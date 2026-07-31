import React from 'react';
import { Shield, Sparkles, MapPin, Layers, User as UserIcon, Activity, CheckCircle2 } from 'lucide-react';
import { User } from '../types';
import { SAMPLE_USERS } from '../data/mockData';

interface NavbarProps {
  currentUser: User;
  onSelectUser: (user: User) => void;
  onOpenLogin?: () => void;
  activeProjectCode?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentUser, onSelectUser, onOpenLogin, activeProjectCode }) => {
  return (
    <header className="relative h-16 bg-[#0c121d] border-b border-slate-800 px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 shadow-xl backdrop-blur-md">
      {/* Official Government Tricolour Top Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* Brand & Government Master Plan Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-blue-600 to-emerald-600 shadow-lg text-white ring-1 ring-blue-400/30">
          <Layers className="w-5 h-5 text-white stroke-[2.5]" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
              Gati<span className="text-blue-400">AI</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" /> भारत सरकार | GOI
            </span>
            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-600/20 text-blue-300 border border-blue-500/30">
              <Sparkles className="w-3 h-3 text-blue-400" /> PM Gati Shakti NMP
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold hidden lg:block">
            प्रधान मंत्री गति शक्ति • National Master Plan Platform
          </p>
        </div>
      </div>

      {/* Center Status Indicators */}
      <div className="hidden lg:flex items-center gap-4 bg-[#080b12] px-3.5 py-1.5 rounded-full border border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-2 border-r border-slate-800 pr-3">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>GIS Engine: <strong className="text-emerald-400 font-mono">Active (12 Layers)</strong></span>
        </div>
        <div className="flex items-center gap-2 border-r border-slate-800 pr-3">
          <CheckCircle2 className="w-4 h-4 text-blue-400" />
          <span>AI Model: <strong className="text-blue-400 font-mono">Gemini 3.6 Flash</strong></span>
        </div>
        {activeProjectCode && (
          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Active: <span className="text-slate-200">{activeProjectCode}</span></span>
          </div>
        )}
      </div>

      {/* Officer Switcher & Login Switch Button */}
      <div className="flex items-center gap-2.5">
        {onOpenLogin && (
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
            title="Go to Officer Login Page"
          >
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Officer Login</span>
          </button>
        )}

        <div className="relative group">
          <button className="flex items-center gap-2.5 bg-[#111827] hover:bg-slate-800 border border-slate-700/60 px-3 py-1.5 rounded-full text-xs font-medium text-slate-200 transition-all">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-blue-500/50"
            />
            <div className="text-left hidden sm:block">
              <div className="font-semibold text-white leading-none text-xs">{currentUser.name}</div>
              <div className="text-[10px] text-emerald-400 font-mono capitalize">{currentUser.role.replace('_', ' ')}</div>
            </div>
          </button>

          {/* User Selector Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-72 bg-[#0c121d] border border-slate-800 rounded-xl shadow-2xl p-2 hidden group-hover:block z-50">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 py-1 mb-1 flex items-center justify-between">
              <span>Switch Officer Persona</span>
              <span className="text-amber-400 font-mono">NIC SSO</span>
            </div>
            {SAMPLE_USERS.map((usr) => (
              <button
                key={usr.id}
                onClick={() => onSelectUser(usr)}
                className={`w-full text-left flex items-start gap-2.5 p-2 rounded-lg text-xs transition-colors ${
                  usr.id === currentUser.id
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                    : 'hover:bg-slate-800/80 text-slate-300'
                }`}
              >
                <img src={usr.avatar} alt={usr.name} className="w-7 h-7 rounded-full object-cover mt-0.5" />
                <div>
                  <div className="font-medium text-white">{usr.name}</div>
                  <div className="text-[10px] text-slate-400 leading-tight">{usr.department}</div>
                </div>
              </button>
            ))}

            {onOpenLogin && (
              <div className="mt-2 pt-2 border-t border-slate-800">
                <button
                  onClick={onOpenLogin}
                  className="w-full text-center py-2 bg-[#080b12] hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-blue-400" /> Go to Full Officer Login Portal
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
