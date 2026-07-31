import React, { useState } from 'react';
import { Project, User } from '../types';
import {
  Layers,
  MapPin,
  Plus,
  ArrowUpRight,
  ShieldAlert,
  CheckCircle2,
  Clock,
  TrendingUp,
  Sparkles,
  Search,
  Filter,
  FileSpreadsheet,
  AlertTriangle,
} from 'lucide-react';

interface DashboardPageProps {
  projects: Project[];
  currentUser: User;
  onSelectProject: (proj: Project) => void;
  onOpenPlanner: () => void;
  onCreateProject: (projData: Partial<Project>) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  projects,
  currentUser,
  onSelectProject,
  onOpenPlanner,
  onCreateProject,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSource, setNewSource] = useState('Delhi NCR (Dadri Logistics Hub)');
  const [newDest, setNewDest] = useState('Mumbai (JNPT Port)');
  const [newType, setNewType] = useState<'highway' | 'railway' | 'multimodal'>('highway');

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBudget = projects.reduce((acc, p) => acc + p.budgetCrores, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.spentCrores, 0);
  const avgRisk = Math.round(
    projects.reduce((acc, p) => acc + p.riskScore, 0) / (projects.length || 1)
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    onCreateProject({
      title: newTitle,
      sourceCity: newSource,
      destinationCity: newDest,
      infrastructureType: newType,
      department: currentUser.department,
      budgetCrores: 9500,
      assignedLead: currentUser.name,
      sourceCoords: [28.5528, 77.5539],
      destinationCoords: [18.9500, 72.9500],
    });

    setNewTitle('');
    setShowCreateModal(false);
    onOpenPlanner();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0c121d] via-[#0d1421] to-blue-950/30 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Sparkles className="w-3 h-3" /> PM Gati Shakti Executive Oversight
          </div>
          <h1 className="text-2xl font-black text-white">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs text-slate-400">
            {currentUser.department} • Multi-modal Corridor Decision Support
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-blue-900/30 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Corridor Project
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0c121d] border border-slate-800">
          <div className="text-slate-400 text-xs font-semibold">Total Projects</div>
          <div className="text-2xl font-black text-white mt-1">{projects.length}</div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> 100% On-Track PM GS
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0c121d] border border-slate-800">
          <div className="text-slate-400 text-xs font-semibold">Combined Capital Outlay</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            ₹{totalBudget.toLocaleString('en-IN')} <span className="text-xs font-normal">Cr</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            ₹{totalSpent.toLocaleString('en-IN')} Cr Allocated
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0c121d] border border-slate-800">
          <div className="text-slate-400 text-xs font-semibold">Average Risk Index</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{avgRisk}/100</div>
          <div className="text-[10px] text-emerald-400 mt-1">Low Overrun Risk</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0c121d] border border-slate-800">
          <div className="text-slate-400 text-xs font-semibold">AI Recommended Routes</div>
          <div className="text-2xl font-black text-blue-400 mt-1">
            {projects.filter((p) => p.selectedRouteId).length}
          </div>
          <div className="text-[10px] text-blue-400 mt-1">Ready for Stage-1 Clearance</div>
        </div>
      </div>

      {/* Projects List & Filter */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white">Active Infrastructure Corridors</h2>
            <p className="text-xs text-slate-400">Click a project to launch deep spatial analysis & GIS map</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search corridors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0c121d] border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((proj) => {
            const activeRoute = proj.routes.find((r) => r.id === proj.selectedRouteId) || proj.routes[0];
            return (
              <div
                key={proj.id}
                onClick={() => {
                  onSelectProject(proj);
                  onOpenPlanner();
                }}
                className="p-5 rounded-2xl bg-[#0c121d] border border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer group space-y-3 hover:shadow-xl hover:shadow-blue-950/20"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#080b12] text-slate-300 border border-slate-800">
                    {proj.code}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                      proj.riskLevel === 'High'
                        ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                        : proj.riskLevel === 'Medium'
                        ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    {proj.riskLevel} Risk
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                    {proj.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{proj.department}</p>
                </div>

                <div className="bg-[#080b12] p-2.5 rounded-xl border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {proj.sourceCity.split(' ')[0]}
                    </span>
                    <span className="text-slate-500">→</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" /> {proj.destinationCity.split(' ')[0]}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-[#080b12] p-2 rounded-lg border border-slate-800/60">
                    <div className="text-slate-500 text-[9px] uppercase font-bold">Est. Cost</div>
                    <div className="font-bold text-slate-200">₹{proj.budgetCrores.toLocaleString('en-IN')} Cr</div>
                  </div>
                  <div className="bg-[#080b12] p-2 rounded-lg border border-slate-800/60">
                    <div className="text-slate-500 text-[9px] uppercase font-bold">Recommended</div>
                    <div className="font-bold text-emerald-400 truncate">{activeRoute?.name || 'Route B'}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-semibold group-hover:text-blue-400">
                  <span>Open GIS Planner</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create New Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080b12]/80 backdrop-blur-md">
          <div className="bg-[#0c121d] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Create New Corridor Project</h3>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Visakhapatnam to Raipur Multimodal Industrial Corridor"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#080b12] border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Infrastructure Mode</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full bg-[#080b12] border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="highway">Access-Controlled Highway / Expressway</option>
                  <option value="railway">Freight Railway Line</option>
                  <option value="multimodal">Multi-modal Freight Corridor</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Origin Node</label>
                <input
                  type="text"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="w-full bg-[#080b12] border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold mb-1 block">Destination Terminal</label>
                <input
                  type="text"
                  value={newDest}
                  onChange={(e) => setNewDest(e.target.value)}
                  className="w-full bg-[#080b12] border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/30"
                >
                  Generate AI Routes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
