export type UserRole = 'planner' | 'environmental_officer' | 'logistics_head' | 'admin';

export interface GISPoint {
  lat: number;
  lng: number;
  name?: string;
}

export interface RiverCrossing {
  id: string;
  name: string; // actual OSM name or "Unnamed river/waterway"
  coordinates: [number, number]; // [lat, lng]
}
export interface ConflictZone {
  id: string;
  name: string;
  type: 'forest' | 'river' | 'protected_area' | 'urban' | 'highway_crossing' | 'railway_crossing' | 'utility_corridor' | 'airport_buffer';
  severity: 'high' | 'medium' | 'low';
  locationName: string;
  coordinates: [number, number];
  description: string;
  impactScore?: number;
  mitigationSuggestion?: string;
}

export interface UtilityIntersection {
  id: string;
  type: 'pipeline' | 'underground_cable';
  osmId: string;
  name: string;
  substance?: string; // Gas, Oil, Water, or "Pipeline type unavailable"
  location?: string; // "Underground power cable — type unavailable"
  coordinates: [number, number]; // [lat, lng]
}

export interface GISFeatureGeometry {
  id: string;
  type: 'polygon' | 'polyline';
  category: 'forest' | 'protected_area' | 'river' | 'pipeline' | 'underground_cable';
  name: string;
  substance?: string;
  location?: string;
  coordinates: [number, number][]; // Array of [lat, lng]
}

export interface RouteOption {
  id: string;
  name: string;
  color: string;
  distanceKm: number;
  durationMinutes: number;
  // Environmental Features
  forestFeatureCount: number;
  protectedAreaFeatureCount: number;
  forestOverlapKm: number;
  protectedOverlapKm: number;
  riverCrossingCount: number;
  riverCrossings: RiverCrossing[];
  // Utility Infrastructure Features
  pipelineCrossingCount: number;
  undergroundCableCrossingCount: number;
  pipelineOverlapKm?: number;
  undergroundCableOverlapKm?: number;
  utilityIntersections: UtilityIntersection[];
  utilityDataState: 'available' | 'unavailable' | 'none_detected';
  // Route Geometries for rendering on map
  waypoints: [number, number][];
  forestGeometries?: GISFeatureGeometry[];
  protectedGeometries?: GISFeatureGeometry[];
  riverGeometries?: GISFeatureGeometry[];
  pipelineGeometries?: GISFeatureGeometry[];
  undergroundCableGeometries?: GISFeatureGeometry[];
}

export interface GISLayerState {
  routes: boolean;
  forests: boolean;
  protectedAreas: boolean;
  rivers: boolean;
  riverCrossings: boolean;
  // Utility Infrastructure Layers
  pipelines: boolean;
  undergroundCables: boolean;
  utilityIntersections: boolean;
}
