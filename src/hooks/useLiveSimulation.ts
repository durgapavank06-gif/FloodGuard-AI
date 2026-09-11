import { useCallback, useEffect, useRef, useState } from 'react';
import { SimulationParams } from '../types';
import { useDataMode } from '../context/DataModeContext';
import { api, ApiZone } from '../services/api';

interface LiveSimState {
  zones: ApiZone[] | null;
  aggregates: Record<string, number> | null;
  running: boolean;
  error: string | null;
  isLive: boolean;
  /** True after the first solve attempt finished (success or fail). */
  attempted: boolean;
  runLive: (p: SimulationParams) => Promise<void>;
}

/**
 * Shared live-simulation state (POST /api/simulate).
 * With { auto: true } it re-solves (debounced) whenever the slider params
 * change — used by the simulation inundation map. Manual callers (panel
 * button) use { auto: false } and invoke runLive themselves.
 */
export const useLiveSimulation = (
  params: SimulationParams,
  opts?: { auto?: boolean; debounceMs?: number }
): LiveSimState => {
  const { mode, apiUrl } = useDataMode();
  const [zones, setZones] = useState<ApiZone[] | null>(null);
  const [aggregates, setAggregates] = useState<Record<string, number> | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempted, setAttempted] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstRun = useRef(true);

  const runLive = useCallback(
    async (p: SimulationParams) => {
      setRunning(true);
      setError(null);
      try {
        const res = await api.simulate(apiUrl, {
          rainfall_intensity: p.rainfallIntensity,
          storm_duration: p.forecastDuration,
          drainage_capacity_pct: p.drainageCapacity,
          mode: 'real',
        });
        setZones(res.zones || []);
        setAggregates((res.aggregates || {}) as Record<string, number>);
      } catch (e) {
        setError(String(e));
        setZones(null);
      } finally {
        setRunning(false);
        setAttempted(true);
      }
    },
    [apiUrl]
  );

  const { rainfallIntensity, forecastDuration, drainageCapacity, surfaceRunoff, scenario } = params;
  const auto = opts?.auto ?? false;
  const debounceMs = opts?.debounceMs ?? 800;

  useEffect(() => {
    if (mode === 'fake' || !auto) {
      if (mode === 'fake') {
        setZones(null);
        setAggregates(null);
        setError(null);
        setAttempted(false);
        firstRun.current = true;
      }
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    // Solve immediately on mount; debounce subsequent slider drags.
    const delay = firstRun.current ? 0 : debounceMs;
    firstRun.current = false;
    if (delay === 0) {
      runLive({ rainfallIntensity, forecastDuration, drainageCapacity, surfaceRunoff, scenario });
      return;
    }
    timer.current = setTimeout(() => {
      runLive({ rainfallIntensity, forecastDuration, drainageCapacity, surfaceRunoff, scenario });
    }, delay);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, apiUrl, auto, debounceMs, rainfallIntensity, forecastDuration, drainageCapacity, surfaceRunoff]);

  return { zones, aggregates, running, error, isLive: mode === 'real', attempted, runLive };
};
