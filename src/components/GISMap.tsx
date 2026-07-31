import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { RouteOption, GISLayerState, ConflictZone } from '../types';
import { GIS_LAYERS_DATA } from '../data/gisLayers';

interface GISMapProps {
  sourceCoords: [number, number];
  sourceName: string;
  destCoords: [number, number];
  destName: string;
  routes: RouteOption[];
  selectedRouteId: string;
  onSelectRoute: (routeId: string) => void;
  layers: GISLayerState;
  onSelectConflict?: (conflict: ConflictZone) => void;
  waypoints?: [number, number][];
  onAddWaypoint?: (coords: [number, number]) => void;
  interactiveMode?: boolean;
}

export const GISMap: React.FC<GISMapProps> = ({
  sourceCoords,
  sourceName,
  destCoords,
  destName,
  routes,
  selectedRouteId,
  onSelectRoute,
  layers,
  onSelectConflict,
  waypoints,
  onAddWaypoint,
  interactiveMode = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routeLayersRef = useRef<L.Polyline[]>([]);
  const gisLayersGroupRef = useRef<L.LayerGroup | null>(null);
  const markerGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center map around middle of India / project bounds
    const midLat = (sourceCoords[0] + destCoords[0]) / 2;
    const midLng = (sourceCoords[1] + destCoords[1]) / 2;

    const map = L.map(mapContainerRef.current, {
      center: [midLat, midLng],
      zoom: 6,
      zoomControl: false,
    });

    // Dark canvas tile layer from CartoDB / OpenStreetMap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Add zoom controls
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    gisLayersGroupRef.current = L.layerGroup().addTo(map);
    markerGroupRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    // Force map to recalculate dimensions after DOM paint
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    // ResizeObserver to handle layout/window size changes dynamically
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });

    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    // Map click handler for interactive waypoint placement
    if (interactiveMode && onAddWaypoint) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        onAddWaypoint([e.latlng.lat, e.latlng.lng]);
      });
    }

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Layers & Overlays
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !gisLayersGroupRef.current) return;

    gisLayersGroupRef.current.clearLayers();

    GIS_LAYERS_DATA.forEach((shape) => {
      const showCategory =
        (shape.category === 'forest' && layers.forests) ||
        (shape.category === 'river' && layers.rivers) ||
        (shape.category === 'protected_area' && layers.protectedAreas) ||
        (shape.category === 'highway' && layers.existingHighways) ||
        (shape.category === 'railway' && layers.railwayNetwork) ||
        (shape.category === 'airport' && layers.airports) ||
        (shape.category === 'urban' && layers.urbanClusters) ||
        (shape.category === 'utility' && layers.utilityCorridors);

      if (!showCategory) return;

      if (shape.type === 'polygon') {
        const poly = L.polygon(shape.coordinates as [number, number][], {
          color: shape.color,
          fillColor: shape.fillColor || shape.color,
          fillOpacity: 0.25,
          weight: 1.5,
        });
        poly.bindTooltip(`<b>${shape.name}</b><br/>${shape.description}`);
        gisLayersGroupRef.current?.addLayer(poly);
      } else if (shape.type === 'polyline') {
        const line = L.polyline(shape.coordinates as [number, number][], {
          color: shape.color,
          weight: 3,
          dashArray: '5, 5',
          opacity: 0.7,
        });
        line.bindTooltip(`<b>${shape.name}</b><br/>${shape.description}`);
        gisLayersGroupRef.current?.addLayer(line);
      } else if (shape.type === 'circle' && shape.center && shape.radiusKm) {
        const circle = L.circle(shape.center, {
          radius: shape.radiusKm * 1000,
          color: shape.color,
          fillColor: shape.fillColor || shape.color,
          fillOpacity: 0.15,
          weight: 1,
        });
        circle.bindTooltip(`<b>${shape.name}</b><br/>${shape.description}`);
        gisLayersGroupRef.current?.addLayer(circle);
      }
    });
  }, [layers]);

  // Render Routes and Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markerGroupRef.current) return;

    markerGroupRef.current.clearLayers();
    routeLayersRef.current.forEach((l) => l.remove());
    routeLayersRef.current = [];

    // Custom Source Icon (Green Hub)
    const sourceIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `<div class="w-7 h-7 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/50 animate-bounce">S</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    // Custom Dest Icon (Cyan Hub)
    const destIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `<div class="w-7 h-7 rounded-full bg-cyan-400 border-2 border-slate-950 flex items-center justify-center text-slate-950 font-black text-xs shadow-lg shadow-cyan-400/50">D</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    // Source & Dest Markers
    const sMarker = L.marker(sourceCoords, { icon: sourceIcon }).bindPopup(
      `<div class="p-1"><div class="text-xs font-bold text-emerald-400">ORIGIN NODE</div><div class="text-sm font-semibold">${sourceName}</div></div>`
    );
    const dMarker = L.marker(destCoords, { icon: destIcon }).bindPopup(
      `<div class="p-1"><div class="text-xs font-bold text-cyan-400">DESTINATION TERMINAL</div><div class="text-sm font-semibold">${destName}</div></div>`
    );

    markerGroupRef.current.addLayer(sMarker);
    markerGroupRef.current.addLayer(dMarker);

    // Draw Waypoints if any
    waypoints?.forEach((wp, idx) => {
      const wpIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `<div class="w-5 h-5 rounded-full bg-amber-400 border border-slate-950 flex items-center justify-center text-slate-950 font-bold text-[10px]">W${idx + 1}</div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
      const wpMarker = L.marker(wp, { icon: wpIcon });
      markerGroupRef.current?.addLayer(wpMarker);
    });

    // Render Routes
    const bounds = L.latLngBounds([sourceCoords, destCoords]);

    routes.forEach((rt) => {
      const isSelected = rt.id === selectedRouteId;
      const polyline = L.polyline(rt.waypoints, {
        color: rt.color,
        weight: isSelected ? 6 : 3,
        opacity: isSelected ? 0.95 : 0.45,
        dashArray: isSelected ? undefined : '6, 6',
      });

      polyline.on('click', () => {
        onSelectRoute(rt.id);
      });

      polyline.bindTooltip(
        `<div class="text-xs font-sans">
          <strong style="color: ${rt.color}">${rt.name}</strong><br/>
          Length: ${rt.distanceKm} km | Est. Cost: ₹${rt.estimatedCostCrores} Cr
        </div>`
      );

      polyline.addTo(map);
      routeLayersRef.current.push(polyline);

      // Extend bounds to cover all waypoints
      rt.waypoints.forEach((pt) => bounds.extend(pt));

      // Draw Conflict Warnings on Selected Route
      if (isSelected) {
        rt.conflicts.forEach((cf) => {
          const warningIcon = L.divIcon({
            className: 'custom-warning-pin',
            html: `<div class="w-6 h-6 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center text-white font-black text-xs shadow-md animate-pulse">!</div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });

          const cfMarker = L.marker(cf.coordinates, { icon: warningIcon });
          cfMarker.bindPopup(`
            <div class="p-1 max-w-xs">
              <span class="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase mb-1">${cf.type} CONFLICT</span>
              <div class="text-xs font-bold text-white mb-0.5">${cf.name}</div>
              <div class="text-[11px] text-slate-300 mb-1.5">${cf.description}</div>
              <div class="text-[10px] text-emerald-400 font-medium bg-slate-900/80 p-1.5 rounded border border-slate-800">
                <strong>Mitigation:</strong> ${cf.mitigationSuggestion}
              </div>
            </div>
          `);

          if (onSelectConflict) {
            cfMarker.on('click', () => onSelectConflict(cf));
          }

          markerGroupRef.current?.addLayer(cfMarker);
        });
      }
    });

    // Fit map bounds smoothly
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [routes, selectedRouteId, sourceCoords, destCoords, waypoints]);

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Floating Map Legend */}
      <div className="absolute bottom-4 left-4 z-20 glass-panel p-2.5 rounded-xl text-xs space-y-1.5 text-slate-300 max-w-xs">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
          PM GS Map Layers & Routes
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>Source Node</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400" />
          <span>Destination Terminal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500 flex items-center justify-center text-[8px] font-bold text-white">!</div>
          <span>Conflict Intersection Zone</span>
        </div>
      </div>
    </div>
  );
};
