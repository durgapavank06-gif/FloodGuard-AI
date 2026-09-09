import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Waves,
  Shield,
  CloudRain,
  BrainCircuit,
  MapPin,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  GitBranch,
  Navigation,
  SlidersHorizontal,
  History,
  CheckCircle2,
  Radio,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';
import { mockZones } from '../data/zones';

export const LandingPage: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="min-h-screen bg-command-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Banner / SIH recognition */}
      <div className="border-b border-white/5 bg-command-900/60 py-2 px-4 text-center text-[11px] text-slate-400">
        <span className="inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
          <strong className="text-white">SIH Problem Statement 26085:</strong> Urban Flood Nowcasting System (Drainage and Rainfall Coupling) • 
          <span className="text-cyan-400 font-medium ml-1">Ministry of Earth Sciences (MoES) / NCMRWF</span>
        </span>
      </div>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Background glow effects */}
        <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-cyan-600/15 via-blue-600/10 to-transparent blur-3xl rounded-full" />
        <div className="pointer-events-none absolute top-10 right-10 w-96 h-96 bg-rose-600/10 blur-3xl rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-4 py-1.5 text-xs font-semibold text-cyan-300 shadow-glow-cyan mb-6 backdrop-blur-md">
              <Radio className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
              <span>Urban Flood Intelligence & Nowcasting</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Predict Floods Before They Become <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">Disasters</span>
            </h1>

            <p className="mt-6 text-base sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
              Transform rainfall, terrain and drainage information into actionable urban flood-risk intelligence with a 0–3 hour forward-looking nowcast window.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => navigate('/role-selection')}
                className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-600/30 transition-all hover:scale-105"
              >
                <span>Explore Flood Intelligence</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => navigate('/citizen/map')}
                className="flex items-center gap-2 rounded-xl bg-command-800 hover:bg-command-750 px-6 py-3.5 text-sm font-semibold text-slate-200 border border-white/10 transition-colors"
              >
                <span>View Risk Map</span>
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left border-y border-white/5 py-5 max-w-3xl mx-auto">
              <div>
                <span className="text-2xl font-bold font-mono text-cyan-400">0–3h</span>
                <p className="text-xs text-slate-400 mt-0.5">Nowcast Lead Window</p>
              </div>
              <div>
                <span className="text-2xl font-bold font-mono text-white">1m DEM</span>
                <p className="text-xs text-slate-400 mt-0.5">Micro-Topography Res.</p>
              </div>
              <div>
                <span className="text-2xl font-bold font-mono text-white">148 Drains</span>
                <p className="text-xs text-slate-400 mt-0.5">Graph Network Coupled</p>
              </div>
              <div>
                <span className="text-2xl font-bold font-mono text-emerald-400">Street-Level</span>
                <p className="text-xs text-slate-400 mt-0.5">Water Depth Nowcasting</p>
              </div>
            </div>
          </div>

          {/* HERO VISUAL: Large Futuristic City Flood-Risk Visualization */}
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
                  DWR-HYD // COUPLED HYDRAULIC SURFACE SOLVER
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  LIVE TELEMETRY
                </span>
                <span className="text-slate-400">19:15:00 IST</span>
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

                  {/* Drainage conduits with glow */}
                  <line x1="160" y1="140" x2="340" y2="240" stroke="#06b6d4" strokeWidth="3" strokeDasharray="6,3" />
                  <line x1="340" y1="240" x2="460" y2="240" stroke="#ef4444" strokeWidth="4" />

                  {/* Zones & Markers */}
                  {/* Critical Zone Marker */}
                  <g transform="translate(340, 240)">
                    <circle r="22" fill="none" stroke="#ef4444" strokeWidth="1.5" className="animate-ping" opacity="0.6" />
                    <circle r="10" fill="#ef4444" stroke="#0b111d" strokeWidth="2" />
                    <rect x="-40" y="-32" width="80" height="18" rx="4" fill="#0b111d" stroke="#ef4444" strokeWidth="1" />
                    <text x="0" y="-20" textAnchor="middle" fill="#fca5a5" fontSize="9" fontWeight="bold" fontFamily="monospace">
                      ZONE 14: 91%
                    </text>
                  </g>

                  {/* High Risk Zone Marker */}
                  <g transform="translate(160, 140)">
                    <circle r="8" fill="#f97316" stroke="#0b111d" strokeWidth="2" />
                    <rect x="-35" y="-30" width="70" height="18" rx="4" fill="#0b111d" stroke="#f97316" strokeWidth="1" />
                    <text x="0" y="-18" textAnchor="middle" fill="#fdba74" fontSize="9" fontWeight="bold" fontFamily="monospace">
                      ZONE 21: 79%
                    </text>
                  </g>

                  {/* Safe Zone Marker */}
                  <g transform="translate(460, 140)">
                    <circle r="8" fill="#10b981" stroke="#0b111d" strokeWidth="2" />
                    <rect x="-35" y="-30" width="70" height="18" rx="4" fill="#0b111d" stroke="#10b981" strokeWidth="1" />
                    <text x="0" y="-18" textAnchor="middle" fill="#a7f3d0" fontSize="9" fontWeight="bold" fontFamily="monospace">
                      ZONE 01: 18%
                    </text>
                  </g>
                </svg>

                {/* Floating bottom radar tag */}
                <div className="absolute bottom-3 left-3 bg-command-900/90 border border-white/10 px-3 py-1.5 rounded-lg text-[11px] text-slate-300 backdrop-blur-md flex items-center gap-2 font-mono">
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                  <span>BEGUMPET UNDERPASS: 42cm INUNDATION EXPECTED (+27 MIN)</span>
                </div>
              </div>

              {/* Right: Small live dashboard statistics */}
              <div className="flex flex-col justify-between gap-3">
                <div className="rounded-xl bg-command-950 p-4 border border-white/10">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Critical Basin Alert</span>
                    <span className="rounded bg-rose-500/20 text-rose-300 px-1.5 py-0.5 text-[10px] font-bold">
                      LEVEL 4
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-1">Zone 14 (Begumpet)</h4>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="rounded bg-command-900 p-2">
                      <span className="text-slate-400 text-[10px]">Prob:</span>
                      <p className="text-rose-400 font-bold text-lg">91%</p>
                    </div>
                    <div className="rounded bg-command-900 p-2">
                      <span className="text-slate-400 text-[10px]">Depth:</span>
                      <p className="text-cyan-300 font-bold text-lg">42 cm</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-command-950 p-4 border border-white/10 space-y-2">
                  <span className="text-xs font-semibold text-slate-300">Coupled Solver Attributions</span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Rainfall Overload:</span>
                      <span className="font-mono text-cyan-400 font-bold">68 mm/h (92%)</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Drain D-104 Surcharge:</span>
                      <span className="font-mono text-rose-400 font-bold">82% Limit</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Basin Depression:</span>
                      <span className="font-mono text-amber-400 font-bold">498m MSL</span>
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
        </div>
      </section>

      {/* WHY FLOODGUARD AI? */}
      <section className="py-16 border-t border-white/5 bg-command-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
              The Science of Coupling
            </h2>
            <h3 className="mt-2 text-3xl font-extrabold text-white">
              Why FloodGuard AI?
            </h3>
            <p className="mt-3 text-sm text-slate-300">
              Weather models predict rain. FloodGuard AI couples real-time radar with 1m DEM terrain models and underground pipe graphs to predict actual street water depth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="rounded-2xl border border-white/10 bg-command-900/80 p-6 shadow-card-dark hover:border-cyan-500/40 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30 mb-4 text-xl">
                🌧
              </div>
              <h4 className="text-base font-bold text-white">Rainfall Intelligence</h4>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Monitor rainfall intensity and changing weather conditions via Doppler Weather Radar nowcasts updated continuously.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-white/10 bg-command-900/80 p-6 shadow-card-dark hover:border-cyan-500/40 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-950 text-purple-400 border border-purple-500/30 mb-4 text-xl">
                🧠
              </div>
              <h4 className="text-base font-bold text-white">AI Risk Analysis</h4>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Understand the hydrodynamic factors contributing to flood risk—including soil saturation, slope runoff, and conduit choking.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-white/10 bg-command-900/80 p-6 shadow-card-dark hover:border-cyan-500/40 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-950 text-blue-400 border border-blue-500/30 mb-4 text-xl">
                🗺
              </div>
              <h4 className="text-base font-bold text-white">Street-Level Risk Mapping</h4>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Visualize high-risk locations across the city down to individual intersections, underpasses, and drainage catchments.
              </p>
            </div>

            {/* Card 4 */}
            <div className="rounded-2xl border border-white/10 bg-command-900/80 p-6 shadow-card-dark hover:border-cyan-500/40 transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-950 text-rose-400 border border-rose-500/30 mb-4 text-xl">
                🚨
              </div>
              <h4 className="text-base font-bold text-white">Early Warning</h4>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Identify potential flooding up to 180 minutes before it becomes critical, giving citizens and emergency responders time to act.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS: Visual Process Pipeline */}
      <section className="py-20 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
              Pipeline Architecture
            </h2>
            <h3 className="mt-2 text-3xl font-extrabold text-white">
              How It Works
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Coupling meteorological forecasts with hydraulic surface physics.
            </p>
          </div>

          {/* Visual Step-by-Step Flow */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
              {/* Step 1 */}
              <div className="rounded-2xl border border-white/10 bg-command-900 p-5 text-center flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-950/70 border border-blue-500/30 text-blue-400 mb-3 font-mono font-bold">
                  01
                </div>
                <h4 className="text-sm font-bold text-white">Rainfall</h4>
                <p className="mt-1.5 text-xs text-slate-400">
                  Doppler Radar Nowcasts & AWS rain gauge feeds in real time.
                </p>
              </div>

              {/* Step 2 */}
              <div className="rounded-2xl border border-white/10 bg-command-900 p-5 text-center flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-950/70 border border-purple-500/30 text-purple-400 mb-3 font-mono font-bold">
                  02
                </div>
                <h4 className="text-sm font-bold text-white">Terrain + Drainage</h4>
                <p className="mt-1.5 text-xs text-slate-400">
                  1m LIDAR Digital Elevation Model coupled with 1D pipe graphs.
                </p>
              </div>

              {/* Step 3 */}
              <div className="rounded-2xl border border-white/10 bg-command-900 p-5 text-center flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 mb-3 font-mono font-bold">
                  03
                </div>
                <h4 className="text-sm font-bold text-white">Risk Analysis</h4>
                <p className="mt-1.5 text-xs text-slate-400">
                  Overcapacity & backflow hydrodynamic calculations across all nodes.
                </p>
              </div>

              {/* Step 4 */}
              <div className="rounded-2xl border border-white/10 bg-command-900 p-5 text-center flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-950/70 border border-orange-500/30 text-orange-400 mb-3 font-mono font-bold">
                  04
                </div>
                <h4 className="text-sm font-bold text-white">Flood Prediction</h4>
                <p className="mt-1.5 text-xs text-slate-400">
                  Centimeter-level water depth and earliest onset estimations.
                </p>
              </div>

              {/* Step 5 */}
              <div className="rounded-2xl border border-white/10 bg-command-900 p-5 text-center flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-950/70 border border-rose-500/30 text-rose-400 mb-3 font-mono font-bold">
                  05
                </div>
                <h4 className="text-sm font-bold text-white">Actionable Alert</h4>
                <p className="mt-1.5 text-xs text-slate-400">
                  Citizen safe routes and authority dewatering pump dispatches.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KEY CAPABILITIES */}
      <section className="py-20 border-t border-white/5 bg-command-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
              Operational Toolkit
            </h2>
            <h3 className="mt-2 text-3xl font-extrabold text-white">
              Key Capabilities
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: '3-Hour Flood Nowcasting',
                desc: 'Continuous radar time-step projections indicating impending water accumulation before clouds peak.',
                icon: Clock,
                color: 'text-cyan-400',
              },
              {
                title: 'Street-Level Risk Mapping',
                desc: 'Sub-meter precision spatial GIS displaying road inundation contours, vulnerable underpasses, and riverbanks.',
                icon: MapPin,
                color: 'text-blue-400',
              },
              {
                title: 'Drainage Monitoring',
                desc: 'Directed graph mathematical representation of underground culverts, inlets, flow rates, and surcharge points.',
                icon: GitBranch,
                color: 'text-purple-400',
              },
              {
                title: 'Safe Route Planning',
                desc: 'Navigation engine computing flood-safe alternative pathways avoiding submerged underpasses and waterlogged avenues.',
                icon: Navigation,
                color: 'text-emerald-400',
              },
              {
                title: 'Flood Simulation',
                desc: 'Interactive scenario laboratory to stress-test cloudburst intensities and desilting capacities dynamically.',
                icon: SlidersHorizontal,
                color: 'text-amber-400',
              },
              {
                title: 'Historical Flood Intelligence',
                desc: 'Longitudinal analysis correlating multi-year rainfall thresholds against micro-basin inundation events.',
                icon: History,
                color: 'text-rose-400',
              },
            ].map((cap, i) => {
              const Icon = cap.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-command-900/90 p-6 shadow-card-dark hover:border-cyan-500/40 transition-all"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-command-800 mb-4">
                    <Icon className={`h-5 w-5 ${cap.color}`} />
                  </div>
                  <h4 className="text-base font-bold text-white">{cap.title}</h4>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">{cap.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-24 border-t border-white/10 relative overflow-hidden bg-gradient-to-b from-command-950 via-command-900 to-command-950">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Be Ready Before the Water Rises.
          </h2>
          <p className="mt-4 text-base text-slate-300 max-w-xl mx-auto">
            Experience next-generation urban flood nowcasting engineered for municipal authorities, disaster management agencies, and everyday citizens.
          </p>
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigate('/role-selection')}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-cyan-600/30 transition-all hover:scale-105"
            >
              <span>Enter FloodGuard AI</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-command-950 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Waves className="h-4 w-4 text-cyan-400" />
            <span className="font-bold text-slate-300">FloodGuard AI</span>
            <span>• Ministry of Earth Sciences (MoES) / NCMRWF</span>
          </div>
          <p className="text-[11px]">
            SIH Problem Statement 26085 — Urban Flood Nowcasting System (Drainage and Rainfall Coupling)
          </p>
        </div>
      </footer>
    </div>
  );
};
