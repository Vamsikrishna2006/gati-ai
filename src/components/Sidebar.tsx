import React from 'react';
import { Map, GitCompare, Sparkles, Info, ChevronRight } from 'lucide-react';

export type ActivePage = 'map' | 'analysis' | 'ai_assistant' | 'about';

interface SidebarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
}

const navItems = [
  {
    id: 'map' as ActivePage,
    label: 'Map Planner',
    sublabel: 'Search & draw routes',
    icon: Map,
  },
  {
    id: 'analysis' as ActivePage,
    label: 'Route Analysis',
    sublabel: 'Measured GIS metrics',
    icon: GitCompare,
  },
  {
    id: 'ai_assistant' as ActivePage,
    label: 'AI Tradeoff',
    sublabel: 'Explain route tradeoff',
    icon: Sparkles,
    badge: 'Gemini',
  },
  {
    id: 'about' as ActivePage,
    label: 'About & Provenance',
    sublabel: 'Tech stack & scope',
    icon: Info,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  return (
    <aside className="w-56 glass border-r border-white/[0.08] flex flex-col h-[calc(100vh-4rem)] sticky top-16 shrink-0 z-30 py-4">
      <div className="px-3 mb-3">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
          NAVIGATION
        </div>
      </div>

      <nav className="flex-1 px-2 space-y-1">
        {navItems.map(({ id, label, sublabel, icon: Icon, badge }) => {
          const isActive = activePage === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer group ${
                isActive
                  ? 'bg-teal-500/15 border border-teal-500/30 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05] border border-transparent'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                isActive ? 'bg-teal-500/20' : 'bg-white/[0.05] group-hover:bg-white/[0.08]'
              }`}>
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-semibold leading-none mb-1 ${isActive ? 'text-white' : ''}`}>
                  {label}
                </div>
                <div className="text-[10px] text-slate-400 truncate">{sublabel}</div>
              </div>
              {badge && (
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                  isActive ? 'bg-teal-500/25 text-teal-300' : 'bg-white/[0.06] text-slate-400'
                }`}>
                  {badge}
                </span>
              )}
              {isActive && !badge && <ChevronRight className="w-3 h-3 text-teal-400 shrink-0" />}
            </button>
          );
        })}
      </nav>

      {/* Footer Note */}
      <div className="px-3 mt-4">
        <div className="glass-light rounded-xl p-3 text-center border border-white/[0.06]">
          <div className="text-[10px] text-slate-400 font-medium leading-relaxed">
            Real Routing · Overpass GIS · Gemini AI
          </div>
          <div className="text-[9px] text-teal-400 mt-1 font-semibold">
            No simulated values
          </div>
        </div>
      </div>
    </aside>
  );
};
