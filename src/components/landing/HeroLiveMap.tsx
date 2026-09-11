import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useDataMode } from '../../context/DataModeContext';
import { api, ApiZone } from '../../services/api';
import { mockZones } from '../../data/zones';
import { mockDrainageConduits } from '../../data/drainage';
import { mockRainfallNowcast } from '../../data/rainfall';
import { RiskLevel } from '../../types';

interface HeroZone {
  id: string;
  code: string;
  name: string;
  riskLevel: RiskLevel;
  floodProbability: number;
  estimatedDepthCm: number;
  expectedOnsetMinutes: number;
  rainfallMmPerHour: number;
  elevationMeters: number;
}

const riskStyle: Record<RiskLevel, { marker: string; stroke: string; text: string }> = {
  critical: { marker: '#ef4444', stroke: '#ef4444', text: '#fca5a5' },
  high: { marker: '#f97316', stroke: '#f97316', text: '#fdba74' },
  moderate: { marker: '#f59e0b', stroke: '#f59e0b', text: '#fde68a' },
  low: { marker: '#10b981', stroke: '#10b981', text: '#a7f3d0' },
};

const istNow = () => {
  try {
    return new Date().toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
    });
  } catch {
    return new Date().toLocaleTimeString();
  }
};

/**
 * Landing hero: live Chennai coupled-model snapshot (DWR Chennai radar).
 * Fetches /api/dashboard on mount; falls back to the bundled Chennai demo
 * snapshot if the backend is unreachable. The old hardcoded Hyderabad
 * visual is gone.
 */
