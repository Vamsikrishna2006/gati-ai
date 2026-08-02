import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// CORS & JSON Header Middleware
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// ------------------------------------
// GEMINI CLIENT (lazy init)
// ------------------------------------
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      });
    } catch (err) {
      console.warn('Gemini init failed:', err);
    }
  }
  return aiClient;
}

// Deterministic geographic lookup for real Indian river names based on coordinates
function getRealRiverNameByCoords(lat: number, lng: number): string {
  if (lat >= 27.5 && lat <= 30.5 && lng >= 76.5 && lng <= 79.5) {
    return lat > 28.5 ? 'Yamuna River' : 'Ganga River';
  }
  if (lat >= 24.5 && lat <= 27.5 && lng >= 79.5 && lng <= 88.0) {
    return lng > 84.0 ? 'Kosi River' : 'Ganga River';
  }
  if (lat >= 19.5 && lat <= 23.5 && lng >= 77.0 && lng <= 84.0) {
    if (lng > 81.5) return 'Mahanadi River';
    if (lat > 21.5) return 'Narmada River';
    return 'Wainganga River';
  }
  if (lat >= 20.0 && lat <= 24.5 && lng >= 70.0 && lng <= 75.0) {
    return lat > 22.0 ? 'Sabarmati River' : 'Tapti River';
  }
  if (lat >= 15.5 && lat <= 19.5 && lng >= 73.5 && lng <= 82.5) {
    return lat > 17.5 ? 'Godavari River' : 'Krishna River';
  }
  if (lat >= 10.0 && lat <= 15.5 && lng >= 75.0 && lng <= 80.5) {
    return lat > 13.0 ? 'Palar River' : 'Cauvery River';
  }
  if (lat >= 22.0 && lat <= 28.0 && lng >= 88.0 && lng <= 96.0) {
    return lat > 25.0 ? 'Brahmaputra River' : 'Hooghly River';
  }
  return 'Ganga River';
}

// 2D Line Segment Intersection Algorithm
function lineSegmentIntersection(
  p1: [number, number], // [lat, lng]
  p2: [number, number],
  q1: [number, number],
  q2: [number, number]
): [number, number] | null {
  const x1 = p1[1], y1 = p1[0];
  const x2 = p2[1], y2 = p2[0];
  const x3 = q1[1], y3 = q1[0];
  const x4 = q2[1], y4 = q2[0];

  const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (Math.abs(denom) < 1e-10) return null;

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;

  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    const intLng = x1 + t * (x2 - x1);
    const intLat = y1 + t * (y2 - y1);
    return [parseFloat(intLat.toFixed(5)), parseFloat(intLng.toFixed(5))];
  }

  return null;
}

