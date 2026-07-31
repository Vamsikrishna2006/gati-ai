import React from 'react';
import { RouteOption } from '../types';
import { Sparkles, ShieldAlert, CheckCircle, Clock, DollarSign, Mountain, Leaf, AlertTriangle } from 'lucide-react';

interface RouteCardProps {
  route: RouteOption;
  isSelected: boolean;
  onSelect: () => void;
  onViewConflicts: () => void;
}

export const RouteCard: React.FC<RouteCardProps> = ({
  route,
  isSelected,
  onSelect,
  onViewConflicts,
}) => {
  return (
    <div
      onClick={onSelect}
      className={`relative p-4 rounded-xl transition-all cursor-pointer border select-none ${
        isSelected
          ? 'bg-[#0c121d] border-blue-500/80 shadow-xl shadow-blue-950/40 ring-1 ring-blue-500/40'
          : 'bg-[#0c121d]/70 border-slate-800 hover:border-slate-700 hover:bg-[#0c121d]'
      }`}
    >
      {/* Top Header & AI Recommendation Badge */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-3.5 h-3.5 rounded-full shrink-0"
            style={{ backgroundColor: route.color }}
          />
          <h4 className="font-bold text-sm text-white leading-tight">{route.name}</h4>
        </div>

        {route.isRecommended && (
          <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-600/20 text-blue-300 border border-blue-500/40 animate-pulse">
            <Sparkles className="w-3 h-3 text-blue-400" /> AI Choice ({route.confidenceScore}%)
          </span>
        )}
      </div>

      {/* Rationale text */}
      <p className="text-xs text-slate-300 line-clamp-2 mb-3 bg-[#080b12] p-2 rounded-lg border border-slate-800/80">
        {route.recommendationReason}
      </p>

      {/* Grid Metrics */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="bg-[#080b12] p-2 rounded-lg border border-slate-800">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-blue-400" /> Length & Time
          </div>
          <div className="font-bold text-slate-100 text-sm mt-0.5">
            {route.distanceKm} km <span className="text-xs font-normal text-slate-400">({route.constructionMonths}m)</span>
          </div>
        </div>

        <div className="bg-[#080b12] p-2 rounded-lg border border-slate-800">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-emerald-400" /> Capital Outlay
          </div>
          <div className="font-bold text-slate-100 text-sm mt-0.5">
            ₹{route.estimatedCostCrores.toLocaleString('en-IN')} <span className="text-[10px] font-normal text-slate-400">Cr</span>
          </div>
        </div>

        <div className="bg-[#080b12] p-2 rounded-lg border border-slate-800">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Leaf className="w-3 h-3 text-emerald-400" /> Eco Impact
          </div>
          <div className="font-bold text-emerald-400 text-xs mt-0.5">
            {route.environmentalImpactScore}/100 <span className="text-[10px] font-normal text-slate-400">(Score)</span>
          </div>
        </div>

        <div className="bg-[#080b12] p-2 rounded-lg border border-slate-800">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Mountain className="w-3 h-3 text-amber-400" /> Terrain
          </div>
          <div className="font-bold text-amber-300 text-xs mt-0.5">
            {route.terrainDifficulty}
          </div>
        </div>
      </div>

      {/* Bottom Footer: Conflict warnings count & select button */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewConflicts();
          }}
          className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors ${
            route.conflicts.length > 0
              ? 'bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30'
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}
        >
          {route.conflicts.length > 0 ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>{route.conflicts.length} Intersections Found</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero High-Risk Conflicts</span>
            </>
          )}
        </button>

        <span className={`text-xs font-bold px-3 py-1 rounded-lg transition-colors ${
          isSelected
            ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-md'
            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
        }`}>
          {isSelected ? 'Selected' : 'Select Route'}
        </span>
      </div>
    </div>
  );
};
