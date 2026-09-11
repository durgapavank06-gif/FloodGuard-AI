/** Typed client for the FloodGuard Chennai coupled-model Flask API. */
import { RainfallNowcastPoint, RiskLevel, Zone } from '../types';

export interface ApiNowcastResponse {
  mode: string;
  series: RainfallNowcastPoint[];
  radar?: string;
  method?: string;
}

export interface ApiZone extends Partial<Zone> {
  id: string;
  code: string;
  name: string;
  riskLevel: RiskLevel;
  floodProbability: number;
  expectedOnsetMinutes: number;
  estimatedDepthCm: number;
  rainfallMmPerHour: number;
  drainageUtilization: number;
  elevationMeters: number;
  depthTraceCm?: number[];
}

export interface LiveAlert {
  id: string;
  code: string;
  title: string;
  description: string;
  severity: RiskLevel;
  zoneId: string;
  zoneName: string;
  expectedOnsetMinutes: number | null;
  estimatedDepthCm?: number;
  recommendation: string;
  status: string;
  timestamp: string;
}

/** Client-side mirror of the backend alert rule (used for slider-driven sim zones). */
export const alertsFromZones = (zones: ApiZone[]): LiveAlert[] =>
  [...zones]
    .filter((z) => z.riskLevel === 'high' || z.riskLevel === 'critical')
    .sort((a, b) => (a.expectedOnsetMinutes >= 900 ? 9999 : a.expectedOnsetMinutes) - (b.expectedOnsetMinutes >= 900 ? 9999 : b.expectedOnsetMinutes))
    .map((z, i) => ({
      id: `alt-${z.id}`,
      code: `ALT-2026-${104 - i}`,
      title: `${z.riskLevel === 'critical' ? 'Severe ponding predicted' : 'Ponding warning'}: ${z.name}`,
      description: `Simulated: ${z.rainfallMmPerHour}mm/h, drainage ${z.drainageUtilization}% → ${z.estimatedDepthCm}cm ponding.`,
      severity: z.riskLevel,
      zoneId: z.id,
      zoneName: `${z.name} (${z.code})`,
      expectedOnsetMinutes: z.expectedOnsetMinutes >= 900 ? null : Math.round(z.expectedOnsetMinutes),
      estimatedDepthCm: z.estimatedDepthCm,
      recommendation: z.riskLevel === 'critical' ? 'Avoid underpasses, divert via flyovers; pre-deploy pumps.' : 'Avoid low dips; monitor inlets.',
      status: 'active',
      timestamp: 'sim',
    }));

export interface SafeRouteLeg {
  from: string;
  to: string;
  via: string;
  km: number;
  depthCm: number;
}

export interface SafeRouteOption {
  id: string;
  rank: number;
  recommended: boolean;
  distanceKm: number;
  durationMin: number;
  maxDepthCm: number;
  riskLevel: RiskLevel;
  floodExposureScore: number;
  legs: SafeRouteLeg[];
  summary: string;
}

export interface SafeRouteResponse {
  mode: string;
  origin: string;
  destination: string;
  depthsByZoneCm: Record<string, number>;
  avoidDepthCm: number;
  routes: SafeRouteOption[];
}

async function req<T>(base: string, path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${path} failed (${res.status}): ${text.slice(0, 200)}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  health: (base: string) => req(base, '/api/health'),
  nowcast: (base: string, mode: string) =>
    req<ApiNowcastResponse>(base, `/api/nowcast?mode=${mode}`),
  floodZones: (base: string, mode: string) =>
    req<{ mode: string; zones: ApiZone[] }>(base, `/api/flood/zones?mode=${mode}`),
  dashboard: (base: string, mode: string) =>
    req<{ mode: string; nowcast: RainfallNowcastPoint[]; zones: ApiZone[]; city: Record<string, number | null> }>(
      base,
      `/api/dashboard?mode=${mode}`
    ),
  simulate: (
    base: string,
    p: { rainfall_intensity: number; storm_duration: number; drainage_capacity_pct: number; mode: string; velocity_ms?: number }
  ) =>
    req<{ status: string; mode: string; zones: ApiZone[]; aggregates?: Record<string, number>; hydraulics?: Record<string, number | boolean | string[]>; message?: string }>(
      base,
      '/api/simulate',
      { method: 'POST', body: JSON.stringify(p) }
    ),
  hydraulics: (
    base: string,
    p: { rainfall_intensity: number; storm_duration: number; drainage_capacity_pct: number; mode: string }
  ) =>
    req<{ mode: string; result: { conduits: unknown[]; summary: Record<string, number | boolean | string[]> } }>(
      base,
      '/api/hydraulics/capacity',
      { method: 'POST', body: JSON.stringify(p) }
    ),
  safeRoute: (base: string, p: { origin: string; destination: string; mode: string; avoid_depth_cm?: number; alternatives?: number }) =>
    req<SafeRouteResponse>(base, '/api/routes/safe-route', {
      method: 'POST',
      body: JSON.stringify(p),
    }),
  alerts: (base: string, mode: string, velocity_ms?: number) =>
    req<{ mode: string; alerts: LiveAlert[] }>(
      base,
      `/api/alerts?mode=${mode}${velocity_ms !== undefined ? `&velocity_ms=${velocity_ms}` : ''}`
    ),
  drainageNetwork: (base: string) => req(base, '/api/drainage/network'),
  fullGraph: (base: string, mode: string, rainfallMmh?: number) =>
    req<{
      mode: string;
      counts: Record<string, number>;
      rainfall_by_zone: Record<string, number>;
      nodes: { id: string; x: number; y: number; type: string; zone: string; status: string; util: number }[];
      edges: { id: string; from: string; to: string; kind: string; zone: string; status: string; util: number; flow: number }[];
    }>(base, `/api/drainage/graph/full?mode=${mode}${rainfallMmh !== undefined ? `&rainfall_mmh=${Math.round(rainfallMmh)}` : ''}`),
};
