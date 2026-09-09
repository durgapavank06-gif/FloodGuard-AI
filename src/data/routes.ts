import { RouteOption } from '../types';

export const mockRouteOrigins = [
  'Hitec City Cyber Towers',
  'Gachibowli Financial District',
  'Madhapur Metro Station',
  'Jubilee Hills Road No. 36',
  'Kukatpally Housing Board (KPHB)'
];

export const mockRouteDestinations = [
  'Secunderabad Junction Railway Station',
  'Banjara Hills Care Hospital',
  'Nampally Railway Station',
  'Begumpet Airport Plaza',
  'Raj Bhavan Hyderabad'
];

export const mockRouteComparison: RouteOption[] = [
  {
    id: 'route-b',
    name: 'Route B',
    routeName: 'via Jubilee Hills Ridge & Panjagutta Elevated Flyover',
    distanceKm: 6.1,
    durationMin: 22,
    riskLevel: 'low',
    isRecommended: true,
    floodExposureScore: 4,
    maxFloodDepthCm: 3,
    inundatedStreetsCount: 0,
    summary: 'Route B is slightly longer (+0.9 km) but has significantly lower flood exposure. Uses high-elevation arterial ridge and grade-separated flyovers avoiding all flooded underpasses.',
    elevationGainMeters: 48,
    elevationProfile: [
      { distanceKm: 0.0, elevationM: 554, waterDepthCm: 0 },
      { distanceKm: 1.2, elevationM: 572, waterDepthCm: 0 },
      { distanceKm: 2.5, elevationM: 582, waterDepthCm: 2 },
      { distanceKm: 3.8, elevationM: 565, waterDepthCm: 1 },
      { distanceKm: 4.9, elevationM: 540, waterDepthCm: 3 },
      { distanceKm: 6.1, elevationM: 512, waterDepthCm: 1 }
    ],
    waypoints: [
      { x: 200, y: 260, name: 'Hitec City' },
      { x: 290, y: 300, name: 'Jubilee Hills Checkpost (Elevated)' },
      { x: 370, y: 310, name: 'Road No. 1 Banjara Hills' },
      { x: 440, y: 305, name: 'Panjagutta Flyover (Grade-Separated)' },
      { x: 520, y: 275, name: 'Penderghast Road' },
      { x: 590, y: 260, name: 'Secunderabad Stn (North Gate)' }
    ],
    hazards: []
  },
  {
    id: 'route-a',
    name: 'Route A',
    routeName: 'via Sardar Patel Rd & Begumpet Railway Subway',
    distanceKm: 5.2,
    durationMin: 45,
    riskLevel: 'critical',
    isRecommended: false,
    floodExposureScore: 89,
    maxFloodDepthCm: 42,
    inundatedStreetsCount: 3,
    summary: 'Direct shortest path, but intersects Begumpet underpass with 42cm standing floodwater. High probability of vehicle stall and submerged engine failure.',
    elevationGainMeters: 12,
    elevationProfile: [
      { distanceKm: 0.0, elevationM: 554, waterDepthCm: 0 },
      { distanceKm: 1.5, elevationM: 535, waterDepthCm: 4 },
      { distanceKm: 2.8, elevationM: 518, waterDepthCm: 18 },
      { distanceKm: 3.9, elevationM: 498, waterDepthCm: 42 },
      { distanceKm: 4.6, elevationM: 504, waterDepthCm: 28 },
      { distanceKm: 5.2, elevationM: 512, waterDepthCm: 6 }
    ],
    waypoints: [
      { x: 200, y: 260, name: 'Hitec City' },
      { x: 280, y: 255, name: 'Madhapur 100ft Rd' },
      { x: 410, y: 270, name: 'Ameerpet Junction (Runoff)' },
      { x: 470, y: 260, name: 'Begumpet Underpass', hasHazard: true },
      { x: 530, y: 260, name: 'Prakash Nagar Culvert', hasHazard: true },
      { x: 590, y: 260, name: 'Secunderabad Stn' }
    ],
    hazards: [
      { location: 'Begumpet Railway Subway', depthCm: 42, severity: 'critical' },
      { location: 'Prakash Nagar Box Drain Overflow', depthCm: 28, severity: 'high' }
    ]
  },
  {
    id: 'route-c',
    name: 'Route C',
    routeName: 'via Sanath Nagar & Fateh Nagar Bridge',
    distanceKm: 5.8,
    durationMin: 32,
    riskLevel: 'moderate',
    isRecommended: false,
    floodExposureScore: 42,
    maxFloodDepthCm: 16,
    inundatedStreetsCount: 1,
    summary: 'Moderate exposure. Avoids Begumpet underpass but experiences heavy curb runoff and slow water sheet near industrial rail siding.',
    elevationGainMeters: 22,
    elevationProfile: [
      { distanceKm: 0.0, elevationM: 554, waterDepthCm: 0 },
      { distanceKm: 1.8, elevationM: 538, waterDepthCm: 2 },
      { distanceKm: 3.2, elevationM: 522, waterDepthCm: 8 },
      { distanceKm: 4.4, elevationM: 508, waterDepthCm: 16 },
      { distanceKm: 5.8, elevationM: 512, waterDepthCm: 4 }
    ],
    waypoints: [
      { x: 200, y: 260, name: 'Hitec City' },
      { x: 310, y: 220, name: 'Borabanda Link' },
      { x: 420, y: 210, name: 'Sanath Nagar Industrial' },
      { x: 510, y: 225, name: 'Fateh Nagar Bridge', hasHazard: true },
      { x: 590, y: 260, name: 'Secunderabad Stn' }
    ],
    hazards: [
      { location: 'Fateh Nagar Bridge approach curb', depthCm: 16, severity: 'moderate' }
    ]
  }
];
