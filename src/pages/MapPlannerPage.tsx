import React, { useState } from 'react';
import { Project, RouteOption, GISLayerState, ConflictZone } from '../types';
import { GISMap } from '../components/GISMap';
import { RouteCard } from '../components/RouteCard';
import { ConflictModal } from '../components/ConflictModal';
import { ReportModal } from '../components/ReportModal';
import { MAJOR_INDIAN_NODES } from '../data/mockData';
import {
  Sparkles,
  MapPin,
  Layers,
  Filter,
  Route,
  ShieldAlert,
  Bot,
  FileSpreadsheet,
  ChevronDown,
  RefreshCw,
  Plus,
  Compass,
} from 'lucide-react';

interface MapPlannerPageProps {
  activeProject: Project;
  onUpdateProjectRoute: (routeId: string) => void;
  onOpenAIAssistant: () => void;
}

export const MapPlannerPage: React.FC<MapPlannerPageProps> = ({
  activeProject,
  onUpdateProjectRoute,
  onOpenAIAssistant,
}) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>(
    activeProject.selectedRouteId || activeProject.routes[0]?.id || 'rt-101-b'
  );

  // GIS Layer State
  const [layers, setLayers] = useState<GISLayerState>({
    forests: true,
    rivers: true,
    protectedAreas: true,
    existingHighways: true,
    railwayNetwork: true,
    airports: false,
    urbanClusters: false,
    utilityCorridors: false,
  });

  // Modal states
  const [inspectConflictModal, setInspectConflictModal] = useState<ConflictZone[] | null>(null);
  const [inspectRouteName, setInspectRouteName] = useState<string>('');
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [analyzingRoute, setAnalyzingRoute] = useState<boolean>(false);

  // Source & Dest Selector
  const [sourceNode, setSourceNode] = useState(MAJOR_INDIAN_NODES[0]);
  const [destNode, setDestNode] = useState(MAJOR_INDIAN_NODES[1]);
  const [currentMode, setCurrentMode] = useState<string>('highway');
  const [customRoutes, setCustomRoutes] = useState<RouteOption[]>(activeProject.routes);

  const selectedRoute =
    customRoutes.find((r) => r.id === selectedRouteId) || customRoutes[0] || activeProject.routes[0];

  const toggleLayer = (key: keyof GISLayerState) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRouteSelect = (id: string) => {
    setSelectedRouteId(id);
    onUpdateProjectRoute(id);
  };

  const handleGenerateRoutes = async () => {
    setAnalyzingRoute(true);
    try {
      const res = await fetch('/api/routes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceName: sourceNode.name,
          sourceCoords: sourceNode.coords,
          destName: destNode.name,
          destCoords: destNode.coords,
          mode: currentMode,
        }),
      });

      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        setCustomRoutes(data.routes);
        setSelectedRouteId(data.routes[1]?.id || data.routes[0]?.id);
      }
    } catch (err) {
      console.error('Failed to generate routes', err);
    } finally {
      setAnalyzingRoute(false);
    }
  };

  const handleRunAiAnalysis = async () => {
    setAnalyzingRoute(true);
    try {
      const res = await fetch('/api/ai/analyze-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectTitle: activeProject.title,
          mode: currentMode,
          routes: customRoutes,
          selectedRoute,
        }),
      });
      const data = await res.json();
      setAiAnalysis(data);
    } catch (err) {
      console.error('Failed AI Analysis', err);
    } finally {
      setAnalyzingRoute(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-[#080b12]">
      {/* Top Toolbar */}
      <div className="bg-[#0c121d] border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#080b12] px-3 py-1.5 rounded-full border border-slate-800 text-xs text-white font-semibold">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Corridor: <strong className="text-emerald-400 font-mono">{sourceNode.name.split(' ')[0]} → {destNode.name.split(' ')[0]}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sourceNode.name}
              onChange={(e) => {
                const found = MAJOR_INDIAN_NODES.find((n) => n.name === e.target.value);
                if (found) setSourceNode(found);
              }}
              className="bg-[#080b12] border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              {MAJOR_INDIAN_NODES.map((n) => (
                <option key={n.name} value={n.name}>
                  Origin: {n.name}
                </option>
              ))}
            </select>

            <span className="text-slate-500 text-xs">→</span>

            <select
              value={destNode.name}
              onChange={(e) => {
                const found = MAJOR_INDIAN_NODES.find((n) => n.name === e.target.value);
                if (found) setDestNode(found);
              }}
              className="bg-[#080b12] border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              {MAJOR_INDIAN_NODES.map((n) => (
                <option key={n.name} value={n.name}>
                  Dest: {n.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleGenerateRoutes}
              disabled={analyzingRoute}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold text-xs rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${analyzingRoute ? 'animate-spin' : ''}`} /> Generate Routes
            </button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunAiAnalysis}
            className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-900/30 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" /> Gemini Route Analysis
          </button>

          <button
            onClick={() => setShowReportModal(true)}
            className="px-3.5 py-1.5 bg-[#111827] hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-xl border border-slate-700/80 transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" /> Export DPR Report
          </button>
        </div>
      </div>

      {/* Main Workspace split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Interactive GIS Map */}
        <div className="flex-1 relative bg-[#080b12] p-3 flex flex-col min-h-0">
          <GISMap
            sourceCoords={sourceNode.coords}
            sourceName={sourceNode.name}
            destCoords={destNode.coords}
            destName={destNode.name}
            routes={customRoutes}
            selectedRouteId={selectedRouteId}
            onSelectRoute={handleRouteSelect}
            layers={layers}
            onSelectConflict={(cf) => {
              setInspectConflictModal([cf]);
              setInspectRouteName(selectedRoute.name);
            }}
          />

          {/* Map Layer Controls Floating Panel */}
          <div className="absolute top-6 left-6 z-20 glass-panel p-3 rounded-2xl border border-slate-800 text-xs space-y-2 max-w-xs shadow-2xl">
            <div className="flex items-center justify-between text-slate-300 font-bold border-b border-slate-800/80 pb-1.5">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-400" /> Spatial GIS Layers
              </span>
              <span className="text-[10px] text-blue-400">PM GS Active</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <label className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300">
                <input
                  type="checkbox"
                  checked={layers.forests}
                  onChange={() => toggleLayer('forests')}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                />
                <span className="truncate">Forest Reserves</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300">
                <input
                  type="checkbox"
                  checked={layers.rivers}
                  onChange={() => toggleLayer('rivers')}
                  className="rounded border-slate-700 text-blue-500 focus:ring-0"
                />
                <span className="truncate">River Basins</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300">
                <input
                  type="checkbox"
                  checked={layers.protectedAreas}
                  onChange={() => toggleLayer('protectedAreas')}
                  className="rounded border-slate-700 text-purple-500 focus:ring-0"
                />
                <span className="truncate">Eco Sanctuaries</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300">
                <input
                  type="checkbox"
                  checked={layers.existingHighways}
                  onChange={() => toggleLayer('existingHighways')}
                  className="rounded border-slate-700 text-slate-400 focus:ring-0"
                />
                <span className="truncate">Expressways</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300">
                <input
                  type="checkbox"
                  checked={layers.railwayNetwork}
                  onChange={() => toggleLayer('railwayNetwork')}
                  className="rounded border-slate-700 text-rose-500 focus:ring-0"
                />
                <span className="truncate">Railway Lines</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300">
                <input
                  type="checkbox"
                  checked={layers.airports}
                  onChange={() => toggleLayer('airports')}
                  className="rounded border-slate-700 text-amber-500 focus:ring-0"
                />
                <span className="truncate">Airport Cones</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Side: Route Comparison & AI Rationale Panel */}
        <div className="w-96 bg-[#0c121d] border-l border-slate-800 flex flex-col h-full overflow-y-auto p-4 space-y-4 shrink-0 shadow-2xl">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-extrabold text-sm text-white">Route Alignments</h3>
              <span className="text-[10px] text-slate-400 font-bold">{customRoutes.length} Generated</span>
            </div>
            <p className="text-xs text-slate-400">Select route to inspect spatial conflicts and cost profiles</p>
          </div>

          {/* Route Cards */}
          <div className="space-y-3">
            {customRoutes.map((rt) => (
              <RouteCard
                key={rt.id}
                route={rt}
                isSelected={rt.id === selectedRouteId}
                onSelect={() => handleRouteSelect(rt.id)}
                onViewConflicts={() => {
                  setInspectConflictModal(rt.conflicts);
                  setInspectRouteName(rt.name);
                }}
              />
            ))}
          </div>

          {/* Gemini Analysis Summary Panel if available */}
          {aiAnalysis && (
            <div className="p-4 rounded-2xl bg-[#0d1421] border border-blue-500/30 text-xs text-slate-200 space-y-2">
              <div className="flex items-center justify-between font-bold text-blue-400">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> AI Decision Rationale
                </span>
                <span>{aiAnalysis.aiConfidenceScore}% Score</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">{aiAnalysis.summary}</p>
              {aiAnalysis.keyMitigations?.length > 0 && (
                <div className="pt-2 border-t border-slate-800 text-[10px] text-emerald-300 space-y-1">
                  <strong className="block text-emerald-400">Top Mitigation Protocol:</strong>
                  <div>• {aiAnalysis.keyMitigations[0]}</div>
                </div>
              )}
            </div>
          )}

          {/* Quick AI Assistant Trigger */}
          <div className="mt-auto pt-3 border-t border-slate-800">
            <button
              onClick={onOpenAIAssistant}
              className="w-full py-2.5 px-3 bg-[#111827] hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-xl transition-all border border-slate-700/80 flex items-center justify-center gap-2"
            >
              <Bot className="w-4 h-4 text-blue-400" /> Ask GatiAI Assistant
            </button>
          </div>
        </div>
      </div>

      {/* Conflict Inspection Modal */}
      {inspectConflictModal && (
        <ConflictModal
          conflicts={inspectConflictModal}
          routeName={inspectRouteName}
          onClose={() => setInspectConflictModal(null)}
        />
      )}

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal
          project={activeProject}
          selectedRoute={selectedRoute}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
};
