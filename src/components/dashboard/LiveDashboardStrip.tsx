import React, { useEffect, useState } from 'react';
import { Activity, RefreshCw } from 'lucide-react';
import { useDataMode } from '../../context/DataModeContext';
import { api, ApiZone } from '../../services/api';
import { RiskBadge } from '../common/RiskBadge';

/** Live city telemetry from the coupled Flask model. Rendered only in REAL mode. */
export const LiveDashboardStrip: React.FC = () => {
  const { mode, apiUrl } = useDataMode();
  const [zones, setZones] = useState<ApiZone[]>([]);
  const [city, setCity] = useState<Record<string, number | null>>({});
  const [loading, setLoading] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (mode === 'fake') return;
    let cancelled = false;
    setLoading(true);
    api
      .dashboard(apiUrl, mode)
      .then((res) => {
        if (!cancelled) {
          setZones(res.zones || []);
          setCity(res.city || {});
        }
      })
      .catch(() => {
        if (!cancelled) setZones([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [mode, apiUrl, tick]);

  if (mode === 'fake') return null;

  const crit = zones.filter((z) => z.riskLevel === 'critical').length;
  const high = zones.filter((z) => z.riskLevel === 'high').length;

  return (
    <div className="rounded-2xl border border-emerald-500/25 bg-emerald-950/20 p-4 shadow-card-dark">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
            Live Coupled-Model Telemetry
          </h3>
          <span className="rounded-full bg-emerald-500/15 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
            ● REAL
          </span>
        </div>
        <button
          onClick={() => setTick((t) => t + 1)}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-command-900 px-2.5 py-1 text-[11px] text-slate-300 hover:text-white"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {zones.length === 0 ? (
        <p className="mt-3 text-xs text-slate-400">
          {loading ? 'Solving advection + DEM routing + Manning surcharge…' : 'Live engine unreachable — start the Flask API on :5000. Showing demo KPIs above.'}
        </p>
      ) : (
        <>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-center">
            <div className="rounded-xl bg-command-950/80 border border-white/5 p-2.5">
              <span className="text-[10px] text-slate-400 block font-sans">City Risk</span>
              <span className="text-lg font-bold text-amber-300">{Math.round(Number(city.overallCityRiskScore || 0))}%</span>
            </div>
            <div className="rounded-xl bg-command-950/80 border border-white/5 p-2.5">
              <span className="text-[10px] text-slate-400 block font-sans">Critical / High</span>
              <span className="text-lg font-bold text-rose-400">{crit} / {high}</span>
            </div>
            <div className="rounded-xl bg-command-950/80 border border-white/5 p-2.5">
              <span className="text-[10px] text-slate-400 block font-sans">Earliest Onset</span>
              <span className="text-lg font-bold text-cyan-300">{city.earliestFloodOnsetMinutes ?? '—'}<span className="text-[10px]"> min</span></span>
            </div>
            <div className="rounded-xl bg-command-950/80 border border-white/5 p-2.5">
              <span className="text-[10px] text-slate-400 block font-sans">Max Depth</span>
              <span className="text-lg font-bold text-orange-300">{city.maxDepthCm ?? '—'}<span className="text-[10px]"> cm</span></span>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {zones.map((z) => (
              <span key={z.id} className="inline-flex items-center gap-1.5 rounded-lg bg-command-950/80 border border-white/5 px-2.5 py-1 text-[11px]">
                <RiskBadge level={z.riskLevel} size="sm" />
                <span className="font-mono font-bold text-white">{z.code}</span>
                <span className="font-mono text-cyan-300">{Math.round(z.estimatedDepthCm)}cm</span>
                <span className="font-mono text-slate-400">{Math.round(z.floodProbability)}%</span>
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
