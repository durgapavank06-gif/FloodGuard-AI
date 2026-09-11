import React from 'react';
import { Cpu, Play, Loader2 } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { useDataMode } from '../../context/DataModeContext';
import { useLiveSimulation } from '../../hooks/useLiveSimulation';
import { ApiZone } from '../../services/api';
import { RiskBadge } from '../common/RiskBadge';

interface LiveSimulationPanelProps {
  /** Shared auto-solving state from the parent (map + panel stay in sync). */
  live?: {
    zones: ApiZone[] | null;
    aggregates: Record<string, number> | null;
    running: boolean;
    error: string | null;
  };
  onRun?: () => void;
}

/**
 * Live coupled-model results (POST /api/simulate). Hidden in FAKE mode —
 * FAKE keeps the instant client-side stress math in SimulationContext.
 */
export const LiveSimulationPanel: React.FC<LiveSimulationPanelProps> = ({ live, onRun }) => {
  const { params } = useSimulation();
  const { mode } = useDataMode();
  const internal = useLiveSimulation(params, { auto: false });

  if (mode === 'fake') return null;

  const zones = live?.zones ?? internal.zones;
  const aggregates = live?.aggregates ?? internal.aggregates;
  const running = live?.running ?? internal.running;
  const error = live?.error ?? internal.error;
  const handleRun = onRun ?? (() => internal.runLive(params));

  return (
    <div className="rounded-2xl border border-cyan-500/25 bg-cyan-950/20 p-4 shadow-card-dark">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
            Live Coupled-Model Run — {params.rainfallIntensity} mm/h, {params.forecastDuration} min, {params.drainageCapacity}% drainage
          </h3>
        </div>
        <button
          onClick={handleRun}
          disabled={running}
          className="flex items-center gap-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-60 px-4 py-2 text-xs font-bold text-white transition-colors"
        >
          {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
          <span>{running ? 'Solving…' : 'Run Live Simulation'}</span>
        </button>
      </div>

      {error && <p className="mt-3 text-xs text-rose-400 font-mono">{error}. Is the Flask API running on :5000?</p>}

      {aggregates && (
        <div className="mt-3 grid grid-cols-3 gap-2 text-center font-mono">
          <div className="rounded-xl bg-command-950/80 border border-white/5 p-2.5">
            <span className="text-[10px] text-slate-400 block font-sans">Critical Zones</span>
            <span className="text-lg font-bold text-rose-400">{aggregates.criticalZones}</span>
          </div>
          <div className="rounded-xl bg-command-950/80 border border-white/5 p-2.5">
            <span className="text-[10px] text-slate-400 block font-sans">Max Depth</span>
            <span className="text-lg font-bold text-orange-300">{aggregates.maxFloodDepthCm}<span className="text-[10px]"> cm</span></span>
          </div>
          <div className="rounded-xl bg-command-950/80 border border-white/5 p-2.5">
            <span className="text-[10px] text-slate-400 block font-sans">Overflow Vol</span>
            <span className="text-lg font-bold text-cyan-300">{aggregates.totalOverflowM3}<span className="text-[10px]"> m³</span></span>
          </div>
        </div>
      )}

      {zones && (
        <div className="mt-3 space-y-1.5">
          {zones.map((z) => (
            <div key={z.id} className="flex items-center justify-between gap-2 rounded-lg bg-command-950/80 border border-white/5 px-3 py-1.5 text-xs">
              <span className="font-mono font-bold text-white">{z.code}</span>
              <span className="flex-1 truncate text-slate-400">{z.name}</span>
              <RiskBadge level={z.riskLevel} size="sm" />
              <span className="font-mono text-cyan-300">{Math.round(z.estimatedDepthCm)}cm</span>
              <span className="font-mono text-slate-400">{Math.round(z.floodProbability)}%</span>
            </div>
          ))}
        </div>
      )}

      {!zones && !error && (
        <p className="mt-3 text-[11px] text-slate-400">
          Solves Manning capacity + Rational inflow + diffusive-wave DEM routing per zone (Q=(1/n)·A·R<sup>2/3</sup>·S<sup>1/2</sup>, Q=C·i·A).
        </p>
      )}
    </div>
  );
};
