import React, { useState, useEffect } from 'react';
import { User, Project } from './types';
import { SAMPLE_USERS, SAMPLE_PROJECTS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { Sidebar, ActivePage } from './components/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { MapPlannerPage } from './pages/MapPlannerPage';
import { RouteAnalysisPage } from './pages/RouteAnalysisPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(SAMPLE_USERS[0]);
  const [currentPage, setCurrentPage] = useState<ActivePage | 'landing' | 'login'>('landing');
  const [projects, setProjects] = useState<Project[]>(SAMPLE_PROJECTS);
  const [activeProject, setActiveProject] = useState<Project>(SAMPLE_PROJECTS[0]);

  // Fetch projects from server on mount
  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (data.projects && data.projects.length > 0) {
          setProjects(data.projects);
          setActiveProject(data.projects[0]);
        }
      } catch (err) {
        console.warn('Using local sample projects fallback', err);
      }
    }
    loadProjects();
  }, []);

  const handleUpdateProjectRoute = (routeId: string) => {
    const updated = projects.map((p) => {
      if (p.id === activeProject.id) {
        return {
          ...p,
          selectedRouteId: routeId,
        };
      }
      return p;
    });
    setProjects(updated);
    setActiveProject((prev) => ({ ...prev, selectedRouteId: routeId }));

    // Send patch to server
    fetch(`/api/projects/${activeProject.id}/select-route`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ routeId }),
    }).catch((err) => console.warn('Route update failed on backend', err));
  };

  const handleCreateProject = (newProjData: Partial<Project>) => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      code: `PMGS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'planning',
      spentCrores: 0,
      timelineMonths: 36,
      startDate: new Date().toISOString().split('T')[0],
      completionDate: '2028-12-31',
      riskLevel: 'Medium',
      riskScore: 35,
      lastUpdated: new Date().toISOString().split('T')[0],
      routes: [],
      description: 'Newly generated PM Gati Shakti multi-modal freight corridor.',
      title: newProjData.title || 'New Corridor Project',
      department: newProjData.department || currentUser.department,
      infrastructureType: newProjData.infrastructureType || 'highway',
      sourceCity: newProjData.sourceCity || 'Delhi NCR',
      destinationCity: newProjData.destinationCity || 'Mumbai',
      sourceCoords: newProjData.sourceCoords || [28.5528, 77.5539],
      destinationCoords: newProjData.destinationCoords || [18.9500, 72.9500],
      budgetCrores: newProjData.budgetCrores || 9500,
      assignedLead: currentUser.name,
    };

    setProjects((prev) => [newProj, ...prev]);
    setActiveProject(newProj);

    // Save to backend
    fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProj),
    }).catch((err) => console.warn('Failed to save project to backend', err));
  };

  const selectedRoute =
    activeProject.routes.find((r) => r.id === activeProject.selectedRouteId) ||
    activeProject.routes[0];

  // Render standalone Landing or Login page
  if (currentPage === 'landing') {
    return (
      <LandingPage
        onStartPlanner={() => setCurrentPage('map')}
        onLogin={() => setCurrentPage('login')}
      />
    );
  }

  if (currentPage === 'login') {
    return (
      <LoginPage
        onLoginSuccess={(usr) => {
          setCurrentUser(usr);
          setCurrentPage('dashboard');
        }}
        onBackToLanding={() => setCurrentPage('landing')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onSelectUser={(usr) => setCurrentUser(usr)}
        onOpenLogin={() => setCurrentPage('login')}
        activeProjectCode={activeProject.code}
      />

      {/* Main Body split into Sidebar + Workspace Page */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activePage={currentPage}
          onNavigate={(page) => setCurrentPage(page)}
          onOpenLogin={() => setCurrentPage('login')}
        />

        <main className="flex-1 overflow-y-auto bg-slate-950">
          {currentPage === 'dashboard' && (
            <DashboardPage
              projects={projects}
              currentUser={currentUser}
              onSelectProject={(proj) => setActiveProject(proj)}
              onOpenPlanner={() => setCurrentPage('map')}
              onCreateProject={handleCreateProject}
            />
          )}

          {currentPage === 'map' && (
            <MapPlannerPage
              activeProject={activeProject}
              onUpdateProjectRoute={handleUpdateProjectRoute}
              onOpenAIAssistant={() => setCurrentPage('ai_assistant')}
            />
          )}

          {currentPage === 'analysis' && (
            <RouteAnalysisPage
              activeProject={activeProject}
              onSelectRoute={handleUpdateProjectRoute}
              onOpenPlanner={() => setCurrentPage('map')}
            />
          )}

          {currentPage === 'ai_assistant' && (
            <AIAssistantPage
              activeProject={activeProject}
              selectedRoute={selectedRoute}
            />
          )}

          {currentPage === 'analytics' && <AnalyticsPage projects={projects} />}

          {currentPage === 'reports' && <ReportsPage projects={projects} />}

          {currentPage === 'settings' && <SettingsPage />}

          {currentPage === 'about' && <AboutPage />}
        </main>
      </div>
    </div>
  );
}
