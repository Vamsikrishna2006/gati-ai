import React, { useState } from 'react';
import { RouteOption } from '../types';
import { GitCompare, Trees, Shield, Clock, ArrowLeft, Sparkles, Waves, Database, Info, Layers, Activity, Zap, AlertTriangle, Users, Building2, FileCheck, CheckCircle2 } from 'lucide-react';

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
  const [activeDeptTab, setActiveDeptTab] = useState<'matrix' | 'coordination'>('coordination');

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
    <div className="min-h-[calc(100vh-4rem)] p-6 max-w-5xl mx-auto space-y-6 font-sans">

      {/* Header */}
      <div className="glass-card rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4 border border-white/[0.08]">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <GitCompare className="w-4 h-4 text-teal-400" />
            <span className="text-xs text-teal-400 font-semibold uppercase tracking-wider">Route Comparison & Inter-Department Coordination</span>
          </div>
          <h1 className="text-xl font-bold text-white leading-tight">
            {sourceLabel.split('(')[0].trim()} → {destLabel.split('(')[0].trim()}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Pre-construction screening & multi-department clearance protocol (MoRTH, Power DISCOM, Jal Shakti, MoEFCC)
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

      {/* MULTI-DEPARTMENT INTER-MINISTERIAL COORDINATION WORKFLOW (New Feature) */}
      <div className="glass-card rounded-2xl p-5 border border-teal-500/30 space-y-4 bg-teal-950/20 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
          <div>
            <div className="text-xs font-bold text-teal-400 uppercase tracking-widest flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-400" />
              INTER-DEPARTMENTAL PRE-CONSTRUCTION COORDINATION HUB
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Prevent post-construction road digging & coordinate joint utility duct laying before asphalt paving.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/[0.06]">
            <button
              onClick={() => setActiveDeptTab('coordination')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeDeptTab === 'coordination'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Department Clearances
            </button>
            <button
              onClick={() => setActiveDeptTab('matrix')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeDeptTab === 'matrix'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              At a Glance Matrix
            </button>
          </div>
        </div>

        {activeDeptTab === 'coordination' ? (
          <div className="space-y-4">
            {/* Alert Banner for Inter-Department Notice */}
            <div className="glass-light p-4 rounded-xl border border-amber-500/30 flex items-start gap-3 bg-amber-500/[0.04]">
              <Building2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <div className="font-bold text-amber-300">
                  Pre-Paving Multi-Department Coordination Notice (PM Gati Shakti Protocol)
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Before asphalt paving or earthwork begins for Route A or Route B, the Highways Department must hold a joint pre-construction coordination meeting with Electricity, Water, and Forest Authorities to co-lay underground utilities in designated right-of-way (RoW) conduits.
                </p>
              </div>
            </div>

            {/* Department Action Cards */}
            <div className="grid md:grid-cols-2 gap-3.5">
              {/* ⚡ Power & Electricity Department */}
              <div className="glass-light p-4 rounded-xl border border-purple-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-purple-300 text-xs">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span>Power & Electricity (DISCOM / PowerGrid)</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Joint Trenching
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Action Required:</strong> Route A intersects {routeA.undergroundCableCrossingCount ?? 0} mapped power cables and Route B intersects {routeB.undergroundCableCrossingCount ?? 0}. Electricity Board must co-lay high-voltage lines in pre-constructed roadside utility ducts <em>BEFORE</em> asphalt laying to avoid digging up completed roads.
                </p>
              </div>

              {/* 💧 Water Resources & Jal Shakti */}
              <div className="glass-light p-4 rounded-xl border border-amber-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-amber-300 text-xs">
                    <Activity className="w-4 h-4 text-amber-400" />
                    <span>Water Supply & Pipelines (Jal Shakti)</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Pipeline Duct Access
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Action Required:</strong> Route A intersects {routeA.pipelineCrossingCount ?? 0} mapped pipelines and Route B intersects {routeB.pipelineCrossingCount ?? 0}. Water Department must align main water supply trunk pipelines with proposed highway service corridors and river bridge piers.
                </p>
              </div>

              {/* 🌲 Forest & Environment Department */}
              <div className="glass-light p-4 rounded-xl border border-emerald-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-emerald-300 text-xs">
                    <Trees className="w-4 h-4 text-emerald-400" />
                    <span>Forest & Wildlife (MoEFCC)</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Statutory Clearance
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Action Required:</strong> Route A passes ~{routeA.forestOverlapKm.toFixed(1)} km through mapped forest features and Route B passes ~{routeB.forestOverlapKm.toFixed(1)} km. Apply for Stage-I Forest Conservation Act (FCA) diversion clearance during early alignment screening.
                </p>
              </div>

              {/* 🌉 Inland Waterways & River Authority */}
              <div className="glass-light p-4 rounded-xl border border-sky-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sky-300 text-xs">
                    <Waves className="w-4 h-4 text-sky-400" />
                    <span>Rivers & Inland Waterways</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Bridge Pier Span
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Action Required:</strong> Route A crosses {routeA.riverCrossingCount ?? 0} mapped river systems and Route B crosses {routeB.riverCrossingCount ?? 0}. Coordinate bridge pier span clearances and high-flood level (HFL) data with Inland Waterways Authority.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* AT A GLANCE COMPARISON MATRIX */
          <div className="glass-card rounded-xl overflow-hidden border border-white/[0.08]">
            <div className="divide-y divide-white/[0.05]">
              {[
                { label: 'Distance', a: `${routeA.distanceKm.toFixed(0)} km`, b: `${routeB.distanceKm.toFixed(0)} km`, icon: Clock },
                { label: 'Travel time', a: `${Math.floor(routeA.durationMinutes / 60)}h ${routeA.durationMinutes % 60}m`, b: `${Math.floor(routeB.durationMinutes / 60)}h ${routeB.durationMinutes % 60}m`, icon: Clock },
                { label: 'Forest features', a: `${routeA.forestFeatureCount}`, b: `${routeB.forestFeatureCount}`, icon: Trees },
                { label: 'Protected areas', a: `${routeA.protectedAreaFeatureCount}`, b: `${routeB.protectedAreaFeatureCount}`, icon: Shield },
                { label: 'River crossings', a: `${routeA.riverCrossingCount ?? 0}`, b: `${routeB.riverCrossingCount ?? 0}`, icon: Waves },
                { label: 'Mapped Pipelines', a: `${routeA.pipelineCrossingCount ?? 0}`, b: `${routeB.pipelineCrossingCount ?? 0}`, icon: Activity },
                { label: 'Underground cables', a: `${routeA.undergroundCableCrossingCount ?? 0}`, b: `${routeB.undergroundCableCrossingCount ?? 0}`, icon: Zap },
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

      {/* SECTION: MEASURED ROUTE PANELS */}
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
          {routeA && <RoutePanel route={routeA} label="Route A (Primary Corridor)" />}
          {routeB && <RoutePanel route={routeB} label="Route B (Alternative Corridor)" />}
        </div>
      </div>

      {/* FIELD VERIFICATION WARNING */}
      <div className="glass-card rounded-xl p-4 border border-amber-500/30 flex items-start gap-3 bg-amber-500/[0.04]">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200/90 leading-relaxed">
          <strong>Field Verification Warning:</strong> Mapped utility intersections should be verified through authoritative utility records and field surveys before construction or final route selection.
        </div>
      </div>

      {/* DATA SOURCES & PUBLIC GIS COVERAGE */}
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
