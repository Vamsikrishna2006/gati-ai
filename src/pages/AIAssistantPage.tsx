import React, { useState } from 'react';
import { RouteOption } from '../types';
import { Sparkles, Loader2, Trees, Shield, Clock, RefreshCw, Activity, Zap } from 'lucide-react';

interface AIAssistantPageProps {
  routes: RouteOption[];
  sourceLabel: string;
  destLabel: string;
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({
  routes,
  sourceLabel,
  destLabel,
}) => {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasRoutes = routes.length >= 2;
  const [routeA, routeB] = routes;

  const handleExplain = async () => {
    if (!hasRoutes || loading) return;
    setLoading(true);
    setError(null);
    setExplanation(null);

    try {
      const res = await fetch('/api/ai/explain-tradeoff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceLabel,
          destLabel,
          routeA: {
            name: routeA.name,
            distanceKm: routeA.distanceKm,
            durationMinutes: routeA.durationMinutes,
            forestFeatureCount: routeA.forestFeatureCount,
            protectedAreaFeatureCount: routeA.protectedAreaFeatureCount,
            forestOverlapKm: routeA.forestOverlapKm,
            protectedOverlapKm: routeA.protectedOverlapKm,
            riverCrossingCount: routeA.riverCrossingCount,
            pipelineCrossingCount: routeA.pipelineCrossingCount,
            undergroundCableCrossingCount: routeA.undergroundCableCrossingCount,
          },
          routeB: {
            name: routeB.name,
            distanceKm: routeB.distanceKm,
            durationMinutes: routeB.durationMinutes,
            forestFeatureCount: routeB.forestFeatureCount,
            protectedAreaFeatureCount: routeB.protectedAreaFeatureCount,
            forestOverlapKm: routeB.forestOverlapKm,
            protectedOverlapKm: routeB.protectedOverlapKm,
            riverCrossingCount: routeB.riverCrossingCount,
            pipelineCrossingCount: routeB.pipelineCrossingCount,
            undergroundCableCrossingCount: routeB.undergroundCableCrossingCount,
          },
        }),
      });

      const data = await res.json();
      if (data.explanation) {
        setExplanation(data.explanation);
      } else if (data.error) {
        setError(data.error);
      } else {
        setError('Unable to fetch AI explanation. Using instant tradeoff summary.');
      }
    } catch (err: any) {
      console.error('AI call error:', err);
      const shorter = routeA.distanceKm <= routeB.distanceKm ? 'Route A' : 'Route B';
      const lessEnv =
        (routeA.forestFeatureCount + routeA.protectedAreaFeatureCount) <=
        (routeB.forestFeatureCount + routeB.protectedAreaFeatureCount)
          ? 'Route A'
          : 'Route B';

      setExplanation(
        `Route A measures ${routeA.distanceKm.toFixed(0)} km with ${routeA.forestFeatureCount} mapped forest features and ${routeA.pipelineCrossingCount ?? 0} mapped pipeline intersections. Route B measures ${routeB.distanceKm.toFixed(0)} km with ${routeB.forestFeatureCount} mapped forest features and ${routeB.pipelineCrossingCount ?? 0} mapped pipeline intersections. These mapped infrastructure findings warrant further field verification.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-6 max-w-4xl mx-auto space-y-5 relative z-10 font-sans">

      {/* Header */}
      <div className="glass-card rounded-2xl p-5 border border-white/[0.09] shadow-xl">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-6 h-6 rounded-md bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Gemini AI</span>
        </div>
        <h1 className="text-xl font-bold text-white mb-1">Explain Route Tradeoff</h1>
        <p className="text-xs text-slate-300 leading-relaxed">
          Give Gemini the measured metrics — distance, duration, forest overlap, river crossings, mapped pipelines, and underground power cables — and it will explain candidate corridor trade-offs in neutral, plain language. No winner declared.
          <strong className="text-teal-400"> You decide.</strong>
        </p>
      </div>

      {/* Route Preview Cards */}
      {hasRoutes ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[routeA, routeB].map((rt, i) => (
            <div key={rt.id} className="glass-card rounded-2xl p-5 space-y-3 border border-white/[0.08]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: rt.color }} />
                  <span className="text-xs font-semibold text-white">Route {String.fromCharCode(65 + i)}</span>
                </div>
                <span className="text-[10px] text-slate-400">{rt.name}</span>
              </div>

              {/* Primary metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="glass-light p-2.5 rounded-lg border border-white/[0.05]">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3 text-teal-400" /> Distance</div>
                  <div className="font-bold text-white mt-0.5">{rt.distanceKm.toFixed(0)} km</div>
                </div>
                <div className="glass-light p-2.5 rounded-lg border border-white/[0.05]">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1"><Trees className="w-3 h-3 text-emerald-400" /> Forest Overlap</div>
                  <div className="font-bold text-white mt-0.5">~{rt.forestOverlapKm.toFixed(1)} km</div>
                </div>
              </div>

              {/* Utility counts */}
              <div className="glass-light p-3 rounded-xl border border-white/[0.06] space-y-1 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                    <Activity className="w-3.5 h-3.5" /> Mapped pipelines:
                  </span>
                  <span className="font-bold text-white">{rt.pipelineCrossingCount ?? 0}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-purple-400 font-medium">
                    <Zap className="w-3.5 h-3.5" /> Underground cables:
                  </span>
                  <span className="font-bold text-white">{rt.undergroundCableCrossingCount ?? 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-8 text-center space-y-3">
          <Trees className="w-10 h-10 text-teal-400/60 mx-auto" />
          <p className="text-base text-white font-semibold">No route data loaded yet</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Go to Map Planner, pick two cities, and click "Find Routes". Once candidate routes are calculated, Gemini will explain the corridor tradeoffs.
          </p>
        </div>
      )}

      {/* Trigger button */}
      {hasRoutes && (
        <button
          onClick={handleExplain}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-teal-900/40 border border-teal-400/20 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing candidate route tradeoffs with Gemini...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{explanation ? 'Re-analyze Route Tradeoff' : 'Explain Route Tradeoff'}</span>
            </>
          )}
        </button>
      )}

      {/* Error display */}
      {error && (
        <div className="glass-card border border-rose-500/30 rounded-xl p-4 text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* AI explanation panel */}
      {explanation && !loading && (
        <div className="glass-card rounded-2xl p-6 space-y-4 border border-teal-500/20 shadow-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Gemini Neutral Tradeoff Explanation</div>
              <div className="text-[10px] text-slate-400">Based strictly on measured ORS & OpenStreetMap GIS data</div>
            </div>
            <button
              onClick={handleExplain}
              className="ml-auto p-1.5 glass-light rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Regenerate"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="border-t border-white/[0.08] pt-4">
            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-normal">
              {explanation}
            </p>
          </div>

          <div className="border-t border-white/[0.08] pt-3">
            <p className="text-[10px] text-slate-500">
              This evaluation was generated strictly from measured GIS route metrics and available public OpenStreetMap data. Gemini is constrained from declaring a winner, providing neutral facts for your planning committee.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
