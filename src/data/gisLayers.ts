// Mock GIS spatial layers for India Multi-modal Master Plan

export interface GISLayerShape {
  id: string;
  name: string;
  category: 'forest' | 'river' | 'protected_area' | 'highway' | 'railway' | 'airport' | 'urban' | 'utility';
  type: 'polygon' | 'polyline' | 'circle';
  coordinates: [number, number][] | [number, number][][]; // lat, lng
  center?: [number, number];
  radiusKm?: number;
  color: string;
  fillColor?: string;
  description: string;
}

export const GIS_LAYERS_DATA: GISLayerShape[] = [
  // Forests & Sanctuaries
  {
    id: 'layer-f1',
    name: 'Aravalli Eco-Sensitive Forest Belt',
    category: 'forest',
    type: 'polygon',
    color: '#16a34a',
    fillColor: '#22c55e',
    description: 'Protected Aravalli mountain reserve forest and leopard corridor.',
    coordinates: [
      [27.8000, 76.2000],
      [27.9000, 76.6000],
      [27.3000, 76.8000],
      [26.8000, 76.3000],
      [26.9000, 75.9000],
      [27.5000, 76.0000],
    ],
  },
  {
    id: 'layer-f2',
    name: 'Western Ghats Biodiversity Reserve',
    category: 'forest',
    type: 'polygon',
    color: '#15803d',
    fillColor: '#16a34a',
    description: 'UNESCO World Heritage ecological biosphere zone.',
    coordinates: [
      [15.8000, 74.0000],
      [15.9000, 74.6000],
      [13.5000, 75.8000],
      [12.2000, 75.9000],
      [11.5000, 76.5000],
      [11.2000, 75.8000],
      [13.0000, 75.0000],
    ],
  },

  // Rivers
  {
    id: 'layer-r1',
    name: 'Ganga River Master Waterway (NW-1)',
    category: 'river',
    type: 'polyline',
    color: '#0284c7',
    description: 'National Waterway 1 primary shipping and ecological river corridor.',
    coordinates: [
      [30.0869, 78.2676], // Rishikesh
      [29.9457, 78.1642], // Haridwar
      [26.4499, 80.3319], // Kanpur
      [25.4358, 81.8463], // Prayagraj
      [25.3176, 82.9739], // Varanasi
      [25.6000, 85.1000], // Patna
      [22.5726, 88.3639], // Kolkata
    ],
  },
  {
    id: 'layer-r2',
    name: 'Narmada River Basin',
    category: 'river',
    type: 'polyline',
    color: '#0369a1',
    description: 'Major central river basin requiring elevated bridge engineering.',
    coordinates: [
      [22.6700, 81.7500],
      [23.1800, 79.9500],
      [21.7000, 72.9800],
    ],
  },

  // Airports & Buffers
  {
    id: 'layer-a1',
    name: 'Delhi IGI Airspace Restricted Cone',
    category: 'airport',
    type: 'circle',
    center: [28.5562, 77.1000],
    radiusKm: 18,
    color: '#d97706',
    fillColor: '#f59e0b',
    description: 'Aviation height ceiling and radar interference clearance zone.',
    coordinates: [],
  },
  {
    id: 'layer-a2',
    name: 'Mumbai Airport Noise & Safety Buffer',
    category: 'airport',
    type: 'circle',
    center: [19.0896, 72.8656],
    radiusKm: 14,
    color: '#d97706',
    fillColor: '#f59e0b',
    description: 'Density restricted runway flight path corridor.',
    coordinates: [],
  },

  // Existing Infrastructure
  {
    id: 'layer-h1',
    name: 'Golden Quadrilateral Highway Network',
    category: 'highway',
    type: 'polyline',
    color: '#475569',
    description: 'Existing 4/6-lane primary arterial national highway system.',
    coordinates: [
      [28.6139, 77.2090], // Delhi
      [22.5726, 88.3639], // Kolkata
      [13.0827, 80.2707], // Chennai
      [19.0760, 72.8777], // Mumbai
      [28.6139, 77.2090], // Delhi
    ],
  },
  {
    id: 'layer-rw1',
    name: 'Western Dedicated Freight Corridor (WDFC Rail)',
    category: 'railway',
    type: 'polyline',
    color: '#dc2626',
    description: 'Active electrified heavy-haul freight railway line from Dadri to JNPT.',
    coordinates: [
      [28.5528, 77.5539], // Dadri
      [27.8974, 78.0880], // Aligarh
      [26.9124, 75.7873], // Jaipur
      [24.5854, 73.7125], // Udaipur
      [22.3072, 73.1812], // Vadodara
      [18.9500, 72.9500], // JNPT
    ],
  },
];
