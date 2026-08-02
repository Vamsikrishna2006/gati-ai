import React from 'react';
import { RouteOption } from '../types';
import { GitCompare, Trees, Shield, Clock, ArrowLeft, Sparkles, Waves, Database, Info, Layers, Activity, Zap, AlertTriangle } from 'lucide-react';

interface RouteAnalysisPageProps {
  routes: RouteOption[];
  sourceLabel: string;
  destLabel: string;
  onOpenPlanner: () => void;
  onOpenAI: () => void;
}

function StatPill({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="glass-card rounded-xl px-3.5 py-3 flex flex-col gap-0.5 min-w-[110px]">
      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">{label}</div>
      <div className={`text-base font-bold leading-tight ${accent ? 'text-teal-400' : 'text-white'}`}>
        {value}
      </div>
      {sub && <div className="text-[10px] text-slate-400">{sub}</div>}
    </div>
  );
}

function RoutePanel({ route, label }: { route: RouteOption; label: string }) {
  const riverCount = route.riverCrossingCount ?? route.riverCrossings?.length ?? 0;
  const pipelineCount = route.pipelineCrossingCount ?? 0;
  const cableCount = route.undergroundCableCrossingCount ?? 0;
  const durationHrs = Math.floor(route.durationMinutes / 60);
  const durationMins = route.durationMinutes % 60;

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col gap-4 border border-white/[0.08]">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-3.5 h-3.5 rounded-full shrink-0 ring-2 ring-white/10"
          style={{ backgroundColor: route.color }}
        />
        <div>
          <div className="text-xs text-slate-400 font-medium">{label}</div>
          <div className="text-sm font-semibold text-white">{route.name}</div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        <StatPill
          label="Distance"
          value={`${route.distanceKm.toFixed(0)} km`}
          accent
        />
        <StatPill
          label="Est. duration"
          value={`${durationHrs}h ${durationMins}m`}
        />
        <StatPill
          label="Forest features"
          value={`${route.forestFeatureCount}`}
          sub={`Forest overlap: ~${route.forestOverlapKm.toFixed(1)} km`}
        />
        <StatPill
          label="Protected areas"
          value={`${route.protectedAreaFeatureCount}`}
          sub={`Protected overlap: ~${route.protectedOverlapKm.toFixed(1)} km`}
        />
        <StatPill
          label="River crossings"
          value={`${riverCount}`}
          sub="Line intersections"
        />
        <StatPill
          label="Mapped pipelines"
          value={`${pipelineCount}`}
          sub="Pipeline intersections"
        />
        <StatPill
          label="Underground cables"
          value={`${cableCount}`}
          sub="Power cable intersections"
        />
      </div>

      {/* Summary Text */}
      <div className="rounded-xl px-3.5 py-3 glass-light border border-white/[0.07] flex items-start gap-2.5">
        <Layers className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-300 leading-relaxed">
          Intersects {route.forestFeatureCount} mapped forest {route.forestFeatureCount === 1 ? 'feature' : 'features'} and {route.protectedAreaFeatureCount} mapped protected-area {route.protectedAreaFeatureCount === 1 ? 'feature' : 'features'}. {riverCount} mapped river {riverCount === 1 ? 'crossing' : 'crossings'}. {pipelineCount} mapped pipeline {pipelineCount === 1 ? 'intersection' : 'intersections'} and {cableCount} mapped underground power-cable {cableCount === 1 ? 'intersection' : 'intersections'}.
        </p>
      </div>
    </div>
  );
}

