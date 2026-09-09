import React from 'react';
import { Alert } from '../../types';
import { RiskBadge } from './RiskBadge';
import { Clock, MapPin, AlertCircle, ArrowUpRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface AlertCardProps {
  alert: Alert;
  onViewOnMap?: (zoneId: string) => void;
  onAcknowledge?: (id: string) => void;
  onResolve?: (id: string) => void;
  onEscalate?: (id: string) => void;
  isAuthorityView?: boolean;
  className?: string;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  alert,
  onViewOnMap,
  onAcknowledge,
  onResolve,
  onEscalate,
  isAuthorityView = false,
  className = ''
}) => {
  const borderColors = {
    critical: 'border-rose-500/30 hover:border-rose-500/60 bg-gradient-to-r from-rose-950/20 to-transparent',
    high: 'border-orange-500/30 hover:border-orange-500/60 bg-gradient-to-r from-orange-950/20 to-transparent',
    moderate: 'border-amber-500/30 hover:border-amber-500/60 bg-gradient-to-r from-amber-950/20 to-transparent',
    low: 'border-emerald-500/30 hover:border-emerald-500/60 bg-gradient-to-r from-emerald-950/20 to-transparent',
  }[alert.severity];

  const statusBadge = {
    active: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    acknowledged: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    escalated: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    resolved: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  }[alert.status];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-command-900/90 p-5 shadow-card-dark transition-all duration-200 ${borderColors} ${className}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <RiskBadge level={alert.severity} size="sm" />
          <span className="text-xs font-mono font-medium text-slate-400">
            {alert.code}
          </span>
          <span className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusBadge}`}>
            {alert.status}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span>{alert.timestamp}</span>
        </div>
      </div>

      <div className="mt-3">
        <h4 className="text-base font-bold text-slate-100 group-hover:text-cyan-300">
          {alert.title}
        </h4>
        <p className="mt-1 text-sm text-slate-300 leading-relaxed">
          {alert.description}
        </p>
      </div>

      {/* Details Bar */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 bg-command-950/60 p-2.5 rounded-lg border border-white/5">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
          <span className="font-semibold text-slate-200">{alert.zoneName}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span>Expected onset:</span>
          <span className="font-bold text-amber-300 font-mono">
            {alert.expectedOnsetMinutes > 0 ? `${alert.expectedOnsetMinutes} min` : 'Active Now'}
          </span>
        </div>
      </div>

      {/* Recommendation */}
      <div className="mt-3 flex items-start gap-2 rounded-lg bg-command-800/60 p-2.5 text-xs border border-white/5">
        <AlertCircle className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-cyan-300">Recommendation: </span>
          <span className="text-slate-300">{alert.recommendation}</span>
        </div>
      </div>

      {/* Affected Streets */}
      {alert.affectedStreets && alert.affectedStreets.length > 0 && (
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
          <span className="font-medium text-slate-400">Streets:</span>
          {alert.affectedStreets.map((st, i) => (
            <span
              key={i}
              className="rounded bg-command-800 px-2 py-0.5 text-slate-300 font-mono"
            >
              {st}
            </span>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
        {onViewOnMap && (
          <button
            onClick={() => onViewOnMap(alert.zoneId)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>View on Map</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        )}

        {isAuthorityView && alert.status !== 'resolved' && (
          <div className="flex items-center gap-2">
            {alert.status === 'active' && onAcknowledge && (
              <button
                onClick={() => onAcknowledge(alert.id)}
                className="inline-flex items-center gap-1 rounded-lg bg-command-750 hover:bg-command-700 px-3 py-1.5 text-xs font-medium text-amber-300 border border-amber-500/30 transition-colors"
              >
                <span>Acknowledge</span>
              </button>
            )}

            {onEscalate && alert.status !== 'escalated' && (
              <button
                onClick={() => onEscalate(alert.id)}
                className="inline-flex items-center gap-1 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 px-3 py-1.5 text-xs font-medium text-purple-300 border border-purple-500/40 transition-colors"
              >
                <ShieldAlert className="h-3 w-3" />
                <span>Escalate</span>
              </button>
            )}

            {onResolve && (
              <button
                onClick={() => onResolve(alert.id)}
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 px-3 py-1.5 text-xs font-medium text-emerald-300 border border-emerald-500/40 transition-colors"
              >
                <CheckCircle2 className="h-3 w-3" />
                <span>Resolve</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
