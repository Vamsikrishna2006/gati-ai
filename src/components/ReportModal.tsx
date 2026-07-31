import React, { useState, useEffect } from 'react';
import { Project, RouteOption, ProjectReport } from '../types';
import { FileText, Download, X, CheckCircle2, Sparkles, Printer, Layers, Building2, ShieldAlert } from 'lucide-react';

interface ReportModalProps {
  project: Project;
  selectedRoute: RouteOption;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ project, selectedRoute, onClose }) => {
  const [reportData, setReportData] = useState<ProjectReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchReport() {
      setLoading(true);
      try {
        const res = await fetch('/api/ai/generate-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ project, route: selectedRoute }),
        });
        const data = await res.json();
        if (data.report) {
          setReportData({
            id: `rep-${Date.now()}`,
            projectId: project.id,
            projectTitle: project.title,
            generatedAt: new Date().toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }),
            generatedBy: 'GatiAI National Master Plan Engine',
            executiveSummary: data.report.executiveSummary,
            routeComparisonSummary: data.report.routeComparisonSummary,
            riskAssessmentSummary: data.report.riskAssessmentSummary,
            environmentalClearanceSummary: data.report.environmentalClearanceSummary,
            recommendedRouteName: selectedRoute.name,
            estimatedCost: `₹${selectedRoute.estimatedCostCrores.toLocaleString('en-IN')} Cr`,
            estimatedTime: `${selectedRoute.constructionMonths} Months`,
            roiEstimate: data.report.roiEstimate || '18.5% Internal Rate of Return (IRR)',
            approvalChecklist: [
              { task: 'Stage-1 Forest Clearance (FC-1)', status: 'completed', department: 'MoEFCC' },
              { task: 'NHAI Grade Separation Interchange Authorization', status: 'completed', department: 'MoRTH' },
              { task: 'Inland Waterways Dredging Permit', status: 'pending', department: 'IWAI' },
              { task: 'State Railway Safety Inspector Certification', status: 'required', department: 'Indian Railways' },
            ],
          });
        }
      } catch (err) {
        console.error('Failed to generate report', err);
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [project, selectedRoute]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080b12]/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0c121d] border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto print:max-w-none print:w-full print:h-auto print:static print:bg-white print:text-black">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#080b12] print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600/20 rounded-xl border border-blue-500/30 text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">PM Gati Shakti Detailed Project Report (DPR)</h3>
              <p className="text-xs text-slate-400">Government Decision Support & Executive Clearance Brief</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
            >
              <Printer className="w-4 h-4" /> Export PDF / Print
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Content Container */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200 print:text-slate-900 print:p-8">
          {loading ? (
            <div className="text-center py-16 space-y-3">
              <Sparkles className="w-10 h-10 text-blue-400 mx-auto animate-spin" />
              <div className="text-sm font-bold text-white">Synthesizing Official PM Gati Shakti DPR...</div>
              <p className="text-xs text-slate-400">Cross-analyzing spatial GIS data, cost metrics, and environmental clearance requirements.</p>
            </div>
          ) : reportData ? (
            <div className="space-y-6">
              {/* Official Header Banner */}
              <div className="border-b-2 border-blue-500/40 pb-4 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold tracking-widest text-blue-400 uppercase">
                    Government of India • PM Gati Shakti National Master Plan
                  </div>
                  <h1 className="text-xl font-extrabold text-white mt-0.5 print:text-black">{project.title}</h1>
                  <p className="text-xs text-slate-400">Project Code: {project.code} | Department: {project.department}</p>
                </div>
                <div className="text-right text-xs">
                  <div className="font-bold text-slate-300">Date: {reportData.generatedAt}</div>
                  <div className="text-slate-500">GatiAI Confidence: {selectedRoute.confidenceScore}%</div>
                </div>
              </div>

              {/* Key Metrics Strip */}
              <div className="grid grid-cols-4 gap-3 bg-[#080b12] p-3 rounded-xl border border-slate-800 text-center print:bg-slate-100 print:border-slate-300">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Selected Alignment</div>
                  <div className="text-xs font-extrabold text-emerald-400 mt-0.5">{selectedRoute.name}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Total Capital Outlay</div>
                  <div className="text-xs font-extrabold text-white mt-0.5 print:text-black">{reportData.estimatedCost}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Completion Horizon</div>
                  <div className="text-xs font-extrabold text-white mt-0.5 print:text-black">{reportData.estimatedTime}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Projected ROI</div>
                  <div className="text-xs font-extrabold text-blue-400 mt-0.5">{reportData.roiEstimate}</div>
                </div>
              </div>

              {/* Executive Summary Section */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> 1. Executive Rationale & Decision Matrix
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed bg-[#080b12] p-3 rounded-xl border border-slate-800 print:bg-white print:border-slate-200 print:text-black">
                  {reportData.executiveSummary}
                </p>
              </div>

              {/* Route & Spatial Analysis */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" /> 2. Multi-Modal Alignment & Spatial Evaluation
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed bg-[#080b12] p-3 rounded-xl border border-slate-800 print:bg-white print:border-slate-200 print:text-black">
                  {reportData.routeComparisonSummary}
                </p>
              </div>

              {/* Risk & Environmental Clearance */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 bg-[#080b12] p-3 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> Delay & Budget Risk Assessment
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-normal">
                    {reportData.riskAssessmentSummary}
                  </p>
                </div>

                <div className="space-y-1.5 bg-[#080b12] p-3 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Environmental Clearance Roadmap
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-normal">
                    {reportData.environmentalClearanceSummary}
                  </p>
                </div>
              </div>

              {/* Inter-Departmental Approval Checklist */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" /> 3. Inter-Departmental Approval Clearance Matrix
                </h3>
                <div className="border border-slate-800 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-[#080b12] text-slate-400 text-[10px] uppercase font-bold">
                      <tr>
                        <th className="p-2.5">Clearance Protocol</th>
                        <th className="p-2.5">Authority</th>
                        <th className="p-2.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {reportData.approvalChecklist.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30">
                          <td className="p-2.5 font-medium text-slate-200 print:text-black">{item.task}</td>
                          <td className="p-2.5 text-slate-400">{item.department}</td>
                          <td className="p-2.5 text-right">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                item.status === 'completed'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : item.status === 'pending'
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : 'bg-rose-500/20 text-rose-400'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Official Seal / Signature Placeholder */}
              <div className="border-t border-slate-800 pt-4 flex items-center justify-between text-[11px] text-slate-400">
                <div>
                  Verified by: <strong>GatiAI Multi-Modal Spatial Optimization Engine v3.6</strong>
                </div>
                <div className="text-right">
                  Authorized Signatory: <strong>PM Gati Shakti National Secretariat</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400">Failed to load report parameters.</div>
          )}
        </div>
      </div>
    </div>
  );
};
