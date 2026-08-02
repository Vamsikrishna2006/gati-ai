import React from 'react';
import { ArrowRight, Map, GitCompare, Sparkles, Trees, Shield, ChevronRight } from 'lucide-react';

interface LandingPageProps {
  onStartPlanner: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartPlanner }) => {
  return (
    <div className="min-h-screen flex flex-col text-slate-100 relative overflow-hidden bg-ambient-mesh" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <header className="relative z-10 h-16 flex items-center justify-between px-6 md:px-12 glass border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center shadow-md shadow-teal-950/50 ring-1 ring-teal-400/30">
            <Map className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-base font-bold text-white">Gati<span className="text-teal-400">AI</span></div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Route Planner</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1.5 glass-light px-3 py-1.5 rounded-full text-[11px] text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            Live GIS · OpenRouteService · Overpass · Gemini
          </span>
          <button
            onClick={onStartPlanner}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-teal-950/40 transition-all cursor-pointer"
          >
            Launch Map Planner <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Content */}
      <section className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-16 pt-16 pb-20 max-w-6xl mx-auto w-full">

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="glass-light px-3.5 py-1.5 rounded-full text-[11px] text-amber-400 border border-amber-500/25 font-semibold">
            Early-Stage Corridor Route Screening Assistant
          </span>
          <span className="glass-light px-3.5 py-1.5 rounded-full text-[11px] text-teal-400 border border-teal-500/25 font-semibold">
            Verified Geospatial Analysis
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.12] tracking-tight max-w-4xl mb-6">
          Identify environmental constraints<br />
          <span className="text-teal-400">before commitment</span><br />
          <span className="text-slate-400 font-normal text-2xl sm:text-3xl">using real OpenStreetMap & routing APIs.</span>
        </h1>

        <p className="text-slate-300 text-base max-w-2xl leading-relaxed mb-8">
          Select origin and destination nodes. OpenRouteService computes candidate driving alignments, Overpass measures actual forest, protected area, and river line intersections, and Gemini provides a neutral tradeoff summary.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 mb-14">
          <button
            onClick={onStartPlanner}
            className="flex items-center gap-2.5 px-6 py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-950/50 transition-all cursor-pointer"
          >
            Start GIS Screening <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="#how"
            className="flex items-center gap-2 px-5 py-3.5 glass-card text-slate-200 hover:text-white text-sm font-medium rounded-xl transition-all"
          >
            How it works <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* Data Provenance Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl">
          <div className="glass-card px-4 py-3 rounded-xl border border-white/[0.08]">
            <div className="text-xs font-bold text-teal-400">OpenRouteService</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Real driving routing</div>
          </div>
          <div className="glass-card px-4 py-3 rounded-xl border border-white/[0.08]">
            <div className="text-xs font-bold text-teal-400">Overpass API</div>
            <div className="text-[11px] text-slate-400 mt-0.5">OSM forest & river layers</div>
          </div>
          <div className="glass-card px-4 py-3 rounded-xl border border-white/[0.08]">
            <div className="text-xs font-bold text-amber-400">Line Intersection</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Exact river crossings</div>
          </div>
          <div className="glass-card px-4 py-3 rounded-xl border border-white/[0.08]">
            <div className="text-xs font-bold text-amber-400">Google Gemini</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Neutral tradeoff summary</div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how" className="relative z-10 border-t border-white/[0.08] py-16 px-6 md:px-16 glass-light">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Verifiable 3-Step Screening Pipeline
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
              Every statistic is computed from live geospatial data. No hardcoded or simulated cost, carbon, or risk figures.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="glass-card rounded-2xl p-6 border border-white/[0.08]">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 text-xs font-bold flex items-center justify-center border border-teal-500/30">1</span>
                <GitCompare className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Candidate Routing</span>
              </div>
              <h3 className="font-bold text-white text-base mb-2">Real OpenRouteService Polylines</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Fetch driving route options between origin and destination nodes. Distances and travel durations are calculated directly from standard road network data.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-card rounded-2xl p-6 border border-white/[0.08]">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 text-xs font-bold flex items-center justify-center border border-teal-500/30">2</span>
                <Trees className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">GIS Intersection</span>
              </div>
              <h3 className="font-bold text-white text-base mb-2">Overpass Environmental Screening</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Query OpenStreetMap for forest polygons, protected area boundaries, and river line geometries. Exact line-intersection algorithms locate river crossings.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-card rounded-2xl p-6 border border-white/[0.08]">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center border border-amber-500/30">3</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Neutral AI Layer</span>
              </div>
              <h3 className="font-bold text-white text-base mb-2">Grounded Tradeoff Explanation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gemini receives only the measured metrics (distance, duration, forest overlap, protected area overlap, river crossings) and explains what is being traded off without picking a winner.
              </p>
            </div>
          </div>

          {/* Principle Disclaimer */}
          <div className="mt-10 glass-card rounded-2xl p-5 border border-white/[0.08] flex items-start gap-3">
            <Shield className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white block mb-0.5">Core Product Principle</strong>
              GatiAI does not declare a winner or calculate fictitious costs. The application surfaces real candidate routes, mapped environmental constraints, and measured differences. <strong className="text-teal-400">The final planning call belongs to the user.</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.08] py-6 px-6 text-center text-xs text-slate-500">
        <p>GatiAI · Early-Stage Route Screening Assistant · Powered by OpenRouteService, Overpass & Gemini</p>
      </footer>
    </div>
  );
};
