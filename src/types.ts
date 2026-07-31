export type UserRole = 'planner' | 'environmental_officer' | 'logistics_head' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar: string;
}

export interface GISPoint {
  lat: number;
  lng: number;
  name?: string;
}

export type InfrastructureType = 'highway' | 'railway' | 'multimodal' | 'waterway' | 'pipeline';

export interface ConflictZone {
  id: string;
  name: string;
  type: 'forest' | 'river' | 'protected_area' | 'urban' | 'highway_crossing' | 'railway_crossing' | 'utility_corridor' | 'airport_buffer';
  severity: 'high' | 'medium' | 'low';
  locationName: string;
  coordinates: [number, number]; // [lat, lng]
  description: string;
  impactScore: number; // 1-100
  mitigationSuggestion: string;
}

export interface RouteOption {
  id: string;
  name: string;
  type: 'shortest' | 'eco_friendly' | 'infrastructure_optimized' | 'cost_optimized';
  color: string;
  dashArray?: string;
  distanceKm: number;
  estimatedCostCrores: number;
  constructionMonths: number;
  terrainDifficulty: 'Low' | 'Moderate' | 'High' | 'Very High';
  terrainDifficultyScore: number; // 1-100
  environmentalImpactScore: number; // 1-100 (lower is better eco)
  travelEfficiencyScore: number; // 1-100 (higher is better)
  landAcquisitionComplexity: 'Simple' | 'Moderate' | 'Complex' | 'Severe';
  landAcquisitionScore: number; // 1-100
  delayProbability: number; // percentage e.g. 18%
  budgetOverrunRisk: number; // percentage e.g. 12%
  approvalRiskScore: number; // 1-100
  co2EmissionsTonsPerYear: number;
  confidenceScore: number; // 1-100 (AI recommendation confidence)
  isRecommended: boolean;
  recommendationReason: string;
  waypoints: [number, number][]; // Array of [lat, lng]
  conflicts: ConflictZone[];
  elevationProfile: { distance: number; elevation: number }[];
}

export interface Project {
  id: string;
  title: string;
  code: string;
  department: string;
  infrastructureType: InfrastructureType;
  sourceCity: string;
  destinationCity: string;
  sourceCoords: [number, number];
  destinationCoords: [number, number];
  status: 'planning' | 'under_review' | 'approved' | 'in_execution' | 'delayed';
  budgetCrores: number;
  spentCrores: number;
  timelineMonths: number;
  startDate: string;
  completionDate: string;
  assignedLead: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  riskScore: number;
  selectedRouteId?: string;
  routes: RouteOption[];
  description: string;
  lastUpdated: string;
}

export interface GISLayerState {
  forests: boolean;
  rivers: boolean;
  protectedAreas: boolean;
  existingHighways: boolean;
  railwayNetwork: boolean;
  airports: boolean;
  urbanClusters: boolean;
  utilityCorridors: boolean;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  routeData?: {
    routeId?: string;
    metrics?: Record<string, string | number>;
  };
}

export interface ProjectReport {
  id: string;
  projectId: string;
  projectTitle: string;
  generatedAt: string;
  generatedBy: string;
  executiveSummary: string;
  routeComparisonSummary: string;
  riskAssessmentSummary: string;
  environmentalClearanceSummary: string;
  recommendedRouteName: string;
  estimatedCost: string;
  estimatedTime: string;
  roiEstimate: string;
  approvalChecklist: { task: string; status: 'completed' | 'pending' | 'required'; department: string }[];
}
