import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockZones } from '../../data/zones';
import { FactorBar } from '../../components/charts/FactorBar';
import { RiskBadge } from '../../components/common/RiskBadge';
import {
  BrainCircuit,
  AlertTriangle,
  Send,
  ShieldAlert,
  SlidersHorizontal,
  GitBranch,
  MapPin,
  CheckCircle2,
  Car,
  Clock
} from 'lucide-react';

export const AuthorityRiskAnalysis: React.FC = () => {
  const { selectedZone, setSelectedZone, addToast } = useApp();
  const [activeZoneId, setActiveZoneId] = useState<string>(selectedZone?.id || 'zone-14');

  const zone = mockZones.find((z) => z.id === activeZoneId) || mockZones[0];

  const handleAction = (actionTitle: string) => {
    addToast(
      'Emergency Action Triggered',
      `${actionTitle} executed for ${zone.code} (${zone.name}).`,
      'success'
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-white/5 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400">
            <BrainCircuit className="h-4 w-4" />
            <span>MULTIMODAL HYDRODYNAMIC ATTRIBUTION ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            AI Risk Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Deconstruct street-level flood probability into physical contributing factors.
          </p>
        </div>

        {/* Catchment Zone Selector */}
        <div className="flex items-center gap-2 bg-command-900 border border-white/10 p-1.5 rounded-xl">
          <MapPin className="h-4 w-4 text-cyan-400 ml-2" />
          <select
            value={activeZoneId}
            onChange={(e) => {
              setActiveZoneId(e.target.value);
              const found = mockZones.find((z) => z.id === e.target.value);
              if (found) setSelectedZone(found);
            }}
            className="rounded-lg bg-command-950 px-3 py-1.5 text-xs font-bold text-white border border-white/10 focus:outline-none focus:border-cyan-500"
          >
            {mockZones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.code} - {z.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Analysis Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Left Col: Large Risk Score & Zone Overview */}
        <div className="rounded-2xl border border-white/10 bg-command-900/90 p-6 shadow-card-dark flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400">
                {zone.code}
              </span>
              <RiskBadge level={zone.riskLevel} size="md" />
            </div>

            <h3 className="text-xl font-extrabold text-white mt-2 leading-tight">
              {zone.name}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Elevation: {zone.elevationMeters}m MSL • Population: {zone.populationAtRisk.toLocaleString()}
            </p>

            {/* Huge Risk Score */}
            <div className="mt-8 text-center rounded-2xl bg-command-950/90 p-6 border border-white/5 relative overflow-hidden">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block font-mono">
                Coupled Flood Probability
              </span>
              <div className="mt-3 flex items-center justify-center gap-2">
                <span
                  className={`text-6xl sm:text-7xl font-extrabold font-mono tracking-tight ${
                    zone.floodProbability > 80
                      ? 'text-rose-400 drop-shadow-[0_0_25px_rgba(239,68,68,0.4)]'
                      : zone.floodProbability > 60
                      ? 'text-orange-400 drop-shadow-[0_0_25px_rgba(249,115,22,0.4)]'
                      : 'text-amber-400'
                  }`}
                >
                  {zone.floodProbability}%
                </span>
              </div>
              <div className="mt-3">
                <RiskBadge level={zone.riskLevel} size="lg" />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 grid grid-cols-2 gap-3 text-center text-xs font-mono">
            <div className="rounded-xl bg-command-950 p-3 border border-white/5">
              <span className="text-[10px] text-slate-400 block font-sans">Water Depth</span>
              <span className="text-base font-bold text-cyan-300">{zone.estimatedDepthCm} cm</span>
            </div>
            <div className="rounded-xl bg-command-950 p-3 border border-white/5">
              <span className="text-[10px] text-slate-400 block font-sans">Earliest Onset</span>
              <span className="text-base font-bold text-amber-300">{zone.expectedOnsetMinutes} min</span>
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Factor Bars & AI Attribution Breakdown */}
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-command-900/90 p-6 shadow-card-dark flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
                  Attribution Factor Weights
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Derived from 2D Navier-Stokes + 1D Saint-Venant
              </span>
            </div>

            {/* Factor Bars */}
            <div className="mt-6 space-y-4">
              <FactorBar
                label="Precipitation Intensity"
                percentage={zone.riskLevel === 'critical' ? 92 : 65}
                weightDescription="Doppler Radar Echo Volume"
                colorTheme="critical"
              />
              <FactorBar
                label="Underground Drainage Surcharge"
                percentage={zone.drainageUtilization}
                weightDescription="Pipe Capacity & Backflow Gradient"
                colorTheme={zone.drainageUtilization > 85 ? 'critical' : 'high'}
              />
              <FactorBar
                label="Topographic Depression / Low Elevation"
                percentage={zone.riskLevel === 'critical' ? 78 : 45}
                weightDescription="1m DEM Basin Curvature"
                colorTheme="high"
              />
              <FactorBar
                label="Surface Runoff Imperviousness"
                percentage={zone.surfaceRunoffPercent}
                weightDescription="Paved Concrete vs Infiltration"
                colorTheme="moderate"
              />
              <FactorBar
                label="Historical Inundation Frequency"
                percentage={zone.riskLevel === 'critical' ? 61 : 35}
                weightDescription="Past 10 Monsoon Seasons"
                colorTheme="cyan"
              />
            </div>

            {/* AI Explanation Narrative */}
            <div className="mt-6 rounded-xl border border-white/10 bg-command-950/80 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 mb-1.5">
                <BrainCircuit className="h-4 w-4" />
                <span>AI Synthetic Explanation</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                "High rainfall intensity ({zone.rainfallMmPerHour} mm/hr) combined with low elevation ({zone.elevationMeters}m MSL) and near-capacity underground drainage ({zone.drainageUtilization}%) drastically increases the probability of surface-water accumulation at primary arterial intersections."
              </p>
            </div>
          </div>

          {/* Recommended Actions Dispatch Panel */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Recommended Emergency Response Protocols
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={() => handleAction('Inspect and clear drainage gratings')}
                className="flex items-center gap-2.5 rounded-xl bg-command-950 hover:bg-command-800 p-3 border border-white/5 text-left text-xs font-semibold text-slate-200 hover:text-white transition-all group"
              >
                <span className="text-lg">🚧</span>
                <div>
                  <span>Inspect drainage intake</span>
                  <p className="text-[10px] text-slate-400 font-normal">Deploy mobile rodding unit</p>
                </div>
              </button>

              <button
                onClick={() => handleAction('Redirect arterial traffic signals')}
                className="flex items-center gap-2.5 rounded-xl bg-command-950 hover:bg-command-800 p-3 border border-white/5 text-left text-xs font-semibold text-slate-200 hover:text-white transition-all group"
              >
                <span className="text-lg">🚗</span>
                <div>
                  <span>Redirect arterial traffic</span>
                  <p className="text-[10px] text-slate-400 font-normal">Switch signals to detour loop</p>
                </div>
              </button>

              <button
                onClick={() => handleAction('Issue localized CAP flash broadcast')}
                className="flex items-center gap-2.5 rounded-xl bg-command-950 hover:bg-command-800 p-3 border border-white/5 text-left text-xs font-semibold text-slate-200 hover:text-white transition-all group"
              >
                <span className="text-lg">🚨</span>
                <div>
                  <span>Issue public warning</span>
                  <p className="text-[10px] text-slate-400 font-normal">SMS blast to local cells</p>
                </div>
              </button>

              <button
                onClick={() => handleAction('Station emergency spotters & tow trucks')}
                className="flex items-center gap-2.5 rounded-xl bg-command-950 hover:bg-command-800 p-3 border border-white/5 text-left text-xs font-semibold text-slate-200 hover:text-white transition-all group"
              >
                <span className="text-lg">👷</span>
                <div>
                  <span>Monitor nearby roads</span>
                  <p className="text-[10px] text-slate-400 font-normal">Position quick-response crane</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
