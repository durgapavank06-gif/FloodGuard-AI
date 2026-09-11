import { Zone } from '../types';
import { ApiZone } from '../services/api';
import { mockZones } from '../data/zones';

/**
 * Overlay live coupled-model metrics onto the static map geometry.
 * Geometry (polygons, SVG anchors) always comes from the mock inventory;
 * risk metrics come from the Flask API when available.
 */
export const mergeLiveZones = (live: ApiZone[] | null | undefined): Zone[] => {
  if (!live || live.length === 0) return mockZones;
  const byId = new Map(live.map((z) => [z.id, z]));
  return mockZones.map((m) => {
    const l = byId.get(m.id);
    if (!l) return m;
    return {
      ...m,
      riskLevel: l.riskLevel,
      floodProbability: Math.round(l.floodProbability),
      estimatedDepthCm: Math.round(l.estimatedDepthCm * 10) / 10,
      rainfallMmPerHour: l.rainfallMmPerHour ?? m.rainfallMmPerHour,
      drainageUtilization: l.drainageUtilization ?? m.drainageUtilization,
      expectedOnsetMinutes:
        l.expectedOnsetMinutes >= 900 ? 999 : Math.round(l.expectedOnsetMinutes),
      lastUpdated: 'live coupled model',
    };
  });
};
