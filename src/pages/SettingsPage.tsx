import React, { useState } from 'react';
import { Settings, Shield, CheckCircle2, Sparkles, Layers, Sliders } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [apiKeySet, setApiKeySet] = useState<boolean>(true);
  const [autoAnalysis, setAutoAnalysis] = useState<boolean>(true);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-[#0c121d] p-6 rounded-2xl border border-slate-800 shadow-xl">
        <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-blue-400" /> Platform Configuration
        </h1>
        <p className="text-xs text-slate-400 mt-1">Manage GIS spatial defaults, AI engine preferences, and PM Gati Shakti delegation rules</p>
      </div>

      <div className="space-y-4 text-xs">
        {/* Gemini Integration Status */}
        <div className="p-5 rounded-2xl bg-[#0c121d] border border-slate-800 space-y-3 shadow-xl">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" /> Gemini AI Engine Status
          </h3>
          <div className="p-3 bg-[#080b12] rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-bold text-white text-xs">Gemini 3.6 Flash Server-Side Model</div>
              <div className="text-[10px] text-slate-400">Environment secret injected automatically via AI Studio</div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Connected
            </span>
          </div>
        </div>

        {/* GIS Layer Defaults */}
        <div className="p-5 rounded-2xl bg-[#0c121d] border border-slate-800 space-y-3 shadow-xl">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" /> Default GIS Layers on Startup
          </h3>
          <p className="text-slate-400">Specify which spatial datasets render automatically when launching new corridor planners.</p>

          <div className="space-y-2 pt-2">
            <label className="flex items-center justify-between p-2.5 bg-[#080b12] rounded-xl border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
              <span className="text-slate-200">Auto-detect Forest Reserve Intersections</span>
              <input type="checkbox" defaultChecked className="rounded border-slate-700 text-blue-600 focus:ring-0" />
            </label>
            <label className="flex items-center justify-between p-2.5 bg-[#080b12] rounded-xl border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
              <span className="text-slate-200">Highlight Eco-Sensitive Protected Areas</span>
              <input type="checkbox" defaultChecked className="rounded border-slate-700 text-blue-600 focus:ring-0" />
            </label>
            <label className="flex items-center justify-between p-2.5 bg-[#080b12] rounded-xl border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
              <span className="text-slate-200">Show Existing Dedicated Freight Corridors (DFCCIL)</span>
              <input type="checkbox" defaultChecked className="rounded border-slate-700 text-blue-600 focus:ring-0" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
