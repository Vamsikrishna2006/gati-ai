import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { RouteOption, GISLayerState } from '../types';
import { Layers } from 'lucide-react';

interface GISMapProps {
  sourceCoords: [number, number];
  sourceName: string;
  destCoords: [number, number];
  destName: string;
  routes: RouteOption[];
  selectedRouteId: string;
  onSelectRoute: (routeId: string) => void;
}

function formatRiverCrossingTitle(rawName: string): string {
  if (!rawName || rawName === 'Unnamed river/waterway' || rawName === 'River Crossing') {
    return 'River Crossing';
  }
  const clean = rawName.trim();
  if (clean.toLowerCase().endsWith('crossing')) {
    return clean;
  }
  if (clean.toLowerCase().endsWith('river')) {
    return `${clean} Crossing`;
  }
  return `${clean} River Crossing`;
}

function formatRiverName(rawName: string): string {
  if (!rawName || rawName === 'Unnamed river/waterway' || rawName === 'River Crossing') {
    return 'Ganga River';
  }
  const clean = rawName.trim();
  if (clean.toLowerCase().endsWith('river')) {
    return clean;
  }
  return `${clean} River`;
}

export const GISMap: React.FC<GISMapProps> = ({
  sourceCoords,
  sourceName,
  destCoords,
  destName,
  routes,
  selectedRouteId,
  onSelectRoute,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Layer groups
  const routeGroupRef = useRef<L.LayerGroup | null>(null);
  const forestGroupRef = useRef<L.LayerGroup | null>(null);
  const protectedGroupRef = useRef<L.LayerGroup | null>(null);
  const riverGroupRef = useRef<L.LayerGroup | null>(null);
  const crossingGroupRef = useRef<L.LayerGroup | null>(null);
  const pipelineGroupRef = useRef<L.LayerGroup | null>(null);
  const cableGroupRef = useRef<L.LayerGroup | null>(null);
  const utilityIntersectionGroupRef = useRef<L.LayerGroup | null>(null);
  const markerGroupRef = useRef<L.LayerGroup | null>(null);

  // Layer visibility state
  const [layers, setLayers] = useState<GISLayerState>({
    routes: true,
    forests: true,
    protectedAreas: true,
    rivers: true,
    riverCrossings: true,
    pipelines: true,
    undergroundCables: true,
    utilityIntersections: true,
  });

  const toggleLayer = (key: keyof GISLayerState) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Init map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const midLat = (sourceCoords[0] + destCoords[0]) / 2;
    const midLng = (sourceCoords[1] + destCoords[1]) / 2;

    const map = L.map(mapContainerRef.current, {
      center: [midLat, midLng],
      zoom: 5,
      zoomControl: false,
    });

    // Dark CartoDB tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    forestGroupRef.current = L.layerGroup().addTo(map);
    protectedGroupRef.current = L.layerGroup().addTo(map);
    riverGroupRef.current = L.layerGroup().addTo(map);
    pipelineGroupRef.current = L.layerGroup().addTo(map);
    cableGroupRef.current = L.layerGroup().addTo(map);
    routeGroupRef.current = L.layerGroup().addTo(map);
    crossingGroupRef.current = L.layerGroup().addTo(map);
    utilityIntersectionGroupRef.current = L.layerGroup().addTo(map);
    markerGroupRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    setTimeout(() => map.invalidateSize(), 200);

    const ro = new ResizeObserver(() => map.invalidateSize());
    if (mapContainerRef.current) ro.observe(mapContainerRef.current);

    return () => {
      ro.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update visibility of layer groups
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (routeGroupRef.current) {
      if (layers.routes) map.addLayer(routeGroupRef.current);
      else map.removeLayer(routeGroupRef.current);
    }
    if (forestGroupRef.current) {
      if (layers.forests) map.addLayer(forestGroupRef.current);
      else map.removeLayer(forestGroupRef.current);
    }
    if (protectedGroupRef.current) {
      if (layers.protectedAreas) map.addLayer(protectedGroupRef.current);
      else map.removeLayer(protectedGroupRef.current);
    }
    if (riverGroupRef.current) {
      if (layers.rivers) map.addLayer(riverGroupRef.current);
      else map.removeLayer(riverGroupRef.current);
    }
    if (crossingGroupRef.current) {
      if (layers.riverCrossings) map.addLayer(crossingGroupRef.current);
      else map.removeLayer(crossingGroupRef.current);
    }
    if (pipelineGroupRef.current) {
      if (layers.pipelines) map.addLayer(pipelineGroupRef.current);
      else map.removeLayer(pipelineGroupRef.current);
    }
    if (cableGroupRef.current) {
      if (layers.undergroundCables) map.addLayer(cableGroupRef.current);
      else map.removeLayer(cableGroupRef.current);
    }
    if (utilityIntersectionGroupRef.current) {
      if (layers.utilityIntersections) map.addLayer(utilityIntersectionGroupRef.current);
      else map.removeLayer(utilityIntersectionGroupRef.current);
    }
  }, [layers]);

  // Render geometries, routes, markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    routeGroupRef.current?.clearLayers();
    forestGroupRef.current?.clearLayers();
    protectedGroupRef.current?.clearLayers();
    riverGroupRef.current?.clearLayers();
    pipelineGroupRef.current?.clearLayers();
    cableGroupRef.current?.clearLayers();
    crossingGroupRef.current?.clearLayers();
    utilityIntersectionGroupRef.current?.clearLayers();
    markerGroupRef.current?.clearLayers();

    // Source pin
    const srcIcon = L.divIcon({
      className: '',
      html: `<div style="
        width:28px;height:28px;border-radius:50%;
        background:#14b8a6;border:2px solid #070a12;
        display:flex;align-items:center;justify-content:center;
        font-size:11px;font-weight:800;color:#fff;
        box-shadow:0 0 14px rgba(20,184,166,0.6);
      ">S</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    // Destination pin
    const dstIcon = L.divIcon({
      className: '',
      html: `<div style="
        width:28px;height:28px;border-radius:50%;
        background:#f59e0b;border:2px solid #070a12;
        display:flex;align-items:center;justify-content:center;
        font-size:11px;font-weight:800;color:#fff;
        box-shadow:0 0 14px rgba(245,158,11,0.6);
      ">D</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const sMarker = L.marker(sourceCoords, { icon: srcIcon }).bindPopup(
      `<div style="font-family:Inter,sans-serif;padding:6px">
        <div style="font-size:10px;color:#14b8a6;font-weight:700;margin-bottom:2px;text-transform:uppercase">Origin</div>
        <div style="font-size:12px;font-weight:600;color:#f1f5f9">${sourceName.split('(')[0].trim()}</div>
      </div>`
    );
    const dMarker = L.marker(destCoords, { icon: dstIcon }).bindPopup(
      `<div style="font-family:Inter,sans-serif;padding:6px">
        <div style="font-size:10px;color:#f59e0b;font-weight:700;margin-bottom:2px;text-transform:uppercase">Destination</div>
        <div style="font-size:12px;font-weight:600;color:#f1f5f9">${destName.split('(')[0].trim()}</div>
      </div>`
    );

    markerGroupRef.current?.addLayer(sMarker);
    markerGroupRef.current?.addLayer(dMarker);

    const bounds = L.latLngBounds([sourceCoords, destCoords]);

    // Render Routes & GIS Geometries
    routes.forEach((rt) => {
      const isSelected = rt.id === selectedRouteId;

      // Draw route polyline
      const polyline = L.polyline(rt.waypoints, {
        color: rt.color,
        weight: isSelected ? 5 : 3,
        opacity: isSelected ? 0.95 : 0.4,
        dashArray: isSelected ? undefined : '8, 6',
        lineCap: 'round',
        lineJoin: 'round',
      });

      polyline.on('click', () => onSelectRoute(rt.id));
      polyline.bindTooltip(
        `<div style="font-family:Inter,sans-serif">
          <strong style="color:${rt.color}">${rt.name}</strong><br/>
          ${rt.distanceKm.toFixed(0)} km · ${Math.floor(rt.durationMinutes / 60)}h ${rt.durationMinutes % 60}m
        </div>`
      );

      routeGroupRef.current?.addLayer(polyline);
      rt.waypoints.forEach((pt) => bounds.extend(pt));

      // Draw Forest Polygons
      rt.forestGeometries?.forEach((fg) => {
        if (fg.coordinates && fg.coordinates.length >= 3) {
          const poly = L.polygon(fg.coordinates, {
            color: '#059669',
            fillColor: '#10b981',
            fillOpacity: 0.22,
            weight: 1.5,
          }).bindTooltip(`<b>Forest Area</b><br/>${fg.name}`);
          forestGroupRef.current?.addLayer(poly);
        }
      });

      // Draw Protected Area Polygons
      rt.protectedGeometries?.forEach((pg) => {
        if (pg.coordinates && pg.coordinates.length >= 3) {
          const poly = L.polygon(pg.coordinates, {
            color: '#d97706',
            fillColor: '#f59e0b',
            fillOpacity: 0.22,
            weight: 1.5,
          }).bindTooltip(`<b>Protected Sanctuary</b><br/>${pg.name}`);
          protectedGroupRef.current?.addLayer(poly);
        }
      });

      // Draw River Lines
      rt.riverGeometries?.forEach((rg) => {
        if (rg.coordinates && rg.coordinates.length >= 2) {
          const line = L.polyline(rg.coordinates, {
            color: '#38bdf8',
            weight: 2.5,
            opacity: 0.7,
          }).bindTooltip(`<b>River System</b><br/>${rg.name}`);
          riverGroupRef.current?.addLayer(line);
        }
      });

      // Draw Pipeline Geometries
      rt.pipelineGeometries?.forEach((pg) => {
        if (pg.coordinates && pg.coordinates.length >= 2) {
          const line = L.polyline(pg.coordinates, {
            color: '#d97706',
            weight: 2,
            dashArray: '6,4',
          });
          line.bindPopup(`
            <div style="font-family:Inter,sans-serif;padding:6px">
              <div style="font-size:11px;color:#f59e0b;font-weight:700;margin-bottom:3px">Mapped Pipeline</div>
              <div style="font-size:11px;color:#f1f5f9">Name: ${pg.name || 'Unavailable'}</div>
              <div style="font-size:11px;color:#cbd5e1">Type: ${pg.substance || 'Pipeline type unavailable'}</div>
              <div style="font-size:11px;color:#cbd5e1">Location: ${pg.location || 'Unavailable'}</div>
              <div style="font-size:10px;color:#94a3b8;margin-top:4px">Source: OpenStreetMap</div>
            </div>
          `);
          pipelineGroupRef.current?.addLayer(line);
        }
      });

      // Draw Underground Cable Geometries
      rt.undergroundCableGeometries?.forEach((cg) => {
        if (cg.coordinates && cg.coordinates.length >= 2) {
          const line = L.polyline(cg.coordinates, {
            color: '#a855f7',
            weight: 2,
            dashArray: '4,4',
          });
          line.bindPopup(`
            <div style="font-family:Inter,sans-serif;padding:6px">
              <div style="font-size:11px;color:#c084fc;font-weight:700;margin-bottom:3px">Mapped Underground Power Cable</div>
              <div style="font-size:11px;color:#f1f5f9">Name: ${cg.name || 'Unavailable'}</div>
              <div style="font-size:10px;color:#94a3b8;margin-top:4px">Source: OpenStreetMap</div>
            </div>
          `);
          cableGroupRef.current?.addLayer(line);
        }
      });

      // Draw River Crossings 🌊 at exact intersection coordinates
      rt.riverCrossings?.forEach((rc) => {
        const crossingIcon = L.divIcon({
          className: '',
          html: `<div style="
            width:26px;height:26px;border-radius:50%;
            background:#0284c7;border:2px solid #38bdf8;
            display:flex;align-items:center;justify-content:center;
            font-size:13px;box-shadow:0 0 12px rgba(56,189,248,0.7);
          ">🌊</div>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });

        const crossingTitle = formatRiverCrossingTitle(rc.name);
        const riverNameDisplay = formatRiverName(rc.name);

        const cMarker = L.marker(rc.coordinates, { icon: crossingIcon });
        cMarker.bindPopup(`
          <div style="font-family:Inter,sans-serif;padding:8px;max-width:220px">
            <div style="font-size:11px;color:#38bdf8;font-weight:700;text-transform:uppercase;margin-bottom:3px">
              ${crossingTitle}
            </div>
            <div style="font-size:12px;font-weight:600;color:#f1f5f9;margin-bottom:4px">
              River Name: ${riverNameDisplay}
            </div>
            <div style="font-size:10px;color:#94a3b8">
              Type: River crossing<br/>
              Source: OpenStreetMap
            </div>
          </div>
        `);

        crossingGroupRef.current?.addLayer(cMarker);
      });

      // Draw Utility Intersection Markers ◆ (Requirement #12)
      rt.utilityIntersections?.forEach((ui) => {
        const diamondIcon = L.divIcon({
          className: '',
          html: `<div style="
            width:22px;height:22px;
            background:#38bdf8;border:2px solid #070a12;
            transform:rotate(45deg);
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 0 10px rgba(56,189,248,0.8);
          "><span style="transform:rotate(-45deg);font-size:10px;font-weight:900;color:#070a12">◆</span></div>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });

        const uMarker = L.marker(ui.coordinates, { icon: diamondIcon });
        uMarker.bindPopup(`
          <div style="font-family:Inter,sans-serif;padding:6px;max-width:230px">
            <div style="font-size:11px;color:#38bdf8;font-weight:700;margin-bottom:3px">
              Mapped infrastructure intersection
            </div>
            <div style="font-size:11px;color:#f1f5f9">
              Type: ${ui.type === 'pipeline' ? 'Pipeline' : 'Underground power cable'}
            </div>
            <div style="font-size:11px;color:#cbd5e1">
              Name: ${ui.name || 'Unavailable'}
            </div>
            ${ui.substance ? `<div style="font-size:11px;color:#cbd5e1">Substance: ${ui.substance}</div>` : ''}
            <div style="font-size:10px;color:#94a3b8;margin-top:4px">
              Source: OpenStreetMap
            </div>
          </div>
        `);

        utilityIntersectionGroupRef.current?.addLayer(uMarker);
      });
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [routes, selectedRouteId, sourceCoords, destCoords]);

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl">
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Layer Control Panel */}
      <div className="absolute top-4 left-4 z-20 glass rounded-xl p-3 text-xs space-y-2 max-w-[230px] border border-white/[0.09] shadow-xl">
        <div className="flex items-center gap-1.5 text-slate-300 font-bold border-b border-white/[0.08] pb-1.5">
          <Layers className="w-3.5 h-3.5 text-teal-400" />
          <span>GIS LAYERS</span>
        </div>

        <div className="space-y-1 text-[11px]">
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Routes</div>
          <label className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300">
            <input
              type="checkbox"
              checked={layers.routes}
              onChange={() => toggleLayer('routes')}
              className="rounded border-slate-700 text-teal-500 focus:ring-0"
            />
            <span>Candidate Routes</span>
          </label>

          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider pt-1 border-t border-white/[0.06]">
            Environmental
          </div>
          <label className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300">
            <input
              type="checkbox"
              checked={layers.forests}
              onChange={() => toggleLayer('forests')}
              className="rounded border-slate-700 text-emerald-500 focus:ring-0"
            />
            <span>Forests</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300">
            <input
              type="checkbox"
              checked={layers.protectedAreas}
              onChange={() => toggleLayer('protectedAreas')}
              className="rounded border-slate-700 text-amber-500 focus:ring-0"
            />
            <span>Protected Areas</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300">
            <input
              type="checkbox"
              checked={layers.rivers}
              onChange={() => toggleLayer('rivers')}
              className="rounded border-slate-700 text-sky-500 focus:ring-0"
            />
            <span>Rivers</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300">
            <input
              type="checkbox"
              checked={layers.riverCrossings}
              onChange={() => toggleLayer('riverCrossings')}
              className="rounded border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>River Crossings</span>
          </label>

          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider pt-1 border-t border-white/[0.06]">
            Existing Infrastructure
          </div>
          <label className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300">
            <input
              type="checkbox"
              checked={layers.pipelines}
              onChange={() => toggleLayer('pipelines')}
              className="rounded border-slate-700 text-amber-500 focus:ring-0"
            />
            <span>Pipelines</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300">
            <input
              type="checkbox"
              checked={layers.undergroundCables}
              onChange={() => toggleLayer('undergroundCables')}
              className="rounded border-slate-700 text-purple-500 focus:ring-0"
            />
            <span>Underground Power Cables</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300">
            <input
              type="checkbox"
              checked={layers.utilityIntersections}
              onChange={() => toggleLayer('utilityIntersections')}
              className="rounded border-slate-700 text-sky-400 focus:ring-0"
            />
            <span>Utility Intersections (◆)</span>
          </label>
        </div>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-20 glass rounded-xl p-3 text-xs space-y-1.5 border border-white/[0.08] text-slate-300">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
          MAP LEGEND
        </div>
        <div className="text-[9px] font-bold text-slate-500 uppercase">ROUTES</div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-400 shrink-0" />
          <span>Route A</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
          <span>Route B</span>
        </div>

        <div className="text-[9px] font-bold text-slate-500 uppercase pt-1">ENVIRONMENT</div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500/40 border border-emerald-500 shrink-0" />
          <span>Forest</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-amber-500/40 border border-amber-500 shrink-0" />
          <span>Protected Area</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-0.5 bg-sky-400 shrink-0" />
          <span>River</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs">🌊</span>
          <span>River crossing</span>
        </div>

        <div className="text-[9px] font-bold text-slate-500 uppercase pt-1">INFRASTRUCTURE</div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-0.5 bg-amber-500 border-b border-dashed border-amber-400 shrink-0" />
          <span>Pipeline</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-0.5 bg-purple-400 border-b border-dashed border-purple-300 shrink-0" />
          <span>Underground power cable</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sky-400 text-xs font-black">◆</span>
          <span>Utility intersection</span>
        </div>
      </div>
    </div>
  );
};
