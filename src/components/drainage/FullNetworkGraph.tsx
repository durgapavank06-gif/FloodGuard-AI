import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RefreshCw, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { useDataMode } from '../../context/DataModeContext';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';

interface GNode {
  id: string; x: number; y: number; type: string; zone: string; status: string; util: number;
}
interface GEdge {
  id: string; from: string; to: string; kind: string; zone: string; status: string; util: number; flow: number;
}

const edgeColor: Record<string, string> = {
  normal: '#1e3a4a',
  near_limit: '#f59e0b',
  critical: '#f97316',
  surcharged: '#ef4444',
};

const ZONE_LABELS: Record<string, { x: number; name: string }> = {
  'zone-c01': { x: 120, name: 'C01 · T.NAGAR' },
  'zone-c02': { x: 360, name: 'C02 · NUNGAMBAKKAM' },
  'zone-c03': { x: 600, name: 'C03 · ANNA NAGAR' },
  'zone-c04': { x: 840, name: 'C04 · VELACHERY' },
  'zone-c05': { x: 1080, name: 'C05 · THIRUVANMIYUR' },
};

/** Full 694-node / 1013-edge network with zoom + pan. */
export const FullNetworkGraph: React.FC = () => {
  const { mode, apiUrl } = useDataMode();
  const { addToast } = useApp();
  const [nodes, setNodes] = useState<GNode[]>([]);
  const [edges, setEdges] = useState<GEdge[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [rain, setRain] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [tick, setTick] = useState(0);
  const [view, setView] = useState({ k: 1, x: 0, y: 0 });
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.fullGraph(apiUrl, mode);
      setNodes(res.nodes);
      setEdges(res.edges);
      setCounts(res.counts || {});
      setRain(res.rainfall_by_zone || {});
    } catch (e) {
      addToast('Full network offline', `Could not load 1013-edge graph (${e}). Is Flask on :5000?`, 'error');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, apiUrl, tick]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (mode === 'fake') return;
    const id = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(id);
  }, [mode]);

  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  // Stressed conduits render last (on top of the calm background mesh)
  const orderedEdges = useMemo(() => {
    const w = { normal: 0, near_limit: 1, critical: 2, surcharged: 3 };
    return [...edges].sort((a, b) => {
      const d = (w[a.status as keyof typeof w] ?? 0) - (w[b.status as keyof typeof w] ?? 0);
      if (d !== 0) return d;
      if (a.kind !== b.kind) return a.kind === 'inferred' ? -1 : 1;
      return a.id < b.id ? -1 : 1;
    });
  }, [edges]);

  const zoom = (f: number) => {
    setView((v) => {
      const k = Math.max(0.5, Math.min(3.5, v.k * f));
      const cx = 600;
      const cy = 410;
      const s = k / v.k;
      return { k, x: cx - (cx - v.x) * s, y: cy - (cy - v.y) * s };
    });
  };

  const onDown = (e: React.MouseEvent) => {
    drag.current = { sx: e.clientX, sy: e.clientY, ox: view.x, oy: view.y };
  };
  const onMove = (e: React.MouseEvent) => {
    if (!drag.current) return;
    const scale = 1200 / (e.currentTarget as SVGSVGElement).clientWidth || 1;
    setView((v) => ({
      ...v,
      x: drag.current!.ox + (e.clientX - drag.current!.sx) * scale,
      y: drag.current!.oy + (e.clientY - drag.current!.sy) * scale,
    }));
  };
  const onUp = () => {
    drag.current = null;
  };

  const nodeFill = (n: GNode) => {
    if (n.status === 'surcharged') return '#ef4444';
    if (n.status === 'critical') return '#f97316';
    if (n.status === 'near_limit') return '#f59e0b';
    if (n.type === 'inlet') return '#2dd4bf';
    if (n.type === 'outfall') return '#71717a';
    return '#0f2532';
  };
  const nodeStroke = (n: GNode) => {
    if (n.status !== 'normal') return nodeFill(n);
    if (n.type === 'inlet') return '#2dd4bf';
    if (n.type === 'outfall') return '#a1a1aa';
    return '#33566b';
  };

  const rainVals = Object.values(rain);
  const rainLabel = rainVals.length ? `${Math.min(...rainVals)}–${Math.max(...rainVals)} mm/h by zone` : '';

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
          <span className="rounded bg-command-950 border border-white/10 px-2 py-1 text-slate-300">
            {counts.nodes ?? '—'} nodes · {counts.edges ?? '—'} edges
          </span>
          <span className="rounded bg-rose-950/60 border border-rose-500/40 px-2 py-1 text-rose-300">
            surcharged: {counts.edges_surcharged ?? '—'} conduits / {counts.nodes_surcharged ?? '—'} manholes
          </span>
          <span className="rounded bg-command-950 border border-white/10 px-2 py-1 text-cyan-300">
            {rainLabel}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => zoom(1.25)} className="rounded-lg border border-white/10 bg-command-950 p-1.5 text-slate-300 hover:text-white" title="Zoom in">
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => zoom(0.8)} className="rounded-lg border border-white/10 bg-command-950 p-1.5 text-slate-300 hover:text-white" title="Zoom out">
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setView({ k: 1, x: 0, y: 0 })} className="rounded-lg border border-white/10 bg-command-950 p-1.5 text-slate-300 hover:text-white" title="Reset view">
            <Maximize className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setTick((t) => t + 1)}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-command-950 px-2.5 py-1.5 text-[11px] text-slate-300 hover:text-white"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            Re-solve
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#05080d] overflow-hidden">
        <svg
          viewBox="0 0 1200 820"
          className="w-full h-[560px] select-none cursor-grab active:cursor-grabbing"
          onMouseDown={onDown}
          onMouseMove={onMove}
          onMouseUp={onUp}
          onMouseLeave={onUp}
        >
          <g transform={`translate(${view.x},${view.y}) scale(${view.k})`}>
            {/* Zone lane separators + labels */}
            {[240, 480, 720, 960].map((x) => (
              <line key={x} x1={x} y1={20} x2={x} y2={800} stroke="#141d2e" strokeWidth="1" strokeDasharray="4 5" />
            ))}
            {Object.entries(ZONE_LABELS).map(([z, l]) => (
              <text key={z} x={l.x} y={24} textAnchor="middle" fill="#475569" fontSize="11" fontWeight="bold" fontFamily="monospace" letterSpacing="1">
                {l.name}
              </text>
            ))}

            {/* Edges */}
            {orderedEdges.map((e) => {
              const f = byId.get(e.from);
              const t = byId.get(e.to);
              if (!f || !t) return null;
              const animated = e.status === 'surcharged' && e.kind === 'main';
              return (
                <g key={e.id}>
                  <line
                    x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                    stroke={edgeColor[e.status] ?? '#1e3a4a'}
                    strokeWidth={e.status === 'surcharged' ? 1.8 : e.status === 'normal' ? 0.8 : 1.3}
                    opacity={e.status === 'normal' ? (e.kind === 'inferred' ? 0.5 : 0.8) : 1}
                  >
                    <title>{`${e.id} · ${e.kind} · ${e.status} · util ${(e.util * 100).toFixed(0)}% · ${e.flow.toFixed(2)} m³/s`}</title>
                  </line>
                  {animated && (
                    <line
                      x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                      stroke="#fca5a5"
                      strokeWidth="1"
                      strokeDasharray="5 7"
                      className="flow-anim"
                      style={{ animationDuration: `${Math.max(0.4, Math.min(2.2, 2.2 - e.util))}s` }}
                      pointerEvents="none"
                    />
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((n) => (
              <g
                key={n.id}
                transform={`translate(${n.x},${n.y})`}
                onClick={() =>
                  addToast(n.id, `${n.type} · ${n.zone} · ${n.status} · util ${(n.util * 100).toFixed(0)}%`, n.status === 'surcharged' || n.status === 'critical' ? 'error' : 'info')
                }
                className="cursor-pointer"
              >
                <title>{`${n.id} · ${n.type} · ${n.status} · util ${(n.util * 100).toFixed(0)}%`}</title>
                {n.status === 'surcharged' && (
                  <circle r="7.5" fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.6" />
                )}
                {n.type === 'inlet' ? (
                  <rect x="-4" y="-4" width="8" height="8" rx="1.5" fill={nodeFill(n)} stroke={nodeStroke(n)} strokeWidth="1" />
                ) : (
                  <circle r={n.type === 'outfall' ? 6 : 3.2} fill={nodeFill(n)} stroke={nodeStroke(n)} strokeWidth="1.2" />
                )}
              </g>
            ))}
          </g>
        </svg>
      </div>
      <p className="mt-2 text-[11px] font-mono text-slate-500">
        ■ inlet · ● manhole · ● outfall — drag to pan, zoom with buttons. Flow animation on surcharged trunk mains; hover any element for telemetry.
      </p>
    </div>
  );
};