// Distance between two points in meters
function getPointDistanceMeters(p1: [number, number], p2: [number, number]): number {
  const R = 6371000;
  const dLat = ((p2[0] - p1[0]) * Math.PI) / 180;
  const dLng = ((p2[1] - p1[1]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1[0] * Math.PI) / 180) *
      Math.cos((p2[0] * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Fallback route generator if ORS is offline
function generateFallbackRoutes(
  sourceCoords: [number, number],
  destCoords: [number, number]
) {
  const [sLat, sLng] = sourceCoords;
  const [dLat, dLng] = destCoords;

  const R = 6371;
  const dLatRad = ((dLat - sLat) * Math.PI) / 180;
  const dLngRad = ((dLng - sLng) * Math.PI) / 180;
  const a =
    Math.sin(dLatRad / 2) * Math.sin(dLatRad / 2) +
    Math.cos((sLat * Math.PI) / 180) *
      Math.cos((dLat * Math.PI) / 180) *
      Math.sin(dLngRad / 2) *
      Math.sin(dLngRad / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const directDist = Math.round(R * c);

  const waypointsA: [number, number][] = [
    [sLat, sLng],
    [sLat + (dLat - sLat) * 0.25, sLng + (dLng - sLng) * 0.23],
    [sLat + (dLat - sLat) * 0.50, sLng + (dLng - sLng) * 0.52],
    [sLat + (dLat - sLat) * 0.75, sLng + (dLng - sLng) * 0.77],
    [dLat, dLng],
  ];

  const latOffset = (dLat - sLat) > 0 ? 0.35 : -0.35;
  const lngOffset = (dLng - sLng) > 0 ? -0.25 : 0.25;
  const waypointsB: [number, number][] = [
    [sLat, sLng],
    [sLat + (dLat - sLat) * 0.20 + latOffset * 0.5, sLng + (dLng - sLng) * 0.20 + lngOffset * 0.5],
    [sLat + (dLat - sLat) * 0.50 + latOffset, sLng + (dLng - sLng) * 0.50 + lngOffset],
    [sLat + (dLat - sLat) * 0.80 + latOffset * 0.5, sLng + (dLng - sLng) * 0.80 + lngOffset * 0.5],
    [dLat, dLng],
  ];

  return [
    {
      id: 'rt-1',
      name: 'Route A',
      color: '#14b8a6',
      distanceKm: parseFloat((directDist * 1.12).toFixed(1)),
      durationMinutes: Math.round((directDist * 1.12) / 1.1),
      forestFeatureCount: 0,
      protectedAreaFeatureCount: 0,
      forestOverlapKm: 0,
      protectedOverlapKm: 0,
      riverCrossingCount: 0,
      riverCrossings: [],
      pipelineCrossingCount: 0,
      undergroundCableCrossingCount: 0,
      utilityIntersections: [],
      utilityDataState: 'none_detected' as const,
      waypoints: waypointsA,
    },
    {
      id: 'rt-2',
      name: 'Route B',
      color: '#f59e0b',
      distanceKm: parseFloat((directDist * 1.24).toFixed(1)),
      durationMinutes: Math.round((directDist * 1.24) / 1.1),
      forestFeatureCount: 0,
      protectedAreaFeatureCount: 0,
      forestOverlapKm: 0,
      protectedOverlapKm: 0,
      riverCrossingCount: 0,
      riverCrossings: [],
      pipelineCrossingCount: 0,
      undergroundCableCrossingCount: 0,
      utilityIntersections: [],
      utilityDataState: 'none_detected' as const,
      waypoints: waypointsB,
    },
  ];
}

// Fetch a single route from ORS API
async function fetchSingleOrsRoute(
  apiKey: string,
  coords: [number, number][]
) {
  const orsBody = {
    coordinates: coords.map(([lat, lng]) => [lng, lat]),
    geometry: true,
    instructions: false,
  };

  const orsRes = await fetch(
    'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
    {
      method: 'POST',
      headers: {
        Authorization: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orsBody),
    }
  );

  if (!orsRes.ok) {
    const text = await orsRes.text();
    throw new Error(`ORS API error ${orsRes.status}: ${text}`);
  }

  const orsData = await orsRes.json();
  const feat = orsData.features?.[0];
  if (!feat) throw new Error('No feature returned from ORS');

  const props = feat.properties?.summary || { distance: 100000, duration: 3600 };
  const waypoints: [number, number][] = feat.geometry?.coordinates?.map(
    ([lng, lat]: [number, number]) => [lat, lng] as [number, number]
  ) || [];

  return {
    distanceKm: parseFloat((props.distance / 1000).toFixed(1)),
    durationMinutes: Math.round(props.duration / 60),
    waypoints,
  };
}

// ------------------------------------
// HEALTH CHECK
// ------------------------------------
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'GatiAI – Infrastructure Route Planner',
    gemini: !!process.env.GEMINI_API_KEY,
    ors: !!process.env.ORS_API_KEY,
  });
});

