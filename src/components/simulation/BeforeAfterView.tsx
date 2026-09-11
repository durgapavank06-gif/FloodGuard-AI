import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { StatCard } from '../common/StatCard';
import {
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Waves,
  Users,
  Route,
  ShieldCheck,
  SplitSquareVertical
} from 'lucide-react';

export const BeforeAfterView: React.FC = () => {
  const { results, baselineResults, params } = useSimulation();
  const [viewMode, setViewMode] = useState<'comparison' | 'simulated_only'>('comparison');

  const calcDiff = (simVal: number, baseVal: number) => {
    const diff = simVal - baseVal;
    const pct = Math.round((diff / baseVal) * 100);
    return {
      diff,
      pct,
      isIncrease: diff > 0,
      text: diff > 0 ? `+${diff} (+${pct}%)` : `${diff} (${pct}%)`,
    };
  };

  const critDiff = calcDiff(results.criticalZones, baselineResults.criticalZones);
  const roadsDiff = calcDiff(results.affectedRoadsKm, baselineResults.affectedRoadsKm);
  const popDiff = calcDiff(results.populationExposed, baselineResults.populationExposed);
  const depthDiff = calcDiff(results.maxFloodDepthCm, baselineResults.maxFloodDepthCm);

  return (
    <div className="space-y-4">
      {/* View Toggle Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-command-900/80 p-3 border border-white/5">
        <div className="flex items-center gap-2">
          <SplitSquareVertical className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Hydraulic Scenario Impact Analysis
          </span>
        </div>

        <div className="flex items-center rounded-lg bg-command-950 p-1 border border-white/10 text-xs">
          <button
            onClick={() => setViewMode('comparison')}
            className={`rounded-md px-3 py-1 font-semibold transition-all ${
              viewMode === 'comparison'
                ? 'bg-cyan-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Baseline vs Scenario Comparison
          </button>
          <button
            onClick={() => setViewMode('simulated_only')}
            className={`rounded-md px-3 py-1 font-semibold transition-all ${
              viewMode === 'simulated_only'
                ? 'bg-cyan-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Scenario Results Only
          </button>
        </div>
      </div>

      {/* KPI Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Critical Zones */}
        <div className="rounded-xl bg-command-900/90 border border-white/10 p-4 shadow-card-dark">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Critical Flood Zones</span>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-rose-400">
              {results.criticalZones}
            </span>
            {viewMode === 'comparison' && (
              <span className="text-xs font-mono text-slate-400">
                Base: {baselineResults.criticalZones}
              </span>
            )}
          </div>
          {viewMode === 'comparison' && (
            <div className={`mt-1 text-xs font-semibold font-mono flex items-center gap-1 ${
              critDiff.isIncrease ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {critDiff.isIncrease ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>{critDiff.text}</span>
            </div>
          )}
        </div>

        {/* Max Flood Depth */}
        <div className="rounded-xl bg-command-900/90 border border-white/10 p-4 shadow-card-dark">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Max Surface Depth</span>
            <Waves className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-cyan-300">
              {results.maxFloodDepthCm} <span className="text-xs font-sans font-normal text-slate-400">cm</span>
            </span>
            {viewMode === 'comparison' && (
              <span className="text-xs font-mono text-slate-400">
                Base: {baselineResults.maxFloodDepthCm}cm
              </span>
            )}
          </div>
          {viewMode === 'comparison' && (
            <div className={`mt-1 text-xs font-semibold font-mono flex items-center gap-1 ${
              depthDiff.isIncrease ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {depthDiff.isIncrease ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>{depthDiff.text}</span>
            </div>
          )}
        </div>

        {/* Affected Roads */}
        <div className="rounded-xl bg-command-900/90 border border-white/10 p-4 shadow-card-dark">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Inundated Roads</span>
            <Route className="h-4 w-4 text-orange-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-orange-400">
              {results.affectedRoadsKm} <span className="text-xs font-sans font-normal text-slate-400">km</span>
            </span>
            {viewMode === 'comparison' && (
              <span className="text-xs font-mono text-slate-400">
                Base: {baselineResults.affectedRoadsKm}km
              </span>
            )}
          </div>
          {viewMode === 'comparison' && (
            <div className={`mt-1 text-xs font-semibold font-mono flex items-center gap-1 ${
              roadsDiff.isIncrease ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {roadsDiff.isIncrease ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>{roadsDiff.text}</span>
            </div>
          )}
        </div>

        {/* Population Exposed */}
        <div className="rounded-xl bg-command-900/90 border border-white/10 p-4 shadow-card-dark">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Exposed Population</span>
            <Users className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-purple-300">
              {results.populationExposed.toLocaleString()}
            </span>
            {viewMode === 'comparison' && (
              <span className="text-xs font-mono text-slate-400">
                Base: {baselineResults.populationExposed.toLocaleString()}
              </span>
            )}
          </div>
          {viewMode === 'comparison' && (
            <div className={`mt-1 text-xs font-semibold font-mono flex items-center gap-1 ${
              popDiff.isIncrease ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {popDiff.isIncrease ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>{popDiff.text}</span>
            </div>
          )}
        </div>
      </div>

      {/* Hydraulic Mitigation Advice */}
      <div className="rounded-xl bg-command-950/70 p-4 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-white uppercase text-[11px] tracking-wider text-cyan-400 font-mono">
            Model Mitigation Recommendation:
          </span>
          <p className="text-slate-300 mt-0.5">
            {results.criticalZones > 20
              ? 'Severe multi-catchment surcharge expected. Pre-deploy heavy high-discharge mobile dewatering pumps across Velachery and Adyar causeway.'
              : results.criticalZones < 10
              ? 'Moderate localized ponding. Existing gravity culverts sufficient with manual debris clearing at intake grates.'
              : 'Standard monsoon surcharge profile. Keep automated Ruby RUB pump sumps active on emergency diesel standby.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-slate-400">Pumps Required:</span>
          <span className="rounded-lg bg-command-800 px-2.5 py-1 font-mono font-bold text-cyan-300 border border-white/5">
            {results.pumpsRequired} Units
          </span>
        </div>
      </div>
    </div>
  );
};
