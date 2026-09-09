import React from 'react';
import { DrainageConduit } from '../../types';
import { GitBranch, AlertTriangle, ArrowUpRight, CheckCircle2, ShieldAlert } from 'lucide-react';

interface DrainageCardProps {
  conduit: DrainageConduit;
  onInspect?: (id: string) => void;
  className?: string;
}

export const DrainageCard: React.FC<DrainageCardProps> = ({
  conduit,
  onInspect,
  className = ''
}) => {
  const statusConfig = {
    surcharged: {
      badge: 'bg-rose-950 text-rose-300 border-rose-500/50',
      label: 'SURCHARGED / BACKFLOW',
      icon: ShieldAlert,
      barColor: 'bg-rose-500',
      glow: 'glow-red',
    },
    critical: {
      badge: 'bg-rose-950/80 text-rose-400 border-rose-500/40',
      label: 'CRITICAL CAPACITY',
      icon: AlertTriangle,
      barColor: 'bg-rose-500',
      glow: 'glow-red',
    },
    near_limit: {
      badge: 'bg-amber-950 text-amber-300 border-amber-500/50',
      label: 'NEAR LIMIT',
      icon: AlertTriangle,
      barColor: 'bg-amber-500',
      glow: 'glow-yellow',
    },
    normal: {
      badge: 'bg-emerald-950 text-emerald-300 border-emerald-500/40',
      label: 'NORMAL CAPACITY',
      icon: CheckCircle2,
      barColor: 'bg-emerald-500',
      glow: '',
    },
  }[conduit.status];

  const StatusIcon = statusConfig.icon;

  return (
    <div
      className={`rounded-xl border border-white/10 bg-command-900/90 p-4 backdrop-blur-md shadow-card-dark transition-all hover:border-cyan-500/40 ${statusConfig.glow} ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-cyan-400">
              {conduit.code}
            </span>
            <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold border ${statusConfig.badge}`}>
              <StatusIcon className="h-3 w-3" />
              {statusConfig.label}
            </span>
          </div>
          <h4 className="mt-1 text-sm font-bold text-white">{conduit.name}</h4>
          <p className="text-[11px] text-slate-400">{conduit.location}</p>
        </div>

        <div className="text-right">
          <span className="font-mono text-xl font-bold text-white">
            {conduit.capacityPercent}%
          </span>
          <p className="text-[10px] text-slate-400">Capacity Used</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 w-full bg-command-950 h-2 rounded-full overflow-hidden p-0.5 border border-white/5">
        <div
          className={`h-full rounded-full transition-all duration-300 ${statusConfig.barColor}`}
          style={{ width: `${Math.min(conduit.capacityPercent, 100)}%` }}
        />
      </div>

      {/* Flow rate & Connected Roads */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-command-950/60 p-2 rounded-lg border border-white/5 font-mono">
        <div>
          <span className="text-slate-400 text-[10px]">Flow Rate:</span>
          <p className="font-bold text-cyan-300">
            {conduit.flowRateM3s} <span className="text-[10px] text-slate-400">m³/s</span>
          </p>
        </div>
        <div>
          <span className="text-slate-400 text-[10px]">Connected Roads:</span>
          <p className="font-bold text-slate-200">{conduit.connectedRoadsCount} arterials</p>
        </div>
      </div>

      {/* Connected Road tags */}
      <div className="mt-2 flex flex-wrap gap-1">
        {conduit.connectedRoads.slice(0, 3).map((rd, i) => (
          <span
            key={i}
            className="rounded bg-command-800 px-1.5 py-0.5 text-[10px] text-slate-300 font-mono"
          >
            {rd}
          </span>
        ))}
        {conduit.connectedRoads.length > 3 && (
          <span className="rounded bg-command-800 px-1.5 py-0.5 text-[10px] text-slate-400 font-mono">
            +{conduit.connectedRoads.length - 3} more
          </span>
        )}
      </div>

      {/* Conduit Specifications */}
      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
        <span>Dia: {conduit.diameterMm}mm • Slope: {conduit.slopePercent}%</span>
        {onInspect && (
          <button
            onClick={() => onInspect(conduit.id)}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
          >
            <span>Telemetry</span>
            <ArrowUpRight className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
};