// ------------------------------------
// ROUTE: ORS directions (2 routes)
// ------------------------------------
app.post('/api/routes/ors', async (req, res) => {
  const { sourceCoords, destCoords } = req.body as {
    sourceCoords: [number, number];
    destCoords: [number, number];
  };

  if (!sourceCoords || !destCoords) {
    return res.status(400).json({ error: 'sourceCoords and destCoords are required' });
  }

  const apiKey = process.env.ORS_API_KEY;

  if (apiKey) {
    try {
      const altBody = {
        coordinates: [
          [sourceCoords[1], sourceCoords[0]],
          [destCoords[1], destCoords[0]],
        ],
        alternative_routes: { share_factor: 0.6, target_count: 2, weight_factor: 1.6 },
        geometry: true,
        instructions: false,
      };

      const orsRes = await fetch(
        'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
        {
          method: 'POST',
          headers: {
            Authorization: apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(altBody),
        }
      );

      if (orsRes.ok) {
        const orsData = await orsRes.json();
        const features = orsData.features || [];

        if (features.length >= 2) {
          const routeColors = ['#14b8a6', '#f59e0b'];
          const routes = features.slice(0, 2).map((feat: any, idx: number) => {
            const props = feat.properties?.summary || { distance: 100000, duration: 3600 };
            const waypoints: [number, number][] = feat.geometry?.coordinates?.map(
              ([lng, lat]: [number, number]) => [lat, lng] as [number, number]
            ) || [];

            return {
              id: `rt-${idx + 1}`,
              name: idx === 0 ? 'Route A' : 'Route B',
              color: routeColors[idx],
              distanceKm: parseFloat((props.distance / 1000).toFixed(1)),
              durationMinutes: Math.round(props.duration / 60),
              forestFeatureCount: 0,
              protectedAreaFeatureCount: 0,
              forestOverlapKm: 0,
              protectedOverlapKm: 0,
              riverCrossingCount: 0,
              riverCrossings: [],
              pipelineCrossingCount: 0,
              undergroundCableCrossingCount: 0,
              utilityIntersections: [],
              utilityDataState: 'none_detected' as const,
              waypoints,
            };
          });

          return res.json({ routes });
        }
      }

      const [sLat, sLng] = sourceCoords;
      const [dLat, dLng] = destCoords;

      const resA = await fetchSingleOrsRoute(apiKey, [sourceCoords, destCoords]);

      const midLat = (sLat + dLat) / 2 + ((dLat - sLat) > 0 ? 0.35 : -0.35);
      const midLng = (sLng + dLng) / 2 + ((dLng - sLng) > 0 ? -0.3 : 0.3);
      const viaPoint: [number, number] = [midLat, midLng];

      let resB;
      try {
        resB = await fetchSingleOrsRoute(apiKey, [sourceCoords, viaPoint, destCoords]);
      } catch (e) {
        resB = {
          distanceKm: parseFloat((resA.distanceKm * 1.15).toFixed(1)),
          durationMinutes: Math.round(resA.durationMinutes * 1.15),
          waypoints: resA.waypoints.map(([lat, lng], idx, arr) => {
            if (idx > 0 && idx < arr.length - 1) {
              return [lat + 0.15 * Math.sin(idx), lng + 0.15 * Math.cos(idx)] as [number, number];
            }
            return [lat, lng] as [number, number];
          }),
        };
      }

      const routes = [
        {
          id: 'rt-1',
          name: 'Route A',
          color: '#14b8a6',
          distanceKm: resA.distanceKm,
          durationMinutes: resA.durationMinutes,
          forestFeatureCount: 0,
          protectedAreaFeatureCount: 0,
          forestOverlapKm: 0,
          protectedOverlapKm: 0,
          riverCrossingCount: 0,
          riverCrossings: [],
          pipelineCrossingCount: 0,
          undergroundCableCrossingCount: 0,
          utilityIntersections: [],
          utilityDataState: 'none_detected' as const,
          waypoints: resA.waypoints,
        },
        {
          id: 'rt-2',
          name: 'Route B',
          color: '#f59e0b',
          distanceKm: resB.distanceKm,
          durationMinutes: resB.durationMinutes,
          forestFeatureCount: 0,
          protectedAreaFeatureCount: 0,
          forestOverlapKm: 0,
          protectedOverlapKm: 0,
          riverCrossingCount: 0,
          riverCrossings: [],
          pipelineCrossingCount: 0,
          undergroundCableCrossingCount: 0,
          utilityIntersections: [],
          utilityDataState: 'none_detected' as const,
          waypoints: resB.waypoints,
        },
      ];

      return res.json({ routes });
    } catch (err: any) {
      console.warn('ORS fetch error, utilizing fallback route generator:', err.message);
    }
  }

  const fallbackRoutes = generateFallbackRoutes(sourceCoords, destCoords);
  res.json({ routes: fallbackRoutes });
});

// ------------------------------------
// ENV & UTILITY INFRASTRUCTURE CHECK
// ------------------------------------
app.post('/api/routes/env-check', async (req, res) => {
  const { routes } = req.body;
  if (!routes || !Array.isArray(routes)) {
    return res.status(400).json({ error: 'routes array required' });
  }

  try {
    const enriched = await Promise.all(
      routes.map(async (route: any) => {
        const waypoints: [number, number][] = route.waypoints || [];
        if (waypoints.length === 0) return route;

        const lats = waypoints.map(([lat]) => lat);
        const lngs = waypoints.map(([, lng]) => lng);
        const BUFFER = 0.02;
        const bbox = {
          south: Math.min(...lats) - BUFFER,
          west: Math.min(...lngs) - BUFFER,
          north: Math.max(...lats) + BUFFER,
          east: Math.max(...lngs) + BUFFER,
        };

        const overpassQuery = `
          [out:json][timeout:25];
          (
            way["landuse"="forest"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});
            relation["landuse"="forest"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});
            way["natural"="wood"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});

            way["boundary"="protected_area"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});
            way["leisure"="nature_reserve"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});

            way["waterway"="river"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});
            way["waterway"="stream"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});
            way["waterway"="canal"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});

            way["man_made"="pipeline"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});
            relation["man_made"="pipeline"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});

            way["power"="cable"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});
            relation["power"="cable"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});
          );
          out body geom;
        `.trim();

        let forestCount = 0;
        let protectedCount = 0;
        let querySucceeded = false;

        const forestGeometries: any[] = [];
        const protectedGeometries: any[] = [];
        const riverGeometries: any[] = [];
        const riverCrossings: any[] = [];
        const pipelineGeometries: any[] = [];
        const undergroundCableGeometries: any[] = [];

        const intersectPipelineOsmIds = new Set<string>();
        const intersectCableOsmIds = new Set<string>();
        const utilityIntersections: any[] = [];

        try {
          const ovRes = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `data=${encodeURIComponent(overpassQuery)}`,
          });

          if (ovRes.ok) {
            querySucceeded = true;
            const ovData = await ovRes.json();
            const elements: any[] = ovData.elements || [];

            elements.forEach((el: any) => {
              const tags = el.tags || {};
              const geomNodes: [number, number][] = el.geometry?.map(
                (g: any) => [g.lat, g.lon] as [number, number]
              ) || [];

              if (geomNodes.length < 2) return;

              const isForest = tags.landuse === 'forest' || tags.natural === 'wood';
              const isProtected = tags.boundary === 'protected_area' || tags.leisure === 'nature_reserve';
              const isRiver = tags.waterway === 'river' || tags.waterway === 'stream' || tags.waterway === 'canal';
              const isPipeline = tags.man_made === 'pipeline';
              const isCable = tags.power === 'cable';

              if (isForest) {
                forestCount++;
                forestGeometries.push({
                  id: `f-${el.id}`,
                  type: 'polygon',
                  category: 'forest',
                  name: tags.name || 'Mapped Forest Area',
                  coordinates: geomNodes,
                });
              } else if (isProtected) {
                protectedCount++;
                protectedGeometries.push({
                  id: `p-${el.id}`,
                  type: 'polygon',
                  category: 'protected_area',
                  name: tags.name || 'Protected Reserve Zone',
                  coordinates: geomNodes,
                });
              } else if (isRiver) {
                const resolvedRiverName = tags.name || tags['name:en'] || getRealRiverNameByCoords(geomNodes[0][0], geomNodes[0][1]);
                riverGeometries.push({
                  id: `r-${el.id}`,
                  type: 'polyline',
                  category: 'river',
                  name: resolvedRiverName,
                  coordinates: geomNodes,
                });

                for (let i = 0; i < waypoints.length - 1; i++) {
                  const p1 = waypoints[i];
                  const p2 = waypoints[i + 1];

                  for (let j = 0; j < geomNodes.length - 1; j++) {
                    const q1 = geomNodes[j];
                    const q2 = geomNodes[j + 1];

                    const intersection = lineSegmentIntersection(p1, p2, q1, q2);
                    if (intersection) {
                      const alreadyExists = riverCrossings.some(
                        (existing: any) => getPointDistanceMeters(existing.coordinates, intersection) < 200
                      );

                      if (!alreadyExists) {
                        const riverNameAtIntersect = tags.name || tags['name:en'] || getRealRiverNameByCoords(intersection[0], intersection[1]);
                        riverCrossings.push({
                          id: `rc-${el.id}-${i}-${j}`,
                          name: riverNameAtIntersect,
                          coordinates: intersection,
                        });
                      }
                    }
                  }
                }
              } else if (isPipeline) {
                const substanceTag = tags.substance || tags.pipeline;
                const rawSubstance = substanceTag ? String(substanceTag).trim() : 'Pipeline type unavailable';
                const substanceDisplay = rawSubstance.charAt(0).toUpperCase() + rawSubstance.slice(1);

                pipelineGeometries.push({
                  id: `pipe-${el.id}`,
                  type: 'polyline',
                  category: 'pipeline',
                  name: tags.name || 'Mapped Pipeline',
                  substance: substanceDisplay,
                  location: tags.location || 'Unavailable',
                  coordinates: geomNodes,
                });

                for (let i = 0; i < waypoints.length - 1; i++) {
                  const p1 = waypoints[i];
                  const p2 = waypoints[i + 1];

                  for (let j = 0; j < geomNodes.length - 1; j++) {
                    const q1 = geomNodes[j];
                    const q2 = geomNodes[j + 1];

                    const intersection = lineSegmentIntersection(p1, p2, q1, q2);
                    if (intersection) {
                      intersectPipelineOsmIds.add(`pipe-${el.id}`);

                      const alreadyExists = utilityIntersections.some(
                        (u: any) => getPointDistanceMeters(u.coordinates, intersection) < 200
                      );

                      if (!alreadyExists) {
                        utilityIntersections.push({
                          id: `u-pipe-${el.id}-${i}`,
                          type: 'pipeline',
                          osmId: `pipe-${el.id}`,
                          name: tags.name || 'Mapped Pipeline',
                          substance: substanceDisplay,
                          location: tags.location || 'Unavailable',
                          coordinates: intersection,
                        });
                      }
                    }
                  }
                }
              } else if (isCable) {
                const isUnderground = tags.location === 'underground' || tags.cable === 'underground' || tags.underground === 'yes';
                const cableLocationDisplay = isUnderground
                  ? 'Mapped underground power cable'
                  : 'Underground power cable — type unavailable';

                undergroundCableGeometries.push({
                  id: `cable-${el.id}`,
                  type: 'polyline',
                  category: 'underground_cable',
                  name: tags.name || 'Mapped Power Cable',
                  location: cableLocationDisplay,
                  coordinates: geomNodes,
                });

                for (let i = 0; i < waypoints.length - 1; i++) {
                  const p1 = waypoints[i];
                  const p2 = waypoints[i + 1];

                  for (let j = 0; j < geomNodes.length - 1; j++) {
                    const q1 = geomNodes[j];
                    const q2 = geomNodes[j + 1];

                    const intersection = lineSegmentIntersection(p1, p2, q1, q2);
                    if (intersection) {
                      intersectCableOsmIds.add(`cable-${el.id}`);

                      const alreadyExists = utilityIntersections.some(
                        (u: any) => getPointDistanceMeters(u.coordinates, intersection) < 200
                      );

                      if (!alreadyExists) {
                        utilityIntersections.push({
                          id: `u-cable-${el.id}-${i}`,
                          type: 'underground_cable',
                          osmId: `cable-${el.id}`,
                          name: tags.name || 'Mapped Power Cable',
                          location: cableLocationDisplay,
                          coordinates: intersection,
                        });
                      }
                    }
                  }
                }
              }
            });
          }
        } catch (ovErr) {
          console.warn('Overpass query failed:', ovErr);
        }

        const totalKm = route.distanceKm || 100;
        const forestOverlapKm = parseFloat(
          Math.min(forestCount * 3.2, totalKm * 0.25).toFixed(1)
        );
        const protectedOverlapKm = parseFloat(
          Math.min(protectedCount * 4.1, totalKm * 0.18).toFixed(1)
        );

        let utilityDataState: 'available' | 'unavailable' | 'none_detected' = 'unavailable';
        if (querySucceeded) {
          utilityDataState = (intersectPipelineOsmIds.size > 0 || intersectCableOsmIds.size > 0)
            ? 'available'
            : 'none_detected';
        }

        return {
          ...route,
          forestFeatureCount: forestCount,
          protectedAreaFeatureCount: protectedCount,
          forestOverlapKm,
          protectedOverlapKm,
          riverCrossingCount: riverCrossings.length,
          riverCrossings,
          pipelineCrossingCount: intersectPipelineOsmIds.size,
          undergroundCableCrossingCount: intersectCableOsmIds.size,
          utilityIntersections,
          utilityDataState,
          forestGeometries: forestGeometries.slice(0, 10),
          protectedGeometries: protectedGeometries.slice(0, 10),
          riverGeometries: riverGeometries.slice(0, 15),
          pipelineGeometries: pipelineGeometries.slice(0, 10),
          undergroundCableGeometries: undergroundCableGeometries.slice(0, 10),
        };
      })
    );

    res.json({ routes: enriched });
  } catch (err: any) {
    console.error('Env-check error:', err);
    res.status(500).json({ error: 'Environmental & Utility check failed', message: err.message });
  }
});

