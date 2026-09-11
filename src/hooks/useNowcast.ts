import { useEffect, useState } from 'react';
import { RainfallNowcastPoint } from '../types';
import { mockRainfallNowcast } from '../data/rainfall';
import { useDataMode } from '../context/DataModeContext';
import { api } from '../services/api';

interface NowcastState {
  series: RainfallNowcastPoint[];
  loading: boolean;
  error: string | null;
  isLive: boolean;
  refetch: () => void;
}

/** Returns the 0–3h nowcast series: live API in REAL mode, static profile in FAKE. */
export const useNowcast = (): NowcastState => {
  const { mode, apiUrl } = useDataMode();
  const [series, setSeries] = useState<RainfallNowcastPoint[]>(mockRainfallNowcast);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (mode === 'fake') {
      setSeries(mockRainfallNowcast);
      setError(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .nowcast(apiUrl, mode)
      .then((res) => {
        if (!cancelled && res.series?.length) setSeries(res.series);
      })
      .catch((e: Error) => {
        if (!cancelled) {
          // Graceful fallback: keep demo curve but flag the outage.
          setSeries(mockRainfallNowcast);
          setError(`Live nowcast unreachable (${e.message}). Showing demo profile.`);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [mode, apiUrl, tick]);

  return {
    series,
    loading,
    error,
    isLive: mode === 'real' && !error,
    refetch: () => setTick((t) => t + 1),
  };
};
