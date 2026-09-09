import React from 'react';
import { RiskBadge } from './RiskBadge';
import { RiskLevel } from '../../types';
import { AlertTriangle, Clock, CloudRain, Droplets, ArrowRight } from 'lucide-react';

interface RiskCardProps {
  level: RiskLevel;
  probability: number;
  expectedOnsetMinutes: number;
  rainfallMmHr: number;
  locationName?: string;
  onViewMap?: () => void;
  className?: string;
}

export const RiskCard: React.FC<RiskCardProps> = ({
  level,
  probability,
  expectedOnsetMinutes,
  rainfallMmHr,
  locationName = 'Hyderabad (Zone 14 - Begumpet Catchment)',
  onViewMap,
  className = ''
}) => {
  const gradientTheme = {
    critical: 'from-rose-950/40 via-command-900 to-command-900 border-rose-500/40 glow-red',
    high: 'from-orange-950/40 via-command-900 to-command-900 border-orange-500/40 glow-orange',
    moderate: 'from-amber-950/40 via-command-900 to-command-900 border-amber-500/40 glow-yellow',
    low: 'from-emerald-950/40 via-command-900 to-command-900 border-emerald-500/40 glow-green',
  }[level];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 backdrop-blur-xl shadow-2xl transition-all ${gradientTheme} ${className}`}
    >
      {/* Background radar concentric rings decoration */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border border-white/5 opacity-40" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/5 opacity-20" />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              Live Street-Level Sensor Nowcast
            </div>
            <h3 className="mt-1 text-xl font-bold text-white">Your Current Flood Risk</h3>
            <p className="text-xs text-slate-300 mt-0.5">{locationName}</p>
          </div>

          <RiskBadge level={level} size="lg" />
        </div>

        {/* Metrics Grid */}
        <div className="mt-6 grid grid-cols-3 gap-3 rounded-xl bg-command-950/70 p-4 border border-white/5">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <Droplets className="h-3.5 w-3.5 text-cyan-400" />
              Probability
            </span>
            <span className="mt-1.5 text-2xl font-bold font-mono text-white">
              {probability}%
            </span>
            <span className="text-[10px] text-slate-400">Coupled Model</span>
          </div>

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left border-x border-white/10 px-2 sm:px-4">
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <Clock className="h-3.5 w-3.5 text-amber-400" />
              Expected Onset
            </span>
            <span className="mt-1.5 text-2xl font-bold font-mono text-amber-300">
              {expectedOnsetMinutes} <span className="text-sm font-sans font-normal text-slate-400">min</span>
            </span>
            <span className="text-[10px] text-slate-400">0-3hr lead time</span>
          </div>

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <CloudRain className="h-3.5 w-3.5 text-blue-400" />
              Rainfall
            </span>
            <span className="mt-1.5 text-2xl font-bold font-mono text-cyan-300">
              {rainfallMmHr} <span className="text-sm font-sans font-normal text-slate-400">mm/h</span>
            </span>
            <span className="text-[10px] text-slate-400">Doppler Radar</span>
          </div>
        </div>

        {/* Action button */}
        {onViewMap && (
          <div className="mt-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <AlertTriangle className="h-4 w-4 text-orange-400" />
              <span>Drainage surcharge active in this catchment</span>
            </div>
            <button
              onClick={onViewMap}
              className="group inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-600/30 transition-all hover:bg-cyan-500 hover:shadow-cyan-500/50"
            >
              <span>View Risk Map</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
