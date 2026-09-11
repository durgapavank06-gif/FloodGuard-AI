export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface Zone {
  id: string;
  code: string; // e.g. "Zone 14"
  name: string; // e.g. "T. Nagar & Bazullah Road"
  riskLevel: RiskLevel;
  floodProbability: number; // 0-100%
  expectedOnsetMinutes: number;
  estimatedDepthCm: number;
  rainfallMmPerHour: number;
  drainageUtilization: number; // 0-100%
  elevationMeters: number;
  surfaceRunoffPercent: number;
  populationAtRisk: number;
  coordinates: {
    lat: number;
    lng: number;
    svgX: number; // For interactive SVG map
    svgY: number;
  };
  polyPoints?: string;
  mainRiskFactors: string[];
  recommendedActions: string[];
  lastUpdated: string;
}

export interface Alert {
  id: string;
  code: string; // e.g. "ALT-2026-089"
  title: string;
  description: string;
  severity: RiskLevel;
  zoneId: string;
  zoneName: string;
  expectedOnsetMinutes: number;
  recommendation: string;
  status: 'active' | 'acknowledged' | 'escalated' | 'resolved';
  cause: string;
  prediction: string;
  timestamp: string;
  affectedStreets: string[];
}

export interface DrainageConduit {
  id: string;
  code: string; // e.g. "D-104"
  name: string;
  capacityPercent: number;
  status: 'normal' | 'near_limit' | 'critical' | 'surcharged';
  flowRateM3s: number;
  maxCapacityM3s: number;
  connectedRoadsCount: number;
  connectedRoads: string[];
  location: string;
  diameterMm: number;
  slopePercent: number;
  backflowRisk: boolean;
  coordinates: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
}

export interface RainfallNowcastPoint {
  timeOffsetMinutes: number; // 0, 30, 60, 90, 120, 180
  label: string; // "NOW", "+30 MIN", "+60 MIN", etc.
  timeString: string; // "19:15", "19:45", etc.
  rainfallMmHr: number;
  floodProbability: number;
  riskLevel: RiskLevel;
  criticalZonesCount: number;
  highRiskZonesCount: number;
  avgDepthCm: number;
  radarEchoDbz: number;
}

export interface RouteOption {
  id: string;
  name: string; // "Route A", "Route B", "Route C"
  routeName: string; // "via Inner Ring Rd", "via Sterling Road Flyover"
  distanceKm: number;
  durationMin: number;
  riskLevel: RiskLevel;
  isRecommended: boolean;
  floodExposureScore: number; // percentage
  maxFloodDepthCm: number;
  inundatedStreetsCount: number;
  summary: string;
  elevationGainMeters: number;
  waypoints: { x: number; y: number; name?: string; hasHazard?: boolean }[];
  elevationProfile: { distanceKm: number; elevationM: number; waterDepthCm: number }[];
  hazards: { location: string; depthCm: number; severity: RiskLevel }[];
}

export interface HistoricalFloodEvent {
  id: string;
  date: string;
  title: string;
  peakRainfallMm: number;
  durationHours: number;
  affectedZonesCount: number;
  maxDepthCm: number;
  economicImpact: string;
  description: string;
  severity: RiskLevel;
  pumpsDeployed: number;
}

export interface SimulationParams {
  rainfallIntensity: number; // 10 - 140 mm/hr
  forecastDuration: number; // 30 - 180 min
  drainageCapacity: number; // 20 - 100 %
  stormVelocityMs: number; // 0 - 12 m/s storm advection (NE)
  surfaceRunoff: 'low' | 'medium' | 'high';
  scenario: 'custom' | 'cloudburst_2020' | 'monsoon_surge' | 'drain_failure' | 'optimal_drainage';
}

export interface SimulationResults {
  criticalZones: number;
  highRiskZones: number;
  moderateZones: number;
  lowZones: number;
  affectedRoadsKm: number;
  populationExposed: number;
  maxFloodDepthCm: number;
  waterAccumulatedMl: number;
  pumpsRequired: number;
}
