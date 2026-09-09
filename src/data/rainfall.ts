import { RainfallNowcastPoint } from '../types';

export const mockRainfallNowcast: RainfallNowcastPoint[] = [
  {
    timeOffsetMinutes: 0,
    label: 'NOW',
    timeString: '19:15',
    rainfallMmHr: 34,
    floodProbability: 48,
    riskLevel: 'moderate',
    criticalZonesCount: 4,
    highRiskZonesCount: 16,
    avgDepthCm: 12,
    radarEchoDbz: 42
  },
  {
    timeOffsetMinutes: 30,
    label: '+30 MIN',
    timeString: '19:45',
    rainfallMmHr: 58,
    floodProbability: 72,
    riskLevel: 'high',
    criticalZonesCount: 9,
    highRiskZonesCount: 24,
    avgDepthCm: 26,
    radarEchoDbz: 51
  },
  {
    timeOffsetMinutes: 60,
    label: '+60 MIN',
    timeString: '20:15',
    rainfallMmHr: 76,
    floodProbability: 92,
    riskLevel: 'critical',
    criticalZonesCount: 14,
    highRiskZonesCount: 32,
    avgDepthCm: 44,
    radarEchoDbz: 58
  },
  {
    timeOffsetMinutes: 90,
    label: '+90 MIN',
    timeString: '20:45',
    rainfallMmHr: 72,
    floodProbability: 88,
    riskLevel: 'critical',
    criticalZonesCount: 13,
    highRiskZonesCount: 29,
    avgDepthCm: 41,
    radarEchoDbz: 55
  },
  {
    timeOffsetMinutes: 120,
    label: '+120 MIN',
    timeString: '21:15',
    rainfallMmHr: 49,
    floodProbability: 69,
    riskLevel: 'high',
    criticalZonesCount: 8,
    highRiskZonesCount: 21,
    avgDepthCm: 28,
    radarEchoDbz: 47
  },
  {
    timeOffsetMinutes: 180,
    label: '+180 MIN',
    timeString: '22:15',
    rainfallMmHr: 28,
    floodProbability: 41,
    riskLevel: 'moderate',
    criticalZonesCount: 3,
    highRiskZonesCount: 12,
    avgDepthCm: 14,
    radarEchoDbz: 36
  }
];

export const hourlyRadarGrid = [
  { hour: '14:00', rainfall: 6, probability: 10 },
  { hour: '15:00', rainfall: 12, probability: 18 },
  { hour: '16:00', rainfall: 22, probability: 31 },
  { hour: '17:00', rainfall: 31, probability: 42 },
  { hour: '18:00', rainfall: 44, probability: 60 },
  { hour: '19:00', rainfall: 65, probability: 82 },
  { hour: '20:00 (Proj)', rainfall: 78, probability: 94 },
  { hour: '21:00 (Proj)', rainfall: 52, probability: 73 },
  { hour: '22:00 (Proj)', rainfall: 25, probability: 38 },
];
