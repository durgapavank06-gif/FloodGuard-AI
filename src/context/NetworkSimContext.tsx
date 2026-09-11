import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { mockDrainageConduits } from '../data/drainage';
import { mockRainfallNowcast } from '../data/rainfall';
import { useDataMode } from './DataModeContext';
import { useApp } from './AppContext';
import { api } from '../services/api';

export type ConduitStatus = 'normal' | 'near_limit' | 'critical' | 'surcharged';

export interface SimConduitState {
  status: ConduitStatus;
  util: number; // capacity fraction (can exceed 1)
  flow: number; // m3/s
}

/** Backend thresholds (capacity_calculator.py): >=1.15 surcharged, >=1.0 critical, >=0.8 near_limit. */
export const statusForUtil = (util: number): ConduitStatus =>
  util >= 1.15 ? 'surcharged' : util >= 1.0 ? 'critical' : util >= 0.8 ? 'near_limit' : 'normal';

interface NetworkSimContextType {
  intensity: number; // rainfall mm/hr slider
  velocity: number; // storm advection multiplier slider
  setIntensity: (v: number) => void;
  setVelocity: (v: number) => void;
  effectiveRain: number; // rainfall actually sent to hydraulics
  conduits: Record<string, SimConduitState>;
  rainNow: number;
  loading: boolean;
  refetch: () => void;
}

const NetworkSimContext = createContext<NetworkSimContextType | undefined>(undefined);

export const NetworkSimProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { mode, apiUrl } = useDataMode();
  const { addToast } = useApp();
  const [intensity, setIntensity] = useState(72);
  const [velocity, setVelocity] = useState(1.0);
  const [conduits, setConduits] = useState<Record<string, SimConduitState>>({});
  const [rainNow, setRainNow] = useState<number>(mockRainfallNowcast[0].rainfallMmHr);
  const [loading, setLoading] = useState(false);
  const [tick, setTick] = useState(0);
  const abortRef = useRef(0);

  // Storm-advection factor: faster-moving cells raise the Rational-Method peak
  // for the same gauge intensity. Neutral at velocity 1.0x.
  const effectiveRain = intensity * (0.5 + 0.5 * velocity);

  useEffect(() => {
    if (mode === 'fake') {
      // Offline: util scales linearly with rainfall (Rational Q=CiA, fixed capacity)
      const base = effectiveRain / 68;
      const map: Record<string, SimConduitState> = {};
      for (const c of mockDrainageConduits) {
        const util = (c.capacityPercent / 100) * base;
        map[c.id] = { status: statusForUtil(util), util, flow: c.flowRateM3s * base };
      }
      setConduits(map);
      setRainNow(Math.round(effectiveRain));
      return;
    }
    // Real: debounced live Manning+ Rational solve so dragging stays smooth
    const myRun = ++abortRef.current;
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const hyd = await api.hydraulics(apiUrl, {
          rainfall_intensity: Math.round(effectiveRain),
          storm_duration: 60,
          drainage_capacity_pct: 75,
          mode: 'real',
        });
        if (abortRef.current !== myRun) return;
        const map: Record<string, SimConduitState> = {};
        for (const c of hyd.result.conduits as { id: string; status: ConduitStatus; capacityPercent: number; flowRateM3s: number }[]) {
          map[c.id] = { status: c.status, util: c.capacityPercent / 100, flow: c.flowRateM3s };
        }
        setConduits(map);
        setRainNow(Math.round(effectiveRain));
      } catch (err) {
        if (abortRef.current !== myRun) return;
        addToast('Flow sim offline', `Live hydraulics unreachable (${err}).`, 'warning');
        setConduits({});
      } finally {
        if (abortRef.current === myRun) setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, apiUrl, tick, effectiveRain]);

  const refetch = () => setTick((t) => t + 1);

  return (
    <NetworkSimContext.Provider
      value={{ intensity, velocity, setIntensity, setVelocity, effectiveRain, conduits, rainNow, loading, refetch }}
    >
      {children}
    </NetworkSimContext.Provider>
  );
};

export const useNetworkSim = () => {
  const ctx = useContext(NetworkSimContext);
  if (!ctx) throw new Error('useNetworkSim must be used within a NetworkSimProvider');
  return ctx;
};
