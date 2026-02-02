/**
 * WaZoBiaRide - Map View Component (Mapbox GL JS)
 * 
 * Real interactive map showing drivers and ride locations
 * Uses Mapbox GL JS for professional-grade Nigeria mapping
 * Maintains 100% API compatibility with previous SVG implementation
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Car, Navigation as NavIcon } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import { cn } from '@/lib/utils';

// Initialize Mapbox with token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

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

// Color constants matching WaZoBiaRide brand
const MARKER_COLORS = {
  driver: {
    standard: '#008751', // primary green
    premium: '#FFD700', // gold
  },
  pickup: '#22c55e', // green-500
  dropoff: '#ef4444', // red-500
  current: '#3b82f6', // blue-500
};

export const MapView: React.FC<MapViewProps> = ({
  markers,
  center,
  showRoute = false,
  onMarkerClick,
  selectedMarkerId,
  className
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const routeSourceId = useRef<string>('route-source');
  const routeLayerId = useRef<string>('route-layer');
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Custom marker element creator
  const createMarkerElement = useCallback((marker: MapMarker, isSelected: boolean, isHovered: boolean): HTMLElement => {
    const el = document.createElement('div');
    
    const color = marker.type === 'driver' 
      ? (marker.tier === 'premium' ? MARKER_COLORS.driver.premium : MARKER_COLORS.driver.standard)
      : MARKER_COLORS[marker.type];

    const scale = isSelected || isHovered ? 1.2 : 1;
    
    el.style.cssText = `
      transform: translate(-50%, -50%) scale(${scale});
      transition: transform 0.2s ease;
      cursor: pointer;
    `;

    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'marker-icon-wrapper';
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
      transition: all 0.2s ease;
    `;

    // Add pulse effect for selected/hovered markers
    if (isSelected || isHovered) {
      const pulse = document.createElement('div');
      pulse.style.cssText = `
        position: absolute;
        inset: -8px;
        border: 2px solid ${color};
        border-radius: 50%;
        animation: pulse 1.5s ease-out infinite;
      `;
      el.appendChild(pulse);
    }

    // Determine which icon to show
    let IconComponent;
    switch (marker.type) {
      case 'driver':
        IconComponent = Car;
        break;
      case 'pickup':
      case 'dropoff':
        IconComponent = MapPin;
        break;
      case 'current':
        IconComponent = NavIcon;
        break;
      default:
        IconComponent = MapPin;
    }

    // Create icon using SVG (simplified from Lucide icons)
    const iconSize = marker.type === 'driver' ? 20 : 16;
    iconWrapper.innerHTML = `
      <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${marker.type === 'driver' ? '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />' : 
          marker.type === 'pickup' || marker.type === 'dropoff' ? '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />' :
          '<polygon points="3 11 22 2 13 21 11 13 3 11" />'}
      </svg>
    `;

    el.appendChild(iconWrapper);

    // Add premium badge for premium drivers
    if (marker.type === 'driver' && marker.tier === 'premium') {
      const badge = document.createElement('div');
      badge.style.cssText = `
        position: absolute;
        top: -4px;
        right: -4px;
        width: 20px;
        height: 20px;
        background: #FFD700;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: bold;
        color: #1e293b;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      `;
      badge.textContent = 'P';
      el.appendChild(badge);
    }

    return el;
  }, []);

  // Update markers on map
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const currentMarkers = markersRef.current;
    const markerIds = new Set(markers.map(m => m.id));

    // Remove markers that no longer exist
    currentMarkers.forEach((marker, id) => {
      if (!markerIds.has(id)) {
        marker.remove();
        currentMarkers.delete(id);
      }
    });

    // Add or update markers
    markers.forEach(marker => {
      const isSelected = selectedMarkerId === marker.id;
      const isHovered = hoveredMarker === marker.id;

      if (currentMarkers.has(marker.id)) {
        // Update existing marker
        const existingMarker = currentMarkers.get(marker.id)!;
        existingMarker.setLngLat([marker.lng, marker.lat]);
        
        // Re-create element to update appearance
        const newElement = createMarkerElement(marker, isSelected, isHovered);
        existingMarker.getElement().replaceWith(newElement);
      } else {
        // Create new marker
        const element = createMarkerElement(marker, isSelected, isHovered);
        const mapboxMarker = new mapboxgl.Marker({
          element,
          anchor: 'center'
        })
          .setLngLat([marker.lng, marker.lat])
          .addTo(map.current!);

        // Add click handler
        element.addEventListener('click', () => {
          onMarkerClick?.(marker);
        });

        // Add hover handlers
        element.addEventListener('mouseenter', () => {
          setHoveredMarker(marker.id);
        });

        element.addEventListener('mouseleave', () => {
          setHoveredMarker(null);
        });

        currentMarkers.set(marker.id, mapboxMarker);
      }
    });
  }, [markers, selectedMarkerId, hoveredMarker, onMarkerClick, createMarkerElement, mapLoaded]);

  // Draw route if showRoute is true
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const mapInstance = map.current;

    // Remove existing route layer if it exists
    if (mapInstance.getLayer(routeLayerId.current)) {
      mapInstance.removeLayer(routeLayerId.current);
      mapInstance.removeSource(routeSourceId.current);
    }

    if (showRoute && markers.length >= 2) {
      const coordinates = markers.map(m => [m.lng, m.lat]);

      mapInstance.addSource(routeSourceId.current, {
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
        id: routeLayerId.current,
        type: 'line',
        source: routeSourceId.current,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#008751',
          'line-width': 3,
          'line-dasharray': [2, 1],
        },
      });
    }
  }, [showRoute, markers, mapLoaded]);

  // Update center and zoom
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    if (center) {
      map.current.flyTo({
        center: [center.lng, center.lat],
        zoom: DEFAULT_ZOOM,
        duration: 1000,
      });
    } else if (markers.length > 0) {
      // Fit map to show all markers
      const bounds = new mapboxgl.LngLatBounds();
      markers.forEach(marker => {
        bounds.extend([marker.lng, marker.lat]);
      });
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 14,
      });
    } else {
      // Default to Lagos center
      map.current.flyTo({
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        duration: 1000,
      });
    }
  }, [center, markers, mapLoaded]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12', // Professional map style
      center: center ? [center.lng, center.lat] : DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      pitch: 45, // 3D perspective for better visualization
      bearing: 0,
      antialias: true,
    });

    // Add navigation controls
    mapInstance.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    // Add scale control
    mapInstance.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

    mapInstance.on('load', () => {
      setMapLoaded(true);
    });

    map.current = mapInstance;

    return () => {
      // Cleanup
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current.clear();
      map.current?.remove();
      map.current = null;
    };
  }, []); // Run only once on mount

  // Driver count
  const driverCount = markers.filter(m => m.type === 'driver').length;

  return (
    <div className={cn('relative w-full h-full bg-slate-100 rounded-2xl overflow-hidden', className)}>
      {/* Map container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Driver count badge */}
      {driverCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg z-10"
        >
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">
              {driverCount} Drivers Nearby
            </span>
          </div>
        </motion.div>
      )}

      {/* Hovered/Selected marker label */}
      {hoveredMarker && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1 rounded-full shadow-lg z-10"
        >
          {markers.find(m => m.id === hoveredMarker)?.label}
        </motion.div>
      )}

      {/* Map loading state */}
      {!mapLoaded && (
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

      {/* Custom CSS for pulse animation */}
      <style>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};