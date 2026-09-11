import React from 'react';
import { RouteOption } from '../../types';
import { ShieldCheck, AlertTriangle, MapPin } from 'lucide-react';

interface RouteMapProps {
  routes: RouteOption[];
  selectedRouteId: string;
  onSelectRoute: (id: string) => void;
  className?: string;
}

export const RouteMap: React.FC<RouteMapProps> = ({
  routes,
  selectedRouteId,
  onSelectRoute,
  className = ''
}) => {
  const selectedRoute = routes.find(r => r.id === selectedRouteId) || routes[0];

  return (
    <div className={`relative w-full rounded-2xl bg-command-950 border border-white/10 overflow-hidden shadow-2xl ${className}`}>
      {/* Background GIS Grid */}
      <div className="absolute inset-0 radar-grid opacity-20 pointer-events-none" />

      {/* SVG Multi-Route Visualization */}
      <div className="w-full h-72 sm:h-96 flex items-center justify-center p-2">
        <svg viewBox="0 0 700 400" className="w-full h-full select-none">
          {/* Street Grid lines backdrop */}
          <g stroke="#1e293b" strokeWidth="1" opacity="0.6">
            <line x1="50" y1="120" x2="650" y2="120" />
            <line x1="50" y1="200" x2="650" y2="200" />
            <line x1="50" y1="280" x2="650" y2="280" />
            <line x1="180" y1="50" x2="180" y2="350" />
            <line x1="340" y1="50" x2="340" y2="350" />
            <line x1="500" y1="50" x2="500" y2="350" />
          </g>

          {/* Cooum Estuary outline for geographical reference */}
          <path
            d="M 440 240 C 470 230 500 245 505 270 C 510 295 480 310 460 305 C 440 300 430 280 435 260 Z"
            fill="#0369a1"
            opacity="0.3"
            stroke="#0284c7"
            strokeWidth="1"
          />
          <text x="445" y="275" fill="#38bdf8" fontSize="8" opacity="0.6">
            Cooum Estuary
          </text>

          {/* ROUTE A (Shortest, High Risk, Red) */}
          <g
            onClick={() => onSelectRoute('route-a')}
            className="cursor-pointer transition-opacity duration-200"
            opacity={selectedRouteId === 'route-a' ? 1 : 0.45}
          >
            {/* Pulsing hazard glow if selected */}
            {selectedRouteId === 'route-a' && (
              <path
                d="M 120 200 L 260 200 L 370 205 L 450 210 L 510 205 L 580 190"
                fill="none"
                stroke="#ef4444"
                strokeWidth="8"
                opacity="0.25"
              />
            )}
            <path
              d="M 120 200 L 260 200 L 370 205 L 450 210 L 510 205 L 580 190"
              fill="none"
              stroke="#ef4444"
              strokeWidth={selectedRouteId === 'route-a' ? 4 : 2.5}
              strokeDasharray={selectedRouteId === 'route-a' ? undefined : '5,3'}
            />
            {/* Flood Hazard Badge on Route A */}
            <circle cx="450" cy="210" r="14" fill="#ef4444" opacity="0.2" className="animate-ping" />
            <circle cx="450" cy="210" r="8" fill="#ef4444" stroke="#0b111d" strokeWidth="2" />
            <text x="450" y="235" textAnchor="middle" fill="#fca5a5" fontSize="8" fontWeight="bold">
              Bazullah Underpass (38cm)
            </text>
          </g>

          {/* ROUTE C (Sanath Nagar, Moderate, Amber) */}
          <g
            onClick={() => onSelectRoute('route-c')}
            className="cursor-pointer transition-opacity duration-200"
            opacity={selectedRouteId === 'route-c' ? 1 : 0.45}
          >
            <path
              d="M 120 200 L 210 130 L 350 115 L 470 130 L 580 190"
              fill="none"
              stroke="#f59e0b"
              strokeWidth={selectedRouteId === 'route-c' ? 4 : 2.5}
            />
            <circle cx="350" cy="115" r="5" fill="#f59e0b" stroke="#0b111d" strokeWidth="1.5" />
            <text x="350" y="105" textAnchor="middle" fill="#fde68a" fontSize="8">
              Drivers Colony (18cm runoff)
            </text>
          </g>

          {/* ROUTE B (Recommended, Low Risk, Green) */}
          <g
            onClick={() => onSelectRoute('route-b')}
            className="cursor-pointer transition-opacity duration-200"
            opacity={selectedRouteId === 'route-b' ? 1 : 0.5}
          >
            {/* Glowing path */}
            <path
              d="M 120 200 L 190 270 L 320 290 L 440 280 L 520 240 L 580 190"
              fill="none"
              stroke="#10b981"
              strokeWidth={selectedRouteId === 'route-b' ? 9 : 4}
              opacity="0.3"
            />
            <path
              d="M 120 200 L 190 270 L 320 290 L 440 280 L 520 240 L 580 190"
              fill="none"
              stroke="#10b981"
              strokeWidth={selectedRouteId === 'route-b' ? 4.5 : 3}
            />
            {/* Elevated flyover indicator */}
            <rect x="300" y="278" width="140" height="12" rx="3" fill="#065f46" stroke="#10b981" strokeWidth="1" opacity="0.8" />
            <text x="370" y="287" textAnchor="middle" fill="#a7f3d0" fontSize="8" fontWeight="bold">
              Sterling Rd Flyover (Flood-Safe)
            </text>
          </g>

          {/* ORIGIN PIN (Hitec City) */}
          <g transform="translate(120, 200)">
            <circle r="9" fill="#06b6d4" stroke="#070b12" strokeWidth="2" />
            <circle r="3" fill="#ffffff" />
            <rect x="-35" y="-28" width="70" height="18" rx="4" fill="#0f172a" stroke="#06b6d4" strokeWidth="1" />
            <text x="0" y="-16" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">
              START (T. Nagar)
            </text>
          </g>

          {/* DESTINATION PIN (Nungambakkam) */}
          <g transform="translate(580, 190)">
            <circle r="9" fill="#8b5cf6" stroke="#070b12" strokeWidth="2" />
            <circle r="3" fill="#ffffff" />
            <rect x="-42" y="-28" width="84" height="18" rx="4" fill="#0f172a" stroke="#8b5cf6" strokeWidth="1" />
            <text x="0" y="-16" textAnchor="middle" fill="#c4b5fd" fontSize="8" fontWeight="bold">
              END (Nungambakkam)
            </text>
          </g>
        </svg>
      </div>

      {/* Elevation and Hazard Profile Comparison Graph */}
      <div className="border-t border-white/10 bg-command-900/90 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white">Elevation & Inundation Profile</span>
            <span className="text-[10px] text-slate-400 font-mono">
              {selectedRoute.name}: {selectedRoute.distanceKm} km
            </span>
          </div>
          {selectedRoute.isRecommended && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/40">
              <ShieldCheck className="h-3 w-3" />
              SAFEST ROUTE (ZERO SUBMERSION)
            </span>
          )}
        </div>

        {/* Dynamic Elevation Chart */}
        <div className="h-16 w-full flex items-end gap-1 pt-2">
          {selectedRoute.elevationProfile.map((pt, i) => {
            const heightPercent = ((pt.elevationM - 480) / (600 - 480)) * 100;
            const hasWater = pt.waterDepthCm > 0;
            return (
              <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                {/* Tooltip on hover */}
                <div className="pointer-events-none absolute -top-8 hidden group-hover:flex flex-col items-center bg-command-950 p-1 rounded border border-white/10 text-[9px] text-slate-200 z-30">
                  <span>{pt.elevationM}m MSL</span>
                  {hasWater && <span className="text-rose-400 font-bold">{pt.waterDepthCm}cm flood</span>}
                </div>

                {/* Floodwater column */}
                {hasWater && (
                  <div
                    className="w-full bg-rose-500/80 rounded-t-sm"
                    style={{ height: `${Math.min(pt.waterDepthCm * 1.5, 30)}px` }}
                  />
                )}

                {/* Terrain bar */}
                <div
                  className={`w-full rounded-t-sm transition-all ${
                    selectedRoute.isRecommended ? 'bg-cyan-600/70' : 'bg-slate-700'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />

                <span className="text-[9px] text-slate-400 mt-1 font-mono">{pt.distanceKm}km</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
