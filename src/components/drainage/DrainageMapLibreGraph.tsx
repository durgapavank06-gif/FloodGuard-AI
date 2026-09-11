import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  CHENNAI_CENTER,
  CHENNAI_DRAINAGE_NETWORK,
  CHENNAI_INFERRED_NETWORK,
  CHENNAI_MANHOLES,
  NetworkManhole,
} from '../../data/chennai-network-data';
import { useNetworkSim } from '../../context/NetworkSimContext';
import {
  AlertTriangle,
  Flame,
  ShieldAlert,
  Sliders,
  Maximize2,
  Compass,
  Layers,
  Droplets,
  Wind,
  Info,
  RotateCcw,
} from 'lucide-react';

interface AtRiskManhole extends NetworkManhole {
  status: 'surcharged' | 'near_capacity';
  surchargeDepthCm: number;
  hydraulicHeadKpa: number;
  backflowRateM3s: number;
  riskScore: number;
}

export const DrainageMapLibreGraph: React.FC<{ className?: string }> = ({ className = '' }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);

  const { intensity, velocity, setIntensity, setVelocity, effectiveRain } = useNetworkSim();
  const [filterMode, setFilterMode] = useState<'all_risk' | 'surcharged_only'>('all_risk');
  const [selectedManhole, setSelectedManhole] = useState<AtRiskManhole | null>(null);
  const [is3D, setIs3D] = useState(true);

  // Compute which manholes are AT RISK based on intensity and velocity
  const atRiskManholes: AtRiskManhole[] = useMemo(() => {
    const list: AtRiskManhole[] = [];

    // Elevation range is 6m to 24m. Lower elevations experience higher surcharge pressure.
    for (const m of CHENNAI_MANHOLES) {
      const elev = m.elevation || 12;
      // Hydraulic head factor: low elevation + high effective rainfall creates hydraulic surcharge
      const headFactor =
        (effectiveRain / 48) *
        Math.pow(Math.max(1, 19 - elev) / 10, 1.25) *
        (0.75 + 0.25 * velocity);

      if (headFactor >= 1.15) {
        // Critical surcharge (water breaching rim, roadway flooding)
        const depth = Math.min(130, Math.round((headFactor - 1.0) * 45 + 12));
        const head = Math.round(95 + (headFactor - 1.0) * 35);
        const backflow = Math.round((headFactor * 1.8) * 10) / 10;
        list.push({
          ...m,
          status: 'surcharged',
          surchargeDepthCm: depth,
          hydraulicHeadKpa: head,
          backflowRateM3s: backflow,
          riskScore: Math.min(100, Math.round(headFactor * 65)),
        });
      } else if (headFactor >= 0.8) {
        // Near capacity (high pressure, imminent surcharge risk)
        const depth = Math.max(4, Math.round((headFactor - 0.8) * 20));
        const head = Math.round(75 + (headFactor - 0.8) * 25);
        const backflow = Math.round((headFactor * 0.7) * 10) / 10;
        list.push({
          ...m,
          status: 'near_capacity',
          surchargeDepthCm: depth,
          hydraulicHeadKpa: head,
          backflowRateM3s: backflow,
          riskScore: Math.min(75, Math.round(headFactor * 55)),
        });
      }
      // Safe / normal manholes (headFactor < 0.8) ARE FILTERED OUT AND NOT SHOWN!
    }

    // Sort by risk score descending
    return list.sort((a, b) => b.riskScore - a.riskScore);
  }, [effectiveRain, velocity]);

  // Filtered list according to current UI filter chip
  const displayedManholes = useMemo(() => {
    if (filterMode === 'surcharged_only') {
      return atRiskManholes.filter((m) => m.status === 'surcharged');
    }
    return atRiskManholes;
  }, [atRiskManholes, filterMode]);

  // Aggregate stats
  const surchargedCount = useMemo(
    () => atRiskManholes.filter((m) => m.status === 'surcharged').length,
    [atRiskManholes]
  );
  const nearCapacityCount = useMemo(
    () => atRiskManholes.filter((m) => m.status === 'near_capacity').length,
    [atRiskManholes]
  );
  const totalBackflowRate = useMemo(
    () => atRiskManholes.reduce((sum, m) => sum + (m.status === 'surcharged' ? m.backflowRateM3s : 0), 0),
    [atRiskManholes]
  );

  // Convert displayed manholes to GeoJSON
  const manholesGeoJSON = useMemo(() => {
    return {
      type: 'FeatureCollection' as const,
      features: displayedManholes.map((m) => ({
        type: 'Feature' as const,
        properties: {
          id: m.id,
          elevation: m.elevation,
          status: m.status,
          surchargeDepthCm: m.surchargeDepthCm,
          hydraulicHeadKpa: m.hydraulicHeadKpa,
          backflowRateM3s: m.backflowRateM3s,
          riskScore: m.riskScore,
          isSurcharged: m.status === 'surcharged',
        },
        geometry: {
          type: 'Point' as const,
          coordinates: m.coords,
        },
      })),
    };
  }, [displayedManholes]);

  // Initialize MapLibre GL Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          darkBasemap: {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
            maxzoom: 16,
            attribution: 'ESRI Dark Gray • CMWSSB',
          },
          darkReference: {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
            maxzoom: 16,
          },
        },
        layers: [
          { id: 'darkBasemap', type: 'raster', source: 'darkBasemap', paint: { 'raster-opacity': 0.95 } },
          { id: 'darkReference', type: 'raster', source: 'darkReference', paint: { 'raster-opacity': 0.65 } },
        ],
      },
      center: CHENNAI_CENTER,
      zoom: 13.9,
      pitch: 52,
      bearing: -12,
      maxPitch: 80,
      minPitch: 0,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true, visualizePitch: true }), 'bottom-right');

    map.on('load', () => {
      // 1. Drainage Pipes Source (Real CMWSSB network)
      const drainFeatures = CHENNAI_DRAINAGE_NETWORK.map((d) => ({
        type: 'Feature' as const,
        properties: {
          id: d.id,
          mm: d.mm,
          thickness: d.mm >= 1200 ? 4.2 : d.mm >= 700 ? 3 : d.mm >= 350 ? 1.8 : 1,
        },
        geometry: {
          type: 'LineString' as const,
          coordinates: d.coords,
        },
      }));

      map.addSource('drains', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: drainFeatures },
      });

      // Conduit Glow & Core Layers
      map.addLayer({
        id: 'drains-glow',
        type: 'line',
        source: 'drains',
        paint: {
          'line-color': '#0284c7',
          'line-width': ['*', ['get', 'thickness'], 2.4],
          'line-opacity': 0.3,
          'line-blur': 3,
        },
      });

      map.addLayer({
        id: 'drains-core',
        type: 'line',
        source: 'drains',
        paint: {
          'line-color': [
            'case',
            ['>=', ['get', 'mm'], 1200],
            '#0284c7',
            ['>=', ['get', 'mm'], 700],
            '#0ea5e9',
            ['>=', ['get', 'mm'], 350],
            '#38bdf8',
            '#7dd3fc',
          ],
          'line-width': ['get', 'thickness'],
          'line-opacity': 0.88,
        },
      });

      // 2. Inferred Drainage Network Source
      const infFeatures = CHENNAI_INFERRED_NETWORK.map((f) => ({
        type: 'Feature' as const,
        properties: {
          id: f.id,
          sewer_type: f.sewer_type,
          thickness: f.thickness,
          confidence: f.connection_confidence,
        },
        geometry: {
          type: 'LineString' as const,
          coordinates: f.coords,
        },
      }));

      map.addSource('inferred-drains', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: infFeatures },
      });

      map.addLayer({
        id: 'inferred-core',
        type: 'line',
        source: 'inferred-drains',
        paint: {
          'line-color': '#38bdf8',
          'line-width': ['get', 'thickness'],
          'line-opacity': 0.45,
          'line-dasharray': [2, 3],
        },
      });

      // 3. At-Risk / Flooded Manholes Source (ONLY flooded/risk manholes)
      map.addSource('at-risk-manholes', {
        type: 'geojson',
        data: manholesGeoJSON,
      });

      // Surcharged Manholes Pulsing Outer Ring
      map.addLayer({
        id: 'manholes-pulse',
        type: 'circle',
        source: 'at-risk-manholes',
        filter: ['==', ['get', 'status'], 'surcharged'],
        paint: {
          'circle-radius': 14,
          'circle-color': '#ef4444',
          'circle-opacity': 0.22,
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#f87171',
          'circle-stroke-opacity': 0.6,
        },
      });

      // Manholes Glow
      map.addLayer({
        id: 'manholes-glow',
        type: 'circle',
        source: 'at-risk-manholes',
        paint: {
          'circle-radius': ['case', ['==', ['get', 'status'], 'surcharged'], 9, 6.5],
          'circle-color': ['case', ['==', ['get', 'status'], 'surcharged'], '#ef4444', '#f59e0b'],
          'circle-opacity': 0.45,
          'circle-blur': 0.5,
        },
      });

      // Manholes Core Solid
      map.addLayer({
        id: 'manholes-core',
        type: 'circle',
        source: 'at-risk-manholes',
        paint: {
          'circle-radius': ['case', ['==', ['get', 'status'], 'surcharged'], 5.5, 4],
          'circle-color': ['case', ['==', ['get', 'status'], 'surcharged'], '#ef4444', '#f59e0b'],
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-opacity': 0.95,
        },
      });

      // Click event for at-risk manhole
      map.on('click', 'manholes-core', (e: any) => {
        if (!e.features || e.features.length === 0) return;
        const feat = e.features[0];
        const props = feat.properties as any;
        const coords = (feat.geometry as any).coordinates.slice();

        setSelectedManhole({
          id: props.id,
          elevation: Number(props.elevation),
          status: props.status,
          surchargeDepthCm: Number(props.surchargeDepthCm),
          hydraulicHeadKpa: Number(props.hydraulicHeadKpa),
          backflowRateM3s: Number(props.backflowRateM3s),
          riskScore: Number(props.riskScore),
          coords: [coords[0], coords[1]],
        });

        const isSur = props.status === 'surcharged';
        const popupContent = `
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 4px; color: #f1f5f9;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
              <span style="font-weight: 800; color: ${isSur ? '#f87171' : '#fbbf24'}; font-size: 12px;">MANHOLE ${props.id}</span>
              <span style="background: ${isSur ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}; border: 1px solid ${isSur ? 'rgba(239,68,68,0.4)' : 'rgba(245,158,11,0.4)'}; color: ${isSur ? '#fca5a5' : '#fcd34d'}; padding: 1px 6px; border-radius: 4px; font-size: 10px; font-weight: 700;">
                ${isSur ? 'SURCHARGED · FLOODING' : 'NEAR CAPACITY'}
              </span>
            </div>
            <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 6px; line-height: 1.6;">
              <div>Elev DEM: <b>${props.elevation}m MSL</b> (Basin Low)</div>
              <div>Hydraulic Head: <b style="color:#38bdf8;">${props.hydraulicHeadKpa} kPa</b></div>
              <div>Ponding Depth: <b style="color:${isSur ? '#f87171' : '#fbbf24'};">+${props.surchargeDepthCm} cm</b></div>
              <div>Backflow Spill: <b>${props.backflowRateM3s} m³/s</b></div>
            </div>
            ${isSur ? '<div style="margin-top:6px; color:#ef4444; font-weight:700; font-size:10px;">⚠️ ACTIVE STREET BACKFLOW WARNING</div>' : ''}
          </div>
        `;

        if (popupRef.current) popupRef.current.remove();
        popupRef.current = new maplibregl.Popup({ offset: 12, className: 'dark-glass-popup' })
          .setLngLat(coords)
          .setHTML(popupContent)
          .addTo(map);
      });

      // Pointer change
      map.on('mouseenter', 'manholes-core', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'manholes-core', () => {
        map.getCanvas().style.cursor = '';
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update GeoJSON dynamically when rainfall intensity or velocity changes
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const source = map.getSource('at-risk-manholes') as maplibregl.GeoJSONSource | undefined;
    if (source) {
      source.setData(manholesGeoJSON);
    }
  }, [manholesGeoJSON]);

  // Toggle 3D pitch view
  const toggle3D = () => {
    if (!mapRef.current) return;
    const new3D = !is3D;
    setIs3D(new3D);
    mapRef.current.easeTo({
      pitch: new3D ? 55 : 0,
      bearing: new3D ? -15 : 0,
      duration: 800,
    });
  };

  // Fly to top critical hotspot
  const zoomToHotspot = () => {
    if (!mapRef.current || atRiskManholes.length === 0) return;
    const top = atRiskManholes[0];
    mapRef.current.flyTo({
      center: top.coords,
      zoom: 15.5,
      pitch: 60,
      duration: 1200,
    });
    setSelectedManhole(top);
  };

  // Reset view to city wide
  const resetView = () => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: CHENNAI_CENTER,
      zoom: 13.9,
      pitch: 52,
      bearing: -12,
      duration: 1000,
    });
    setSelectedManhole(null);
  };

  return (
    <div className={`rounded-2xl border border-white/10 bg-command-950 shadow-2xl relative overflow-hidden flex flex-col ${className}`}>
      {/* Header bar with controls */}
      <div className="p-4 sm:p-5 border-b border-white/10 bg-command-900/90 backdrop-blur-md z-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 font-mono">
              MAPLIBRE GIS DRAINAGE TOPOGRAPHY · AT-RISK MANHOLE DETECTOR
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white mt-0.5 flex items-center gap-2">
            Chennai CMWSSB Conduit Network & Hydraulic Surcharge Map
          </h2>
          <p className="text-xs text-slate-400">
            Dynamically displays only manholes predicted to surcharge and flood based on current rain intensity & storm velocity.
          </p>
        </div>

        {/* Real-time slider controls directly on the map */}
        <div className="flex flex-wrap items-center gap-3 bg-command-950 border border-white/10 rounded-xl px-3 py-2">
          {/* Intensity Slider */}
          <div className="flex items-center gap-2">
            <Droplets className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-[11px] font-mono text-slate-400">Rain Intensity:</span>
            <input
              type="range"
              min={10}
              max={150}
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-24 sm:w-28 accent-cyan-500 cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-cyan-300 w-14">{intensity} mm/h</span>
          </div>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* Velocity Slider */}
          <div className="flex items-center gap-2">
            <Wind className="h-3.5 w-3.5 text-teal-400" />
            <span className="text-[11px] font-mono text-slate-400">Velocity:</span>
            <input
              type="range"
              min={0.2}
              max={3.0}
              step={0.1}
              value={velocity}
              onChange={(e) => setVelocity(Number(e.target.value))}
              className="w-20 sm:w-24 accent-teal-500 cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-teal-300 w-10">{velocity.toFixed(1)}×</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-white/10 bg-command-900/50 text-xs font-mono">
        <div className="p-3 border-r border-white/10 flex items-center justify-between">
          <span className="text-slate-400 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            Flooding / Surcharged:
          </span>
          <span className="text-base font-extrabold text-rose-400">{surchargedCount}</span>
        </div>

        <div className="p-3 border-r border-white/10 flex items-center justify-between">
          <span className="text-slate-400 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Near Capacity Risk:
          </span>
          <span className="text-base font-extrabold text-amber-400">{nearCapacityCount}</span>
        </div>

        <div className="p-3 border-r border-white/10 flex items-center justify-between">
          <span className="text-slate-400">Safe Manholes:</span>
          <span className="text-slate-300 font-bold">{CHENNAI_MANHOLES.length - atRiskManholes.length} (Hidden)</span>
        </div>

        <div className="p-3 flex items-center justify-between">
          <span className="text-slate-400">Est. Street Spill:</span>
          <span className="text-cyan-300 font-bold">{totalBackflowRate.toFixed(1)} m³/s</span>
        </div>
      </div>

      {/* Main Map Canvas */}
      <div className="relative w-full h-[520px] bg-zinc-950">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Quick Filter & View Controls */}
        <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterMode('all_risk')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border shadow-lg ${
              filterMode === 'all_risk'
                ? 'bg-rose-600/90 text-white border-rose-400'
                : 'bg-command-900/80 text-slate-300 border-white/10 hover:text-white'
            }`}
          >
            All At-Risk ({atRiskManholes.length})
          </button>
          <button
            onClick={() => setFilterMode('surcharged_only')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border shadow-lg ${
              filterMode === 'surcharged_only'
                ? 'bg-rose-600/90 text-white border-rose-400'
                : 'bg-command-900/80 text-slate-300 border-white/10 hover:text-white'
            }`}
          >
            Surcharged Only ({surchargedCount})
          </button>

          {atRiskManholes.length > 0 && (
            <button
              onClick={zoomToHotspot}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-900/80 transition-all flex items-center gap-1.5"
            >
              <Flame className="h-3.5 w-3.5 text-rose-400" />
              Focus Hotspot
            </button>
          )}

          <button
            onClick={resetView}
            className="p-1.5 rounded-lg text-xs bg-command-900/80 text-slate-400 border border-white/10 hover:text-white transition-all"
            title="Reset City View"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={toggle3D}
            className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold bg-command-900/80 text-slate-300 border border-white/10 hover:text-white transition-all"
          >
            {is3D ? '3D View' : '2D Overhead'}
          </button>
        </div>

        {/* Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-10 bg-command-950/90 backdrop-blur-md border border-white/10 rounded-xl p-3 text-xs font-mono space-y-2 shadow-xl">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Hydraulic Network Legend</div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-500 border border-white animate-ping" />
            <span className="text-rose-400 font-semibold">Surcharged Manhole (Active Street Flooding)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 border border-white" />
            <span className="text-amber-400">Near Capacity (&gt;80% HGL Backflow Risk)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-1 bg-[#0284c7] rounded" />
            <span className="text-sky-300">CMWSSB Stormwater Trunks / Outfalls</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 border-t border-dashed border-[#38bdf8]" />
            <span className="text-sky-400/80">Inferred Secondary Conduits</span>
          </div>
          <div className="text-[10px] text-slate-400 pt-1 border-t border-white/10">
            * <b>{CHENNAI_MANHOLES.length - atRiskManholes.length} safe manholes</b> hidden to prioritize flooding hazard response.
          </div>
        </div>

        {/* Selected Manhole Drawer */}
        {selectedManhole && (
          <div className="absolute top-3 right-3 z-10 w-72 bg-command-900/95 backdrop-blur-xl border border-white/15 rounded-xl p-4 shadow-2xl text-xs font-mono">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-white flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-rose-400" />
                {selectedManhole.id}
              </span>
              <button
                onClick={() => setSelectedManhole(null)}
                className="text-slate-400 hover:text-white text-base font-bold"
              >
                ✕
              </button>
            </div>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <strong className={selectedManhole.status === 'surcharged' ? 'text-rose-400' : 'text-amber-400'}>
                  {selectedManhole.status === 'surcharged' ? 'CRITICAL BACKFLOW' : 'NEAR CAPACITY'}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Elevation DEM:</span>
                <span>{selectedManhole.elevation} m MSL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Surcharge Depth:</span>
                <strong className="text-rose-300">+{selectedManhole.surchargeDepthCm} cm</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pressure Head:</span>
                <span>{selectedManhole.hydraulicHeadKpa} kPa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Backflow Rate:</span>
                <strong className="text-cyan-300">{selectedManhole.backflowRateM3s} m³/s</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Risk Score:</span>
                <span>{selectedManhole.riskScore}/100</span>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-white/10 text-[11px] text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Recommended: Immediate barricading & storm suction pump deployment.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
