import React, { useState } from 'react';
import { RouteOption } from '../types';
import { GISMap } from '../components/GISMap';
import { RouteCard } from '../components/RouteCard';
import { MAJOR_INDIAN_NODES } from '../data/indianNodes';
import {
  MapPin,
  RefreshCw,
  ArrowRight,
  ChevronDown,
  Loader2,
  AlertCircle,
  Database,
} from 'lucide-react';

interface MapPlannerPageProps {
  onRoutesReady: (routes: RouteOption[], src: string, dest: string) => void;
  onOpenAnalysis: () => void;
}

export const MapPlannerPage: React.FC<MapPlannerPageProps> = ({
  onRoutesReady,
  onOpenAnalysis,
}) => {
  const [sourceNode, setSourceNode] = useState(MAJOR_INDIAN_NODES[0]);
  const [destNode, setDestNode] = useState(MAJOR_INDIAN_NODES[1]);
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSourceChange = (selectedName: string) => {
    const found = MAJOR_INDIAN_NODES.find((n) => n.name === selectedName);
    if (found) {
      setSourceNode(found);
      // If same as destination, switch destination automatically
      if (found.name === destNode.name) {
        const alt = MAJOR_INDIAN_NODES.find((n) => n.name !== found.name);
        if (alt) setDestNode(alt);
      }
    }
  };

  const handleDestChange = (selectedName: string) => {
    const found = MAJOR_INDIAN_NODES.find((n) => n.name === selectedName);
    if (found) {
      setDestNode(found);
      // If same as source, switch source automatically
      if (found.name === sourceNode.name) {
        const alt = MAJOR_INDIAN_NODES.find((n) => n.name !== found.name);
        if (alt) setSourceNode(alt);
      }
    }
  };

  const handleSearch = async () => {
    if (loading || sourceNode.name === destNode.name) return;
    setLoading(true);
    setHasSearched(true);
    setErrorMsg(null);

    try {
      setLoadingStatus('Fetching real driving routes from OpenRouteService...');
      const orsRes = await fetch('/api/routes/ors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceCoords: sourceNode.coords,
          destCoords: destNode.coords,
        }),
      });

      if (!orsRes.ok) {
        const errText = await orsRes.text();
        throw new Error(`Routing engine error (${orsRes.status}): ${errText || 'Unable to fetch route geometry'}`);
      }

      const orsData = await orsRes.json();
      const orsRoutes: RouteOption[] = orsData?.routes || [];

      if (orsRoutes.length === 0) {
        throw new Error('No route features returned from routing engine.');
      }

      setLoadingStatus('Checking for pipelines, underground cables, mapped rivers, and environmental areas...');
      const envRes = await fetch('/api/routes/env-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ routes: orsRoutes }),
      });

      let finalRoutes: RouteOption[] = orsRoutes;
      if (envRes.ok) {
        const envData = await envRes.json();
        finalRoutes = envData?.routes || orsRoutes;
      }

      setRoutes(finalRoutes);
      setSelectedRouteId(finalRoutes[0]?.id || '');
      onRoutesReady(finalRoutes, sourceNode.name, destNode.name);
    } catch (err: any) {
      console.error('Search failed', err);
      setErrorMsg(err.message || 'Routing request failed. Please check network connection.');
    } finally {
      setLoading(false);
      setLoadingStatus('');
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-[#070a12] relative z-10">

      {/* Toolbar */}
      <div className="glass border-b border-white/[0.08] px-4 py-3 flex flex-wrap items-center gap-3 shrink-0 shadow-lg">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <MapPin className="w-3.5 h-3.5 text-teal-400" />
          <span>Plan Corridor</span>
        </div>

        {/* Source Dropdown (Filters out selected destination) */}
        <div className="relative">
          <select
            value={sourceNode.name}
            onChange={(e) => handleSourceChange(e.target.value)}
            className="glass-light border border-white/[0.09] rounded-lg px-3 py-2 text-xs text-slate-200 pr-8 appearance-none cursor-pointer"
          >
            {MAJOR_INDIAN_NODES.filter((n) => n.name !== destNode.name).map((n) => (
              <option key={n.name} value={n.name} className="bg-[#0d1322]">
                Origin: {n.name.split('(')[0].trim()}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />

        {/* Destination Dropdown (Filters out selected origin) */}
        <div className="relative">
          <select
            value={destNode.name}
            onChange={(e) => handleDestChange(e.target.value)}
            className="glass-light border border-white/[0.09] rounded-lg px-3 py-2 text-xs text-slate-200 pr-8 appearance-none cursor-pointer"
          >
            {MAJOR_INDIAN_NODES.filter((n) => n.name !== sourceNode.name).map((n) => (
              <option key={n.name} value={n.name} className="bg-[#0d1322]">
                Dest: {n.name.split('(')[0].trim()}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <button
          onClick={handleSearch}
          disabled={loading || sourceNode.name === destNode.name}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-lg transition-all cursor-pointer shadow-md shadow-teal-950/40"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5" />
          )}
          {loading ? 'Analyzing...' : 'Find Routes'}
        </button>

        {routes.length > 0 && !loading && (
          <button
            onClick={onOpenAnalysis}
            className="ml-auto flex items-center gap-1.5 px-3 py-2 glass-light border border-teal-500/30 text-teal-400 hover:text-teal-300 text-xs font-semibold rounded-lg transition-all cursor-pointer"
          >
            Compare in Detail <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Workspace Split */}
      <div className="flex-1 flex overflow-hidden">

        {/* Map Viewport */}
        <div className="flex-1 relative p-3">
          <GISMap
            sourceCoords={sourceNode.coords}
            sourceName={sourceNode.name}
            destCoords={destNode.coords}
            destName={destNode.name}
            routes={routes}
            selectedRouteId={selectedRouteId}
            onSelectRoute={setSelectedRouteId}
          />

          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-3 rounded-2xl glass flex flex-col items-center justify-center gap-3 z-30">
              <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
              <p className="text-sm text-slate-200 font-medium max-w-sm text-center">{loadingStatus}</p>
            </div>
          )}

          {/* Error Notice */}
          {errorMsg && (
            <div className="absolute top-6 left-6 right-6 z-30 glass-card border border-rose-500/30 p-3.5 rounded-xl flex items-center gap-3 text-rose-300 text-xs shadow-xl">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="flex-1">{errorMsg}</span>
              <button onClick={() => setErrorMsg(null)} className="text-slate-400 hover:text-white">×</button>
            </div>
          )}

          {/* Initial Prompt Banner */}
          {!loading && !hasSearched && (
            <div className="absolute inset-3 rounded-2xl flex flex-col items-center justify-center gap-3 pointer-events-none">
              <div className="glass-card px-6 py-5 rounded-2xl text-center max-w-sm border border-white/[0.09] shadow-2xl">
                <MapPin className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                <p className="text-sm text-white font-semibold mb-1">Select Origin & Destination Above</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We'll draw candidate driving routes from OpenRouteService and calculate real river line crossings and forest/protected-area overlaps from OpenStreetMap.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Side Panel: Candidate Alignments */}
        <div className="w-80 glass border-l border-white/[0.08] flex flex-col p-4 gap-3 overflow-y-auto shrink-0">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-0.5">Route Options</h3>
            <p className="text-xs text-slate-400">
              {routes.length > 0
                ? `${routes.length} candidate alignments calculated`
                : 'Select nodes above to compute routes'}
            </p>
          </div>

          {routes.length > 0 ? (
            <div className="space-y-3">
              {routes.map((rt) => (
                <RouteCard
                  key={rt.id}
                  route={rt}
                  isSelected={rt.id === selectedRouteId}
                  onSelect={() => setSelectedRouteId(rt.id)}
                />
              ))}

              <button
                onClick={onOpenAnalysis}
                className="w-full py-2.5 glass-card border border-teal-500/30 text-teal-400 hover:text-teal-300 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                Full Comparison & Tradeoff <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="glass-card rounded-xl p-4 animate-pulse">
                  <div className="h-3 bg-white/[0.08] rounded mb-3 w-3/4" />
                  <div className="h-2 bg-white/[0.05] rounded mb-2" />
                  <div className="h-2 bg-white/[0.05] rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : null}

          {/* Footer Data Provenance Badge */}
          <div className="mt-auto pt-3 border-t border-white/[0.06] text-[10px] text-slate-500 flex items-center gap-1.5 justify-center">
            <Database className="w-3 h-3 text-teal-400" />
            <span>OpenRouteService · Overpass · Gemini</span>
          </div>
        </div>
      </div>
    </div>
  );
};
