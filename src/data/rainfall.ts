import { RainfallNowcastPoint } from '../types';

// Chennai 0–3h nowcast (0-3h, 0-180 min) — DWR Chennai Doppler advection + 5×5m DEM 6–24m (6-24m) hydrodynamic routing
// Radar: DWR Chennai (real DEM 6–24m / 6-24m, Copernicus Bhuvan 10m proxy, center 13.06N 80.24E)
// Lead time window 0–180 minutes (0–3h / 0-3h), stormwater network 253 real CMWSSB mains + 760 inferred

export const chennaiRadarMetadata = {
  radar: 'DWR Chennai',
  dem: '5×5m Copernicus DEM 6–24m (Bhuvan 10m proxy)',
  demElevationRangeMeters: '6–24m',
  cmwssbNetwork: '253 real CMWSSB mains + 760 inferred hierarchical (800 manholes)',
  leadTimeWindow: '0–180 Minutes (0–3h)',
  center: { lat: 13.06, lng: 80.24 },
  nowcastMethod: 'Doppler precipitation advection + kinematic wave overland routing',
  sewerHierarchy: 'lateral/house -> branch -> main -> trunk -> outfall',
  timestamp: '19:42 IST (Lead Time: 0–3h)',
};

export const mockRainfallNowcast: RainfallNowcastPoint[] = [
  {
    timeOffsetMinutes: 0,
    label: 'NOW',
    timeString: '19:15',
    rainfallMmHr: 32,
    floodProbability: 46,
    riskLevel: 'moderate',
    criticalZonesCount: 2,
    highRiskZonesCount: 1,
    avgDepthCm: 11,
    radarEchoDbz: 41
  },
  {
    timeOffsetMinutes: 30,
    label: '+30 MIN',
    timeString: '19:45',
    rainfallMmHr: 56,
    floodProbability: 71,
    riskLevel: 'high',
    criticalZonesCount: 3,
    highRiskZonesCount: 2,
    avgDepthCm: 24,
    radarEchoDbz: 50
  },
  {
    timeOffsetMinutes: 60,
    label: '+60 MIN',
    timeString: '20:15',
    rainfallMmHr: 74,
    floodProbability: 89,
    riskLevel: 'critical',
    criticalZonesCount: 3,
    highRiskZonesCount: 3,
    avgDepthCm: 38,
    radarEchoDbz: 57
  },
  {
    timeOffsetMinutes: 90,
    label: '+90 MIN',
    timeString: '20:45',
    rainfallMmHr: 70,
    floodProbability: 86,
    riskLevel: 'critical',
    criticalZonesCount: 3,
    highRiskZonesCount: 3,
    avgDepthCm: 36,
    radarEchoDbz: 54
  },
  {
    timeOffsetMinutes: 120,
    label: '+120 MIN',
    timeString: '21:15',
    rainfallMmHr: 47,
    floodProbability: 67,
    riskLevel: 'high',
    criticalZonesCount: 2,
    highRiskZonesCount: 2,
    avgDepthCm: 26,
    radarEchoDbz: 46
  },
  {
    timeOffsetMinutes: 180,
    label: '+180 MIN',
    timeString: '22:15',
    rainfallMmHr: 26,
    floodProbability: 39,
    riskLevel: 'moderate',
    criticalZonesCount: 1,
    highRiskZonesCount: 1,
    avgDepthCm: 13,
    radarEchoDbz: 35
  }
];

export const hourlyRadarGrid = [
  { hour: '14:00', rainfall: 5, probability: 9 },
  { hour: '15:00', rainfall: 10, probability: 16 },
  { hour: '16:00', rainfall: 20, probability: 29 },
  // DWR Chennai real-time
  { hour: '17:00', rainfall: 29, probability: 40 },
  { hour: '18:00', rainfall: 42, probability: 58 },
  { hour: '19:00', rainfall: 62, probability: 80 },
  { hour: '20:00 (Proj)', rainfall: 74, probability: 89 },
  { hour: '21:00 (Proj)', rainfall: 50, probability: 71 },
  { hour: '22:00 (Proj)', rainfall: 24, probability: 36 },
];
