import React, { useState } from 'react';
import { RouteMap } from '../../components/map/RouteMap';
import { mockRouteComparison, mockRouteOrigins, mockRouteDestinations } from '../../data/routes';
import { RiskBadge } from '../../components/common/RiskBadge';
import {
  Navigation,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Clock,
  Car,
  Compass,
  CheckCircle2,
  Mountain
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CitizenRoutes: React.FC = () => {
  const { addToast } = useApp();
  const [fromLocation, setFromLocation] = useState(mockRouteOrigins[0]);
  const [toLocation, setToLocation] = useState(mockRouteDestinations[0]);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-b');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const handleFindRoute = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      addToast(
        'Hydraulic Route Solved',
        'Coupled model identified Route B with 0% submerged underpass exposure.',
        'success'
      );
    }, 400);
  };

  const selectedRoute =
    mockRouteComparison.find((r) => r.id === selectedRouteId) || mockRouteComparison[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Subtitle */}
      <div className="border-b border-white/5 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
          <Navigation className="h-4 w-4" />
          <span>Intelligent Flood-Avoidance Navigation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Safe Route Planner
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Dynamic routing algorithm coupling elevation contours and street-level water depths to keep you off submerged roads.
        </p>
      </div>

      {/* Input Search Form */}
      <form
        onSubmit={handleFindRoute}
        className="rounded-2xl border border-white/10 bg-command-900/90 p-5 shadow-card-dark"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          {/* From */}
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

          {/* To */}
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

          {/* Button */}
          <div>
            <button
              type="submit"
              disabled={isSearching}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-emerald-600/25 transition-all"
            >
              <Navigation className="h-4 w-4" />
              <span>{isSearching ? 'Calculating Safe Paths...' : 'Find Safe Route'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Main Content: Map Visual + 3 Route Options */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: Interactive Multi-Route GIS Map */}
        <div className="lg:col-span-2 space-y-4">
          <RouteMap
            routes={mockRouteComparison}
            selectedRouteId={selectedRouteId}
            onSelectRoute={setSelectedRouteId}
          />

          {/* Detailed Explanation Banner */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-4 backdrop-blur-md flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                Model Recommendation
              </h4>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                Route B is slightly longer (+0.9 km) but has significantly lower flood exposure. Avoids Begumpet Railway Subway which has 42cm standing water.
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: 3 Route Selection Cards */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Candidate Routes (3 Options)
          </h3>

          {mockRouteComparison.map((route) => {
            const isSelected = selectedRouteId === route.id;

            const borderTheme = {
              critical: 'border-rose-500/40 hover:border-rose-500 bg-rose-950/15',
              high: 'border-orange-500/40 hover:border-orange-500 bg-orange-950/15',
              moderate: 'border-amber-500/40 hover:border-amber-500 bg-amber-950/15',
              low: 'border-emerald-500/50 hover:border-emerald-400 bg-emerald-950/25',
            }[route.riskLevel];

            const activeRing = isSelected ? 'ring-2 ring-cyan-400 shadow-xl' : '';

            return (
              <div
                key={route.id}
                onClick={() => setSelectedRouteId(route.id)}
                className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${borderTheme} ${activeRing}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white font-mono">
                        {route.name}
                      </span>
                      {route.isRecommended && (
                        <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold">
                          ⭐ RECOMMENDED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {route.routeName}
                    </p>
                  </div>

                  <RiskBadge level={route.riskLevel} size="sm" />
                </div>

                {/* Metrics */}
                <div className="mt-3 grid grid-cols-3 gap-2 text-center rounded-xl bg-command-950/80 p-2.5 border border-white/5">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Distance</span>
                    <span className="text-xs font-bold font-mono text-white">
                      {route.distanceKm} km
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Est. Time</span>
                    <span className="text-xs font-bold font-mono text-white">
                      {route.durationMin} min
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Max Flood</span>
                    <span
                      className={`text-xs font-bold font-mono ${
                        route.maxFloodDepthCm > 20
                          ? 'text-rose-400'
                          : route.maxFloodDepthCm > 10
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {route.maxFloodDepthCm} cm
                    </span>
                  </div>
                </div>

                {/* Summary */}
                <p className="mt-2.5 text-[11px] text-slate-300 leading-normal">
                  {route.summary}
                </p>

                {/* Hazards count if any */}
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
    </div>
  );
};
