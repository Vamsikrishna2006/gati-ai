import React from 'react';
import { ConflictZone } from '../types';
import { ShieldAlert, X, AlertTriangle, CheckCircle2, Trees, Waves, Building2, Zap, Plane } from 'lucide-react';

interface ConflictModalProps {
  conflicts: ConflictZone[];
  routeName: string;
  onClose: () => void;
}

export const ConflictModal: React.FC<ConflictModalProps> = ({ conflicts, routeName, onClose }) => {
  const getConflictIcon = (type: string) => {
    switch (type) {
      case 'forest':
        return <Trees className="w-5 h-5 text-emerald-400" />;
      case 'river':
        return <Waves className="w-5 h-5 text-blue-400" />;
      case 'urban':
        return <Building2 className="w-5 h-5 text-purple-400" />;
      case 'utility_corridor':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'airport_buffer':
        return <Plane className="w-5 h-5 text-rose-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-rose-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080b12]/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0c121d] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#080b12]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-500/10 rounded-xl border border-rose-500/20 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Spatial Conflict Inspection</h3>
              <p className="text-xs text-slate-400">{routeName} – Intersections & Mitigations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {conflicts.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="font-bold text-white text-base">Zero High-Risk Spatial Conflicts</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                This alignment successfully bypasses reserve forests, protected sanctuaries, and congested urban zones under PM Gati Shakti guidelines.
              </p>
            </div>
          ) : (
            conflicts.map((cf) => (
              <div
                key={cf.id}
                className="p-4 rounded-xl bg-[#080b12] border border-slate-800 space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-[#0c121d] border border-slate-800">
                      {getConflictIcon(cf.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white">{cf.name}</h4>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase border ${
                            cf.severity === 'high'
                              ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                              : cf.severity === 'medium'
                              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                              : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          }`}
                        >
                          {cf.severity} Severity
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{cf.locationName}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[10px] text-slate-400">Impact Score</div>
                    <div className="font-bold text-sm text-rose-400">{cf.impactScore}/100</div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 bg-[#0c121d] p-2.5 rounded-lg border border-slate-800">
                  {cf.description}
                </p>

                <div className="bg-emerald-950/30 border border-emerald-500/20 p-2.5 rounded-lg text-xs text-emerald-300 space-y-0.5">
                  <div className="font-bold text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> AI Recommended Mitigation Protocol
                  </div>
                  <p className="text-[11px] text-slate-200">{cf.mitigationSuggestion}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#080b12] text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
          >
            Close Inspection
          </button>
        </div>
      </div>
    </div>
  );
};
