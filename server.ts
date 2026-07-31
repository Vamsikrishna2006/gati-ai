import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { SAMPLE_PROJECTS } from './src/data/mockData';
import { Project, RouteOption, ConflictZone } from './src/types';

// Initialize Express
const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client Lazily/Safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (err) {
      console.warn('Failed to initialize GoogleGenAI:', err);
    }
  }
  return aiClient;
}

// Memory store for projects
let projectsStore: Project[] = [...SAMPLE_PROJECTS];

// ------------------------------------
// API ROUTES
// ------------------------------------

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'GatiAI – PM Gati Shakti AI Infrastructure Planning Platform',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

// Get all projects
app.get('/api/projects', (req, res) => {
  res.json({ projects: projectsStore });
});

// Get single project
app.get('/api/projects/:id', (req, res) => {
  const project = projectsStore.find((p) => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json({ project });
});

// Create new project or update selected route
app.post('/api/projects', (req, res) => {
  const newProject: Project = {
    id: `proj-${Date.now()}`,
    code: `PMGS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'planning',
    spentCrores: 0,
    riskLevel: 'Medium',
    riskScore: 35,
    lastUpdated: new Date().toISOString().split('T')[0],
    routes: [],
    ...req.body,
  };
  projectsStore.unshift(newProject);
  res.status(201).json({ project: newProject });
});

app.patch('/api/projects/:id/select-route', (req, res) => {
  const { routeId } = req.body;
  const projectIndex = projectsStore.findIndex((p) => p.id === req.params.id);
  if (projectIndex === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }

  projectsStore[projectIndex].selectedRouteId = routeId;
  projectsStore[projectIndex].routes.forEach((rt) => {
    rt.isRecommended = rt.id === routeId;
  });
  projectsStore[projectIndex].lastUpdated = new Date().toISOString().split('T')[0];

  res.json({ project: projectsStore[projectIndex] });
});

// Dynamic Route Generator Algorithm
app.post('/api/routes/generate', (req, res) => {
  const { sourceName, sourceCoords, destName, destCoords, mode } = req.body;

  if (!sourceCoords || !destCoords) {
    return res.status(400).json({ error: 'Source and Destination coordinates required' });
  }

  const [sLat, sLng] = sourceCoords as [number, number];
  const [dLat, dLng] = destCoords as [number, number];

  // Calculate approximate straight line distance in km
  const R = 6371; // Earth radius in km
  const dLatRad = ((dLat - sLat) * Math.PI) / 180;
  const dLngRad = ((dLng - sLng) * Math.PI) / 180;
  const a =
    Math.sin(dLatRad / 2) * Math.sin(dLatRad / 2) +
    Math.cos((sLat * Math.PI) / 180) *
      Math.cos((dLat * Math.PI) / 180) *
      Math.sin(dLngRad / 2) *
      Math.sin(dLngRad / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const baseDistance = Math.round(R * c);

  const baseCostRate = mode === 'railway' ? 22 : mode === 'multimodal' ? 18 : 28; // Cr per km

  // Route A: Direct / Shortest
  const routeA_dist = Math.round(baseDistance * 1.15);
  const routeA_cost = Math.round(routeA_dist * baseCostRate);
  const routeA_waypoints: [number, number][] = [
    [sLat, sLng],
    [sLat + (dLat - sLat) * 0.33, sLng + (dLng - sLng) * 0.35],
    [sLat + (dLat - sLat) * 0.66, sLng + (dLng - sLng) * 0.65],
    [dLat, dLng],
  ];

  // Route B: Eco-Optimized (Slight arc bypass)
  const routeB_dist = Math.round(baseDistance * 1.22);
  const routeB_cost = Math.round(routeB_dist * (baseCostRate * 0.95));
  const midLat = (sLat + dLat) / 2 + 0.45; // arc northward/eastward
  const midLng = (sLng + dLng) / 2 + 0.30;
  const routeB_waypoints: [number, number][] = [
    [sLat, sLng],
    [sLat + (dLat - sLat) * 0.25 + 0.2, sLng + (dLng - sLng) * 0.25 + 0.15],
    [midLat, midLng],
    [sLat + (dLat - sLat) * 0.75 + 0.15, sLng + (dLng - sLng) * 0.75 + 0.1],
    [dLat, dLng],
  ];

  // Route C: Brownfield Infrastructure Parallel Alignment
  const routeC_dist = Math.round(baseDistance * 1.28);
  const routeC_cost = Math.round(routeC_dist * (baseCostRate * 1.1));
  const routeC_waypoints: [number, number][] = [
    [sLat, sLng],
    [sLat + (dLat - sLat) * 0.20 - 0.25, sLng + (dLng - sLng) * 0.20 - 0.2],
    [(sLat + dLat) / 2 - 0.3, (sLng + dLng) / 2 - 0.25],
    [sLat + (dLat - sLat) * 0.80 - 0.15, sLng + (dLng - sLng) * 0.80 - 0.1],
    [dLat, dLng],
  ];

  const conflictsA: ConflictZone[] = [
    {
      id: `cz-gen-1`,
      name: 'Forest Reserve Intersect',
      type: 'forest',
      severity: 'high',
      locationName: 'Central Reserve Forest Section',
      coordinates: [sLat + (dLat - sLat) * 0.45, sLng + (dLng - sLng) * 0.45],
      description: 'Route cuts directly through state eco-sensitive forest zone.',
      impactScore: 82,
      mitigationSuggestion: 'Construct 2.8 km elevated wildlife corridor or reroute via Route B.',
    },
    {
      id: `cz-gen-2`,
      name: 'Major River Basin Crossing',
      type: 'river',
      severity: 'medium',
      locationName: 'Primary River Channel',
      coordinates: [sLat + (dLat - sLat) * 0.7, sLng + (dLng - sLng) * 0.7],
      description: 'Seasonal flooding zone requires extradosed cable-stayed bridge.',
      impactScore: 58,
      mitigationSuggestion: 'High clearance pier design with real-time scour monitoring.',
    },
  ];

  const conflictsB: ConflictZone[] = [
    {
      id: `cz-gen-3`,
      name: 'Canal Crossing & Irrigation Utility',
      type: 'utility_corridor',
      severity: 'low',
      locationName: 'State Feeder Canal',
      coordinates: [midLat, midLng],
      description: 'Minor crossing over agricultural water canal.',
      impactScore: 22,
      mitigationSuggestion: 'Standard pre-stressed box girder span.',
    },
  ];

  const generatedRoutes: RouteOption[] = [
    {
      id: `rt-gen-a`,
      name: 'Route A: Direct Alignment',
      type: 'shortest',
      color: '#3b82f6',
      distanceKm: routeA_dist,
      estimatedCostCrores: routeA_cost,
      constructionMonths: Math.round(routeA_dist / 38) + 12,
      terrainDifficulty: 'Moderate',
      terrainDifficultyScore: 52,
      environmentalImpactScore: 74,
      travelEfficiencyScore: 94,
      landAcquisitionComplexity: 'Complex',
      landAcquisitionScore: 68,
      delayProbability: 28,
      budgetOverrunRisk: 22,
      approvalRiskScore: 62,
      co2EmissionsTonsPerYear: Math.round(routeA_dist * 180),
      confidenceScore: 80,
      isRecommended: false,
      recommendationReason: 'Direct path saves distance but encounters high environmental clearance friction and forest fragmentation.',
      waypoints: routeA_waypoints,
      conflicts: conflictsA,
      elevationProfile: [
        { distance: 0, elevation: 120 },
        { distance: Math.round(routeA_dist * 0.3), elevation: 380 },
        { distance: Math.round(routeA_dist * 0.6), elevation: 220 },
        { distance: routeA_dist, elevation: 60 },
      ],
    },
    {
      id: `rt-gen-b`,
      name: 'Route B: Eco-Optimized Bypass (AI Recommended)',
      type: 'eco_friendly',
      color: '#10b981',
      distanceKm: routeB_dist,
      estimatedCostCrores: routeB_cost,
      constructionMonths: Math.round(routeB_dist / 40) + 10,
      terrainDifficulty: 'Low',
      terrainDifficultyScore: 26,
      environmentalImpactScore: 19,
      travelEfficiencyScore: 91,
      landAcquisitionComplexity: 'Simple',
      landAcquisitionScore: 32,
      delayProbability: 9,
      budgetOverrunRisk: 7,
      approvalRiskScore: 14,
      co2EmissionsTonsPerYear: Math.round(routeB_dist * 120),
      confidenceScore: 97,
      isRecommended: true,
      recommendationReason: 'AI recommended alignment bypasses dense eco-sensitive reserves, avoids severe land disputes, and guarantees fast-track clearance under PM Gati Shakti guidelines.',
      waypoints: routeB_waypoints,
      conflicts: conflictsB,
      elevationProfile: [
        { distance: 0, elevation: 120 },
        { distance: Math.round(routeB_dist * 0.3), elevation: 180 },
        { distance: Math.round(routeB_dist * 0.6), elevation: 190 },
        { distance: routeB_dist, elevation: 60 },
      ],
    },
    {
      id: `rt-gen-c`,
      name: 'Route C: Industrial & Logistics Node Loop',
      type: 'infrastructure_optimized',
      color: '#8b5cf6',
      distanceKm: routeC_dist,
      estimatedCostCrores: routeC_cost,
      constructionMonths: Math.round(routeC_dist / 36) + 14,
      terrainDifficulty: 'Moderate',
      terrainDifficultyScore: 44,
      environmentalImpactScore: 40,
      travelEfficiencyScore: 88,
      landAcquisitionComplexity: 'Moderate',
      landAcquisitionScore: 45,
      delayProbability: 15,
      budgetOverrunRisk: 12,
      approvalRiskScore: 28,
      co2EmissionsTonsPerYear: Math.round(routeC_dist * 150),
      confidenceScore: 88,
      isRecommended: false,
      recommendationReason: 'Provides multi-modal connectivity to intermediate industrial parks at a slight increase in capital outlay.',
      waypoints: routeC_waypoints,
      conflicts: [],
      elevationProfile: [
        { distance: 0, elevation: 120 },
        { distance: Math.round(routeC_dist * 0.4), elevation: 280 },
        { distance: Math.round(routeC_dist * 0.7), elevation: 140 },
        { distance: routeC_dist, elevation: 60 },
      ],
    },
  ];

  res.json({
    source: { name: sourceName, coords: sourceCoords },
    destination: { name: destName, coords: destCoords },
    mode,
    routes: generatedRoutes,
  });
});

// AI Route Analysis Endpoint
app.post('/api/ai/analyze-route', async (req, res) => {
  const { projectTitle, mode, routes, selectedRoute } = req.body;

  const ai = getGeminiClient();
  if (!ai) {
    // Fallback response if Gemini API key not provided
    return res.json({
      summary: `PM Gati Shakti Multi-Modal Analysis for "${projectTitle || 'Selected Corridor'}"`,
      detailedAnalysis: `Based on spatial constraint overlay algorithms, Route B provides the optimal balance between project execution velocity and ecological conservation.`,
      keyMitigations: [
        'Utilize elevated viaducts over seasonal river basins to maintain natural hydrology.',
        'Implement automated wildlife crossing sensors in peripheral forest buffers.',
        'Synchronize land acquisition with PM Gati Shakti unified portal for single-window clearances.',
      ],
      interDepartmentalTasks: [
        { dept: 'MoEFCC', task: 'Stage-1 Forest Clearance Approval', priority: 'High' },
        { dept: 'MoRTH', task: 'NH-44 Interchange Grade Separation Approval', priority: 'Medium' },
        { dept: 'State Govt', task: 'Land Value Assessment & Resettlement Package', priority: 'High' },
      ],
      aiConfidenceScore: 96,
    });
  }

  try {
    const prompt = `You are the lead PM Gati Shakti AI Master Planner. Analyze the following infrastructure project route options and generate an authoritative executive decision summary:

Project Title: ${projectTitle || 'National Corridor'}
Transport Mode: ${mode || 'Highway/Railway'}
Selected Route: ${selectedRoute?.name || 'Route B'}
Routes Data: ${JSON.stringify(routes, null, 2)}

Provide a concise, highly professional analysis covering:
1. Clear rationale for why the optimal route minimizes delay risks and cost overruns.
2. Environmental impact mitigation measures (forests, rivers, eco-zones).
3. Strategic multi-modal connectivity impact under PM Gati Shakti.
4. Key inter-departmental action checklist (MoRTH, Indian Railways, MoEFCC, State Land Authorities).

Format your response as clean JSON with keys:
- summary (string)
- detailedAnalysis (string)
- keyMitigations (array of strings)
- interDepartmentalTasks (array of objects with { dept, task, priority })
- aiConfidenceScore (number 1-100)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsedText = response.text || '';
    const result = JSON.parse(parsedText);
    res.json(result);
  } catch (err: any) {
    console.error('Gemini API Error in analyze-route:', err);
    res.status(500).json({
      error: 'Failed to generate AI analysis',
      message: err.message || 'AI service error',
    });
  }
});

// AI Conversational Planning Assistant
app.post('/api/ai/chat', async (req, res) => {
  const { message, history, currentProject, currentRoute } = req.body;

  const ai = getGeminiClient();
  if (!ai) {
    // Intelligent fallback responses for demonstration
    let reply = `Under PM Gati Shakti National Master Plan, Route B is prioritized because it avoids high-risk eco-sensitive zones while optimizing freight throughput by 35%.`;
    if (message.toLowerCase().includes('why') || message.toLowerCase().includes('reason')) {
      reply = `Route B is recommended because it reduces environmental approval risks by 78%, cuts land acquisition delays by 14 months, and lowers overall carbon footprint compared to direct Route A.`;
    } else if (message.toLowerCase().includes('forest') || message.toLowerCase().includes('eco')) {
      reply = `To protect forest reserves, GatiAI routes around core tiger corridors and recommends elevated eco-ducts for necessary peripheral crossings, ensuring zero forest clearance blockage.`;
    } else if (message.toLowerCase().includes('cost') || message.toLowerCase().includes('budget')) {
      reply = `While Route B requires ₹14,200 Cr initial capital outlay compared to Route A's ₹13,800 Cr, its low delay probability prevents projected ₹2,400 Cr overrun penalties, saving ₹2,000 Cr net overall.`;
    }

    return res.json({ reply });
  }

  try {
    const systemInstruction = `You are "GatiAI Master Assistant", an expert AI Infrastructure Planner and GIS Engineer specializing in PM Gati Shakti National Master Plan for multi-modal connectivity in India.
Your answers are concise, strategic, data-backed, and focused on reducing project delays, lowering environmental impact, avoiding cost overruns, and promoting inter-departmental coordination (MoRTH, Railways, Inland Waterways, MoEFCC, Port Authorities).

Current Context:
Project: ${currentProject?.title || 'Delhi-Mumbai Freight Corridor'}
Active Route: ${currentRoute?.name || 'Route B: Eco-Optimized Bypass'}`;

    const chatMessages = [
      {
        role: 'user',
        parts: [{ text: `${systemInstruction}\n\nUser Question: ${message}` }],
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: message,
      config: {
        systemInstruction,
      },
    });

    res.json({ reply: response.text || 'Analysis completed.' });
  } catch (err: any) {
    console.error('Gemini Chat Error:', err);
    res.status(500).json({ error: 'AI Assistant temporary error', message: err.message });
  }
});

// AI Report Generator Endpoint
app.post('/api/ai/generate-report', async (req, res) => {
  const { project, route } = req.body;

  const ai = getGeminiClient();
  if (!ai) {
    return res.json({
      report: {
        executiveSummary: `This PM Gati Shakti Detailed Project Report (DPR) evaluates the multi-modal infrastructure alignment for ${project?.title || 'National Logistics Corridor'}. Using GatiAI predictive spatial analytics, Route B has been selected for execution.`,
        routeComparisonSummary: `Route B achieves a 96% AI confidence score by maintaining 1,315 km length, bypassing Aravalli tiger reserves, and reducing delay risk from 24% to 11%.`,
        riskAssessmentSummary: `Land acquisition complexity is rated Moderate, with approval risk score at 18/100. Environmental clearance lead time is estimated at 42 days.`,
        environmentalClearanceSummary: `Requires 0 hectares of core sanctuary clearance. Requires standard river bridge hydrology approval from Central Water Commission.`,
        roiEstimate: `18.4% internal rate of return (IRR) with 4.2 years payback period driven by 60% freight time reduction.`,
      },
    });
  }

  try {
    const prompt = `Generate a formal PM Gati Shakti Detailed Project Report (DPR) executive summary for:
Project Name: ${project?.title}
Infrastructure Type: ${project?.infrastructureType}
Selected Route: ${route?.name}
Distance: ${route?.distanceKm} km
Cost: ₹${route?.estimatedCostCrores} Crores
Construction Timeline: ${route?.constructionMonths} months
Risk Score: ${route?.approvalRiskScore}/100

Return a valid JSON object with keys:
- executiveSummary
- routeComparisonSummary
- riskAssessmentSummary
- environmentalClearanceSummary
- roiEstimate`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ report: parsed });
  } catch (err: any) {
    res.status(500).json({ error: 'Report generation failed', message: err.message });
  }
});

// ------------------------------------
// VITE / STATIC SERVING
// ------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GatiAI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
