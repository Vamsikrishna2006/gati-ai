import React, { useState } from 'react';
import { Project, RouteOption } from '../types';
import { ReportModal } from '../components/ReportModal';
import { FileSpreadsheet, Download, CheckCircle2, FileText, ArrowUpRight, Sparkles, Clock } from 'lucide-react';

interface ReportsPageProps {
  projects: Project[];
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  const selectedRoute =
    selectedProject.routes.find((r) => r.id === selectedProject.selectedRouteId) ||
    selectedProject.routes[0];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-[#0c121d] p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600/20 text-blue-400 border border-blue-500/30 mb-2">
            <FileSpreadsheet className="w-3.5 h-3.5" /> Detailed Project Report (DPR) Central Vault
          </div>
          <h1 className="text-2xl font-black text-white">PM Gati Shakti Official Reports</h1>
          <p className="text-xs text-slate-400">Generate, view, and export executive clearance DPR documents</p>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((proj) => {
          const route = proj.routes.find((r) => r.id === proj.selectedRouteId) || proj.routes[0];
          return (
            <div
              key={proj.id}
              className="p-5 rounded-2xl bg-[#0c121d] border border-slate-800 space-y-4 hover:border-blue-500/50 transition-all flex flex-col justify-between shadow-xl"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#080b12] text-slate-300 border border-slate-800">
                    {proj.code}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Ready for Stage-1
                  </span>
                </div>

                <h3 className="font-bold text-sm text-white">{proj.title}</h3>
                <p className="text-xs text-slate-400">{proj.department}</p>

                <div className="bg-[#080b12] p-2.5 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Selected Route</div>
                  <div className="font-bold text-emerald-400">{route?.name}</div>
                  <div className="text-[11px] text-slate-300">
                    ₹{route?.estimatedCostCrores} Cr | {route?.distanceKm} km | {route?.constructionMonths} Mos
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedProject(proj);
                  setShowReportModal(true);
                }}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-900/30 transition-all flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" /> Generate DPR Brief
              </button>
            </div>
          );
        })}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal
          project={selectedProject}
          selectedRoute={selectedRoute}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
};
