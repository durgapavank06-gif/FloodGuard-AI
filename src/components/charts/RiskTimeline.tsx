import React from 'react';
import { RainfallNowcastPoint } from '../../types';
import { mockRainfallNowcast } from '../../data/rainfall';
import { RiskBadge } from '../common/RiskBadge';
import { Clock, CloudRain, Droplets } from 'lucide-react';

interface RiskTimelineProps {
  selectedPoint: RainfallNowcastPoint;
  onSelectPoint: (point: RainfallNowcastPoint) => void;
  className?: string;
  /** Override series (live API). Defaults to bundled demo profile. */
  data?: RainfallNowcastPoint[];
}

export const RiskTimeline: React.FC<RiskTimelineProps> = ({
  selectedPoint,
  onSelectPoint,
  className = '',
  data,
}) => {
  const series = data && data.length > 0 ? data : mockRainfallNowcast;
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            0-3 Hour Flood Nowcast Progression
          </span>
        </div>
        <span className="text-[11px] text-slate-400">Select interval to inspect</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {series.map((pt) => {
          const isSelected = selectedPoint.timeOffsetMinutes === pt.timeOffsetMinutes;

          const borderStyle = {
            critical: 'border-rose-500/50 hover:border-rose-500 bg-rose-950/20',
            high: 'border-orange-500/50 hover:border-orange-500 bg-orange-950/20',
            moderate: 'border-amber-500/50 hover:border-amber-500 bg-amber-950/20',
            low: 'border-emerald-500/50 hover:border-emerald-500 bg-emerald-950/20',
          }[pt.riskLevel];

          const activeStyle = isSelected
            ? 'ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/20 bg-command-800'
            : 'hover:bg-command-850';

          return (
            <button
              key={pt.timeOffsetMinutes}
              onClick={() => onSelectPoint(pt)}
              className={`flex flex-col items-center justify-between p-3 rounded-xl border text-left transition-all ${borderStyle} ${activeStyle}`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-white font-mono">
                  {pt.label}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {pt.timeString}
                </span>
              </div>

              <div className="my-2 flex flex-col items-center">
                <RiskBadge level={pt.riskLevel} size="sm" />
                <span className="mt-2 text-lg font-extrabold font-mono text-white">
                  {pt.floodProbability}%
                </span>
                <span className="text-[10px] text-slate-400">Probability</span>
              </div>

              <div className="w-full pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-300">
                <span className="flex items-center gap-1 text-cyan-300">
                  <CloudRain className="h-3 w-3" />
                  {pt.rainfallMmHr} <span className="text-[9px]">mm/h</span>
                </span>
                <span className="text-slate-400 font-mono text-[10px]">
                  {pt.avgDepthCm}cm
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