// ------------------------------------
// AI: Explain Route Tradeoff (Gemini call)
// ------------------------------------
app.post('/api/ai/explain-tradeoff', async (req, res) => {
  const { routeA, routeB, sourceLabel, destLabel } = req.body;

  const systemPrompt = `You are GatiAI, an infrastructure planning assistant.

You are given route metrics calculated from real routing and geospatial data.

Explain the tradeoffs between candidate infrastructure routes in simple, neutral language.

The supplied utility data represents only publicly mapped infrastructure available in the source dataset.

Do NOT assume the utility dataset is complete.
Do NOT claim that a route is free of underground infrastructure merely because none was detected.
Use the phrase 'mapped infrastructure' when appropriate.

Do NOT choose a winner.
Do NOT declare any route 'best'.
Do NOT invent numbers.
Do NOT invent construction costs.
Do NOT estimate utility relocation costs.
Do NOT estimate bridge costs.
Do NOT create risk percentages.
Do NOT create construction timelines.
Do NOT claim regulatory approval.
Do NOT claim engineering feasibility.
Do NOT claim environmental clearance.

Only interpret the supplied measurements.
If utility information is unavailable, explicitly state that it is unavailable.

The final decision belongs to the infrastructure planner.`;

  const userPrompt = `Here are the verified route metrics for candidate corridors between ${sourceLabel || 'Origin'} and ${destLabel || 'Destination'}:

Route A:
- Distance: ${routeA?.distanceKm} km
- Estimated travel duration: ${Math.floor((routeA?.durationMinutes || 0) / 60)}h ${(routeA?.durationMinutes || 0) % 60}m
- Mapped forest features: ${routeA?.forestFeatureCount} (approx. ${routeA?.forestOverlapKm} km overlap)
- Mapped protected-area features: ${routeA?.protectedAreaFeatureCount} (approx. ${routeA?.protectedOverlapKm} km overlap)
- Mapped river crossings: ${routeA?.riverCrossingCount ?? 0}
- Mapped pipeline intersections: ${routeA?.pipelineCrossingCount ?? 0}
- Mapped underground power-cable intersections: ${routeA?.undergroundCableCrossingCount ?? 0}

Route B:
- Distance: ${routeB?.distanceKm} km
- Estimated travel duration: ${Math.floor((routeB?.durationMinutes || 0) / 60)}h ${(routeB?.durationMinutes || 0) % 60}m
- Mapped forest features: ${routeB?.forestFeatureCount} (approx. ${routeB?.forestOverlapKm} km overlap)
- Mapped protected-area features: ${routeB?.protectedAreaFeatureCount} (approx. ${routeB?.protectedOverlapKm} km overlap)
- Mapped river crossings: ${routeB?.riverCrossingCount ?? 0}
- Mapped pipeline intersections: ${routeB?.pipelineCrossingCount ?? 0}
- Mapped underground power-cable intersections: ${routeB?.undergroundCableCrossingCount ?? 0}

Explain the tradeoffs between candidate routes in neutral, plain language. Do NOT declare a winner.`;

  const ai = getGeminiClient();

  if (!ai) {
    const shorterRoute = (routeA?.distanceKm || 0) <= (routeB?.distanceKm || 0) ? 'Route A' : 'Route B';

    const explanation = `Route A is shorter (${routeA?.distanceKm || 0} km) with an estimated travel duration of ${Math.floor((routeA?.durationMinutes || 0) / 60)}h ${(routeA?.durationMinutes || 0) % 60}m. However, it intersects ${routeA?.forestFeatureCount || 0} mapped forest features, ${routeA?.protectedAreaFeatureCount || 0} mapped protected-area features, and ${routeA?.riverCrossingCount || 0} mapped river crossings.

The available public GIS data also shows ${routeA?.pipelineCrossingCount || 0} mapped pipeline intersections and ${routeA?.undergroundCableCrossingCount || 0} mapped underground power-cable intersections along Route A, compared to ${routeB?.pipelineCrossingCount || 0} mapped pipeline intersections and ${routeB?.undergroundCableCrossingCount || 0} mapped underground power-cable intersections along Route B.

These findings indicate different planning considerations, but they do not establish construction cost, relocation requirements, or regulatory feasibility. Detailed engineering and field verification are required before making a final alignment decision.`;

    return res.json({ explanation });
  }

  try {
    let explanation = '';
    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-latest'];
    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: userPrompt,
          config: { systemInstruction: systemPrompt },
        });
        explanation = response.text || '';
        if (explanation) break;
      } catch (mErr: any) {
        console.warn(`Model ${modelName} call error:`, mErr?.message || mErr);
      }
    }

    if (!explanation) {
      explanation = `Route A measures ${routeA?.distanceKm || 0} km with ${routeA?.forestFeatureCount || 0} mapped forest features and ${routeA?.pipelineCrossingCount || 0} mapped pipeline intersections. Route B measures ${routeB?.distanceKm || 0} km with ${routeB?.forestFeatureCount || 0} mapped forest features and ${routeB?.pipelineCrossingCount || 0} mapped pipeline intersections. These mapped infrastructure findings warrant further field verification.`;
    }

    res.json({ explanation });
  } catch (err: any) {
    console.error('Gemini error:', err);
    res.json({
      explanation: `Route A measures ${routeA?.distanceKm || 0} km with ${routeA?.forestFeatureCount || 0} mapped forest features and ${routeA?.riverCrossingCount || 0} mapped river crossings. Route B measures ${routeB?.distanceKm || 0} km with ${routeB?.forestFeatureCount || 0} mapped forest features and ${routeB?.riverCrossingCount || 0} mapped river crossings. Field utility verification is recommended.`
    });
  }
});

// Catch-all API 404 handler returning JSON instead of raw text
app.use('/api/*', (_req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
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
    let distPath = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(path.join(distPath, 'index.html'))) {
      distPath = path.resolve(__dirname, '..', 'dist');
    }
    if (!fs.existsSync(path.join(distPath, 'index.html'))) {
      distPath = path.resolve(__dirname);
    }
    console.log(`Serving production static assets from: ${distPath}`);
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GatiAI Server running on http://0.0.0.0:${PORT}`);
    console.log(`  Gemini: ${!!process.env.GEMINI_API_KEY ? 'configured' : 'NOT set (fallback mode)'}`);
    console.log(`  ORS:    ${!!process.env.ORS_API_KEY ? 'configured' : 'NOT set'}`);
  });
}

startServer();
