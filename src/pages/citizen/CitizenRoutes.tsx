import React, { useState } from 'react';
import { RouteMap } from '../../components/map/RouteMap';
import { mockRouteComparison, mockRouteOrigins, mockRouteDestinations } from '../../data/routes';
import { RiskBadge } from '../../components/common/RiskBadge';
import { DataModeToggle } from '../../components/common/DataModeToggle';
import { useDataMode } from '../../context/DataModeContext';
import { api, SafeRouteOption } from '../../services/api';
import {
  Navigation,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Route as RouteIcon,
  Loader2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CitizenRoutes: React.FC = () => {
  const { addToast } = useApp();
  const { mode, apiUrl } = useDataMode();
  const [fromLocation, setFromLocation] = useState(mockRouteOrigins[0]);
  const [toLocation, setToLocation] = useState(mockRouteDestinations[0]);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-b');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [liveRoutes, setLiveRoutes] = useState<SafeRouteOption[] | null>(null);
  const [liveDepths, setLiveDepths] = useState<Record<string, number> | null>(null);

  const isLiveMode = mode === 'real' && liveRoutes !== null;

  const handleFindRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    if (mode === 'fake') {
      setTimeout(() => {
        setIsSearching(false);
        addToast(
          'Hydraulic Route Solved',
          'Coupled model identified Route B with 0% submerged underpass exposure.',
          'success'
        );
      }, 400);
      return;
    }
    try {
      const res = await api.safeRoute(apiUrl, {
        origin: fromLocation,
        destination: toLocation,
        mode: 'real',
        avoid_depth_cm: 15,
        alternatives: 3,
      });
      setLiveRoutes(res.routes);
      setLiveDepths(res.depthsByZoneCm);
      const rec = res.routes.find((r) => r.recommended) || res.routes[0];
      setSelectedRouteId(rec.id);
      addToast(
        'Live Safe Route Solved',
        `${rec.id.toUpperCase()} via ${rec.legs.map((l) => l.via).slice(0, 2).join(', ')} — max ${rec.maxDepthCm}cm exposure.`,
        'success'
      );
    } catch (err) {
      addToast('Routing API unreachable', `Falling back to demo corridors. ${err}`, 'error');
      setLiveRoutes(null);
    } finally {
      setIsSearching(false);
    }
  };

  const selectedRoute =
    mockRouteComparison.find((r) => r.id === selectedRouteId) || mockRouteComparison[0];
  const selectedLive = liveRoutes?.find((r) => r.id === selectedRouteId) || liveRoutes?.[0];

  const borderTheme = (risk: string) =>
    ({
      critical: 'border-rose-500/40 hover:border-rose-500 bg-rose-950/15',
      high: 'border-orange-500/40 hover:border-orange-500 bg-orange-950/15',
      moderate: 'border-amber-500/40 hover:border-amber-500 bg-amber-950/15',
      low: 'border-emerald-500/50 hover:border-emerald-400 bg-emerald-950/25',
    }[risk as 'critical' | 'high' | 'moderate' | 'low']);

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Subtitle */}
      <div className="border-b border-white/5 pb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Navigation className="h-4 w-4" />
            <span>Intelligent Flood-Avoidance Navigation</span>
            {isLiveMode && (
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                ● LIVE /api/routes/safe-route
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Safe Route Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Dynamic routing algorithm coupling elevation contours and street-level water depths to keep you off submerged roads.
          </p>
        </div>
        <DataModeToggle loading={isSearching} />
      </div>

      {/* Input Search Form */}
      <form
        onSubmit={handleFindRoute}
        className="rounded-2xl border border-white/10 bg-command-900/90 p-5 shadow-card-dark"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-cyan-400" />
              From (Origin)
            </label>
            <select
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              className="w-full rounded-xl bg-command-950 border border-white/10 px-3 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              {mockRouteOrigins.map((loc, i) => (
                <option key={i} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-purple-400" />
              To (Destination)
            </label>
            <select
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              className="w-full rounded-xl bg-command-950 border border-white/10 px-3 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              {mockRouteDestinations.map((loc, i) => (
                <option key={i} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSearching}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-60"
            >
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
              <span>{isSearching ? 'Calculating Safe Paths...' : mode === 'real' ? 'Find Safe Route (Live API)' : 'Find Safe Route'}</span>
            </button>
          </div>
        </div>
        {mode === 'real' && (
          <p className="mt-3 text-[11px] font-mono text-slate-400">
            POST /api/routes/safe-route → Dijkstra over flood-weighted street graph (cost = duration × (1 + depth/12)).
            External maps: Mapbox / OSRM / Google can query the same endpoint.
          </p>
        )}
      </form>

      {/* LIVE MODE: API route cards + turn-by-turn legs */}
      {mode === 'real' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-4">
            {liveRoutes ? (
              <div className="rounded-2xl border border-white/10 bg-command-900/90 p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
                  <RouteIcon className="h-4 w-4 text-cyan-400" />
                  {selectedLive?.id.toUpperCase()} — Turn by Turn ({selectedLive?.distanceKm} km, ~{selectedLive?.durationMin} min)
                </h3>
                <div className="mt-4 space-y-0">
                  {selectedLive?.legs.map((leg, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`h-3 w-3 rounded-full mt-1 ${leg.depthCm > 15 ? 'bg-rose-500' : leg.depthCm > 8 ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                        {i < (selectedLive?.legs.length || 0) - 1 && <div className="w-px flex-1 bg-white/10" />}
                      </div>
                      <div className="pb-4">
                        <p className="text-xs font-bold text-white">{leg.from} → {leg.to}</p>
                        <p className="text-[11px] text-slate-400">
                          via {leg.via} • {leg.km} km • water{' '}
                          <span className={`font-mono font-bold ${leg.depthCm > 15 ? 'text-rose-400' : leg.depthCm > 8 ? 'text-amber-300' : 'text-emerald-300'}`}>
                            {leg.depthCm} cm
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {liveDepths && (
                  <p className="mt-2 text-[11px] font-mono text-slate-500">
                    Live zone depths (cm): {Object.entries(liveDepths).map(([k, v]) => `${k}=${v}`).join('  ')}
                  </p>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/15 bg-command-900/60 p-8 text-center">
                <Navigation className="h-8 w-8 text-slate-500 mx-auto" />
                <p className="mt-3 text-sm font-bold text-white">No live route yet</p>
                <p className="mt-1 text-xs text-slate-400">
                  Pick an origin/destination and hit “Find Safe Route (Live API)” to solve the flood-weighted graph on the backend.
                </p>
              </div>
            )}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-4 backdrop-blur-md flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  Model Recommendation
                </h4>
                <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                  {selectedLive ? selectedLive.summary : 'Run a live query to get the recommended corridor with minimum flood exposure.'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Candidate Routes {liveRoutes ? `(${liveRoutes.length} live)` : '(press Find)'}
            </h3>
            {(liveRoutes || []).map((route) => {
              const isSelected = selectedRouteId === route.id;
              return (
                <div
                  key={route.id}
                  onClick={() => setSelectedRouteId(route.id)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${borderTheme(route.riskLevel)} ${isSelected ? 'ring-2 ring-cyan-400 shadow-xl' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-white font-mono">{route.id.toUpperCase()}</span>
                        {route.recommended && (
                          <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold">
                            ⭐ RECOMMENDED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{route.legs[0]?.via} → {route.legs[route.legs.length - 1]?.via}</p>
                    </div>
                    <RiskBadge level={route.riskLevel} size="sm" />
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center rounded-xl bg-command-950/80 p-2.5 border border-white/5">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Distance</span>
                      <span className="text-xs font-bold font-mono text-white">{route.distanceKm} km</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Est. Time</span>
                      <span className="text-xs font-bold font-mono text-white flex items-center justify-center gap-1">
                        <Clock className="h-3 w-3" />{route.durationMin} min
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Max Flood</span>
                      <span className={`text-xs font-bold font-mono ${route.maxDepthCm > 20 ? 'text-rose-400' : route.maxDepthCm > 10 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {route.maxDepthCm} cm
                      </span>
                    </div>
                  </div>
                  <p className="mt-2.5 text-[11px] text-slate-300 leading-normal">{route.summary}</p>
                  <p className="mt-2 text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    Exposure score {route.floodExposureScore}% • {route.legs.length} legs
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FAKE MODE: original demo corridors */}
      {mode === 'fake' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-4">
            <RouteMap
              routes={mockRouteComparison}
              selectedRouteId={selectedRouteId}
              onSelectRoute={setSelectedRouteId}
            />
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-4 backdrop-blur-md flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  Model Recommendation (demo)
                </h4>
                <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                  Route B is slightly longer (+0.9 km) but has significantly lower flood exposure. Avoids Bazullah Road underpass which has 38cm standing water.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Candidate Routes (3 demo options)
            </h3>
            {mockRouteComparison.map((route) => {
              const isSelected = selectedRouteId === route.id;
              return (
                <div
                  key={route.id}
                  onClick={() => setSelectedRouteId(route.id)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${borderTheme(route.riskLevel)} ${isSelected ? 'ring-2 ring-cyan-400 shadow-xl' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-white font-mono">{route.name}</span>
                        {route.isRecommended && (
                          <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold">
                            ⭐ RECOMMENDED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{route.routeName}</p>
                    </div>
                    <RiskBadge level={route.riskLevel} size="sm" />
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center rounded-xl bg-command-950/80 p-2.5 border border-white/5">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Distance</span>
                      <span className="text-xs font-bold font-mono text-white">{route.distanceKm} km</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Est. Time</span>
                      <span className="text-xs font-bold font-mono text-white">{route.durationMin} min</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Max Flood</span>
                      <span className={`text-xs font-bold font-mono ${route.maxFloodDepthCm > 20 ? 'text-rose-400' : route.maxFloodDepthCm > 10 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {route.maxFloodDepthCm} cm
                      </span>
                    </div>
                  </div>
                  <p className="mt-2.5 text-[11px] text-slate-300 leading-normal">{route.summary}</p>
                  {route.hazards.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-rose-400">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      <span>{route.hazards.length} high-inundation points along route</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
