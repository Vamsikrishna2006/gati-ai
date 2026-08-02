import React from 'react';
import { RouteOption } from '../types';
import { Clock, Navigation, Trees, Shield, Waves, Zap, Activity } from 'lucide-react';

interface RouteCardProps {
  route: RouteOption;
  isSelected: boolean;
  onSelect: () => void;
}

export const RouteCard: React.FC<RouteCardProps> = ({
  route,
  isSelected,
  onSelect,
}) => {
  const riverCount = route.riverCrossingCount ?? route.riverCrossings?.length ?? 0;
  const pipelineCount = route.pipelineCrossingCount ?? 0;
  const cableCount = route.undergroundCableCrossingCount ?? 0;

  return (
    <div
      onClick={onSelect}
      className={`glass-card rounded-2xl p-4 transition-all duration-300 cursor-pointer relative overflow-hidden border ${
        isSelected
          ? 'border-teal-500/50 shadow-lg shadow-teal-950/30 ring-1 ring-teal-500/30'
          : 'border-white/[0.08] hover:border-white/20'
      }`}
    >
      {/* Accent strip */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: route.color }}
      />

      <div className="flex items-center justify-between mb-3 pt-1">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full shadow-sm"
            style={{ backgroundColor: route.color }}
          />
          <h3 className="font-bold text-white text-sm tracking-wide">{route.name}</h3>
        </div>
        {isSelected && (
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30">
            Selected
          </span>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="glass-light p-2.5 rounded-xl border border-white/[0.05]">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Navigation className="w-3 h-3 text-teal-400" /> Distance
          </div>
          <div className="text-sm font-bold text-white mt-0.5">{route.distanceKm.toFixed(0)} km</div>
        </div>

        <div className="glass-light p-2.5 rounded-xl border border-white/[0.05]">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" /> Est. Duration
          </div>
          <div className="text-sm font-bold text-white mt-0.5">
            {Math.floor(route.durationMinutes / 60)}h {route.durationMinutes % 60}m
          </div>
        </div>
      </div>

      {/* Environmental & Utility Infrastructure Metrics */}
      <div className="mt-3 pt-2.5 border-t border-white/[0.06] space-y-1.5 text-[11px] text-slate-300">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Trees className="w-3.5 h-3.5 text-emerald-400" /> Forest features:
          </span>
          <span className="font-semibold text-white">
            {route.forestFeatureCount} <span className="text-[10px] text-slate-400">(~{route.forestOverlapKm.toFixed(1)} km)</span>
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Shield className="w-3.5 h-3.5 text-amber-400" /> Protected areas:
          </span>
          <span className="font-semibold text-white">
            {route.protectedAreaFeatureCount} <span className="text-[10px] text-slate-400">(~{route.protectedOverlapKm.toFixed(1)} km)</span>
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Waves className="w-3.5 h-3.5 text-sky-400" /> River crossings:
          </span>
          <span className="font-semibold text-white">{riverCount}</span>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-white/[0.04]">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Activity className="w-3.5 h-3.5 text-amber-400" /> Mapped pipelines:
          </span>
          <span className="font-semibold text-white">{pipelineCount}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Zap className="w-3.5 h-3.5 text-purple-400" /> Underground cables:
          </span>
          <span className="font-semibold text-white">{cableCount}</span>
        </div>
      </div>
    </div>
  );
};
