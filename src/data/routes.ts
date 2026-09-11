import { RouteOption } from '../types';

// Chennai safe routes — T. Nagar to Nungambakkam corridor (T Nagar to Nungambakkam) over Bhuvan 5×5m DEM 6–24m (6-24m)
// Coords 13.0–13.08N (13.0-13.08), 80.225–80.255E (80.225-80.255), elevations 6–24m (6-24m), DWR Chennai 0–3h (0-3h)

export const mockRouteOrigins = [
  'T. Nagar Pondy Bazaar',
  'Velachery Vijayanagar',
  'Anna Nagar 2nd Avenue',
  'Thiruvanmiyur ECR',
  'Nungambakkam College Road',
];

export const mockRouteDestinations = [
  'Nungambakkam College Road',
  'T. Nagar Bazullah Road',
  'Anna Nagar Shanthi Colony',
  'Velachery 100ft Road',
  'Thiruvanmiyur Lattice Bridge Road',
];

export const mockRouteComparison: RouteOption[] = [
  {
    id: 'route-b',
    name: 'Route B',
    routeName: 'via G.N. Chetty Road & Sterling Road Flyover (Recommended)',
    distanceKm: 5.8,
    durationMin: 22,
    riskLevel: 'low',
    isRecommended: true,
    floodExposureScore: 6,
    maxFloodDepthCm: 3,
    inundatedStreetsCount: 0,
    summary: 'Route B is slightly longer (+0.9 km) but has significantly lower flood exposure. Uses high-elevation G.N. Chetty ridge (8–11m) and grade-separated Sterling Road flyover avoiding all flooded T. Nagar underpasses and Velachery low.',
    elevationGainMeters: 5,
    elevationProfile: [
      { distanceKm: 0.0, elevationM: 7, waterDepthCm: 0 },
      { distanceKm: 1.2, elevationM: 8, waterDepthCm: 0 },
      { distanceKm: 2.5, elevationM: 11, waterDepthCm: 2 },
      { distanceKm: 3.8, elevationM: 10, waterDepthCm: 1 },
      { distanceKm: 4.9, elevationM: 9, waterDepthCm: 3 },
      { distanceKm: 5.8, elevationM: 11, waterDepthCm: 1 }
    ],
    waypoints: [
      { x: 420, y: 380, name: 'T. Nagar Pondy Bazaar' },
      { x: 430, y: 360, name: 'G.N. Chetty Road (Ridge 8m)' },
      { x: 445, y: 340, name: 'Thyagaraya Nagar Flyover' },
      { x: 455, y: 315, name: 'Sterling Road Elevated' },
      { x: 445, y: 295, name: 'Valluvar Kottam Link' },
      { x: 440, y: 280, name: 'Nungambakkam College Road' }
    ],
    hazards: []
  },
  {
    id: 'route-a',
    name: 'Route A',
    routeName: 'via Bazullah Road Underpass & Cooum Culvert (Direct)',
    distanceKm: 4.9,
    durationMin: 42,
    riskLevel: 'critical',
    isRecommended: false,
    floodExposureScore: 88,
    maxFloodDepthCm: 38,
    inundatedStreetsCount: 3,
    summary: 'Direct shortest path, but intersects Bazullah Road underpass with 38cm standing floodwater at 7m low basin. High probability of vehicle stall and submerged engine failure near Cooum link drain.',
    elevationGainMeters: 2,
    elevationProfile: [
      { distanceKm: 0.0, elevationM: 7, waterDepthCm: 0 },
      { distanceKm: 1.1, elevationM: 7, waterDepthCm: 6 },
      { distanceKm: 2.4, elevationM: 7, waterDepthCm: 22 },
      { distanceKm: 3.2, elevationM: 6.5, waterDepthCm: 38 },
      { distanceKm: 4.1, elevationM: 8, waterDepthCm: 26 },
      { distanceKm: 4.9, elevationM: 11, waterDepthCm: 5 }
    ],
    waypoints: [
      { x: 420, y: 380, name: 'T. Nagar Pondy Bazaar' },
      { x: 425, y: 390, name: 'Bazullah Road dip' },
      { x: 430, y: 375, name: 'Usman Road (Runoff)' },
      { x: 435, y: 360, name: 'Bazullah Underpass', hasHazard: true },
      { x: 438, y: 320, name: 'Cooum Culvert', hasHazard: true },
      { x: 440, y: 280, name: 'Nungambakkam' }
    ],
    hazards: [
      { location: 'Bazullah Road Underpass', depthCm: 38, severity: 'critical' },
      { location: 'Cooum Connector Nala overflow', depthCm: 26, severity: 'high' }
    ]
  },
  {
    id: 'route-c',
    name: 'Route C',
    routeName: 'via Velachery 100ft Road & Anna Nagar Link',
    distanceKm: 6.4,
    durationMin: 34,
    riskLevel: 'moderate',
    isRecommended: false,
    floodExposureScore: 44,
    maxFloodDepthCm: 18,
    inundatedStreetsCount: 1,
    summary: 'Moderate exposure. Avoids Bazullah underpass but experiences heavy curb runoff and water sheet near Velachery 6m low pocket and Anna Nagar 2nd Ave.',
    elevationGainMeters: 4,
    elevationProfile: [
      { distanceKm: 0.0, elevationM: 7, waterDepthCm: 0 },
      { distanceKm: 1.6, elevationM: 6, waterDepthCm: 4 },
      { distanceKm: 2.9, elevationM: 6, waterDepthCm: 10 },
      { distanceKm: 4.2, elevationM: 7, waterDepthCm: 18 },
      { distanceKm: 5.3, elevationM: 9, waterDepthCm: 8 },
      { distanceKm: 6.4, elevationM: 11, waterDepthCm: 3 }
    ],
    waypoints: [
      { x: 420, y: 380, name: 'T. Nagar' },
      { x: 380, y: 410, name: 'Velachery Link' },
      { x: 330, y: 400, name: 'Drivers Colony', hasHazard: true },
      { x: 300, y: 300, name: 'Anna Nagar 2nd Ave' },
      { x: 370, y: 290, name: 'Aminjikarai' },
      { x: 440, y: 280, name: 'Nungambakkam' }
    ],
    hazards: [
      { location: 'Velachery Drivers Colony curb', depthCm: 18, severity: 'moderate' }
    ]
  }
];