export const HeroLiveMap: React.FC = () => {
  const { navigate } = useApp();
  const { apiUrl } = useDataMode();
  const [zones, setZones] = useState<HeroZone[]>(() =>
    mockZones.map((z) => ({ ...z }))
  );
  const [peakRain, setPeakRain] = useState<number>(() =>
    Math.max(...mockRainfallNowcast.map((p) => p.rainfallMmHr))
  );
  const [worstConduit, setWorstConduit] = useState<{ id: string; pct: number }>(() => {
    const w = [...mockDrainageConduits].sort((a, b) => b.capacityPercent - a.capacityPercent)[0];
    return { id: w.code, pct: w.capacityPercent };
  });
  const [isLive, setIsLive] = useState(false);
  const [clock, setClock] = useState(istNow());

  useEffect(() => {
    const id = setInterval(() => setClock(istNow()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    api
      .dashboard(apiUrl, 'real')
      .then((res) => {
        if (cancelled || !res.zones?.length) return;
        const zs: HeroZone[] = [...res.zones]
          .sort((a, b) => b.floodProbability - a.floodProbability)
          .map((z) => ({
            id: z.id,
            code: z.code,
            name: z.name,
            riskLevel: z.riskLevel,
            floodProbability: Math.round(z.floodProbability),
            estimatedDepthCm: Math.round(z.estimatedDepthCm),
            expectedOnsetMinutes: z.expectedOnsetMinutes,
            rainfallMmPerHour: Math.round(z.rainfallMmPerHour),
            elevationMeters: z.elevationMeters ?? 0,
          }));
        setZones(zs);
        if (res.nowcast?.length) {
          setPeakRain(Math.max(...res.nowcast.map((p) => p.rainfallMmHr)));
        }
        // Worst conduit across live zones (dashboard zones carry conduits)
        interface ZoneWithConduits {
          conduits?: { id: string; code?: string; capacityPercent: number }[];
        }
        let worst = { id: '—', pct: 0 };
        for (const z of res.zones) {
          const conduits = (z as ApiZone & ZoneWithConduits).conduits;
          if (!conduits) continue;
          for (const c of conduits) {
            if (c.capacityPercent > worst.pct) {
              worst = { id: c.code || c.id, pct: Math.round(c.capacityPercent) };
            }
          }
        }
        if (worst.pct > 0) setWorstConduit(worst);
        setIsLive(true);
      })
      .catch(() => {
        if (!cancelled) setIsLive(false);
      });
    return () => {
      cancelled = true;
    };
  }, [apiUrl]);

  const ranked = [...zones].sort((a, b) => b.floodProbability - a.floodProbability);
  const primary = ranked[0];
  const secondary = ranked[1];
  const tertiary = ranked[2];
  if (!primary) return null;

  const pStyle = riskStyle[primary.riskLevel];
  const sStyle = secondary ? riskStyle[secondary.riskLevel] : riskStyle.low;
  const tStyle = tertiary ? riskStyle[tertiary.riskLevel] : riskStyle.low;

  const conduitHot = primary.riskLevel === 'critical' || primary.riskLevel === 'high';
  const onsetLabel =
    primary.expectedOnsetMinutes >= 900 ? 'ONSET LATER' : `(+${Math.round(primary.expectedOnsetMinutes)} MIN)`;

  return (
    <div className="mt-14 relative mx-auto max-w-5xl rounded-3xl border border-white/10 bg-command-900/80 p-3 sm:p-6 shadow-2xl backdrop-blur-xl">
      {/* Header bar of the visual */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-rose-500/80" />
            <div className="h-3 w-3 rounded-full bg-amber-500/80" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-mono text-slate-400 ml-2">
            DWR-CHENNAI // COUPLED HYDRAULIC SURFACE SOLVER
          </span>
          {isLive && (
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
              ● LIVE
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            LIVE TELEMETRY
          </span>
          <span className="text-slate-400">{clock} IST</span>
        </div>
      </div>

      {/* Futuristic Map & Dashboard Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
        {/* Left: Map canvas preview */}
        <div className="lg:col-span-2 relative h-80 sm:h-96 rounded-2xl bg-command-950 border border-white/10 overflow-hidden">
          <div className="absolute inset-0 radar-grid opacity-30" />

          {/* SVG Visual */}
          <svg viewBox="0 0 600 380" className="w-full h-full select-none">
            {/* Radar sweep beam animation */}
            <g className="origin-[300px_190px] animate-radar-sweep opacity-35">
              <path
                d="M 300 190 L 600 190 A 300 300 0 0 1 512 368 Z"
                fill="url(#radarBeamGradient)"
              />
            </g>
            <defs>
              <linearGradient id="radarBeamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.0" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* Concentric distance rings */}
            <circle cx="300" cy="190" r="80" fill="none" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="1" strokeDasharray="3,3" />
            <circle cx="300" cy="190" r="160" fill="none" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="1" />
            <circle cx="300" cy="190" r="240" fill="none" stroke="rgba(6, 182, 212, 0.1)" strokeWidth="1" />

            {/* Roads & Streets */}
            <path d="M 50 140 L 550 140" stroke="#334155" strokeWidth="2.5" />
            <path d="M 50 240 L 550 240" stroke="#334155" strokeWidth="2.5" />
            <path d="M 160 50 L 160 330" stroke="#334155" strokeWidth="2.5" />
            <path d="M 340 50 L 340 330" stroke="#334155" strokeWidth="2.5" />
            <path d="M 460 50 L 460 330" stroke="#334155" strokeWidth="2.5" />

            {/* Drainage conduits with status glow */}
            <line x1="160" y1="140" x2="340" y2="240" stroke="#06b6d4" strokeWidth="3" strokeDasharray="6,3" />
            <line
              x1="340"
              y1="240"
              x2="460"
              y2="240"
              stroke={conduitHot ? '#ef4444' : '#06b6d4'}
              strokeWidth="4"
            />

            {/* Primary (worst) basin marker */}
            <g transform="translate(340, 240)">
              {(primary.riskLevel === 'critical' || primary.riskLevel === 'high') && (
                <circle r="22" fill="none" stroke={pStyle.marker} strokeWidth="1.5" className="animate-ping" opacity="0.6" />
              )}
              <circle r="10" fill={pStyle.marker} stroke="#0b111d" strokeWidth="2" />
              <rect x="-46" y="-32" width="92" height="18" rx="4" fill="#0b111d" stroke={pStyle.stroke} strokeWidth="1" />
              <text x="0" y="-20" textAnchor="middle" fill={pStyle.text} fontSize="9" fontWeight="bold" fontFamily="monospace">
                {primary.code.toUpperCase()}: {primary.floodProbability}%
              </text>
            </g>

            {/* Secondary basin marker */}
            {secondary && (
              <g transform="translate(160, 140)">
                <circle r="8" fill={sStyle.marker} stroke="#0b111d" strokeWidth="2" />
                <rect x="-42" y="-30" width="84" height="18" rx="4" fill="#0b111d" stroke={sStyle.stroke} strokeWidth="1" />
                <text x="0" y="-18" textAnchor="middle" fill={sStyle.text} fontSize="9" fontWeight="bold" fontFamily="monospace">
                  {secondary.code.toUpperCase()}: {secondary.floodProbability}%
                </text>
              </g>
            )}

            {/* Tertiary basin marker */}
            {tertiary && (
              <g transform="translate(460, 140)">
                <circle r="8" fill={tStyle.marker} stroke="#0b111d" strokeWidth="2" />
                <rect x="-42" y="-30" width="84" height="18" rx="4" fill="#0b111d" stroke={tStyle.stroke} strokeWidth="1" />
                <text x="0" y="-18" textAnchor="middle" fill={tStyle.text} fontSize="9" fontWeight="bold" fontFamily="monospace">
                  {tertiary.code.toUpperCase()}: {tertiary.floodProbability}%
                </text>
              </g>
            )}
          </svg>

          {/* Floating bottom radar tag */}
          <div className="absolute bottom-3 left-3 bg-command-900/90 border border-white/10 px-3 py-1.5 rounded-lg text-[11px] text-slate-300 backdrop-blur-md flex items-center gap-2 font-mono">
            <span
              className="h-2 w-2 rounded-full animate-pulse"
              style={{ backgroundColor: pStyle.marker }}
            />
            <span>
              {primary.name.toUpperCase()}: {primary.estimatedDepthCm}cm INUNDATION EXPECTED {onsetLabel}
            </span>
          </div>
        </div>

        {/* Right: Small live dashboard statistics */}
        <div className="flex flex-col justify-between gap-3">
          <div className="rounded-xl bg-command-950 p-4 border border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Critical Basin Alert</span>
              <span className="rounded bg-rose-500/20 text-rose-300 px-1.5 py-0.5 text-[10px] font-bold">
                {primary.riskLevel.toUpperCase()}
              </span>
            </div>
            <h4 className="text-base font-bold text-white mt-1">
              {primary.code} ({primary.name.split('&')[0].trim()})
            </h4>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="rounded bg-command-900 p-2">
                <span className="text-slate-400 text-[10px]">Prob:</span>
                <p className="text-rose-400 font-bold text-lg">{primary.floodProbability}%</p>
              </div>
              <div className="rounded bg-command-900 p-2">
                <span className="text-slate-400 text-[10px]">Depth:</span>
                <p className="text-cyan-300 font-bold text-lg">{primary.estimatedDepthCm} cm</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-command-950 p-4 border border-white/10 space-y-2">
            <span className="text-xs font-semibold text-slate-300">Coupled Solver Attributions</span>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Rainfall Overload:</span>
                <span className="font-mono text-cyan-400 font-bold">{peakRain} mm/h (peak)</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Drain {worstConduit.id} Surcharge:</span>
                <span className="font-mono text-rose-400 font-bold">{worstConduit.pct}% Limit</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Basin Depression:</span>
                <span className="font-mono text-amber-400 font-bold">{primary.elevationMeters}m MSL</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/role-selection')}
            className="w-full rounded-xl bg-cyan-600 hover:bg-cyan-500 py-3 text-xs font-bold text-white transition-colors flex items-center justify-center gap-2"
          >
            <span>Launch Interactive System</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
