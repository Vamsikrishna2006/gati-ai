import React, { useEffect, useState } from 'react';
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

  // Auto-trigger search on initial mount
  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-[#070a12] relative z-10">

      {/* Toolbar */}
      <div className="glass border-b border-white/[0.08] px-4 py-3 flex flex-wrap items-center gap-3 shrink-0 shadow-lg">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <MapPin className="w-3.5 h-3.5 text-teal-400" />
          <span>Plan Corridor</span>
        </div>

        {/* Source Dropdown */}
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

        {/* Destination Dropdown */}
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
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-950/40 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing GIS...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Find Routes</span>
            </>
          )}
        </button>

        {routes.length > 0 && (
          <button
            onClick={onOpenAnalysis}
            className="ml-auto flex items-center gap-2 px-4 py-2 glass-light border border-teal-500/30 text-teal-300 hover:text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
          >
            <span>Compare in Detail</span>
            <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
          </button>
        )}
      </div>

      {/* Main Grid View */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden relative">
        {/* Left/Center: GIS Map */}
        <div className="lg:col-span-8 xl:col-span-9 h-full p-3 relative">
          <GISMap
            routes={routes}
            selectedRouteId={selectedRouteId}
            onSelectRoute={(id) => setSelectedRouteId(id)}
            sourceCoords={sourceNode.coords}
            destCoords={destNode.coords}
            sourceName={sourceNode.name.split('(')[0].trim()}
            destName={destNode.name.split('(')[0].trim()}
          />
        </div>

        {/* Right Sidebar: Route Option Cards */}
        <div className="lg:col-span-4 xl:col-span-3 h-full overflow-y-auto p-4 border-l border-white/[0.08] glass-light space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              ROUTE OPTIONS
            </h2>
            <span className="text-[10px] text-slate-400 font-medium">
              {routes.length} candidate alignments calculated
            </span>
          </div>

          {/* Loading status alert */}
          {loading && (
            <div className="p-3 rounded-xl glass-light border border-teal-500/30 text-teal-300 text-xs flex items-center gap-2.5 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-teal-400 shrink-0" />
              <span>{loadingStatus || 'Processing GIS layers...'}</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block">Routing Notice</strong>
                {errorMsg}
              </div>
            </div>
          )}

          {/* Render Route Cards */}
          {routes.length > 0 ? (
            <div className="space-y-3">
              {routes.map((r, idx) => (
                <RouteCard
                  key={r.id}
                  route={r}
                  label={idx === 0 ? 'Route A (Primary Corridor)' : 'Route B (Alternative Corridor)'}
                  isSelected={r.id === selectedRouteId}
                  onSelect={() => setSelectedRouteId(r.id)}
                />
              ))}

              <button
                onClick={onOpenAnalysis}
                className="w-full py-3 mt-2 bg-gradient-to-r from-teal-600/30 to-emerald-600/30 hover:from-teal-600/50 hover:to-emerald-600/50 border border-teal-500/40 rounded-xl text-teal-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Full Comparison & Tradeoff</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            !loading && (
              <div className="text-center py-10 px-4 space-y-2 text-slate-500">
                <Database className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs">No routes calculated yet.</p>
                <p className="text-[11px] text-slate-600">Select Origin and Destination above and click "Find Routes".</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
