import React, { useState } from 'react';
import { Zone } from '../../types';
import { mockZones } from '../../data/zones';
import { mockDrainageConduits } from '../../data/drainage';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  Compass,
  Eye,
  Info,
  Droplets,
  AlertCircle,
  Crosshair,
  Maximize2
} from 'lucide-react';
import { MapLegend } from './MapLegend';

interface InteractiveMapProps {
  onSelectZone?: (zone: Zone) => void;
  selectedZoneId?: string;
  isAuthority?: boolean;
  className?: string;
  showControls?: boolean;
  /** Override zone metrics (live coupled model). Geometry falls back to mock inventory. */
  zones?: Zone[];
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  onSelectZone,
  selectedZoneId,
  isAuthority = false,
  className = '',
  showControls = true,
  zones,
}) => {
  const { selectedZone, setSelectedZone, addToast } = useApp();

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showLegend, setShowLegend] = useState<boolean>(true);
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);
  const [hoveredZone, setHoveredZone] = useState<Zone | null>(null);

  // Layer toggles
  const [layers, setLayers] = useState({
    floodRisk: true,
    roads: true,
    rainfall: true,
    drainage: true,
    elevation: false,
    historical: false
  });

  const displayZones = zones && zones.length > 0 ? zones : mockZones;
  const isLiveData = displayZones !== mockZones;

  const activeZone = selectedZoneId
    ? displayZones.find((z) => z.id === selectedZoneId) || selectedZone
    : selectedZone;

  const handleZoneClick = (zone: Zone) => {
    if (onSelectZone) onSelectZone(zone);
    else setSelectedZone(zone);
  };

  const handleLocateMe = () => {
    const defaultZone = displayZones.find(z => z.id === 'zone-14') || displayZones[0];
    if (onSelectZone) onSelectZone(defaultZone);
    else setSelectedZone(defaultZone);
    addToast('Location Acquired', `Centered on ${defaultZone.name} (${defaultZone.code})`, 'info');
  };

  const toggleLayer = (layerKey: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  return (
    <div className={`relative w-full h-full min-h-[420px] bg-command-950 overflow-hidden rounded-2xl border border-white/10 ${className}`}>
      {/* Background GIS Grid Pattern */}
      <div className="absolute inset-0 radar-grid opacity-30 pointer-events-none" />

      {/* SVG GIS Map Surface */}
      <div className="w-full h-full flex items-center justify-center p-2 overflow-auto">
        <svg
          viewBox="0 0 800 520"
          className="w-full h-full max-h-[700px] select-none transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <defs>
            {/* Gradients */}
            <radialGradient id="lakeGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.4" />
            </radialGradient>

            <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="seaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0369a1" stopOpacity="0.0" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.55" />
            </linearGradient>

            <radialGradient id="radarRainStorm" cx="480" cy="270" r="180" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.35" />
              <stop offset="35%" stopColor="#f97316" stopOpacity="0.25" />
              <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>

            {/* Elevation Contour Pattern */}
            <pattern id="elevationLines" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 0 10 Q 10 0 20 10" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Elevation Contours Layer */}
          {layers.elevation && (
            <rect width="800" height="520" fill="url(#elevationLines)" opacity="0.8" />
          )}

          {/* Natural Water Bodies — Chennai: Cooum & Adyar rivers, Pallikaranai Marsh, Velachery Lake, Bay of Bengal */}
          <g id="waterbodies" className="transition-opacity duration-300">
            {/* Bay of Bengal (eastern seaboard) */}
            <rect x="655" y="0" width="145" height="520" fill="url(#seaGradient)" pointerEvents="none" />
            <text x="745" y="260" fill="#7dd3fc" fontSize="11" fontWeight="bold" letterSpacing="2" transform="rotate(90 745 260)" opacity="0.8">
              BAY OF BENGAL
            </text>

            {/* Buckingham Canal (north-south, along the coast) */}
            <path
              d="M 635 30 L 630 250 L 635 490"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeDasharray="7,4"
              opacity="0.7"
            />
            <text x="612" y="250" fill="#7dd3fc" fontSize="8" fontWeight="600" transform="rotate(90 612 250)" opacity="0.8">
              Buckingham Canal
            </text>

            {/* Cooum River (west → central → sea) */}
            <path
              d="M 20 262 Q 160 242 300 256 T 520 278 T 660 302"
              fill="none"
              stroke="url(#riverGradient)"
              strokeWidth="7"
              strokeLinecap="round"
              opacity="0.9"
            />
            <text x="150" y="248" fill="#7dd3fc" fontSize="9" fontWeight="bold" letterSpacing="1">
              COOUM RIVER
            </text>

            {/* Pallikaranai Marsh */}
            <path
              d="M 460 300 C 480 290 510 305 515 330 C 520 355 490 370 470 365 C 450 360 440 340 445 320 Z"
              fill="url(#lakeGradient)"
              stroke="#38bdf8"
              strokeWidth="1.5"
            />
            <text x="448" y="338" fill="#bae6fd" fontSize="9" fontWeight="600" letterSpacing="0.5">
              Pallikaranai Marsh
            </text>

            {/* Velachery Lake */}
            <path
              d="M 180 305 C 195 295 210 300 215 315 C 220 330 200 340 185 335 C 170 330 165 315 180 305 Z"
              fill="url(#lakeGradient)"
              stroke="#38bdf8"
              strokeWidth="1"
            />
            <text x="168" y="325" fill="#bae6fd" fontSize="8" fontWeight="500">
              Velachery Lake
            </text>

            {/* Adyar River Corridor */}
            <path
              d="M 20 445 Q 220 425 380 440 T 620 450 T 780 445"
              fill="none"
              stroke="url(#riverGradient)"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <text x="620" y="472" fill="#7dd3fc" fontSize="10" fontWeight="bold" letterSpacing="1">
              ADYAR RIVER
            </text>
          </g>

          {/* Historical Flood Outlines */}
          {layers.historical && (
            <g id="historicalFloods" opacity="0.4">
              <path
                d="M 430 240 Q 480 230 530 260 T 480 310 Z"
                fill="none"
                stroke="#ec4899"
                strokeWidth="2"
                strokeDasharray="4,4"
              />
              <path
                d="M 240 340 Q 300 330 330 380 T 260 420 Z"
                fill="none"
                stroke="#ec4899"
                strokeWidth="2"
                strokeDasharray="4,4"
              />
            </g>
          )}

          {/* Road Network Layer — Chennai arterials */}
          {layers.roads && (
            <g id="roadNetwork" opacity="0.6">
              {/* Chennai Bypass Arc (west) */}
              <path
                d="M 30 100 Q 80 460 220 500"
                fill="none"
                stroke="#475569"
                strokeWidth="4"
                strokeDasharray="8,2"
              />
              <text x="50" y="180" fill="#94a3b8" fontSize="8" transform="rotate(70 50 180)">
                Chennai Bypass
              </text>

              {/* Anna Salai Arterial */}
              <path
                d="M 120 80 L 440 270 L 650 350 L 780 410"
                fill="none"
                stroke="#64748b"
                strokeWidth="3"
              />
              <text x="210" y="125" fill="#cbd5e1" fontSize="9" fontWeight="bold">
                Anna Salai
              </text>

              {/* G.N. Chetty Road (T. Nagar east-west) */}
              <path
                d="M 380 265 L 620 260"
                fill="none"
                stroke="#64748b"
                strokeWidth="3.5"
              />
              <text x="488" y="255" fill="#e2e8f0" fontSize="8" fontWeight="bold">
                G.N. Chetty Rd
              </text>

              {/* 100 Feet Road, Velachery */}
              <path
                d="M 300 360 L 460 380 L 590 390"
                fill="none"
                stroke="#475569"
                strokeWidth="2.5"
              />
              <text x="238" y="356" fill="#94a3b8" fontSize="8" fontWeight="600">
                100 Feet Rd
              </text>

              {/* Sterling Road Link */}
              <path
                d="M 220 270 L 370 330 L 440 340"
                fill="none"
                stroke="#475569"
                strokeWidth="2.5"
              />
              <text x="292" y="308" fill="#94a3b8" fontSize="8" fontWeight="600">
                Sterling Rd
              </text>
            </g>
          )}

          {/* Radar Rainfall Intensity Overlay */}
          {layers.rainfall && (
            <circle cx="480" cy="270" r="180" fill="url(#radarRainStorm)" pointerEvents="none" />
          )}

          {/* Underground Stormwater Drainage Network */}
          {layers.drainage && (
            <g id="drainageNetwork">
              {mockDrainageConduits.map((conduit) => {
                const strokeColor =
                  conduit.status === 'surcharged'
                    ? '#ef4444'
                    : conduit.status === 'critical'
                    ? '#f97316'
                    : conduit.status === 'near_limit'
                    ? '#f59e0b'
                    : '#06b6d4';

                return (
                  <g key={conduit.id}>
                    <line
                      x1={conduit.coordinates.x1}
                      y1={conduit.coordinates.y1}
                      x2={conduit.coordinates.x2}
                      y2={conduit.coordinates.y2}
                      stroke={strokeColor}
                      strokeWidth={conduit.capacityPercent > 80 ? 3.5 : 2}
                      strokeDasharray={conduit.backflowRisk ? '5,3' : undefined}
                      className={conduit.backflowRisk ? 'animate-pulse' : ''}
                    />
                    <circle
                      cx={conduit.coordinates.x1}
                      cy={conduit.coordinates.y1}
                      r={conduit.capacityPercent > 85 ? 4.5 : 3}
                      fill={strokeColor}
                      stroke="#070b12"
                      strokeWidth="1.5"
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* Flood Risk Zones (Polygons & Markers) */}
          {layers.floodRisk && (
            <g id="floodRiskZones">
              {displayZones.map((zone) => {
                const isSelected = activeZone?.id === zone.id;
                const isHovered = hoveredZone?.id === zone.id;

                const colorConfig = {
                  critical: {
                    fill: 'rgba(239, 68, 68, 0.35)',
                    hoverFill: 'rgba(239, 68, 68, 0.55)',
                    stroke: '#ef4444',
                    marker: '#ef4444',
                    text: '#fca5a5',
                  },
                  high: {
                    fill: 'rgba(249, 115, 22, 0.30)',
                    hoverFill: 'rgba(249, 115, 22, 0.50)',
                    stroke: '#f97316',
                    marker: '#f97316',
                    text: '#fdba74',
                  },
                  moderate: {
                    fill: 'rgba(245, 158, 11, 0.25)',
                    hoverFill: 'rgba(245, 158, 11, 0.45)',
                    stroke: '#f59e0b',
                    marker: '#f59e0b',
                    text: '#fde68a',
                  },
                  low: {
                    fill: 'rgba(16, 185, 129, 0.20)',
                    hoverFill: 'rgba(16, 185, 129, 0.38)',
                    stroke: '#10b981',
                    marker: '#10b981',
                    text: '#a7f3d0',
                  },
                }[zone.riskLevel];

                return (
                  <g
                    key={zone.id}
                    onClick={() => handleZoneClick(zone)}
                    onMouseEnter={() => setHoveredZone(zone)}
                    onMouseLeave={() => setHoveredZone(null)}
                    className="cursor-pointer transition-all duration-200"
                  >
                    {/* Zone polygon catchment */}
                    {zone.polyPoints && (
                      <polygon
                        points={zone.polyPoints}
                        fill={isHovered || isSelected ? colorConfig.hoverFill : colorConfig.fill}
                        stroke={isSelected ? '#38bdf8' : colorConfig.stroke}
                        strokeWidth={isSelected ? 3 : isHovered ? 2 : 1.2}
                        className="transition-colors duration-200"
                      />
                    )}

                    {/* Zone Center Anchor */}
                    <g transform={`translate(${zone.coordinates.svgX}, ${zone.coordinates.svgY})`}>
                      {/* Critical pulse wave */}
                      {zone.riskLevel === 'critical' && (
                        <circle
                          r="18"
                          fill="none"
                          stroke={colorConfig.marker}
                          strokeWidth="1.5"
                          opacity="0.6"
                          className="animate-ping"
                        />
                      )}

                      {/* Selection reticle */}
                      {isSelected && (
                        <circle
                          r="20"
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="2"
                          strokeDasharray="4,3"
                        />
                      )}

                      {/* Main marker circle */}
                      <circle
                        r={isSelected ? 9 : 7.5}
                        fill={colorConfig.marker}
                        stroke="#070b12"
                        strokeWidth="2"
                        className="shadow-lg"
                      />

                      {/* Water Depth indicator pill */}
                      <rect
                        x="-24"
                        y="-26"
                        width="48"
                        height="15"
                        rx="4"
                        fill="#0b111d"
                        stroke={colorConfig.stroke}
                        strokeWidth="1"
                        opacity="0.9"
                      />
                      <text
                        x="0"
                        y="-16"
                        textAnchor="middle"
                        fill={colorConfig.text}
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {zone.code.replace('Zone ', 'Z-')}
                      </text>

                      {/* Risk % Pill */}
                      <text
                        x="0"
                        y="18"
                        textAnchor="middle"
                        fill="#f8fafc"
                        fontSize="8.5"
                        fontWeight="bold"
                        fontFamily="sans-serif"
                        className="drop-shadow"
                      >
                        {zone.floodProbability}%
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
          )}

          {/* Compass Rose */}
          <g transform="translate(740, 50)" opacity="0.7">
            <circle r="18" fill="#0b111d" stroke="#334155" strokeWidth="1" />
            <path d="M 0 -14 L 4 0 L -4 0 Z" fill="#ef4444" />
            <path d="M 0 14 L 4 0 L -4 0 Z" fill="#94a3b8" />
            <text x="0" y="-16" textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="bold">N</text>
          </g>
        </svg>
      </div>

      {/* Floating Zone Hover Card / Tooltip */}
      {hoveredZone && (
        <div className="pointer-events-none absolute top-4 left-4 z-20 rounded-xl bg-command-900/95 p-3.5 border border-white/10 shadow-2xl backdrop-blur-md max-w-xs animate-in fade-in duration-150">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-white font-mono">{hoveredZone.code}</span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                hoveredZone.riskLevel === 'critical'
                  ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                  : hoveredZone.riskLevel === 'high'
                  ? 'bg-orange-950 text-orange-300 border border-orange-500/40'
                  : 'bg-amber-950 text-amber-300 border border-amber-500/40'
              }`}
            >
              {hoveredZone.riskLevel.toUpperCase()}
            </span>
          </div>
          <h4 className="text-xs font-semibold text-slate-200 mt-1">{hoveredZone.name}</h4>
          <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-300 font-mono">
            <div>Prob: <span className="text-white font-bold">{hoveredZone.floodProbability}%</span></div>
            <div>Depth: <span className="text-cyan-300 font-bold">{hoveredZone.estimatedDepthCm} cm</span></div>
            <div>Onset: <span className="text-amber-300 font-bold">{hoveredZone.expectedOnsetMinutes} min</span></div>
            <div>Rain: <span className="text-white font-bold">{hoveredZone.rainfallMmPerHour} mm/h</span></div>
          </div>
        </div>
      )}

      {/* Map Action Controls (Right side) */}
      {showControls && (
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          {/* Layer Menu Button & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-command-900/90 text-slate-300 hover:text-white hover:bg-command-800 border border-white/10 shadow-lg backdrop-blur-md transition-colors"
              title="Toggle GIS Layers"
            >
              <Layers className="h-4 w-4" />
            </button>

            {showLayerMenu && (
              <div className="absolute right-11 top-0 z-30 w-52 rounded-xl bg-command-950/95 p-3 border border-white/10 shadow-2xl backdrop-blur-md text-xs">
                <div className="font-semibold text-white uppercase text-[10px] pb-2 border-b border-white/5 mb-2">
                  GIS Layer Controls
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                    <input
                      type="checkbox"
                      checked={layers.floodRisk}
                      onChange={() => toggleLayer('floodRisk')}
                      className="rounded bg-command-800 border-white/20 text-cyan-500 focus:ring-0"
                    />
                    <span>Flood Risk Zones</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                    <input
                      type="checkbox"
                      checked={layers.roads}
                      onChange={() => toggleLayer('roads')}
                      className="rounded bg-command-800 border-white/20 text-cyan-500 focus:ring-0"
                    />
                    <span>Roads & Highways</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                    <input
                      type="checkbox"
                      checked={layers.rainfall}
                      onChange={() => toggleLayer('rainfall')}
                      className="rounded bg-command-800 border-white/20 text-cyan-500 focus:ring-0"
                    />
                    <span>Radar Rainfall Intensity</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                    <input
                      type="checkbox"
                      checked={layers.drainage}
                      onChange={() => toggleLayer('drainage')}
                      className="rounded bg-command-800 border-white/20 text-cyan-500 focus:ring-0"
                    />
                    <span>Drainage Conduits</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-white">
                    <input
                      type="checkbox"
                      checked={layers.elevation}
                      onChange={() => toggleLayer('elevation')}
                      className="rounded bg-command-800 border-white/20 text-cyan-500 focus:ring-0"
                    />
                    <span>Elevation Contours</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-white">
                    <input
                      type="checkbox"
                      checked={layers.historical}
                      onChange={() => toggleLayer('historical')}
                      className="rounded bg-command-800 border-white/20 text-cyan-500 focus:ring-0"
                    />
                    <span>Historical Inundation</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Locate Button */}
          <button
            onClick={handleLocateMe}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-command-900/90 text-cyan-400 hover:text-cyan-300 hover:bg-command-800 border border-white/10 shadow-lg backdrop-blur-md transition-colors"
            title="Locate Current Position"
          >
            <Crosshair className="h-4 w-4" />
          </button>

          {/* Zoom In */}
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.25))}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-command-900/90 text-slate-300 hover:text-white hover:bg-command-800 border border-white/10 shadow-lg backdrop-blur-md transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>

          {/* Zoom Out */}
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-command-900/90 text-slate-300 hover:text-white hover:bg-command-800 border border-white/10 shadow-lg backdrop-blur-md transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>

          {/* Legend Toggle */}
          <button
            onClick={() => setShowLegend(!showLegend)}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 shadow-lg backdrop-blur-md transition-colors ${
              showLegend ? 'bg-cyan-600/30 text-cyan-300' : 'bg-command-900/90 text-slate-400 hover:text-white'
            }`}
            title="Toggle Legend"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Floating Legend (Bottom Left) */}
      {showLegend && (
        <div className="absolute bottom-4 left-4 z-20 max-w-xs hidden sm:block">
          <MapLegend />
        </div>
      )}

      {/* Real-time Status Overlay (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-10 hidden md:flex items-center gap-2 rounded-lg bg-command-950/80 px-3 py-1.5 border border-white/5 backdrop-blur-md text-[11px] text-slate-400">
        <span className={`flex h-2 w-2 rounded-full animate-pulse ${isLiveData ? 'bg-emerald-400' : 'bg-amber-400'}`} />
        <span>{isLiveData ? 'Live coupled-model zones' : '16 Active Micro-Basins Monitored'}</span>
      </div>
    </div>
  );
};
