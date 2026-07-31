import React from 'react';
import { Sparkles, MapPin, Layers, Route, ShieldCheck, ArrowRight, Bot, ChevronRight, Shield, Building2 } from 'lucide-react';

interface LandingPageProps {
  onStartPlanner: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartPlanner, onLogin }) => {
  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] relative overflow-hidden">
      {/* Official Government Tricolour Top Accent Ribbon */}
      <div className="fixed top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#FF9933] via-white to-[#138808] z-50" />

      {/* Top Header */}
      <header className="h-20 border-b border-slate-800/80 px-6 lg:px-12 flex items-center justify-between sticky top-0 bg-[#0c121d]/90 backdrop-blur-md z-40 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-blue-600 to-emerald-600 flex items-center justify-center font-bold text-white text-xl shadow-lg ring-1 ring-blue-400/30">
            <Layers className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                Gati<span className="text-blue-400">AI</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                भारत सरकार | GOI
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
              PM Gati Shakti National Master Plan Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onLogin}
            className="px-4 py-2 text-xs font-bold text-blue-300 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-full transition-all flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5 text-blue-400" /> Officer Login
          </button>
          <button
            onClick={onStartPlanner}
            className="px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 rounded-full transition-all flex items-center gap-2 shadow-lg shadow-blue-900/40"
          >
            Launch Map Planner <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-6 lg:px-12 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            प्रधान मंत्री गति शक्ति - राष्ट्रीय मास्टर प्लान
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Sparkles className="w-4 h-4 text-blue-400" /> Multi-Modal AI Corridor Route Optimization
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white max-w-4xl leading-[1.15] mb-6">
          Smarter, Faster & Eco-Friendly Corridor Route Planning for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400">PM Gati Shakti</span>
        </h1>

        <p className="text-slate-300 text-base md:text-lg max-w-2xl leading-relaxed mb-8">
          Accelerate national infrastructure decisions with real-time multi-layer GIS conflict detection, automated terrain elevation profiles, predictive delay risk modeling, and instant Gemini 3.6 AI decision briefs.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-4 mb-14">
          <button
            onClick={onStartPlanner}
            className="px-7 py-3.5 rounded-full font-extrabold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:opacity-90 transition-all flex items-center gap-2.5 shadow-xl shadow-blue-950/50"
          >
            Open Interactive GIS Planner <Route className="w-5 h-5" />
          </button>
          <button
            onClick={onLogin}
            className="px-6 py-3.5 rounded-full font-bold text-sm text-slate-200 bg-[#0c121d] hover:bg-slate-800 border border-slate-700/80 transition-all flex items-center gap-2 shadow-md"
          >
            Officer / Judge Sign In <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
          <div className="p-4 rounded-2xl bg-[#0c121d] border border-slate-800 shadow-xl">
            <div className="text-2xl font-black text-emerald-400">70%</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Faster Route Approval Time</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0c121d] border border-slate-800 shadow-xl">
            <div className="text-2xl font-black text-blue-400">12+ Layers</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Integrated GIS Datasets</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0c121d] border border-slate-800 shadow-xl">
            <div className="text-2xl font-black text-purple-400">₹2,400 Cr</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Avg Overrun Risk Prevented</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0c121d] border border-slate-800 shadow-xl">
            <div className="text-2xl font-black text-amber-400">Zero</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Core Forest Disruption via AI</div>
          </div>
        </div>
      </section>

      {/* Core Features Showcase */}
      <section className="bg-[#0c121d]/80 border-t border-slate-800 py-16 px-6 lg:px-12 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
              Solving Inter-Departmental Infrastructure Bottlenecks
            </h2>
            <p className="text-xs md:text-sm text-slate-400">
              Transforming complex multi-modal corridor planning into a streamlined, data-driven workflow across railways, highways, ports, and environmental authorities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#080b12] border border-slate-800 space-y-3 shadow-xl hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Multi-Layer GIS Mapping</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Overlay forest reserves, river basins, protected sanctuaries, existing freight lines, and utility corridors on a real-time vector canvas.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#080b12] border border-slate-800 space-y-3 shadow-xl hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Spatial Conflict Detection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instantly highlight intersections with eco-sensitive tiger corridors, coastal zones, high-voltage lines, and urban congestion areas.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#080b12] border border-slate-800 space-y-3 shadow-xl hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Gemini AI Decision Support</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Natural language query assistant providing deep route comparison explanations, risk summaries, and downloadable DPR executive reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-6 lg:px-12 text-center text-xs text-slate-500 bg-[#060911]">
        <p>GatiAI – PM Gati Shakti AI Infrastructure Planning Platform • Built for National Multi-modal Connectivity</p>
      </footer>
    </div>
  );
};
