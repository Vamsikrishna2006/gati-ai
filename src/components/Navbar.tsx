import React from 'react';
import { Layers, Map, GitCompare, Sparkles, Info, FileText } from 'lucide-react';

interface NavbarProps {
  onNavigate: (page: string) => void;
  onOpenDPR?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, onOpenDPR }) => {
  return (
    <header className="h-16 sticky top-0 z-40 glass border-b border-white/[0.08] px-5 flex items-center justify-between shadow-lg">
      {/* Brand */}
      <button
        onClick={() => onNavigate('landing')}
        className="flex items-center gap-3 group cursor-pointer"
      >
        <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center shadow-md shadow-teal-950/50 ring-1 ring-teal-400/30">
          <Layers className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
        </div>
        <div className="leading-none text-left">
          <div className="text-base font-bold text-white tracking-tight">
            Gati<span className="text-teal-400">AI</span>
          </div>
          <div className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
            Route Planner
          </div>
        </div>
      </button>

      {/* Center Status Badge */}
      <div className="hidden md:flex items-center gap-2 glass-light px-3.5 py-1.5 rounded-full text-[11px] text-slate-300 border border-white/[0.08]">
        <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
        <span>OpenRouteService · Overpass API · Gemini</span>
        <span className="text-white/20 mx-1">|</span>
        <span className="text-teal-400 font-semibold">Live GIS Pipeline</span>
      </div>

      {/* Navigation Links & DPR Export Action */}
      <div className="flex items-center gap-2">
        <nav className="flex items-center gap-1">
          {[
            { id: 'map', icon: Map, label: 'Planner' },
            { id: 'analysis', icon: GitCompare, label: 'Analysis' },
            { id: 'ai_assistant', icon: Sparkles, label: 'AI Tradeoff' },
            { id: 'about', icon: Info, label: 'About' },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:block">{label}</span>
            </button>
          ))}
        </nav>

        {onOpenDPR && (
          <button
            onClick={onOpenDPR}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-lg shadow-md shadow-teal-950/40 transition-all cursor-pointer border border-teal-400/30"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden md:block">DPR Report</span>
          </button>
        )}
      </div>
    </header>
  );
};
