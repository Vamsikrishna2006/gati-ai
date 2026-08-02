import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RouteOption, GISLayerState } from '../types';
import { Layers, MapPin, ChevronDown, ChevronUp, X, Globe } from 'lucide-react';

interface GISMapProps {
  routes: RouteOption[];
  selectedRouteId: string;
  onSelectRoute: (id: string) => void;
  sourceCoords: [number, number];
  destCoords: [number, number];
  sourceName?: string;
  destName?: string;
}

export type MapStyle = 'dark' | 'satellite' | 'hybrid' | 'terrain';

export const GISMap: React.FC<GISMapProps> = ({
  routes,
  selectedRouteId,
  onSelectRoute,
  sourceCoords,
  destCoords,
  sourceName = 'Source',
  destName = 'Destination',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const labelLayerRef = useRef<L.TileLayer | null>(null);

  const routeGroupRef = useRef<L.LayerGroup | null>(null);
  const forestGroupRef = useRef<L.LayerGroup | null>(null);
  const protectedGroupRef = useRef<L.LayerGroup | null>(null);
  const riverGroupRef = useRef<L.LayerGroup | null>(null);
  const crossingGroupRef = useRef<L.LayerGroup | null>(null);
  const pipelineGroupRef = useRef<L.LayerGroup | null>(null);
  const cableGroupRef = useRef<L.LayerGroup | null>(null);
  const utilityIntersectionGroupRef = useRef<L.LayerGroup | null>(null);

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

  const [mapStyle, setMapStyle] = useState<MapStyle>('dark');
  const [panelTab, setPanelTab] = useState<'layers' | 'legend' | 'both'>('both');
  const [panelCollapsed, setPanelCollapsed] = useState<boolean>(() => {
    return typeof window !== 'undefined' && window.innerWidth < 768;
  });

  // Auto-collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setPanelCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleLayer = (layerKey: keyof GISLayerState) => {
    setLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  function formatRiverCrossingTitle(name: string): string {
    if (!name) return 'River Crossing';
    const clean = name.replace(/\b(River|Stream|Canal)\b/gi, '').trim();
    if (!clean || clean.toUpperCase() === 'UNNAMED') {
      return 'River Crossing';
    }
    return `${clean} River Crossing`;
  }

  function formatRiverName(name: string): string {
    if (!name) return 'Unnamed river';
    const clean = name.replace(/\b(River|Stream|Canal)\b/gi, '').trim();
    if (!clean || clean.toUpperCase() === 'UNNAMED') {
      return 'Unnamed river';
    }
    return `${clean} River`;
  }

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([20.5937, 78.9629], 5);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    routeGroupRef.current = L.layerGroup().addTo(map);
    forestGroupRef.current = L.layerGroup().addTo(map);
    protectedGroupRef.current = L.layerGroup().addTo(map);
    riverGroupRef.current = L.layerGroup().addTo(map);
    crossingGroupRef.current = L.layerGroup().addTo(map);
    pipelineGroupRef.current = L.layerGroup().addTo(map);
    cableGroupRef.current = L.layerGroup().addTo(map);
    utilityIntersectionGroupRef.current = L.layerGroup().addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Dynamic Tile Basemap Layer (Dark / Satellite / Hybrid / Terrain)
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (tileLayerRef.current) map.removeLayer(tileLayerRef.current);
    if (labelLayerRef.current) map.removeLayer(labelLayerRef.current);
    labelLayerRef.current = null;

    if (mapStyle === 'satellite') {
      tileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19, attribution: 'Tiles &copy; Esri World Imagery' }
      ).addTo(map);
    } else if (mapStyle === 'hybrid') {
      tileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19, attribution: 'Tiles &copy; Esri World Imagery' }
      ).addTo(map);
      labelLayerRef.current = L.tileLayer(
        'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19 }
      ).addTo(map);
    } else if (mapStyle === 'terrain') {
      tileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19, attribution: 'Tiles &copy; Esri World Topo Map' }
      ).addTo(map);
    } else {
      // Default Vector Dark Mode
      tileLayerRef.current = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        { subdomains: 'abcd', maxZoom: 19 }
      ).addTo(map);
    }
  }, [mapStyle]);

  // Update Layer Visibility
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (layers.routes && routeGroupRef.current) map.addLayer(routeGroupRef.current);
    else if (routeGroupRef.current) map.removeLayer(routeGroupRef.current);

    if (layers.forests && forestGroupRef.current) map.addLayer(forestGroupRef.current);
    else if (forestGroupRef.current) map.removeLayer(forestGroupRef.current);

    if (layers.protectedAreas && protectedGroupRef.current) map.addLayer(protectedGroupRef.current);
    else if (protectedGroupRef.current) map.removeLayer(protectedGroupRef.current);

    if (layers.rivers && riverGroupRef.current) map.addLayer(riverGroupRef.current);
    else if (riverGroupRef.current) map.removeLayer(riverGroupRef.current);

    if (layers.riverCrossings && crossingGroupRef.current) map.addLayer(crossingGroupRef.current);
    else if (crossingGroupRef.current) map.removeLayer(crossingGroupRef.current);

    if (layers.pipelines && pipelineGroupRef.current) map.addLayer(pipelineGroupRef.current);
    else if (pipelineGroupRef.current) map.removeLayer(pipelineGroupRef.current);

    if (layers.undergroundCables && cableGroupRef.current) map.addLayer(cableGroupRef.current);
    else if (cableGroupRef.current) map.removeLayer(cableGroupRef.current);

    if (layers.utilityIntersections && utilityIntersectionGroupRef.current) map.addLayer(utilityIntersectionGroupRef.current);
    else if (utilityIntersectionGroupRef.current) map.removeLayer(utilityIntersectionGroupRef.current);
  }, [layers]);

  // Render Routes and Markers
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    routeGroupRef.current?.clearLayers();
    forestGroupRef.current?.clearLayers();
    protectedGroupRef.current?.clearLayers();
    riverGroupRef.current?.clearLayers();
    crossingGroupRef.current?.clearLayers();
    pipelineGroupRef.current?.clearLayers();
    cableGroupRef.current?.clearLayers();
    utilityIntersectionGroupRef.current?.clearLayers();

    const bounds = L.latLngBounds([]);

    // Source Marker
    const sourceIcon = L.divIcon({
      className: '',
      html: `<div style="
        width:32px;height:32px;border-radius:50%;
        background:#0d9488;border:3px solid #ffffff;
        box-shadow:0 0 16px rgba(13,148,136,0.8);
        display:flex;align-items:center;justify-content:center;
        color:white;font-weight:800;font-size:12px;font-family:Inter,sans-serif;
      ">S</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
    L.marker(sourceCoords, { icon: sourceIcon })
      .bindPopup(`<b>Origin:</b> ${sourceName}`)
      .addTo(routeGroupRef.current!);
    bounds.extend(sourceCoords);

    // Dest Marker
    const destIcon = L.divIcon({
      className: '',
      html: `<div style="
        width:32px;height:32px;border-radius:50%;
        background:#d97706;border:3px solid #ffffff;
        box-shadow:0 0 16px rgba(217,119,6,0.8);
        display:flex;align-items:center;justify-content:center;
        color:white;font-weight:800;font-size:12px;font-family:Inter,sans-serif;
      ">D</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
    L.marker(destCoords, { icon: destIcon })
      .bindPopup(`<b>Destination:</b> ${destName}`)
      .addTo(routeGroupRef.current!);
    bounds.extend(destCoords);

    routes.forEach((rt) => {
      const isSelected = rt.id === selectedRouteId;
      const waypoints = rt.waypoints || [];

      if (waypoints.length > 0) {
        const polyline = L.polyline(waypoints, {
          color: rt.color,
          weight: isSelected ? 6 : 3.5,
          opacity: isSelected ? 0.95 : 0.5,
          dashArray: isSelected ? undefined : '6,8',
        });

        polyline.on('click', () => onSelectRoute(rt.id));
        polyline.bindTooltip(
          `<b>${rt.name}</b><br/>${rt.distanceKm} km · ${Math.floor(rt.durationMinutes / 60)}h ${rt.durationMinutes % 60}m`,
          { sticky: true }
        );

        routeGroupRef.current?.addLayer(polyline);
        waypoints.forEach((pt) => bounds.extend(pt));
      }

      // Draw Forest Polygons
      rt.forestGeometries?.forEach((fg) => {
        if (fg.coordinates && fg.coordinates.length >= 3) {
          const poly = L.polygon(fg.coordinates, {
            color: '#059669',
            fillColor: '#10b981',
            fillOpacity: 0.25,
            weight: 1.5,
          }).bindTooltip(`<b>Forest Zone</b><br/>${fg.name}`);
          forestGroupRef.current?.addLayer(poly);
        }
      });

      // Draw Protected Areas
      rt.protectedGeometries?.forEach((pg) => {
        if (pg.coordinates && pg.coordinates.length >= 3) {
          const poly = L.polygon(pg.coordinates, {
            color: '#d97706',
            fillColor: '#f59e0b',
            fillOpacity: 0.25,
            weight: 1.5,
          }).bindTooltip(`<b>Protected Sanctuary</b><br/>${pg.name}`);
          protectedGroupRef.current?.addLayer(poly);
        }
      });

      // Draw Rivers
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
    <div className="relative w-full h-full min-h-[350px] md:min-h-[450px] rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl">
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Prominent Top-Right Map View Switcher Bar (Dark | Satellite | Hybrid | Terrain) */}
      <div className="absolute top-3 right-3 z-30 glass rounded-xl p-1.5 border border-white/[0.12] shadow-2xl backdrop-blur-md flex items-center gap-1">
        <div className="text-[10px] font-bold text-slate-300 px-1.5 flex items-center gap-1">
          <Globe className="w-3.5 h-3.5 text-teal-400" />
          <span className="hidden sm:inline text-slate-300">View:</span>
        </div>

        <button
          onClick={() => setMapStyle('dark')}
          className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
            mapStyle === 'dark'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white glass-light'
          }`}
        >
          Dark
        </button>

        <button
          onClick={() => setMapStyle('satellite')}
          className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
            mapStyle === 'satellite'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white glass-light'
          }`}
        >
          Satellite
        </button>

        <button
          onClick={() => setMapStyle('hybrid')}
          className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
            mapStyle === 'hybrid'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white glass-light'
          }`}
        >
          Hybrid
        </button>

        <button
          onClick={() => setMapStyle('terrain')}
          className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
            mapStyle === 'terrain'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-slate-300 hover:text-white glass-light'
          }`}
        >
          Terrain
        </button>
      </div>

      {/* Floating Collapsed Pill Trigger (for Mobile/Small screens) */}
      {panelCollapsed ? (
        <button
          onClick={() => setPanelCollapsed(false)}
          className="absolute top-3 left-3 z-30 glass rounded-xl px-3 py-2 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-2 border border-white/[0.12] shadow-xl backdrop-blur-md cursor-pointer transition-all active:scale-95"
        >
          <Layers className="w-4 h-4 text-teal-400" />
          <span>GIS Layers</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      ) : (
        /* Expanded Unified Responsive Sidebar Overlay */
        <div className="absolute top-3 left-3 md:top-4 md:left-4 z-30 glass rounded-2xl p-3 text-xs w-[240px] sm:w-[260px] max-h-[calc(100%-1.5rem)] overflow-y-auto border border-white/[0.1] shadow-2xl transition-all duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-1.5 mb-2">
            <div className="flex items-center gap-1.5 text-slate-200 font-bold text-xs">
              <Layers className="w-3.5 h-3.5 text-teal-400" />
              <span>GIS PANELS</span>
            </div>

            <button
              onClick={() => setPanelCollapsed(true)}
              className="p-1 rounded glass-light text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Minimize Panel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* View Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-black/40 p-1 rounded-lg border border-white/[0.05] mb-2.5">
            <button
              onClick={() => setPanelTab('layers')}
              className={`py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                panelTab === 'layers'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Layers
            </button>
            <button
              onClick={() => setPanelTab('legend')}
              className={`py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                panelTab === 'legend'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Legend
            </button>
            <button
              onClick={() => setPanelTab('both')}
              className={`py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                panelTab === 'both'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Both
            </button>
          </div>

          {/* Main Content Body */}
          <div className="space-y-3">
            {/* GIS Layers Section */}
            {(panelTab === 'layers' || panelTab === 'both') && (
              <div>
                <div className="text-[9px] font-bold text-teal-400 uppercase tracking-wider mb-1">
                  LAYER CONTROLS
                </div>

                <div className="space-y-1 text-[11px]">
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Routes</div>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300">
                    <input
                      type="checkbox"
                      checked={layers.routes}
                      onChange={() => toggleLayer('routes')}
                      className="rounded border-slate-700 text-teal-500 focus:ring-0 cursor-pointer"
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
                      className="rounded border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
                    />
                    <span>Forests</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300">
                    <input
                      type="checkbox"
                      checked={layers.protectedAreas}
                      onChange={() => toggleLayer('protectedAreas')}
                      className="rounded border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
                    />
                    <span>Protected Areas</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300">
                    <input
                      type="checkbox"
                      checked={layers.rivers}
                      onChange={() => toggleLayer('rivers')}
                      className="rounded border-slate-700 text-sky-500 focus:ring-0 cursor-pointer"
                    />
                    <span>Rivers</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300">
                    <input
                      type="checkbox"
                      checked={layers.riverCrossings}
                      onChange={() => toggleLayer('riverCrossings')}
                      className="rounded border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
                    />
                    <span>River Crossings (🌊)</span>
                  </label>

                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider pt-1 border-t border-white/[0.06]">
                    Existing Infrastructure
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300">
                    <input
                      type="checkbox"
                      checked={layers.pipelines}
                      onChange={() => toggleLayer('pipelines')}
                      className="rounded border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
                    />
                    <span>Pipelines</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300">
                    <input
                      type="checkbox"
                      checked={layers.undergroundCables}
                      onChange={() => toggleLayer('undergroundCables')}
                      className="rounded border-slate-700 text-purple-500 focus:ring-0 cursor-pointer"
                    />
                    <span>Underground Power Cables</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300">
                    <input
                      type="checkbox"
                      checked={layers.utilityIntersections}
                      onChange={() => toggleLayer('utilityIntersections')}
                      className="rounded border-slate-700 text-sky-400 focus:ring-0 cursor-pointer"
                    />
                    <span>Utility Intersections (◆)</span>
                  </label>
                </div>
              </div>
            )}

            {/* Map Legend Section */}
            {(panelTab === 'legend' || panelTab === 'both') && (
              <div className={`${panelTab === 'both' ? 'pt-2 border-t border-white/[0.08]' : ''} space-y-1 text-slate-300`}>
                <div className="text-[9px] font-bold text-amber-400 uppercase tracking-wider mb-1">
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
            )}
          </div>
        </div>
      )}
    </div>
  );
};
