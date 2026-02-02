/**
 * WaZoBiaRide - Map View Component (Mapbox GL JS)
 *
 * Real interactive map showing drivers and ride locations
 * Uses Mapbox GL JS for professional-grade Nigeria mapping
 * Maintains 100% API compatibility with previous SVG implementation
 *
 * Refactored for:
 * - Smooth animations without degradation
 * - Proper cleanup and memory leak prevention
 * - Graceful handling of blocked telemetry
 * - Efficient marker diffing and updates
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Car } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import { cn } from '@/lib/utils';

// Initialize Mapbox with token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

// Disable Mapbox telemetry to prevent ERR_BLOCKED_BY_CLIENT errors from ad blockers
// This must be done before any map is created
// Reference: https://github.com/mapbox/mapbox-gl-js/issues/10365
// Intercept fetch requests to events.mapbox.com to prevent ERR_BLOCKED_BY_CLIENT errors
if (typeof window !== 'undefined') {
  try {
    const originalFetch = window.fetch;
    window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      if (url && url.includes('events.mapbox.com')) {
        // Return a resolved promise with an empty response to silently block telemetry
        return Promise.resolve(new Response(null, { status: 204 }));
      }
      return originalFetch.call(this, input, init);
    };
  } catch {
    // Silently ignore if we can't intercept fetch
  }
}

// Note: The SES "Removing unpermitted intrinsics" warning is from browser
// extensions (like MetaMask) and is harmless - cannot be suppressed from app code.

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  type: 'driver' | 'pickup' | 'dropoff' | 'current';
  label?: string;
  tier?: 'standard' | 'premium';
}

interface MapViewProps {
  markers: MapMarker[];
  center?: { lat: number; lng: number };
  showRoute?: boolean;
  onMarkerClick?: (marker: MapMarker) => void;
  selectedMarkerId?: string;
  className?: string;
}

// Default center: South West Nigeria (Lagos region)
const DEFAULT_CENTER: [number, number] = [3.3792, 6.5244]; // [lng, lat]
const DEFAULT_ZOOM = 10;
const ROUTE_SOURCE_ID = 'route-source';
const ROUTE_LAYER_ID = 'route-layer';

// Color constants matching WaZoBiaRide brand
const MARKER_COLORS = {
  driver: {
    standard: '#008751', // primary green
    premium: '#FFD700', // gold
  },
  pickup: '#22c55e', // green-500
  dropoff: '#ef4444', // red-500
  current: '#3b82f6', // blue-500
} as const;

// CSS for pulse animation - injected once globally
const PULSE_ANIMATION_ID = 'mapview-pulse-animation';
const injectPulseAnimation = () => {
  if (typeof document === 'undefined') return;
  if (document.getElementById(PULSE_ANIMATION_ID)) return;

  const style = document.createElement('style');
  style.id = PULSE_ANIMATION_ID;
  style.textContent = `
    @keyframes mapview-pulse {
      0% { transform: scale(1); opacity: 0.6; }
      100% { transform: scale(2); opacity: 0; }
    }
    .mapview-marker-pulse {
      animation: mapview-pulse 1.5s ease-out infinite;
    }
  `;
  document.head.appendChild(style);
};

// Marker element data stored alongside DOM element
interface MarkerData {
  mapboxMarker: mapboxgl.Marker;
  element: HTMLElement;
  markerId: string;
  isSelected: boolean;
  isHovered: boolean;
  cleanup: () => void;
}

// Get marker color based on type and tier
const getMarkerColor = (marker: MapMarker): string => {
  if (marker.type === 'driver') {
    return marker.tier === 'premium' ? MARKER_COLORS.driver.premium : MARKER_COLORS.driver.standard;
  }
  return MARKER_COLORS[marker.type];
};

// Get SVG icon path for marker type
const getMarkerIconSVG = (type: MapMarker['type']): string => {
  switch (type) {
    case 'driver':
      return '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />';
    case 'pickup':
    case 'dropoff':
      return '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />';
    case 'current':
      return '<polygon points="3 11 22 2 13 21 11 13 3 11" />';
    default:
      return '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />';
  }
};

export const MapView: React.FC<MapViewProps> = ({
  markers,
  center,
  showRoute = false,
  onMarkerClick,
  selectedMarkerId,
  className
}) => {
  // Refs for map instance and containers
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersDataRef = useRef<Map<string, MarkerData>>(new Map());
  const isUnmountedRef = useRef(false);
  const flyToTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stable refs for callbacks to avoid stale closures
  const onMarkerClickRef = useRef(onMarkerClick);
  onMarkerClickRef.current = onMarkerClick;

  // State
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Inject pulse animation CSS once globally
  useEffect(() => {
    injectPulseAnimation();
  }, []);

  // Create a marker DOM element with proper structure
  const createMarkerElement = useCallback((marker: MapMarker): HTMLElement => {
    const color = getMarkerColor(marker);
    const iconSize = marker.type === 'driver' ? 20 : 16;

    const container = document.createElement('div');
    container.className = 'mapview-marker-container';
    container.dataset.markerId = marker.id;
    container.style.cssText = `
      position: relative;
      cursor: pointer;
      transition: transform 0.2s ease-out;
      will-change: transform;
    `;

    // Pulse ring element (hidden by default, shown on hover/select)
    const pulseRing = document.createElement('div');
    pulseRing.className = 'mapview-marker-pulse-ring';
    pulseRing.style.cssText = `
      position: absolute;
      inset: -8px;
      border: 2px solid ${color};
      border-radius: 50%;
      opacity: 0;
      pointer-events: none;
    `;
    container.appendChild(pulseRing);

    // Main icon wrapper
    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'mapview-marker-icon';
    iconWrapper.style.cssText = `
      position: relative;
      width: 44px;
      height: 44px;
      background: white;
      border: 3px solid ${color};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
    `;

    // SVG icon
    iconWrapper.innerHTML = `
      <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${getMarkerIconSVG(marker.type)}
      </svg>
    `;
    container.appendChild(iconWrapper);

    // Premium badge for premium drivers
    if (marker.type === 'driver' && marker.tier === 'premium') {
      const badge = document.createElement('div');
      badge.className = 'mapview-marker-badge';
      badge.style.cssText = `
        position: absolute;
        top: -4px;
        right: -4px;
        width: 20px;
        height: 20px;
        background: ${MARKER_COLORS.driver.premium};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: bold;
        color: #1e293b;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        z-index: 1;
      `;
      badge.textContent = 'P';
      container.appendChild(badge);
    }

    return container;
  }, []);

  // Update marker visual state (hover/selected) without recreating elements
  const updateMarkerVisualState = useCallback((
    element: HTMLElement,
    isSelected: boolean,
    isHovered: boolean,
    color: string
  ) => {
    const pulseRing = element.querySelector('.mapview-marker-pulse-ring') as HTMLElement;
    const iconWrapper = element.querySelector('.mapview-marker-icon') as HTMLElement;

    if (!pulseRing || !iconWrapper) return;

    const isActive = isSelected || isHovered;

    // Update container scale
    element.style.transform = isActive ? 'scale(1.15)' : 'scale(1)';

    // Update pulse ring visibility and animation
    if (isActive) {
      pulseRing.style.opacity = '1';
      pulseRing.classList.add('mapview-marker-pulse');
    } else {
      pulseRing.style.opacity = '0';
      pulseRing.classList.remove('mapview-marker-pulse');
    }

    // Update icon wrapper shadow
    iconWrapper.style.boxShadow = isActive
      ? `0 6px 20px rgba(0, 0, 0, 0.25), 0 0 0 2px ${color}40`
      : '0 4px 12px rgba(0, 0, 0, 0.15)';
  }, []);

  // Sync markers with map - handles add/remove/update efficiently
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    if (isUnmountedRef.current) return;

    const currentMarkersData = markersDataRef.current;
    const newMarkerIds = new Set(markers.map(m => m.id));
    const mapInstance = mapRef.current;

    // Remove markers that no longer exist
    currentMarkersData.forEach((data, id) => {
      if (!newMarkerIds.has(id)) {
        data.cleanup();
        data.mapboxMarker.remove();
        currentMarkersData.delete(id);
      }
    });

    // Add new markers or update existing ones
    markers.forEach(marker => {
      const existingData = currentMarkersData.get(marker.id);
      const isSelected = selectedMarkerId === marker.id;
      const isHovered = hoveredMarkerId === marker.id;
      const color = getMarkerColor(marker);

      if (existingData) {
        // Update existing marker position (smooth if coordinates changed)
        existingData.mapboxMarker.setLngLat([marker.lng, marker.lat]);

        // Update visual state only if it changed (avoids animation restart)
        if (existingData.isSelected !== isSelected || existingData.isHovered !== isHovered) {
          updateMarkerVisualState(existingData.element, isSelected, isHovered, color);
          existingData.isSelected = isSelected;
          existingData.isHovered = isHovered;
        }
      } else {
        // Create new marker
        const element = createMarkerElement(marker);

        // Create event handlers with cleanup tracking
        const handleClick = (e: Event) => {
          e.stopPropagation();
          onMarkerClickRef.current?.(marker);
        };

        const handleMouseEnter = () => {
          if (!isUnmountedRef.current) {
            setHoveredMarkerId(marker.id);
          }
        };

        const handleMouseLeave = () => {
          if (!isUnmountedRef.current) {
            setHoveredMarkerId(null);
          }
        };

        // Attach event listeners
        element.addEventListener('click', handleClick);
        element.addEventListener('mouseenter', handleMouseEnter);
        element.addEventListener('mouseleave', handleMouseLeave);

        // Cleanup function to remove listeners
        const cleanup = () => {
          element.removeEventListener('click', handleClick);
          element.removeEventListener('mouseenter', handleMouseEnter);
          element.removeEventListener('mouseleave', handleMouseLeave);
        };

        // Create Mapbox marker
        const mapboxMarker = new mapboxgl.Marker({
          element,
          anchor: 'center'
        })
          .setLngLat([marker.lng, marker.lat])
          .addTo(mapInstance);

        // Store marker data
        currentMarkersData.set(marker.id, {
          mapboxMarker,
          element,
          markerId: marker.id,
          isSelected,
          isHovered,
          cleanup
        });

        // Apply initial visual state
        updateMarkerVisualState(element, isSelected, isHovered, color);
      }
    });
  }, [markers, selectedMarkerId, hoveredMarkerId, createMarkerElement, updateMarkerVisualState, mapLoaded]);

  // Draw route between markers when showRoute is true
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    if (isUnmountedRef.current) return;

    const mapInstance = mapRef.current;

    // Safely remove existing route layer and source
    try {
      if (mapInstance.getLayer(ROUTE_LAYER_ID)) {
        mapInstance.removeLayer(ROUTE_LAYER_ID);
      }
      if (mapInstance.getSource(ROUTE_SOURCE_ID)) {
        mapInstance.removeSource(ROUTE_SOURCE_ID);
      }
    } catch (e) {
      // Layer/source might not exist, ignore
    }

    // Add new route if needed
    if (showRoute && markers.length >= 2) {
      const coordinates = markers.map(m => [m.lng, m.lat]);

      try {
        mapInstance.addSource(ROUTE_SOURCE_ID, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates,
            },
          },
        });

        mapInstance.addLayer({
          id: ROUTE_LAYER_ID,
          type: 'line',
          source: ROUTE_SOURCE_ID,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': MARKER_COLORS.driver.standard,
            'line-width': 3,
            'line-dasharray': [2, 1],
          },
        });
      } catch (e) {
        console.warn('MapView: Failed to add route layer:', e);
      }
    }
  }, [showRoute, markers, mapLoaded]);

  // Stable reference to markers for bounds calculation
  const markersForBounds = useMemo(() => {
    return markers.map(m => ({ lng: m.lng, lat: m.lat }));
  }, [markers]);

  // Update map center/bounds with debounced flyTo to prevent animation conflicts
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    if (isUnmountedRef.current) return;

    const mapInstance = mapRef.current;

    // Clear any pending flyTo animation
    if (flyToTimeoutRef.current) {
      clearTimeout(flyToTimeoutRef.current);
    }

    // Debounce map movements to prevent animation stacking
    flyToTimeoutRef.current = setTimeout(() => {
      if (isUnmountedRef.current || !mapRef.current) return;

      try {
        if (center) {
          mapInstance.flyTo({
            center: [center.lng, center.lat],
            zoom: DEFAULT_ZOOM,
            duration: 800,
            essential: true, // Ensures animation completes
          });
        } else if (markersForBounds.length > 0) {
          const bounds = new mapboxgl.LngLatBounds();
          markersForBounds.forEach(pos => {
            bounds.extend([pos.lng, pos.lat]);
          });
          mapInstance.fitBounds(bounds, {
            padding: 50,
            maxZoom: 14,
            duration: 800,
          });
        } else {
          mapInstance.flyTo({
            center: DEFAULT_CENTER,
            zoom: DEFAULT_ZOOM,
            duration: 800,
            essential: true,
          });
        }
      } catch (e) {
        console.warn('MapView: Map animation error:', e);
      }
    }, 100); // Small debounce to batch rapid prop changes

    return () => {
      if (flyToTimeoutRef.current) {
        clearTimeout(flyToTimeoutRef.current);
      }
    };
  }, [center, markersForBounds, mapLoaded]);

  // Initialize Mapbox map instance
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return; // Already initialized

    isUnmountedRef.current = false;

    // Check for valid access token
    if (!mapboxgl.accessToken) {
      setMapError('Mapbox access token is missing. Please set VITE_MAPBOX_ACCESS_TOKEN.');
      return;
    }

    try {
      const mapInstance = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: center ? [center.lng, center.lat] : DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        pitch: 45,
        bearing: 0,
        antialias: true,
        trackResize: true,
        // Disable telemetry to prevent ad-blocker errors
        collectResourceTiming: false,
      });

      // Add controls
      mapInstance.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
      mapInstance.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

      // Handle map load
      mapInstance.on('load', () => {
        if (!isUnmountedRef.current) {
          setMapLoaded(true);
        }
      });

      // Handle map errors gracefully
      mapInstance.on('error', (e) => {
        // Ignore telemetry/analytics errors (caused by ad blockers)
        // These are non-critical and don't affect map functionality
        const errorMessage = e.error?.message || String(e.error) || '';
        const errorString = String(e.error);

        if (
          errorMessage.includes('events.mapbox.com') ||
          errorString.includes('events.mapbox.com') ||
          errorMessage.includes('ERR_BLOCKED') ||
          errorMessage.includes('Failed to fetch')
        ) {
          // Silently ignore telemetry errors
          return;
        }

        console.warn('MapView: Map error:', e.error);
      });

      mapRef.current = mapInstance;
    } catch (e) {
      console.error('MapView: Failed to initialize map:', e);
      setMapError('Failed to initialize map. Please check your Mapbox configuration.');
    }

    // Cleanup on unmount
    return () => {
      isUnmountedRef.current = true;

      // Clear any pending timeouts
      if (flyToTimeoutRef.current) {
        clearTimeout(flyToTimeoutRef.current);
        flyToTimeoutRef.current = null;
      }

      // Clean up all markers
      markersDataRef.current.forEach(data => {
        data.cleanup();
        data.mapboxMarker.remove();
      });
      markersDataRef.current.clear();

      // Remove map instance
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Empty deps - run once on mount

  // Memoize driver count to avoid recalculating on every render
  const driverCount = useMemo(
    () => markers.filter(m => m.type === 'driver').length,
    [markers]
  );

  // Get hovered marker label
  const hoveredMarkerLabel = useMemo(() => {
    if (!hoveredMarkerId) return null;
    return markers.find(m => m.id === hoveredMarkerId)?.label || null;
  }, [hoveredMarkerId, markers]);

  return (
    <div className={cn('relative w-full h-full bg-slate-100 rounded-2xl overflow-hidden', className)}>
      {/* Map container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Error state */}
      {mapError && (
        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
          <div className="text-center p-6">
            <div className="text-red-500 text-lg font-semibold mb-2">Map Error</div>
            <div className="text-gray-600 text-sm">{mapError}</div>
          </div>
        </div>
      )}

      {/* Driver count badge */}
      {driverCount > 0 && !mapError && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg z-10"
        >
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">
              {driverCount} Driver{driverCount !== 1 ? 's' : ''} Nearby
            </span>
          </div>
        </motion.div>
      )}

      {/* Hovered marker label tooltip */}
      {hoveredMarkerLabel && (
        <motion.div
          key={hoveredMarkerId} // Key ensures animation replays for different markers
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-full shadow-lg z-10 max-w-[200px] truncate"
        >
          {hoveredMarkerLabel}
        </motion.div>
      )}

      {/* Map loading state */}
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
          />
        </div>
      )}

      {/* WaZoBiaRide watermark */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-600 font-medium z-10 bg-white/80 px-2 py-1 rounded">
        WaZoBiaRide • Mapbox
      </div>
    </div>
  );
};