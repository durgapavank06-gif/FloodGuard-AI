import React, { useState } from 'react';
import { ForecastChart } from '../../components/charts/ForecastChart';
import { RiskTimeline } from '../../components/charts/RiskTimeline';
import { mockRainfallNowcast } from '../../data/rainfall';
import { RainfallNowcastPoint } from '../../types';
import { RiskBadge } from '../../components/common/RiskBadge';
import { mockZones } from '../../data/zones';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Clock,
  CloudRain,
  Droplets,
  AlertTriangle,
  ArrowRight,
  GitBranch,
  Waves,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

export const AuthorityForecast: React.FC = () => {
  const { navigate, setSelectedZone } = useApp();
  const [selectedPoint, setSelectedPoint] = useState<RainfallNowcastPoint>(
    mockRainfallNowcast[2] // +60 min peak
  );

  const highestRiskAreas = [
    { zoneId: 'zone-14', code: 'Zone 14', name: 'Begumpet Underpass', prob: 91, depth: 42, onset: 27, level: 'critical' as const },
    { zoneId: 'zone-10', code: 'Zone 10', name: 'Moosarambagh Causeway', prob: 93, depth: 56, onset: 18, level: 'critical' as const },
    { zoneId: 'zone-09', code: 'Zone 09', name: 'Tolichowki Basin', prob: 84, depth: 38, onset: 34, level: 'critical' as const },
    { zoneId: 'zone-11', code: 'Zone 11', name: 'Malakpet RUB', prob: 90, depth: 46, onset: 22, level: 'critical' as const },
    { zoneId: 'zone-21', code: 'Zone 21', name: 'Ameerpet Junction', prob: 79, depth: 29, onset: 45, level: 'high' as const },
    { zoneId: 'zone-17', code: 'Zone 17', name: 'Khairatabad Circle', prob: 72, depth: 24, onset: 52, level: 'high' as const },
  ];

  const handleInspectZone = (zoneId: string) => {
    const zone = mockZones.find((z) => z.id === zoneId);
    if (zone) {
      setSelectedZone(zone);
      navigate('/authority/map');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-white/5 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
            <TrendingUp className="h-4 w-4" />
            <span>0–3 HOUR LEAD TIME HYDRODYNAMIC PREDICTIVE ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            3-Hour Flood Nowcasting
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Coupled kinematic wave overland routing with DWR precipitation advection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/authority/simulation')}
            className="rounded-xl bg-cyan-600 hover:bg-cyan-500 px-4 py-2 text-xs font-bold text-white transition-colors"
          >
            Scenario Stress Test
          </button>
        </div>
      </div>

      {/* Interactive Timeline Selector */}
      <div className="rounded-2xl border border-white/10 bg-command-900/80 p-4 shadow-card-dark">
        <RiskTimeline
          selectedPoint={selectedPoint}
          onSelectPoint={setSelectedPoint}
        />
      </div>

      {/* Large Modern Forecast Chart */}
      <ForecastChart
        activePoint={selectedPoint}
        onSelectPoint={setSelectedPoint}
      />

      {/* Section: Highest Risk Areas Matrix */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Highest Risk Priority Basins
            </h3>
          </div>
          <span className="text-xs text-slate-400">Ranked by coupled inundation probability</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {highestRiskAreas.map((area) => (
            <div
              key={area.zoneId}
              onClick={() => handleInspectZone(area.zoneId)}
              className="cursor-pointer rounded-xl border border-white/10 bg-command-900/90 p-4 shadow-card-dark hover:border-cyan-500/50 hover:bg-command-850 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-400">
                    {area.code}
                  </span>
                  <RiskBadge level={area.level} size="sm" />
                </div>
                <h4 className="text-sm font-bold text-white mt-1">{area.name}</h4>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-3 gap-1 text-center font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Probability</span>
                  <span className="text-sm font-bold text-rose-400">{area.prob}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Est. Depth</span>
                  <span className="text-sm font-bold text-cyan-300">{area.depth}cm</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Onset</span>
                  <span className="text-sm font-bold text-amber-300">{area.onset}m</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end text-[11px] font-semibold text-cyan-400">
                <span>Inspect on Live Map</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
