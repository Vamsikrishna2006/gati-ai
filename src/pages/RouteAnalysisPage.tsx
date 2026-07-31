import React from 'react';
import { Project, RouteOption } from '../types';
import { Sparkles, GitCompare, CheckCircle2, ShieldAlert, ArrowRight, DollarSign, Clock, Mountain, Leaf, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

interface RouteAnalysisPageProps {
  activeProject: Project;
  onSelectRoute: (routeId: string) => void;
  onOpenPlanner: () => void;
}

export const RouteAnalysisPage: React.FC<RouteAnalysisPageProps> = ({
  activeProject,
  onSelectRoute,
  onOpenPlanner,
}) => {
  const routes = activeProject.routes;

  const chartData = routes.map((r) => ({
    name: r.name.split(':')[0],
    Cost: r.estimatedCostCrores,
    Distance: r.distanceKm,
    EcoScore: r.environmentalImpactScore,
    DelayRisk: r.delayProbability,
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0c121d] p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600/20 text-blue-400 border border-blue-500/30 mb-2">
            <GitCompare className="w-3.5 h-3.5" /> Multi-Metric Route Rationale Engine
          </div>
          <h1 className="text-2xl font-black text-white">{activeProject.title}</h1>
          <p className="text-xs text-slate-400">Comparing {routes.length} generated route alignments across PM Gati Shakti decision parameters</p>
        </div>

        <button
          onClick={onOpenPlanner}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-900/30 transition-all flex items-center gap-1.5"
        >
          View on GIS Map <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Comparison Table */}
      <div className="bg-[#0c121d] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 bg-[#080b12] font-bold text-sm text-white flex items-center justify-between">
          <span>Comparative Matrix</span>
          <span className="text-xs text-slate-400">Lower Eco Impact & Lower Delay Risk is Preferred</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#080b12] text-slate-400 text-[10px] uppercase tracking-wider border-b border-slate-800">
                <th className="p-3.5">Route Option</th>
                <th className="p-3.5">Distance</th>
                <th className="p-3.5">Est. Cost</th>
                <th className="p-3.5">Timeline</th>
                <th className="p-3.5">Terrain</th>
                <th className="p-3.5">Eco Score</th>
                <th className="p-3.5">Delay Risk</th>
                <th className="p-3.5">Conflicts</th>
                <th className="p-3.5 text-center">AI Rating</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {routes.map((rt) => {
                const isSelected = rt.id === activeProject.selectedRouteId;
                return (
                  <tr
                    key={rt.id}
                    className={`transition-colors ${
                      isSelected ? 'bg-blue-600/10 font-medium' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="p-3.5">
                      <div className="font-bold text-white flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: rt.color }} />
                        {rt.name}
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">{rt.recommendationReason}</div>
                    </td>

                    <td className="p-3.5 font-bold text-slate-200">{rt.distanceKm} km</td>

                    <td className="p-3.5 font-bold text-emerald-400">
                      ₹{rt.estimatedCostCrores.toLocaleString('en-IN')} Cr
                    </td>

                    <td className="p-3.5 text-slate-300">{rt.constructionMonths} Mos</td>

                    <td className="p-3.5 text-amber-300 font-semibold">{rt.terrainDifficulty}</td>

                    <td className="p-3.5 font-bold text-emerald-400">{rt.environmentalImpactScore}/100</td>

                    <td className="p-3.5 font-bold text-rose-400">{rt.delayProbability}%</td>

                    <td className="p-3.5">
                      {rt.conflicts.length > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          <AlertTriangle className="w-3 h-3" /> {rt.conflicts.length}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> None
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 text-center">
                      <span className="font-extrabold text-xs text-blue-400">{rt.confidenceScore}%</span>
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          onSelectRoute(rt.id);
                          onOpenPlanner();
                        }}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-md'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Select'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Cost vs Distance Chart */}
        <div className="p-5 rounded-2xl bg-[#0c121d] border border-slate-800 space-y-3 shadow-xl">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" /> Capital Cost Comparison (₹ Crores)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0c121d', borderColor: '#1e293b', borderRadius: '0.75rem', fontSize: '12px', color: '#f8fafc' }}
                />
                <Bar dataKey="Cost" fill="#10b981" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 1 ? '#10b981' : '#2563eb'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Delay Risk Probability */}
        <div className="p-5 rounded-2xl bg-[#0c121d] border border-slate-800 space-y-3 shadow-xl">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" /> Delay Probability (%)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0c121d', borderColor: '#1e293b', borderRadius: '0.75rem', fontSize: '12px', color: '#f8fafc' }}
                />
                <Bar dataKey="DelayRisk" fill="#f43f5e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
