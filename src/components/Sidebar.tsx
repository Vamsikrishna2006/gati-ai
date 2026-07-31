import React from 'react';
import {
  LayoutDashboard,
  Map,
  GitCompare,
  Bot,
  BarChart3,
  FileSpreadsheet,
  Settings,
  Info,
  ChevronRight,
  Route,
  Shield,
} from 'lucide-react';

export type ActivePage =
  | 'dashboard'
  | 'map'
  | 'analysis'
  | 'ai_assistant'
  | 'analytics'
  | 'reports'
  | 'settings'
  | 'about';

interface SidebarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  onOpenLogin?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, onOpenLogin }) => {
  const menuItems = [
    { id: 'dashboard' as ActivePage, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'map' as ActivePage, label: 'GIS Map Planner', icon: Map, badge: 'Live GIS' },
    { id: 'analysis' as ActivePage, label: 'Route Analysis', icon: GitCompare },
    { id: 'ai_assistant' as ActivePage, label: 'AI Assistant', icon: Bot, badge: 'Gemini 3.6' },
    { id: 'analytics' as ActivePage, label: 'Analytics Hub', icon: BarChart3 },
    { id: 'reports' as ActivePage, label: 'DPR Reports', icon: FileSpreadsheet },
  ];

  const secondaryItems = [
    { id: 'settings' as ActivePage, label: 'Settings', icon: Settings },
    { id: 'about' as ActivePage, label: 'About & PM GS', icon: Info },
  ];

  return (
    <aside className="w-64 bg-[#0c121d] border-r border-slate-800 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none z-30 shadow-xl">
      <div className="p-3 space-y-6 overflow-y-auto">
        {/* Primary Menu */}
        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">
            Master Planning Core
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-950/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-blue-500/30 text-blue-200' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  ) : (
                    isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Secondary Menu */}
        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">
            System & Reference
          </div>
          <nav className="space-y-1">
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}

            {onOpenLogin && (
              <button
                onClick={onOpenLogin}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 border border-amber-500/20 transition-all mt-2"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>Officer Portal Login</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Footer PM Gati Shakti Banner */}
      <div className="p-3 m-3 rounded-xl bg-[#080b12] border border-slate-800 text-center">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-200 mb-1">
          <Route className="w-4 h-4 text-emerald-400" />
          <span>7 Engines of Growth</span>
        </div>
        <p className="text-[10px] text-slate-500 leading-tight">
          Railways, Roads, Ports, Waterways, Airports, Mass Transport, Logistics Infrastructure
        </p>
      </div>
    </aside>
  );
};
