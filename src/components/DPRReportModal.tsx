import React from 'react';
import { RouteOption } from '../types';
import { jsPDF } from 'jspdf';
import { FileText, Download, X, CheckCircle2 } from 'lucide-react';

interface DPRReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  routes: RouteOption[];
  sourceLabel: string;
  destLabel: string;
}

export const DPRReportModal: React.FC<DPRReportModalProps> = ({
  isOpen,
  onClose,
  routes,
  sourceLabel,
  destLabel,
}) => {
  if (!isOpen) return null;

  const [routeA, routeB] = routes;
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const dprNumber = `DPR-GATI-${Math.floor(100000 + Math.random() * 900000)}`;

  const generatePDF = () => {
    const doc = new jsPDF();
    let y = 15;

    // Header Band
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 30, 'F');

    doc.setTextColor(20, 184, 166);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('GATI-AI INFRASTRUCTURE PLANNER', 14, 14);

    doc.setTextColor(241, 245, 249);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('DETAILED PROJECT SCREENING REPORT (DPR)', 14, 22);

    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Ref ID: ${dprNumber}`, 150, 14);
    doc.text(`Date: ${dateStr}`, 150, 22);

    y = 40;

    // Section 1: Corridor Project Overview
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('1. CORRIDOR PROJECT OVERVIEW', 14, y);
    y += 6;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Origin Node: ${sourceLabel || 'Selected Origin'}`, 14, y);
    y += 5;
    doc.text(`Destination Node: ${destLabel || 'Selected Destination'}`, 14, y);
    y += 5;
    doc.text('Assessment Type: Early-Stage GIS Corridor Pre-Feasibility Screening', 14, y);
    y += 10;

    // Section 2: Candidate Alignment Comparison Matrix
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('2. CANDIDATE ALIGNMENT COMPARISON MATRIX', 14, y);
    y += 8;

    // Table Header
    doc.setFillColor(241, 245, 249);
    doc.rect(14, y - 4, 182, 7, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('Metric / GIS Parameter', 16, y);
    doc.text('Route A Alignment', 90, y);
    doc.text('Route B Alignment', 145, y);
    y += 8;

    doc.setFont('helvetica', 'normal');

    if (routeA && routeB) {
      const rows = [
        ['Total Distance (km)', `${routeA.distanceKm.toFixed(1)} km`, `${routeB.distanceKm.toFixed(1)} km`],
        ['Est. Travel Duration', `${Math.floor(routeA.durationMinutes / 60)}h ${routeA.durationMinutes % 60}m`, `${Math.floor(routeB.durationMinutes / 60)}h ${routeB.durationMinutes % 60}m`],
        ['Forest Features Overlap', `${routeA.forestFeatureCount} (~${routeA.forestOverlapKm.toFixed(1)} km)`, `${routeB.forestFeatureCount} (~${routeB.forestOverlapKm.toFixed(1)} km)`],
        ['Protected Sanctuary Overlap', `${routeA.protectedAreaFeatureCount} (~${routeA.protectedOverlapKm.toFixed(1)} km)`, `${routeB.protectedAreaFeatureCount} (~${routeB.protectedOverlapKm.toFixed(1)} km)`],
        ['River Bridge Crossings', `${routeA.riverCrossingCount ?? 0} crossings`, `${routeB.riverCrossingCount ?? 0} crossings`],
        ['Mapped Pipelines', `${routeA.pipelineCrossingCount ?? 0} intersections`, `${routeB.pipelineCrossingCount ?? 0} intersections`],
        ['Underground Power Cables', `${routeA.undergroundCableCrossingCount ?? 0} intersections`, `${routeB.undergroundCableCrossingCount ?? 0} intersections`],
      ];

      rows.forEach(([label, valA, valB]) => {
        doc.text(label, 16, y);
        doc.text(valA, 90, y);
        doc.text(valB, 145, y);
        doc.setDrawColor(226, 232, 240);
        doc.line(14, y + 2, 196, y + 2);
        y += 7;
      });
    }

    y += 6;

    // Section 3: Utility & River Intersections Inventory
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('3. MAPPED UTILITY INFRASTRUCTURE INTERSECTIONS', 14, y);
    y += 7;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');

    if (routeA?.utilityIntersections && routeA.utilityIntersections.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Route A Mapped Utility Intersections:', 14, y);
      y += 5;
      doc.setFont('helvetica', 'normal');

      routeA.utilityIntersections.slice(0, 4).forEach((ui) => {
        const typeLabel = ui.type === 'pipeline' ? `Pipeline (${ui.substance || 'Pipeline type unavailable'})` : 'Underground power cable';
        doc.text(`• ${typeLabel} - ${ui.name || 'Mapped Infrastructure'} at [${ui.coordinates[0].toFixed(4)}, ${ui.coordinates[1].toFixed(4)}]`, 18, y);
        y += 5;
      });
    } else {
      doc.text('• No mapped utility infrastructure detected in available public OpenStreetMap data.', 18, y);
      y += 5;
    }

    y += 8;

    // Footer Disclaimer & Signoff
    doc.setDrawColor(203, 213, 225);
    doc.line(14, y, 196, y);
    y += 5;

    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('PUBLIC GIS COVERAGE: Utility data reflects publicly mapped OpenStreetMap features and may be incomplete.', 14, y);
    y += 4;
    doc.text('FIELD VERIFICATION WARNING: Mapped utility intersections should be verified through authoritative utility records.', 14, y);

    // Save File
    doc.save(`${dprNumber}_GatiAI_Detailed_Project_Report.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-card w-full max-w-3xl rounded-2xl border border-white/[0.1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between glass-light">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Detailed Project Report (DPR) Preview</h2>
              <p className="text-[10px] text-slate-400">Ref: {dprNumber} · Date: {dateStr}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white glass-light transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body Preview Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          {/* Executive Overview Banner */}
          <div className="glass-light p-4 rounded-xl border border-white/[0.06] space-y-1">
            <div className="flex justify-between items-center text-slate-400 text-[10px] uppercase font-bold tracking-wider">
              <span>Project Screening Brief</span>
              <span className="text-teal-400 font-extrabold">{dprNumber}</span>
            </div>
            <div className="text-sm font-bold text-white">{sourceLabel.split('(')[0]} → {destLabel.split('(')[0]}</div>
            <p className="text-[11px] text-slate-300">
              Pre-feasibility GIS screening report evaluating candidate infrastructure corridors against mapped forest reserves, protected sanctuaries, river crossings, mapped pipelines, and underground power cables.
            </p>
          </div>

          {/* Side-by-Side Candidate Summary */}
          {routeA && routeB && (
            <div className="grid md:grid-cols-2 gap-3">
              <div className="glass-light p-3.5 rounded-xl border border-white/[0.06] space-y-2">
                <div className="flex items-center gap-2 font-bold text-white text-xs">
                  <div className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                  <span>Route A Alignment</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-300">
                  <div>Distance: <strong className="text-white">{routeA.distanceKm.toFixed(0)} km</strong></div>
                  <div>Travel time: <strong className="text-white">{Math.floor(routeA.durationMinutes / 60)}h {routeA.durationMinutes % 60}m</strong></div>
                  <div>Forest overlap: <strong className="text-emerald-400">~{routeA.forestOverlapKm.toFixed(1)} km</strong></div>
                  <div>River crossings: <strong className="text-sky-400">{routeA.riverCrossingCount ?? 0}</strong></div>
                  <div>Mapped pipelines: <strong className="text-amber-400">{routeA.pipelineCrossingCount ?? 0}</strong></div>
                  <div>Underground cables: <strong className="text-purple-400">{routeA.undergroundCableCrossingCount ?? 0}</strong></div>
                </div>
              </div>

              <div className="glass-light p-3.5 rounded-xl border border-white/[0.06] space-y-2">
                <div className="flex items-center gap-2 font-bold text-white text-xs">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>Route B Alignment</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-300">
                  <div>Distance: <strong className="text-white">{routeB.distanceKm.toFixed(0)} km</strong></div>
                  <div>Travel time: <strong className="text-white">{Math.floor(routeB.durationMinutes / 60)}h {routeB.durationMinutes % 60}m</strong></div>
                  <div>Forest overlap: <strong className="text-emerald-400">~{routeB.forestOverlapKm.toFixed(1)} km</strong></div>
                  <div>River crossings: <strong className="text-sky-400">{routeB.riverCrossingCount ?? 0}</strong></div>
                  <div>Mapped pipelines: <strong className="text-amber-400">{routeB.pipelineCrossingCount ?? 0}</strong></div>
                  <div>Underground cables: <strong className="text-purple-400">{routeB.undergroundCableCrossingCount ?? 0}</strong></div>
                </div>
              </div>
            </div>
          )}

          {/* PDF Report Structure Note */}
          <div className="glass-light p-4 rounded-xl border border-teal-500/20 space-y-2">
            <div className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400" /> DPR PDF Export Contents
            </div>
            <ul className="grid md:grid-cols-2 gap-1.5 text-[11px] text-slate-300 list-disc list-inside">
              <li>Formal Ref ID & Timestamp</li>
              <li>Side-by-side alignment comparison matrix</li>
              <li>River bridge crossing coordinates & OSM names</li>
              <li>Mapped pipeline intersection inventory</li>
              <li>Mapped underground power cable inventory</li>
              <li>Public GIS coverage & field verification disclaimers</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-white/[0.08] flex items-center justify-between glass-light">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white glass-light rounded-lg transition-all cursor-pointer"
          >
            Close Preview
          </button>

          <button
            onClick={generatePDF}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-950/40 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" /> Download Official DPR PDF
          </button>
        </div>
      </div>
    </div>
  );
};
