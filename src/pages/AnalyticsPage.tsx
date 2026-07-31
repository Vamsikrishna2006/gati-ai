import React from 'react';
import { Project } from '../types';
import { BarChart3, TrendingUp, ShieldAlert, Leaf, Clock, DollarSign, PieChart as PieIcon } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

interface AnalyticsPageProps {
  projects: Project[];
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ projects }) => {
  const costVsBudget = projects.map((p) => ({
    name: p.code,
    Budget: p.budgetCrores,
    Spent: p.spentCrores,
  }));

  const riskDistribution = [
    { name: 'Low Risk (<25%)', value: 45, color: '#10b981' },
    { name: 'Medium Risk (25-50%)', value: 35, color: '#f59e0b' },
    { name: 'High Risk (>50%)', value: 20, color: '#f43f5e' },
  ];

  const co2Savings = projects.map((p) => {
    const route = p.routes.find((r) => r.isRecommended) || p.routes[0];
    return {
      name: p.sourceCity.split(' ')[0],
      Emissions: route ? route.co2EmissionsTonsPerYear : 150000,
    };
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="bg-[#0c121d] p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600/20 text-blue-400 border border-blue-500/30 mb-2">
            <BarChart3 className="w-3.5 h-3.5" /> PM Gati Shakti National Analytics Hub
          </div>
          <h1 className="text-2xl font-black text-white">Infrastructure Intelligence Dashboard</h1>
          <p className="text-xs text-slate-400">Cross-departmental performance metrics, cost distribution, and carbon offset tracking</p>
        </div>
      </div>

      {/* Grid of Chart Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Budget vs Outlay */}
        <div className="p-5 rounded-2xl bg-[#0c121d] border border-slate-800 space-y-3 shadow-xl">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" /> Capital Outlay Allocation (₹ Crores)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costVsBudget}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0c121d', borderColor: '#1e293b', borderRadius: '0.75rem', fontSize: '12px', color: '#f8fafc' }}
                />
                <Bar dataKey="Budget" fill="#2563eb" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Spent" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Pie */}
        <div className="p-5 rounded-2xl bg-[#0c121d] border border-slate-800 space-y-3 shadow-xl">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" /> Project Overrun Risk Profile
          </h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0c121d', borderColor: '#1e293b', borderRadius: '0.75rem', fontSize: '12px', color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Carbon Footprint */}
        <div className="p-5 rounded-2xl bg-[#0c121d] border border-slate-800 space-y-3 shadow-xl md:col-span-2">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-400" /> Projected Annual CO2 Emissions (Tons/Year)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={co2Savings}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0c121d', borderColor: '#1e293b', borderRadius: '0.75rem', fontSize: '12px', color: '#f8fafc' }}
                />
                <Bar dataKey="Emissions" fill="#059669" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
