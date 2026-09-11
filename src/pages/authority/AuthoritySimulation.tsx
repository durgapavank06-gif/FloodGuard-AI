import React, { useEffect, useRef } from 'react';
import { SimulationControl } from '../../components/simulation/SimulationControl';
import { BeforeAfterView } from '../../components/simulation/BeforeAfterView';
import { LiveSimulationPanel } from '../../components/simulation/LiveSimulationPanel';
import { DataModeToggle } from '../../components/common/DataModeToggle';
import { useSimulation } from '../../context/SimulationContext';
import { useDataMode } from '../../context/DataModeContext';
import { useLiveSimulation } from '../../hooks/useLiveSimulation';
import {
  SlidersHorizontal,
  Map,
  Loader2
} from 'lucide-react';

export const AuthoritySimulation: React.FC = () => {
  const { params, results } = useSimulation();
  const { mode } = useDataMode();

  // REAL mode: auto re-solve the coupled model (debounced) as sliders move.
  // FAKE mode: hook stays idle and the map falls back to the demo profile.
  const live = useLiveSimulation(params, { auto: true });
  const showingLive = mode === 'real' && live.zones !== null;
  const cesiumRef = useRef<HTMLIFrameElement>(null);

  // Drive the embedded Cesium water sim with the OUTER bars.
  // The inbuilt control box is hidden inside the iframe (?embed=sim).
  useEffect(() => {
    const payload = {
      type: 'FLOODGUARD_RAIN',
      intensity: params.rainfallIntensity,
      drainage: params.drainageCapacity,
      duration: params.forecastDuration,
    };
    const send = () => {
      try {
        cesiumRef.current?.contentWindow?.postMessage(payload, '*');
      } catch {
        /* noop */
      }
    };
    send();
    const t1 = setTimeout(send, 1200);
    const t2 = setTimeout(send, 3500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [params.rainfallIntensity, params.drainageCapacity, params.forecastDuration]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-white/5 pb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
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
        <DataModeToggle loading={live.running} />
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

          {/* Live coupled-model run (REAL mode) */}
          <LiveSimulationPanel
            live={{ zones: live.zones, aggregates: live.aggregates, running: live.running, error: live.error }}
            onRun={() => live.runLive(params)}
          />

          {/* Simulated Flood Footprint GIS Map */}
          <div className="rounded-2xl border border-white/10 bg-command-900/90 p-4 shadow-card-dark">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Map className="h-4 w-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                  Simulated Inundation Map: {params.rainfallIntensity} mm/h @ {params.drainageCapacity}% Capacity
                </h3>
                {showingLive && (
                  <span className="rounded-full bg-emerald-500/15 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                    {live.running && <Loader2 className="h-3 w-3 animate-spin" />}
                    ● LIVE MODEL
                  </span>
                )}
                {mode === 'real' && !showingLive && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold flex items-center gap-1 ${
                    live.running
                      ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300'
                      : live.attempted
                      ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300'
                      : 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300'
                  }`}>
                    {live.running && <Loader2 className="h-3 w-3 animate-spin" />}
                    {live.running ? 'SOLVING LIVE…' : live.attempted ? 'API OFFLINE — DEMO MAP' : 'CONNECTING…'}
                  </span>
                )}
                {mode === 'fake' && (
                  <span className="rounded-full bg-slate-500/15 border border-slate-500/40 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                    DEMO MAP
                  </span>
                )}
              </div>
              <span className="rounded bg-command-800 px-2 py-0.5 text-[10px] font-mono text-cyan-300">
                Runoff: {params.surfaceRunoff.toUpperCase()}
              </span>
            </div>

            <div className="h-96 rounded-xl overflow-hidden border border-white/10 bg-command-950">
              <iframe
                ref={cesiumRef}
                src="/underground.html?embed=sim"
                className="w-full h-full border-0"
                title="Cesium 3D Subsurface Twin (driven by outer rainfall bar)"
              />
            </div>
            {mode === 'real' && live.error && (
              <p className="mt-2 text-[11px] font-mono text-amber-400">
                Live solve failed ({live.error}) — showing demo geometry. Start the Flask API on :5000.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
