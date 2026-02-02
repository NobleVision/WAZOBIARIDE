# Mapbox Integration - WaZoBiaRide

## Overview

WaZoBiaRide now uses **Mapbox GL JS** for professional-grade interactive maps with excellent Nigeria coverage. This implementation replaces the previous SVG-based demo map while maintaining 100% API compatibility with existing components.

## Key Features

### ✅ Real Nigeria Geography
- **Accurate road networks** for Lagos, Ibadan, and South West Nigeria
- **Professional map styling** using Mapbox Streets V12
- **3D perspective** (45° pitch) for enhanced visualization
- **Smooth animations** with `flyTo` transitions

### ✅ Zero Breaking Changes
- **Identical API** to previous `MapView` component
- **No refactoring required** for:
  - `RiderDashboard`
  - `DriverDashboard`
  - `AdminDashboard`
- All existing props and behavior preserved

### ✅ Premium Brand Integration
- **Custom marker colors** matching WaZoBiaRide brand (green/gold)
- **Animated markers** with pulse effects for selection/hover
- **Premium driver badges** (gold "P" badge)
- **Styled route lines** with dashed green paths

### ✅ Performance Optimized
- **WebGL rendering** for smooth 60fps performance
- **Efficient marker management** with React hooks
- **Automatic cleanup** to prevent memory leaks
- **Loading states** for better UX

## Technical Architecture

### Component Structure

```
MapView (React Component)
├── Mapbox GL JS Map Instance
│   ├── Markers Layer (Custom DOM elements)
│   ├── Route Layer (GeoJSON LineString)
│   └── Controls (Navigation, Scale)
├── State Management
│   ├── mapInstance (ref)
│   ├── markers (Map<string, Marker>)
│   ├── hoveredMarker (state)
│   └── mapLoaded (state)
└── Effects
    ├── Initialize Map (once)
    ├── Update Markers (on props change)
    ├── Draw Route (on showRoute change)
    └── Update Center/Zoom (on markers change)
```

### Marker System

**Custom DOM-based markers** provide superior customization:

```typescript
// Marker creation flow
createMarkerElement(marker, isSelected, isHovered)
  ├── White circular container
  ├── Colored border (type-dependent)
  ├── SVG icon (Car/MapPin/Navigation)
  ├── Pulse animation (if selected/hovered)
  └── Premium badge (if driver.tier === 'premium')
```

### Coordinate System

- **Mapbox format**: `[longitude, latitude]`
- **Marker format**: `{ lat, lng }`
- **Automatic conversion** in marker placement

## API Reference

### MapMarker Interface

```typescript
export interface MapMarker {
  id: string;                    // Unique identifier
  lat: number;                   // Latitude (6.5244 for Lagos)
  lng: number;                   // Longitude (3.3792 for Lagos)
  type: 'driver' | 'pickup' | 'dropoff' | 'current';
  label?: string;                // Displayed on hover
  tier?: 'standard' | 'premium';  // Only for 'driver' type
}
```

### MapView Props

```typescript
interface MapViewProps {
  markers: MapMarker[];           // Array of markers to display
  center?: { lat: number; lng: number };  // Override map center
  showRoute?: boolean;            // Draw dashed line between markers
  onMarkerClick?: (marker: MapMarker) => void;  // Click handler
  selectedMarkerId?: string;      // Highlight this marker
  className?: string;             // Additional CSS classes
}
```

### Default Behavior

**No markers provided**: Centers on Lagos (6.5244°N, 3.3792°E) at zoom 10

**Markers provided**: Automatically fits bounds to show all markers

**Center provided**: Overrides default and fits to center at zoom 10

## Usage Examples

### Basic Usage (Zero Configuration)

```tsx
import { MapView } from '@/components/shared/MapView';

<MapView
  markers={[
    {
      id: 'driver-1',
      lat: 6.5244,
      lng: 3.3792,
      type: 'driver',
      label: 'Emeka (Toyota Camry • ABC-123)',
      tier: 'standard'
    }
  ]}
/>
```

### With Route

```tsx
<MapView
  markers={[
    {
      id: 'pickup',
      lat: 6.5244,
      lng: 3.3792,
      type: 'pickup',
      label: 'Victoria Island'
    },
    {
      id: 'dropoff',
      lat: 6.6018,
      lng: 3.3515,
      type: 'dropoff',
      label: 'Lekki Phase 1'
    }
  ]}
  showRoute={true}
/>
```

### With Selection

```tsx
<MapView
  markers={markers}
  selectedMarkerId={selectedDriverId}
  onMarkerClick={(marker) => {
    setSelectedDriverId(marker.id);
    // Handle marker click
  }}
/>
```

## Environment Setup

### 1. Get Mapbox Token