export const RouteAnalysisPage: React.FC<RouteAnalysisPageProps> = ({
  routes,
  sourceLabel,
  destLabel,
  onOpenPlanner,
  onOpenAI,
}) => {
  if (routes.length === 0) {
    return (
      <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4 text-center px-6">
        <GitCompare className="w-10 h-10 text-slate-600" />
        <h2 className="text-lg font-semibold text-white">No route data loaded</h2>
        <p className="text-sm text-slate-400 max-w-sm">
          Go to the Map Planner, pick two cities, and click "Find Routes". Then come back here for measured GIS infrastructure screening.
        </p>
        <button
          onClick={onOpenPlanner}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-lg transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Planner
        </button>
      </div>
    );
  }

  const [routeA, routeB] = routes;

  return (
    <div className="min-h-[calc(100vh-4rem)] p-6 max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="glass-card rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4 border border-white/[0.08]">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <GitCompare className="w-4 h-4 text-teal-400" />
            <span className="text-xs text-teal-400 font-semibold uppercase tracking-wider">Route Comparison & Infrastructure Screening</span>
          </div>
          <h1 className="text-xl font-bold text-white leading-tight">
            {sourceLabel.split('(')[0].trim()} → {destLabel.split('(')[0].trim()}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Measured environmental & mapped utility infrastructure intersections (Pipelines & Underground Power Cables)
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onOpenPlanner}
            className="flex items-center gap-1.5 px-3.5 py-2 glass-light border border-white/[0.09] text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> GIS Map Layers
          </button>
          <button
            onClick={onOpenAI}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-teal-950/40 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> Explain Tradeoff
          </button>
        </div>
      </div>

      {/* SECTION 1: MEASURED FROM LIVE GIS DATA */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.07] pb-2">
          <h2 className="text-xs font-bold text-teal-400 uppercase tracking-widest flex items-center gap-2">
            <Database className="w-4 h-4 text-teal-400" />
            Measured from live GIS data
          </h2>
          <span className="text-[10px] text-slate-400 font-medium">OpenStreetMap & ORS API</span>
        </div>

        {/* Side-by-side route panels */}
        <div className="grid md:grid-cols-2 gap-4">
          {routeA && <RoutePanel route={routeA} label="Route A" />}
          {routeB && <RoutePanel route={routeB} label="Route B" />}
        </div>

        {/* ROUTE CONSTRAINTS SECTION (Requirement #14) */}
        {routeA && routeB && (
          <div className="glass-card rounded-2xl p-5 border border-white/[0.08] space-y-4">
            <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/[0.07] pb-2">
              <Layers className="w-4 h-4 text-teal-400" />
              ROUTE CONSTRAINTS SUMMARY
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Route A Constraints */}
              <div className="glass-light p-4 rounded-xl border border-white/[0.06] space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-400 border-b border-white/[0.05] pb-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                  <span>Route A Constraints</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Environmental Constraints</div>
                  <div className="flex items-center gap-2"><Trees className="w-3.5 h-3.5 text-emerald-400" /> {routeA.forestFeatureCount} forest features</div>
                  <div className="flex items-center gap-2"><Shield className="w-3.5 h-3.5 text-amber-400" /> {routeA.protectedAreaFeatureCount} protected areas</div>
                  <div className="flex items-center gap-2"><Waves className="w-3.5 h-3.5 text-sky-400" /> {routeA.riverCrossingCount ?? 0} river crossings</div>

                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-2 border-t border-white/[0.05]">Existing Infrastructure Constraints</div>
                  <div className="flex items-center gap-2"><Activity className="w-3.5 h-3.5 text-amber-400" /> {routeA.pipelineCrossingCount ?? 0} mapped pipelines</div>
                  <div className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-purple-400" /> {routeA.undergroundCableCrossingCount ?? 0} underground power cables</div>
                </div>
              </div>

              {/* Route B Constraints */}
              <div className="glass-light p-4 rounded-xl border border-white/[0.06] space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 border-b border-white/[0.05] pb-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>Route B Constraints</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Environmental Constraints</div>
                  <div className="flex items-center gap-2"><Trees className="w-3.5 h-3.5 text-emerald-400" /> {routeB.forestFeatureCount} forest features</div>
                  <div className="flex items-center gap-2"><Shield className="w-3.5 h-3.5 text-amber-400" /> {routeB.protectedAreaFeatureCount} protected areas</div>
                  <div className="flex items-center gap-2"><Waves className="w-3.5 h-3.5 text-sky-400" /> {routeB.riverCrossingCount ?? 0} river crossings</div>

                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-2 border-t border-white/[0.05]">Existing Infrastructure Constraints</div>
                  <div className="flex items-center gap-2"><Activity className="w-3.5 h-3.5 text-amber-400" /> {routeB.pipelineCrossingCount ?? 0} mapped pipelines</div>
                  <div className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-purple-400" /> {routeB.undergroundCableCrossingCount ?? 0} underground power cables</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AT A GLANCE COMPARISON MATRIX (Requirements #13 & #18) */}
        {routeA && routeB && (
          <div className="glass-card rounded-2xl overflow-hidden border border-white/[0.08]">
            <div className="px-5 py-3 border-b border-white/[0.07] glass-light flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <GitCompare className="w-4 h-4 text-teal-400" />
                AT A GLANCE
              </h3>
            </div>
            <div className="divide-y divide-white/[0.05]">
              {[
                {
                  label: 'Distance',
                  a: `${routeA.distanceKm.toFixed(0)} km`,
                  b: `${routeB.distanceKm.toFixed(0)} km`,
                  icon: Clock,
                },
                {
                  label: 'Travel time',
                  a: `${Math.floor(routeA.durationMinutes / 60)}h ${routeA.durationMinutes % 60}m`,
                  b: `${Math.floor(routeB.durationMinutes / 60)}h ${routeB.durationMinutes % 60}m`,
                  icon: Clock,
                },
                {
                  label: 'Forest features',
                  a: `${routeA.forestFeatureCount}`,
                  b: `${routeB.forestFeatureCount}`,
                  icon: Trees,
                },
                {
                  label: 'Protected areas',
                  a: `${routeA.protectedAreaFeatureCount}`,
                  b: `${routeB.protectedAreaFeatureCount}`,
                  icon: Shield,
                },
                {
                  label: 'River crossings',
                  a: `${routeA.riverCrossingCount ?? 0}`,
                  b: `${routeB.riverCrossingCount ?? 0}`,
                  icon: Waves,
                },
                {
                  label: 'Pipelines',
                  a: `${routeA.pipelineCrossingCount ?? 0}`,
                  b: `${routeB.pipelineCrossingCount ?? 0}`,
                  icon: Activity,
                },
                {
                  label: 'Underground cables',
                  a: `${routeA.undergroundCableCrossingCount ?? 0}`,
                  b: `${routeB.undergroundCableCrossingCount ?? 0}`,
                  icon: Zap,
                },
              ].map(({ label, a, b, icon: Icon }) => (
                <div key={label} className="flex items-center px-5 py-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-400 w-44 shrink-0 font-medium">
                    <Icon className="w-3.5 h-3.5 text-slate-500" />
                    {label}
                  </div>
                  <div className="flex-1 font-semibold text-slate-200">{a}</div>
                  <div className="flex-1 font-semibold text-slate-200">{b}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FIELD VERIFICATION WARNING (Requirement #20) */}
      <div className="glass-card rounded-xl p-4 border border-amber-500/30 flex items-start gap-3 bg-amber-500/[0.04]">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200/90 leading-relaxed">
          <strong>Field Verification Warning:</strong> Mapped utility intersections should be verified through authoritative utility records and field surveys before construction or final route selection.
        </div>
      </div>

      {/* DATA SOURCES & PUBLIC GIS COVERAGE (Requirements #19 & #21) */}
      <div className="grid md:grid-cols-2 gap-4 pt-2">
        {/* Data Sources Labels */}
        <div className="glass-card rounded-2xl p-4 border border-white/[0.07] space-y-2">
          <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-teal-400" /> DATA SOURCES
          </div>
          <div className="space-y-1 text-xs text-slate-300">
            <div className="flex justify-between py-1 border-b border-white/[0.05]">
              <span className="text-slate-400">Routing</span>
              <span className="font-semibold text-slate-200">OpenRouteService</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/[0.05]">
              <span className="text-slate-400">Place Search</span>
              <span className="font-semibold text-slate-200">OpenStreetMap / Nominatim</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/[0.05]">
              <span className="text-slate-400">Environmental Features</span>
              <span className="font-semibold text-slate-200">OpenStreetMap / Overpass</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/[0.05]">
              <span className="text-slate-400">Utility Infrastructure</span>
              <span className="font-semibold text-slate-200">OpenStreetMap / Overpass</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">AI Explanation</span>
              <span className="font-semibold text-slate-200">Google Gemini</span>
            </div>
          </div>
        </div>

        {/* Public GIS Coverage Data Quality Indicator */}
        <div className="glass-card rounded-2xl p-4 border border-white/[0.07] space-y-2 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Info className="w-3.5 h-3.5 text-amber-400" /> PUBLIC GIS COVERAGE
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Utility data reflects publicly mapped OpenStreetMap features and may be incomplete, especially for underground infrastructure.
            </p>
          </div>
          <div className="text-[10px] text-slate-500 pt-2 border-t border-white/[0.05]">
            GatiAI Screening Assistant · Fact-based GIS Evaluation
          </div>
        </div>
      </div>

    </div>
  );
};
