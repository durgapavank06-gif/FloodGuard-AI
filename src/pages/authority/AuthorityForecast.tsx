import React, { useEffect, useState } from 'react';
import { ForecastChart } from '../../components/charts/ForecastChart';
import { RiskTimeline } from '../../components/charts/RiskTimeline';
import { RainfallNowcastPoint, RiskLevel } from '../../types';
import { RiskBadge } from '../../components/common/RiskBadge';
import { DataModeToggle } from '../../components/common/DataModeToggle';
import { mockZones } from '../../data/zones';
import { useApp } from '../../context/AppContext';
import { useDataMode } from '../../context/DataModeContext';
import { useNowcast } from '../../hooks/useNowcast';
import { api, ApiZone } from '../../services/api';
import {
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

export const AuthorityForecast: React.FC = () => {
  const { navigate, setSelectedZone, addToast } = useApp();
  const { mode, apiUrl } = useDataMode();
  const { series, loading, error, isLive, refetch } = useNowcast();
  const [selectedPoint, setSelectedPoint] = useState<RainfallNowcastPoint>(series[2]);
  const [liveZones, setLiveZones] = useState<ApiZone[] | null>(null);

  useEffect(() => {
    setSelectedPoint((prev) => series.find((p) => p.timeOffsetMinutes === prev.timeOffsetMinutes) || series[2] || series[0]);
  }, [series]);

  useEffect(() => {
    if (error) addToast('Live feed unreachable', error, 'warning');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  // Live coupled-model priority basins in REAL mode
  useEffect(() => {
    if (mode === 'fake') {
      setLiveZones(null);
      return;
    }
    let cancelled = false;
    api
      .floodZones(apiUrl, mode)
      .then((res) => {
        if (!cancelled && res.zones?.length) setLiveZones(res.zones);
      })
      .catch(() => {
        if (!cancelled) setLiveZones(null);
      });
    return () => {
      cancelled = true;
    };
  }, [mode, apiUrl]);

  const fallbackAreas = [
    { zoneId: 'zone-c01', code: 'Zone C01', name: 'T. Nagar & Bazullah Road Basin', prob: 89, depth: 38, onset: 22, level: 'critical' as const },
    { zoneId: 'zone-c04', code: 'Zone C04', name: 'Velachery & Drivers Colony Low', prob: 91, depth: 42, onset: 18, level: 'critical' as const },
    { zoneId: 'zone-c03', code: 'Zone C03', name: 'Anna Nagar & Aminjikarai', prob: 85, depth: 34, onset: 26, level: 'critical' as const },
    { zoneId: 'zone-c02', code: 'Zone C02', name: 'Nungambakkam & Seetha Nagar', prob: 76, depth: 28, onset: 35, level: 'high' as const },
    { zoneId: 'zone-c05', code: 'Zone C05', name: 'Thiruvanmiyur & Adyar', prob: 54, depth: 16, onset: 70, level: 'moderate' as const },
  ];

  const highestRiskAreas = liveZones
    ? liveZones.slice(0, 6).map((z) => ({
        zoneId: z.id,
        code: z.code,
        name: z.name,
        prob: Math.round(z.floodProbability),
        depth: Math.round(z.estimatedDepthCm),
        onset: z.expectedOnsetMinutes >= 900 ? -1 : Math.round(z.expectedOnsetMinutes),
        level: z.riskLevel as RiskLevel,
      }))
    : fallbackAreas;

  const handleInspectZone = (zoneId: string) => {
    const zone = mockZones.find((z) => z.id === zoneId);
    if (zone) {
      setSelectedZone(zone);
      navigate('/authority/map');
    } else {
      navigate('/authority/map');
    }
  };

  if (!selectedPoint) return null;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-white/5 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
            <TrendingUp className="h-4 w-4" />
            <span>0–3 HOUR LEAD TIME HYDRODYNAMIC PREDICTIVE ENGINE</span>
            {isLive && (
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                ● LIVE COUPLED MODEL
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            3-Hour Flood Nowcasting
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Coupled kinematic wave overland routing with DWR precipitation advection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <DataModeToggle loading={loading} />
          <button
            onClick={refetch}
            className="rounded-xl border border-white/10 bg-command-900 p-2 text-slate-300 hover:text-white transition-colors"
            title="Refresh nowcast"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
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
          data={series}
        />
      </div>

      {/* Large Modern Forecast Chart */}
      <ForecastChart
        activePoint={selectedPoint}
        onSelectPoint={setSelectedPoint}
        data={series}
      />

      {/* Section: Highest Risk Areas Matrix */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Highest Risk Priority Basins {liveZones ? '(live coupled model)' : '(demo profile)'}
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
                  <span className="text-sm font-bold text-amber-300">
                    {area.onset < 0 ? '—' : `${area.onset}m`}
                  </span>
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
