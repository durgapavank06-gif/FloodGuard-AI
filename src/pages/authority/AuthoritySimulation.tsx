import React from 'react';
import { SimulationControl } from '../../components/simulation/SimulationControl';
import { BeforeAfterView } from '../../components/simulation/BeforeAfterView';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import { useSimulation } from '../../context/SimulationContext';
import {
  SlidersHorizontal,
  Play,
  RotateCcw,
  Sparkles,
  Map,
  Activity,
  Layers
} from 'lucide-react';

export const AuthoritySimulation: React.FC = () => {
  const { params, results } = useSimulation();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-white/5 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
          <SlidersHorizontal className="h-4 w-4" />
          <span>HYDROLOGIC WHAT-IF EXPERIMENTATION LABORATORY</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Flood Scenario Simulator
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Explore how changing conditions may affect flood risk, water depths, and emergency response resource allocations.
        </p>
      </div>

      {/* Main Grid: Controls on left, Live Simulated Map & Results on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Simulation Controls & Sliders */}
        <div className="space-y-4">
          <SimulationControl />
        </div>

        {/* Right 2 Columns: Large Map Visualization & Before/After Comparison */}
        <div className="lg:col-span-2 space-y-5">
          {/* Results Comparison Overview */}
          <BeforeAfterView />

          {/* Simulated Flood Footprint GIS Map */}
          <div className="rounded-2xl border border-white/10 bg-command-900/90 p-4 shadow-card-dark">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Map className="h-4 w-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                  Simulated Inundation Map: {params.rainfallIntensity} mm/h @ {params.drainageCapacity}% Capacity
                </h3>
              </div>
              <span className="rounded bg-command-800 px-2 py-0.5 text-[10px] font-mono text-cyan-300">
                Runoff: {params.surfaceRunoff.toUpperCase()}
              </span>
            </div>

            <div className="h-96 rounded-xl overflow-hidden border border-white/10 bg-command-950">
              <InteractiveMap
                isAuthority={true}
                className="h-full rounded-none border-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
