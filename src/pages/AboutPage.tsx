import React from 'react';
import { Layers, Code, Server, Shield, Trees, Map, Sparkles, Database, Info, Waves } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const techStack = [
    { label: 'Frontend', value: 'React 19 + Vite + TypeScript + Tailwind CSS' },
    { label: 'Map rendering', value: 'Leaflet + CartoDB Dark Vector Canvas' },
    { label: 'Routing engine', value: 'OpenRouteService Directions API' },
    { label: 'Geospatial data', value: 'OpenStreetMap / Overpass API' },
    { label: 'Intersection math', value: '2D Line Segment Intersection Algorithm' },
    { label: 'AI Tradeoff explanation', value: 'Google Gemini 2.5 Flash / 1.5 Flash' },
    { label: 'Backend API', value: 'Node.js + Express' },
    { label: 'Storage', value: 'In-Memory / Deterministic API State' },
  ];

  const inScope = [
    { icon: Map, text: 'OpenRouteService candidate route polyline fetching' },
    { icon: Trees, text: 'Overpass forest & protected-area polygon extraction' },
    { icon: Waves, text: 'Real 2D line-segment river crossing detection' },
    { icon: Layers, text: 'Interactive map layer controls (Routes, Forests, Protected Areas, Rivers, Crossings)' },
    { icon: Sparkles, text: 'Grounded Gemini tradeoff explanation (Strict no-winner rules)' },
  ];

  const outOfScope = [
    'Complete Environmental Impact Assessment (EIA)',
    'Construction cost estimation (₹ crore figures)',
    'Engineering cost & delay risk modeling',
    'Project completion time prediction',
    'Carbon footprint scoring',
    'Legal & regulatory clearance approval',
    'Winner badges or arbitrary weighted scoring',
    'User authentication & database persistence',
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] p-6 max-w-4xl mx-auto space-y-6 relative z-10" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <div className="glass-card rounded-2xl p-6 border border-white/[0.08] space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600/30 border border-teal-500/30 flex items-center justify-center">
            <Layers className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">About GatiAI</h1>
            <p className="text-xs text-slate-400">Early-Stage Infrastructure Route Screening Assistant</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed pt-1">
          GatiAI is a lightweight screening tool designed to help planners compare candidate infrastructure corridors using real geographic data. It surfaces mapped forest polygons, protected sanctuary boundaries, and river crossings to reveal trade-offs between speed and environmental overlap.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">

        {/* What is live */}
        <div className="glass-card rounded-2xl p-5 border border-white/[0.08] space-y-3">
          <h2 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-teal-400" />
            Verified Pipeline Capabilities
          </h2>
          <div className="space-y-2">
            {inScope.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-2.5 text-xs text-slate-300">
                <div className="w-5 h-5 rounded-md bg-teal-500/15 border border-teal-500/25 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-3 h-3 text-teal-400" />
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap / Out of scope */}
        <div className="glass-card rounded-2xl p-5 border border-white/[0.08] space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400" />
            Explicitly Out of Scope
          </h2>
          <div className="space-y-1.5">
            {outOfScope.map((item) => (
              <div key={item} className="flex items-start gap-2 text-xs text-slate-400">
                <span className="text-slate-600 mt-0.5 shrink-0">—</span>
                {item}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 pt-2 border-t border-white/[0.05]">
            GatiAI focuses exclusively on measured GIS metrics and neutral tradeoff interpretation.
          </p>
        </div>
      </div>

      {/* Tech Stack Grid */}
      <div className="glass-card rounded-2xl p-5 border border-white/[0.08]">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
          <Server className="w-4 h-4 text-teal-400" />
          Technical Stack & Data Sources
        </h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {techStack.map(({ label, value }) => (
            <div key={label} className="flex items-start gap-3 p-3 glass-light rounded-xl text-xs border border-white/[0.05]">
              <Code className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-slate-500 mb-0.5 uppercase tracking-wider text-[10px]">{label}</div>
                <div className="text-slate-200 font-medium">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-xs text-slate-500">
        <p>GatiAI · Built for Infrastructure Planning · Real Routing & Real Geospatial Data</p>
      </div>
    </div>
  );
};
