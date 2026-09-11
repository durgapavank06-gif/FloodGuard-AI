import React, { useEffect, useState } from 'react';
import { ForecastChart } from '../../components/charts/ForecastChart';
import { RiskTimeline } from '../../components/charts/RiskTimeline';
import { RainfallNowcastPoint } from '../../types';
import { RiskBadge } from '../../components/common/RiskBadge';
import { DataModeToggle } from '../../components/common/DataModeToggle';
import { useNowcast } from '../../hooks/useNowcast';
import {
  TrendingUp,
  Clock,
  CloudRain,
  Droplets,
  AlertTriangle,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CitizenForecast: React.FC = () => {
  const { navigate, addToast } = useApp();
  const { series, loading, error, isLive, refetch } = useNowcast();
  const [selectedPoint, setSelectedPoint] = useState<RainfallNowcastPoint>(series[2]);

  useEffect(() => {
    setSelectedPoint((prev) => series.find((p) => p.timeOffsetMinutes === prev.timeOffsetMinutes) || series[2] || series[0]);
  }, [series]);

  useEffect(() => {
    if (error) addToast('Live feed unreachable', error, 'warning');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  if (!selectedPoint) return null;

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Subtitle */}
      <div className="border-b border-white/5 pb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
            <TrendingUp className="h-4 w-4" />
            <span>0–3 Hour Hydrological Nowcasting Window</span>
            {isLive && (
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                ● LIVE DWR ADVECTION
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Flood Forecast
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Understand how flood risk may change over the next 3 hours as rainfall moves across the drainage network.
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

      {/* Selected Time Interval Deep Dive */}
      <div className="rounded-2xl border border-white/10 bg-command-900/90 p-6 shadow-card-dark">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-white font-mono">
              Forecast at {selectedPoint.label} ({selectedPoint.timeString} IST)
            </span>
            <RiskBadge level={selectedPoint.riskLevel} size="md" />
          </div>

          <span className="text-xs text-slate-400 font-mono">
            Doppler Echo: {selectedPoint.radarEchoDbz} dBZ
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="rounded-xl bg-command-950/80 p-4 border border-white/5">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <CloudRain className="h-4 w-4 text-cyan-400" />
              Peak Rainfall Rate
            </span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-cyan-300">
                {selectedPoint.rainfallMmHr}
              </span>
              <span className="text-xs text-slate-400">mm/hour</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Heavy convective band crossing north-central metro
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-xl bg-command-950/80 p-4 border border-white/5">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Droplets className="h-4 w-4 text-rose-400" />
              Flood Probability
            </span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-rose-400">
                {selectedPoint.floodProbability}%
              </span>
              <span className="text-xs text-slate-400">coupled risk</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {selectedPoint.criticalZonesCount} zones in critical status
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-xl bg-command-950/80 p-4 border border-white/5">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-amber-400" />
              Avg Ponding Depth
            </span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-amber-300">
                {selectedPoint.avgDepthCm}
              </span>
              <span className="text-xs text-slate-400">cm standing water</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Underpasses may reach up to 55+ cm
            </p>
          </div>
        </div>

        {/* Citizen Safety Advisory for this interval */}
        <div className="mt-5 rounded-xl bg-command-950/60 p-4 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Recommended Citizen Safety Advisory
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                {selectedPoint.riskLevel === 'critical'
                  ? 'Avoid all non-essential road travel. Low-lying underpasses (Bazullah Road, Velachery 100ft dip) will experience dangerous submergence.'
                  : selectedPoint.riskLevel === 'high'
                  ? 'Heavy surface runoff expected. Use elevated flyovers instead of surface roads. Watch out for open manholes.'
                  : 'Maintain standard vigilance. Normal transit conditions across primary corridors.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/citizen/routes')}
            className="shrink-0 flex items-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 px-4 py-2 text-xs font-semibold text-white transition-colors"
          >
            <span>Plan Safe Route</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
