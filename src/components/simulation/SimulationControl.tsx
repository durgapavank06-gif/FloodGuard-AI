import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { SimulationParams } from '../../types';
import { Sliders, Play, RotateCcw, Sparkles, CloudRain, Clock, GitBranch, Layers } from 'lucide-react';

export const SimulationControl: React.FC = () => {
  const {
    params,
    setParams,
    runSimulation,
    loadScenario,
    resetToDefault,
    isSimulating
  } = useSimulation();

  return (
    <div className="rounded-2xl border border-white/10 bg-command-900/90 p-5 shadow-card-dark space-y-5">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Hydraulic Scenario Controls
          </h3>
        </div>
        <button
          onClick={resetToDefault}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
          title="Reset sliders to baseline"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Preset Scenarios */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          Preset Benchmark Scenarios
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'cloudburst_2020', label: 'Cloudburst 2020 Replay' },
            { id: 'monsoon_surge', label: 'Monsoon Heavy Surge' },
            { id: 'drain_failure', label: 'Conduit Silt Blockage' },
            { id: 'optimal_drainage', label: '100% Desilted Best Case' },
          ].map((sc) => (
            <button
              key={sc.id}
              onClick={() => loadScenario(sc.id as SimulationParams['scenario'])}
              className={`rounded-xl p-2 text-left text-xs transition-all border ${
                params.scenario === sc.id
                  ? 'bg-cyan-600/30 border-cyan-400 text-white font-semibold'
                  : 'bg-command-950/70 border-white/5 text-slate-400 hover:bg-command-800'
              }`}
            >
              {sc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Slider 1: Rainfall Intensity */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <CloudRain className="h-3.5 w-3.5 text-cyan-400" />
            Rainfall Intensity
          </span>
          <span className="font-mono font-bold text-cyan-300">
            {params.rainfallIntensity} mm/h
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="150"
          step="5"
          value={params.rainfallIntensity}
          onChange={(e) =>
            setParams((prev) => ({
              ...prev,
              rainfallIntensity: Number(e.target.value),
              scenario: 'custom'
            }))
          }
          className="w-full accent-cyan-500 bg-command-950 rounded-lg cursor-pointer h-2"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>10 mm/h (Drizzle)</span>
          <span>75 mm/h (Downpour)</span>
          <span>150 mm/h (Extreme)</span>
        </div>
      </div>

      {/* Slider 2: Forecast Duration */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            Forecast Lead Duration
          </span>
          <span className="font-mono font-bold text-amber-300">
            {params.forecastDuration} min
          </span>
        </div>
        <input
          type="range"
          min="30"
          max="180"
          step="15"
          value={params.forecastDuration}
          onChange={(e) =>
            setParams((prev) => ({
              ...prev,
              forecastDuration: Number(e.target.value),
              scenario: 'custom'
            }))
          }
          className="w-full accent-amber-500 bg-command-950 rounded-lg cursor-pointer h-2"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>30 min</span>
          <span>90 min</span>
          <span>180 min (3h)</span>
        </div>
      </div>

      {/* Slider 3: Drainage Capacity */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <GitBranch className="h-3.5 w-3.5 text-purple-400" />
            Drainage Operational Capacity
          </span>
          <span className="font-mono font-bold text-purple-300">
            {params.drainageCapacity}%
          </span>
        </div>
        <input
          type="range"
          min="20"
          max="100"
          step="5"
          value={params.drainageCapacity}
          onChange={(e) =>
            setParams((prev) => ({
              ...prev,
              drainageCapacity: Number(e.target.value),
              scenario: 'custom'
            }))
          }
          className="w-full accent-purple-500 bg-command-950 rounded-lg cursor-pointer h-2"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>20% (Severe Silt)</span>
          <span>60% (Moderate)</span>
          <span>100% (Clean)</span>
        </div>
      </div>

      {/* Surface Runoff Imperviousness */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5 text-indigo-400" />
          Surface Runoff Imperviousness
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'low', label: 'Low (Porous)', desc: 'Green areas' },
            { id: 'medium', label: 'Medium', desc: 'Suburban' },
            { id: 'high', label: 'High (Paved)', desc: '88% Concrete' },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() =>
                setParams((prev) => ({
                  ...prev,
                  surfaceRunoff: r.id as SimulationParams['surfaceRunoff'],
                  scenario: 'custom'
                }))
              }
              className={`rounded-xl p-2 text-center text-xs transition-all border ${
                params.surfaceRunoff === r.id
                  ? 'bg-indigo-600/30 border-indigo-400 text-white font-semibold'
                  : 'bg-command-950/70 border-white/5 text-slate-400 hover:bg-command-800'
              }`}
            >
              <div className="font-semibold text-white">{r.label}</div>
              <div className="text-[10px] text-slate-400">{r.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Execute simulation button */}
      <button
        onClick={runSimulation}
        disabled={isSimulating}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-cyan-600/25 transition-all disabled:opacity-50"
      >
        <Play className="h-4 w-4 fill-current" />
        <span>{isSimulating ? 'Solving Hydrodynamics...' : 'Run Simulation Model'}</span>
      </button>
    </div>
  );
};
