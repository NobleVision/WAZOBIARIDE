/**
 * WaZoBiaRide - Map View Component
 * 
 * Interactive map showing drivers and ride locations
 * For demo purposes, uses a simplified SVG map representation
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Car, Navigation as NavIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

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

export const MapView: React.FC<MapViewProps> = ({
  markers,
  center,
  showRoute = false,
  onMarkerClick,
  selectedMarkerId,
  className
}) => {
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

  // Convert lat/lng to relative position (0-100%)
  const toRelativePosition = (lat: number, lng: number) => {
    // Nigeria bounds: roughly lat 4-7, lng 3-8
    const minLat = 4.5;
    const maxLat = 7.5;
    const minLng = 2.5;
    const maxLng = 5.5;
    
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = 100 - ((lat - minLat) / (maxLat - minLat)) * 100;
    
    return { x, y };
  };

  const getMarkerColor = (marker: MapMarker) => {
    switch (marker.type) {
      case 'driver':
        return marker.tier === 'premium' ? 'text-gold' : 'text-primary';
      case 'pickup':
        return 'text-green-500';
      case 'dropoff':
        return 'text-red-500';
      case 'current':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const getMarkerIcon = (marker: MapMarker) => {
    switch (marker.type) {
      case 'driver':
        return <Car className="w-4 h-4" />;
      case 'pickup':
      case 'dropoff':
        return <MapPin className="w-4 h-4" />;
      case 'current':
        return <NavIcon className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <div className={cn('relative w-full h-full bg-slate-100 rounded-2xl overflow-hidden', className)}>
      {/* SVG Map Background - Simplified Nigeria map representation */}
      <svg
        viewBox="0 0 400 500"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Background */}
        <rect width="400" height="500" fill="#e8f5e9" />
        
        {/* Water bodies */}
        <ellipse cx="280" cy="380" rx="80" ry="60" fill="#b3e5fc" opacity="0.5" />
        <ellipse cx="200" cy="450" rx="100" ry="40" fill="#b3e5fc" opacity="0.5" />
        
        {/* Land mass - Nigeria outline (simplified) */}
        <motion.path
          d="M 50 150 Q 80 100 150 80 Q 250 60 350 120 Q 380 200 350 300 Q 340 400 280 420 Q 200 450 120 430 Q 60 400 40 350 Q 30 250 50 150"
          fill="#c8e6c9"
          stroke="#81c784"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        />
        
        {/* Lagos area highlight */}
        <motion.circle
          cx="200"
          cy="180"
          r="30"
          fill="rgba(0, 135, 81, 0.2)"
          initial={{ r: 0 }}
          animate={{ r: 30 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
        
        {/* Lagos label */}
        <text x="200" y="185" textAnchor="middle" className="text-xs font-bold" fill="#008751">
          LAGOS
        </text>
        
        {/* Ibadan area highlight */}
        <motion.circle
          cx="180"
          cy="250"
          r="20"
          fill="rgba(255, 215, 0, 0.2)"
          initial={{ r: 0 }}
          animate={{ r: 20 }}
          transition={{ duration: 1.5, delay: 0.7 }}
        />
        
        {/* Ibadan label */}
        <text x="180" y="255" textAnchor="middle" className="text-xs font-bold" fill="#FFD700">
          IBADAN
        </text>

        {/* Route line if shown */}
        {showRoute && markers.length >= 2 && (() => {
          const start = toRelativePosition(markers[0].lat, markers[0].lng);
          const end = toRelativePosition(markers[markers.length - 1].lat, markers[markers.length - 1].lng);
          const startX = (start.x / 100) * 400;
          const startY = (start.y / 100) * 500;
          const endX = (end.x / 100) * 400;
          const endY = (end.y / 100) * 500;
          return (
            <motion.path
              d={`M ${startX} ${startY} L ${endX} ${endY}`}
              stroke="#008751"
              strokeWidth="3"
              fill="none"
              strokeDasharray="8 4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5 }}
            />
          );
        })()}
      </svg>

      {/* Map Markers */}
      {markers.map((marker, index) => {
        const pos = toRelativePosition(marker.lat, marker.lng);
        const isHovered = hoveredMarker === marker.id;
        const isSelected = selectedMarkerId === marker.id;

        return (
          <motion.div
            key={marker.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: isHovered || isSelected ? 1.2 : 1,
              opacity: 1 
            }}
            transition={{ 
              delay: index * 0.1,
              type: 'spring',
              stiffness: 300,
              damping: 25
            }}
            className="absolute cursor-pointer"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onMouseEnter={() => setHoveredMarker(marker.id)}
            onMouseLeave={() => setHoveredMarker(null)}
            onClick={() => onMarkerClick?.(marker)}
          >
            {/* Pulse animation for selected marker */}
            {(isSelected || isHovered) && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: getMarkerColor(marker).replace('text-', '') }}
                animate={{
                  scale: [1, 1.5, 2],
                  opacity: [0.5, 0.3, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeOut'
                }}
              />
            )}

            {/* Marker icon */}
            <div
              className={cn(
                'relative p-2 rounded-full bg-white shadow-lg border-2 transition-all',
                isSelected || isHovered ? 'shadow-xl scale-110' : ''
              )}
              style={{ borderColor: getMarkerColor(marker).replace('text-', '') }}
            >
              <div className={getMarkerColor(marker)}>
                {getMarkerIcon(marker)}
              </div>
            </div>

            {/* Label */}
            {marker.label && (isHovered || isSelected) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap"
              >
                <div className="bg-gray-900 text-white text-xs px-3 py-1 rounded-full shadow-lg">
                  {marker.label}
                </div>
              </motion.div>
            )}

            {/* Tier badge for drivers */}
            {marker.type === 'driver' && marker.tier === 'premium' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full flex items-center justify-center"
              >
                <span className="text-xs text-navy font-bold">P</span>
              </motion.div>
            )}
          </motion.div>
        );
      })}

      {/* Map controls overlay */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </motion.button>
      </div>

      {/* Driver count badge */}
      {markers.filter(m => m.type === 'driver').length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg"
        >
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">
              {markers.filter(m => m.type === 'driver').length} Drivers Nearby
            </span>
          </div>
        </motion.div>
      )}

      {/* WaZoBiaRide watermark */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-500 font-medium">
        WaZoBiaRide Demo Map
      </div>
    </div>
  );
};