1. Visit [mapbox.com](https://www.mapbox.com/)
2. Create account (free tier: 50,000 loads/month)
3. Navigate to Account → Tokens
4. Create a new access token

### 2. Configure Environment

**Local Development (`.env`)**:
```bash
VITE_MAPBOX_ACCESS_TOKEN=pk.your_actual_token_here
```

**Production**:
Set `VITE_MAPBOX_ACCESS_TOKEN` in your hosting platform's environment variables.

### 3. Reference Format (`.env.example`)**:
```bash
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
```

## Installation

```bash
cd client
pnpm add mapbox-gl
pnpm add -D @types/mapbox-gl
```

## Browser Support

Mapbox GL JS supports:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance Considerations

### Marker Count
- **Recommended**: < 100 markers for optimal performance
- **Maximum**: ~500 markers before noticeable slowdown
- **Solution**: For 500+ markers, implement clustering

### Map Instance
- **Single instance** per component (enforced via `useRef`)
- **Automatic cleanup** on unmount prevents memory leaks
- **Efficient re-renders** with marker diffing

### Route Rendering
- **Direct line** between coordinates (not actual roads)
- **For actual routing**: Integrate Mapbox Directions API
- **Current implementation**: Fast, simple visualization

## Styling

### Marker Colors

```typescript
const MARKER_COLORS = {
  driver: {
    standard: '#008751',  // WaZoBiaRide primary green
    premium: '#FFD700',   // Gold for premium
  },
  pickup: '#22c55e',      // Bright green
  dropoff: '#ef4444',     // Red
  current: '#3b82f6',     // Blue
};
```

### Map Style

```typescript
// Current: Streets V12
style: 'mapbox://styles/mapbox/streets-v12'

// Alternative options:
// - 'mapbox://styles/mapbox/light-v11'
// - 'mapbox://styles/mapbox/dark-v11'
// - Custom style URL
```

### Customization

To customize map style, modify in `MapView.tsx`:

```typescript
const mapInstance = new mapboxgl.Map({
  // ...
  style: 'your-custom-style-url',  // Change here
  pitch: 45,                        // Adjust 3D effect
  bearing: 0,                       // Adjust rotation
});
```

## Migration from SVG Map

### What Changed?
- **From**: Simplified SVG representation
- **To**: Real interactive Mapbox map
- **API**: Identical (no code changes needed)

### What's Better?
- ✅ Real Nigeria geography
- ✅ Interactive (pan, zoom, rotate)
- ✅ Better performance
- ✅ Professional appearance
- ✅ Future-proof (add features easily)

### What's Same?
- ✅ All props
- ✅ All marker types
- ✅ All behaviors (click, hover, selection)
- ✅ All animations
- ✅ All dashboard components work unchanged

## Troubleshooting

### Map Not Loading

**Issue**: Blank map or "Mapbox access token is required" error

**Solution**:
1. Check `VITE_MAPBOX_ACCESS_TOKEN` in `.env`
2. Restart dev server: `pnpm dev`
3. Verify token is valid at [mapbox.com](https://account.mapbox.com/)

### Markers Not Showing

**Issue**: Map loads but no markers visible

**Solution**:
1. Check `markers` prop has valid data
2. Verify coordinates are in correct format `{ lat, lng }`
3. Check browser console for errors

### Wrong Location

**Issue**: Map centered on wrong area

**Solution**:
1. Verify marker coordinates
2. Nigeria bounds: `lat: 4-7, lng: 3-8`
3. Lagos: `6.5244°N, 3.3792°E`

### Performance Issues

**Issue**: Slow rendering with many markers

**Solution**:
1. Limit to < 100 markers
2. Implement marker clustering
3. Use `mapboxgl.Marker` instead of custom elements

## Future Enhancements

### Recommended Next Steps

1. **Actual Routing**
   - Integrate Mapbox Directions API
   - Get real road-based routes
   - Show turn-by-turn directions

2. **Marker Clustering**
   - Group nearby drivers
   - Show count on cluster
   - Expand on click

3. **Live Tracking**
   - Update driver positions in real-time
   - Smooth transitions with animations
   - Show ETA estimates

4. **Custom Map Style**
   - Create WaZoBiaRide-branded map
   - Match green/gold color scheme
   - Highlight service areas

5. **Offline Support**
   - Download map tiles
   - Cache route data
   - Work without internet

### Advanced Features

- **Heatmaps**: Show driver density
- **Geofencing**: Define service areas
- **Traffic Layer**: Show real-time traffic
- **3D Buildings**: Visualize Lagos skyline
- **Terrain**: Elevation data for routing

## Resources

- [Mapbox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js/api/)
- [Mapbox Style Specification](https://docs.mapbox.com/mapbox-gl-js/style-spec/)
- [WaZoBiaRide Repository](https://github.com/NobleVision/WAZOBIARIDE)
- [Nigeria Coordinates](https://en.wikipedia.org/wiki/Nigeria)

## Support

For issues or questions:
1. Check this documentation
2. Review Mapbox docs
3. Open GitHub issue
4. Contact development team

---

**Version**: 1.0.0  
**Last Updated**: February 2, 2026  
**Maintained By**: WaZoBiaRide Development Team