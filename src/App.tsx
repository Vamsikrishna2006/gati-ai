import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, ActivePage } from './components/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { MapPlannerPage } from './pages/MapPlannerPage';
import { RouteAnalysisPage } from './pages/RouteAnalysisPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { AboutPage } from './pages/AboutPage';
import { DPRReportModal } from './components/DPRReportModal';
import { RouteOption } from './types';

export default function App() {
  // Default directly to 'map' so users immediately see the GIS Map, Satellite Switcher, and Live Routes
  const [currentPage, setCurrentPage] = useState<ActivePage | 'landing'>('map');

  // Shared live route state lifted from MapPlannerPage so analysis + AI pages can consume it
  const [liveRoutes, setLiveRoutes] = useState<RouteOption[]>([]);
  const [sourceLabel, setSourceLabel] = useState('');
  const [destLabel, setDestLabel] = useState('');
  const [isDPROpen, setIsDPROpen] = useState(false);

  if (currentPage === 'landing') {
    return <LandingPage onStartPlanner={() => setCurrentPage('map')} />;
  }

  return (
    <div className="min-h-screen bg-ambient-mesh text-slate-100 flex flex-col relative selection:bg-teal-500 selection:text-slate-950" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Background glowing ambient light spots */}
      <div className="bg-glow-teal top-10 left-1/4" />
      <div className="bg-glow-amber bottom-20 right-10" />

      <Navbar
        onNavigate={(p) => setCurrentPage(p as ActivePage)}
        onOpenDPR={() => setIsDPROpen(true)}
      />

      <div className="flex-1 flex overflow-hidden relative z-10">
        <Sidebar
          activePage={currentPage as ActivePage}
          onNavigate={(page) => setCurrentPage(page)}
        />

        <main className="flex-1 overflow-y-auto bg-transparent relative">
          {currentPage === 'map' && (
            <MapPlannerPage
              onRoutesReady={(routes, src, dest) => {
                setLiveRoutes(routes);
                setSourceLabel(src);
                setDestLabel(dest);
              }}
              onOpenAnalysis={() => setCurrentPage('analysis')}
            />
          )}

          {currentPage === 'analysis' && (
            <RouteAnalysisPage
              routes={liveRoutes}
              sourceLabel={sourceLabel}
              destLabel={destLabel}
              onOpenPlanner={() => setCurrentPage('map')}
              onOpenAI={() => setCurrentPage('ai_assistant')}
            />
          )}

          {currentPage === 'ai_assistant' && (
            <AIAssistantPage
              routes={liveRoutes}
              sourceLabel={sourceLabel}
              destLabel={destLabel}
            />
          )}

          {currentPage === 'about' && <AboutPage />}
        </main>
      </div>

      {/* DPR Executive Report PDF Export Modal */}
      <DPRReportModal
        isOpen={isDPROpen}
        onClose={() => setIsDPROpen(false)}
        routes={liveRoutes}
        sourceLabel={sourceLabel}
        destLabel={destLabel}
      />
    </div>
  );
}
