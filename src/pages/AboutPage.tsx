import React from 'react';
import { Info, Layers, Route, Sparkles, CheckCircle2, Shield, Code, Server, GitBranch, Cpu, Terminal } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 text-slate-200">
      {/* Header */}
      <div className="bg-[#0c121d] p-6 rounded-2xl border border-slate-800 space-y-2 shadow-xl">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600/20 text-blue-400 border border-blue-500/30">
          <Sparkles className="w-3 h-3 text-blue-400" /> PM Gati Shakti National Master Plan
        </div>
        <h1 className="text-2xl font-black text-white">About GatiAI – AI Infrastructure Planning Assistant</h1>
        <p className="text-xs text-slate-400">
          GatiAI is a multi-modal AI infrastructure decision support engine engineered to revolutionize how government planners select, evaluate, and approve major national freight & transit corridors.
        </p>
      </div>

      {/* PM Gati Shakti 7 Engines */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Route className="w-5 h-5 text-emerald-400" /> The 7 Engines of PM Gati Shakti
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {[
            { name: 'Roadways', desc: 'Expressways, National Highways & Border Connectivity' },
            { name: 'Railways', desc: 'Dedicated Freight Corridors & Semi-High Speed Lines' },
            { name: 'Airports', desc: 'Air Cargo Terminals & Regional Heliports' },
            { name: 'Ports', desc: 'Sagarmala Coastal Corridors & Inland Water Terminals' },
            { name: 'Mass Transport', desc: 'Metro Rail & Regional Rapid Transit Systems (RRTS)' },
            { name: 'Waterways', desc: 'Inland National Waterways (NW-1, NW-2, NW-5)' },
            { name: 'Logistics Infra', desc: 'Multi-Modal Logistics Parks (MMLPs) & Dry Ports' },
          ].map((engine, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-[#0c121d] border border-slate-800 space-y-1 shadow-lg hover:border-slate-700 transition-colors">
              <div className="font-bold text-emerald-400 text-xs">{idx + 1}. {engine.name}</div>
              <div className="text-[11px] text-slate-400">{engine.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Architecture & Deployment Guide */}
      <div className="p-6 rounded-2xl bg-[#0c121d] border border-slate-800 space-y-4 shadow-xl">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Server className="w-5 h-5 text-blue-400" /> System Architecture & CI/CD Pipeline
        </h2>

        <div className="grid md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#080b12] border border-slate-800 space-y-2">
            <h3 className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Cpu className="w-4 h-4" /> Full-Stack Architecture
            </h3>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              <li>• <strong>Frontend:</strong> React 19 + Vite + TypeScript + Tailwind CSS</li>
              <li>• <strong>GIS Engine:</strong> Leaflet + OpenStreetMap Vector Overlays</li>
              <li>• <strong>Backend:</strong> Express.js Node.js Server</li>
              <li>• <strong>AI Engine:</strong> @google/genai SDK (Gemini 3.6 Flash)</li>
              <li>• <strong>Analytics:</strong> Recharts Multi-Metric Visualizers</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#080b12] border border-slate-800 space-y-2">
            <h3 className="font-bold text-blue-400 flex items-center gap-1.5">
              <GitBranch className="w-4 h-4" /> Vercel / Render Deployment Workflow
            </h3>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              <li>• <strong>Build Script:</strong> <code className="text-amber-300 font-mono">npm run build</code></li>
              <li>• <strong>Dev Script:</strong> <code className="text-amber-300 font-mono">npm run dev</code></li>
              <li>• <strong>Environment Vars:</strong> Declare <code className="text-amber-300 font-mono">GEMINI_API_KEY</code></li>
              <li>• <strong>Production Start:</strong> <code className="text-amber-300 font-mono">node dist/server.cjs</code></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
