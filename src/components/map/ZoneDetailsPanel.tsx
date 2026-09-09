import React from 'react';
import { Zone } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import {
  X,
  Droplets,
  Clock,
  Waves,
  CloudRain,
  GitBranch,
  Mountain,
  Users,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Send,
  CheckCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ZoneDetailsPanelProps {
  zone: Zone | null;
  onClose: () => void;
  isAuthority?: boolean;
}

export const ZoneDetailsPanel: React.FC<ZoneDetailsPanelProps> = ({
  zone,
  onClose,
  isAuthority = false
}) => {
  const { navigate, setIsReportModalOpen, addToast } = useApp();

  if (!zone) return null;

  const handleDispatchCrews = () => {
    addToast(
      'Action Dispatched',
      `Emergency pumps and road marshals deployed to ${zone.code} (${zone.name}).`,
      'success'
    );
  };

  const handleIssueWarning = () => {
    addToast(
      'Community Warning Issued',
      `CAP emergency SMS broadcast sent to ${zone.populationAtRisk.toLocaleString()} citizens in ${zone.code}.`,
      'warning'
    );
  };

  return (
    <div className="flex flex-col h-full bg-command-900 border-l border-white/10 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-start justify-between border-b border-white/10 bg-command-950/90 p-4 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400">
              {zone.code}
            </span>
            <RiskBadge level={zone.riskLevel} size="sm" />
          </div>
          <h3 className="mt-1 text-base font-bold text-white leading-tight">
            {zone.name}
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Elevation: {zone.elevationMeters}m MSL • Updated {zone.lastUpdated}
          </p>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-command-800 hover:text-white transition-colors"
          title="Close Panel"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-4 space-y-4 flex-1">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-xl bg-command-950/80 p-3 border border-white/5">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Droplets className="h-3.5 w-3.5 text-cyan-400" />
              <span>Flood Probability</span>
            </div>
            <div className="mt-1.5 text-xl font-bold font-mono text-white">
              {zone.floodProbability}%
            </div>
            <div className="w-full bg-command-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  zone.floodProbability > 80 ? 'bg-rose-500' : zone.floodProbability > 60 ? 'bg-orange-500' : 'bg-amber-500'
                }`}
                style={{ width: `${zone.floodProbability}%` }}
              />
            </div>
          </div>

          <div className="rounded-xl bg-command-950/80 p-3 border border-white/5">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="h-3.5 w-3.5 text-amber-400" />
              <span>Expected Onset</span>
            </div>
            <div className="mt-1.5 text-xl font-bold font-mono text-amber-300">
              {zone.expectedOnsetMinutes} <span className="text-xs text-slate-400 font-sans font-normal">min</span>
            </div>
            <span className="text-[10px] text-slate-400">0-3hr lead window</span>
          </div>

          <div className="rounded-xl bg-command-950/80 p-3 border border-white/5">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Waves className="h-3.5 w-3.5 text-blue-400" />
              <span>Estimated Depth</span>
            </div>
            <div className="mt-1.5 text-xl font-bold font-mono text-cyan-300">
              {zone.estimatedDepthCm} <span className="text-xs text-slate-400 font-sans font-normal">cm</span>
            </div>
            <span className="text-[10px] text-slate-400">Surface water level</span>
          </div>

          <div className="rounded-xl bg-command-950/80 p-3 border border-white/5">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <CloudRain className="h-3.5 w-3.5 text-indigo-400" />
              <span>Rainfall</span>
            </div>
            <div className="mt-1.5 text-xl font-bold font-mono text-white">
              {zone.rainfallMmPerHour} <span className="text-xs text-slate-400 font-sans font-normal">mm/h</span>
            </div>
            <span className="text-[10px] text-slate-400">Radar nowcast</span>
          </div>
        </div>

        {/* Drainage & Terrain Stats */}
        <div className="rounded-xl bg-command-950/80 p-3.5 border border-white/5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-400">
              <GitBranch className="h-3.5 w-3.5 text-purple-400" />
              Drainage Utilization
            </span>
            <span className="font-mono font-bold text-white">
              {zone.drainageUtilization}%
            </span>
          </div>
          <div className="w-full bg-command-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                zone.drainageUtilization > 85 ? 'bg-rose-500' : zone.drainageUtilization > 70 ? 'bg-orange-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${zone.drainageUtilization}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-xs">
            <div>
              <span className="text-slate-400 text-[11px]">Surface Runoff:</span>
              <span className="ml-1 font-mono font-semibold text-slate-200">{zone.surfaceRunoffPercent}%</span>
            </div>
            {isAuthority && (
              <div>
                <span className="text-slate-400 text-[11px]">Population at Risk:</span>
                <span className="ml-1 font-mono font-semibold text-slate-200">{zone.populationAtRisk.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Risk Factors */}
        <div className="rounded-xl bg-command-950/60 p-3.5 border border-white/5">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
            Main Risk Factors
          </h4>
          <ul className="space-y-1.5">
            {zone.mainRiskFactors.map((factor, index) => (
              <li key={index} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Actions */}
        <div className="rounded-xl bg-command-950/60 p-3.5 border border-white/5">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-cyan-400" />
            Recommended Actions
          </h4>
          <ul className="space-y-1.5">
            {zone.recommendedActions.map((action, index) => (
              <li key={index} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Buttons at bottom */}
      <div className="sticky bottom-0 border-t border-white/10 bg-command-950 p-4 space-y-2">
        {!isAuthority ? (
          <>
            <button
              onClick={() => navigate('/citizen/routes')}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 py-2.5 text-xs font-semibold text-white shadow-lg transition-colors"
            >
              <span>View Safe Route</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-command-800 hover:bg-command-750 py-2 text-xs font-semibold text-rose-300 border border-rose-500/30 transition-colors"
            >
              <span>Report Flooding in this Zone</span>
            </button>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDispatchCrews}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 py-2 text-xs font-semibold text-white transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Dispatch Pumps</span>
            </button>
            <button
              onClick={handleIssueWarning}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-500 py-2 text-xs font-semibold text-white transition-colors"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Broadcast Warning</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
