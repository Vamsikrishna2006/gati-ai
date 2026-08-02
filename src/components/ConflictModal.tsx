import React from 'react';
import { ConflictZone } from '../types';
import { X, AlertTriangle, CheckCircle2, Trees, Waves, Building2, Zap, Plane, Shield } from 'lucide-react';

interface ConflictModalProps {
  conflicts: ConflictZone[];
  routeName: string;
  onClose: () => void;
}

function conflictIcon(type: string) {
  switch (type) {
    case 'forest': return <Trees className="w-4 h-4 text-teal-400" />;
    case 'river': return <Waves className="w-4 h-4 text-blue-400" />;
    case 'protected_area': return <Shield className="w-4 h-4 text-amber-400" />;
    case 'urban': return <Building2 className="w-4 h-4 text-purple-400" />;
    case 'utility_corridor': return <Zap className="w-4 h-4 text-amber-400" />;
    case 'airport_buffer': return <Plane className="w-4 h-4 text-rose-400" />;
    default: return <AlertTriangle className="w-4 h-4 text-rose-400" />;
  }
}

export const ConflictModal: React.FC<ConflictModalProps> = ({ conflicts, routeName, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="glass rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl overflow-hidden border border-white/[0.08]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-white/[0.07]">
          <div className="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/20 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white">Conflict zones</h3>
            <p className="text-[10px] text-slate-500 truncate">{routeName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 glass-light rounded-lg text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {conflicts.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-teal-400 mx-auto" />
              <p className="text-sm font-semibold text-white">No conflict zones detected</p>
              <p className="text-xs text-slate-400">This route doesn't intersect any flagged areas.</p>
            </div>
          ) : (
            conflicts.map((cf) => (
              <div key={cf.id} className="glass-card rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg glass-light flex items-center justify-center shrink-0">
                    {conflictIcon(cf.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-white">{cf.name}</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                        cf.severity === 'high'
                          ? 'bg-rose-500/15 text-rose-400 border-rose-500/25'
                          : cf.severity === 'medium'
                          ? 'bg-amber-500/15 text-amber-400 border-amber-500/25'
                          : 'bg-teal-500/15 text-teal-400 border-teal-500/25'
                      }`}>
                        {cf.severity}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">{cf.locationName}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{cf.description}</p>

                <div className="bg-teal-500/8 border border-teal-500/15 rounded-lg p-3">
                  <div className="text-[10px] font-semibold text-teal-400 mb-1">Suggested mitigation</div>
                  <p className="text-xs text-slate-300">{cf.mitigationSuggestion}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/[0.07] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 glass-light text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
