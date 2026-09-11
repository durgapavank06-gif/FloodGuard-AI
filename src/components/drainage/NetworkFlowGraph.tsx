import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw, Droplets, GitBranch } from 'lucide-react';
import { FLOW_NODES, FLOW_EDGES, FlowNode, FlowEdge } from '../../data/network-graph';
import { FullNetworkGraph } from './FullNetworkGraph';
import { mockDrainageConduits } from '../../data/drainage';
import { mockRainfallNowcast } from '../../data/rainfall';
import { useDataMode } from '../../context/DataModeContext';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';

type ConduitStatus = 'normal' | 'near_limit' | 'critical' | 'surcharged';

interface ConduitState {
  status: ConduitStatus;
  util: number; // 0..2 fraction
  flow: number; // m3/s
}

const rank: Record<ConduitStatus, number> = { normal: 0, near_limit: 1, critical: 2, surcharged: 3 };
const rankColor = ['#2dd4bf', '#f59e0b', '#f97316', '#ef4444'];

const CARD_W = 132;
const CARD_H = 54;
const HW = CARD_W / 2;
const HH = CARD_H / 2;

const byId = new Map(FLOW_NODES.map((n) => [n.id, n]));

function edgePath(f: FlowNode, t: FlowNode, e: FlowEdge): string {
  if (e.viaX !== undefined) {
    // Routed bus: down from source, across viaX, into the right face of target
    return `M ${f.x} ${f.y + HH} L ${f.x} ${t.y} L ${e.viaX} ${t.y} L ${t.x + HW} ${t.y}`;
  }
  if ((e.enter ?? 'top') === 'left') {
    const sx = f.x;
    const sy = f.y + HH;
    const tx = t.x - HW;
    const ty = t.y;
    const jy = sy + (ty - sy) * 0.18;
    return `M ${sx} ${sy} L ${sx} ${jy} L ${tx} ${jy} L ${tx} ${ty}`;
  }
  const sx = f.x;
  const sy = f.y + HH;
  const tx = t.x;
  const ty = t.y - HH;
  if (Math.abs(sx - tx) < 8) return `M ${sx} ${sy} L ${tx} ${ty}`;
  const midY = (sy + ty) / 2;
  return `M ${sx} ${sy} L ${sx} ${midY} L ${tx} ${midY} L ${tx} ${ty}`;
}

/**
 * Live manhole→conduit flow graph (no buildings): inlets take nowcast
 * rainfall, water animates along directed conduit edges, surcharged
 * manholes spill into street-ponding nodes. REAL = Flask hydraulics +
 * nowcast; FAKE = bundled demo inventory.
 */
export const NetworkFlowGraph: React.FC = () => {
  const { mode, apiUrl } = useDataMode();
  const { addToast } = useApp();
  const [conduits, setConduits] = useState<Record<string, ConduitState>>({});
  const [rainNow, setRainNow] = useState<number>(mockRainfallNowcast[0].rainfallMmHr);
  const [loading, setLoading] = useState(false);
  const [tick, setTick] = useState(0);
  const [view, setView] = useState<'backbone' | 'full'>('full');
  const isLive = mode === 'real' && Object.keys(conduits).length > 0;

  const load = useCallback(async () => {
    if (mode === 'fake') {
      const map: Record<string, ConduitState> = {};
      for (const c of mockDrainageConduits) {
        map[c.id] = { status: c.status, util: c.capacityPercent / 100, flow: c.flowRateM3s };
      }
      setConduits(map);
      setRainNow(mockRainfallNowcast[0].rainfallMmHr);
      return;
    }
    setLoading(true);
    try {
      const now = await api.nowcast(apiUrl, 'real');
      const rain = now.series[0]?.rainfallMmHr ?? 50;
      setRainNow(rain);
      const hyd = await api.hydraulics(apiUrl, {
        rainfall_intensity: rain,
        storm_duration: 60,
        drainage_capacity_pct: 75,
        mode: 'real',
      });
      const map: Record<string, ConduitState> = {};
      for (const c of hyd.result.conduits as { id: string; status: ConduitStatus; capacityPercent: number; flowRateM3s: number }[]) {
        map[c.id] = { status: c.status, util: c.capacityPercent / 100, flow: c.flowRateM3s };
      }
      setConduits(map);
    } catch (err) {
      addToast('Flow graph offline', `Live hydraulics unreachable (${err}). Retrying…`, 'warning');
      setConduits({});
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

  // Node severity = worst rank of incident modelled conduits
  const nodeRank = useMemo(() => {
    const r: Record<string, number> = {};
    for (const n of FLOW_NODES) r[n.id] = 0;
    for (const e of FLOW_EDGES) {
      if (!e.conduitId) continue;
      const c = conduits[e.conduitId];
      if (!c) continue;
      const k = rank[c.status] ?? 0;
      r[e.from] = Math.max(r[e.from], k);
      r[e.to] = Math.max(r[e.to], k);
    }
    return r;
  }, [conduits]);

  const streetFlooding = (n: (typeof FLOW_NODES)[number]) =>
    n.type === 'street' && n.parent !== undefined && (nodeRank[n.parent] ?? 0) >= 2;

  const edgeVisual = (e: FlowEdge): { color: string; util: number; flow: number; active: boolean } => {
    if (e.kind === 'overflow') {
      const parentRank = nodeRank[e.from] ?? 0;
      const active = parentRank >= 2;
      return { color: active ? '#ef4444' : '#475569', util: active ? 1.2 : 0, flow: 0, active };
    }
    if (e.conduitId && conduits[e.conduitId]) {
      const c = conduits[e.conduitId];
      return { color: rankColor[rank[c.status] ?? 0], util: c.util, flow: c.flow, active: true };
    }
    // Unmodelled link: inherit upstream severity, static thin line
    const parentRank = nodeRank[e.from] ?? 0;
    return { color: '#64748b', util: 0.3, flow: 0, active: parentRank >= 0 };
  };

  const nodeStyle = (n: (typeof FLOW_NODES)[number]) => {
    const k = nodeRank[n.id] ?? 0;
    if (n.type === 'inlet') return { fill: '#0b3b36', stroke: '#2dd4bf', dashed: false, dim: false };
    if (n.type === 'outfall') return { fill: '#27272a', stroke: k >= 2 ? '#ef4444' : '#71717a', dashed: false, dim: false };
    if (n.type === 'street') {
      return streetFlooding(n)
        ? { fill: '#431407', stroke: '#fb923c', dashed: false, dim: false }
        : { fill: '#10141c', stroke: '#334155', dashed: true, dim: true };
    }
    if (k >= 2) return { fill: '#450a0a', stroke: '#ef4444', dashed: false, dim: false };
    if (k === 1) return { fill: '#3a2a10', stroke: '#f59e0b', dashed: false, dim: false };
    return { fill: '#0b3b36', stroke: '#2dd4bf', dashed: false, dim: false };
  };

  const nodeSub = (n: (typeof FLOW_NODES)[number]) => {
    if (n.type === 'inlet') return `${rainNow} mm/h in`;
    if (n.type === 'street') return streetFlooding(n) ? 'BACKFLOW PONDING' : 'no ponding';
    if (n.type === 'outfall') {
      const inc = FLOW_EDGES.find((e) => e.to === n.id && e.conduitId && conduits[e.conduitId]);
      const f = inc?.conduitId ? conduits[inc.conduitId].flow : 0;
      return `out ${f.toFixed(1)} m³/s`;
    }
    let worst = 0;
    for (const e of FLOW_EDGES) {
      if (!e.conduitId || (e.from !== n.id && e.to !== n.id)) continue;
      const c = conduits[e.conduitId];
      if (c) worst = Math.max(worst, c.util);
    }
    return `util ${Math.round(worst * 100)}%`;
  };

  const handleNodeClick = (n: (typeof FLOW_NODES)[number]) => {
    const incident = FLOW_EDGES.filter((e) => e.from === n.id || e.to === n.id);
    const detail = incident
      .map((e) => {
        const c = e.conduitId ? conduits[e.conduitId] : undefined;
        return `${e.label}: ${c ? `${c.status} ${Math.round(c.util * 100)}%` : 'link'}`;
      })
      .join(' · ');
    addToast(n.short, `${n.label} — ${detail || 'no conduits'}`, (nodeRank[n.id] ?? 0) >= 2 ? 'error' : 'info');
  };

  const typeWord: Record<string, string> = { inlet: 'Inlet', junction: 'Junction', outfall: 'Outflow', street: 'Street' };

  return (
    <div className="rounded-2xl border border-white/10 bg-command-900/90 p-4 sm:p-5 shadow-card-dark">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <GitBranch className="h-4 w-4 text-teal-300" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Manhole → Conduit Live Flow Graph
          </h3>
          {isLive ? (
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
              ● LIVE HYDRAULICS
            </span>
          ) : (
            <span className="rounded-full bg-slate-500/15 border border-slate-500/40 px-2 py-0.5 text-[10px] font-bold text-slate-300">
              {mode === 'real' ? 'CONNECTING…' : 'DEMO NETWORK'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-command-950 p-1">
            <button
              onClick={() => setView('backbone')}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${view === 'backbone' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Trunk backbone
            </button>
            <button
              onClick={() => setView('full')}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${view === 'full' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Full network (694·1013)
            </button>
          </div>
          <span className="hidden sm:flex items-center gap-1.5 rounded-lg bg-command-950 border border-white/10 px-2.5 py-1.5 text-[11px] font-mono text-cyan-300">
            <Droplets className="h-3 w-3" />
            nowcast in: {rainNow} mm/h
          </span>
          <button
            onClick={() => setTick((t) => t + 1)}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-command-950 px-2.5 py-1.5 text-[11px] text-slate-300 hover:text-white transition-colors"
            title="Re-solve flows"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            Re-solve
          </button>
        </div>
      </div>

      {view === 'full' ? (
        <FullNetworkGraph />
      ) : (
      <div className="rounded-xl border border-white/10 bg-[#05080d] overflow-x-auto">
        <svg viewBox="0 0 780 604" className="w-full min-w-[640px] select-none">
          <defs>
            {[
              ['arr-teal', '#2dd4bf'],
              ['arr-amber', '#f59e0b'],
              ['arr-orange', '#f97316'],
              ['arr-red', '#ef4444'],
              ['arr-gray', '#64748b'],
            ].map(([id, c]) => (
              <marker key={id} id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 1 L 9 5 L 0 9 z" fill={c} />
              </marker>
            ))}
          </defs>

          {/* Rainfall input caption */}
          <text x="8" y="16" fill="#94a3b8" fontSize="10" fontFamily="monospace">
            Rainfall (nowcast input)
          </text>

          {/* Edges */}
          {FLOW_EDGES.map((e) => {
            const f = byId.get(e.from)!;
            const t = byId.get(e.to)!;
            const v = edgeVisual(e);
            const d = edgePath(f, t, e);
            const marker =
              v.color === '#ef4444' ? 'url(#arr-red)'
              : v.color === '#f59e0b' ? 'url(#arr-amber)'
              : v.color === '#f97316' ? 'url(#arr-orange)'
              : v.color === '#2dd4bf' ? 'url(#arr-teal)'
              : 'url(#arr-gray)';
            const speed = Math.max(0.45, Math.min(2.8, 2.8 - v.util * 2.2));
            const width = e.kind === 'overflow' ? 2.5 : 2 + Math.min(v.flow, 8) * 0.45;
            return (
              <g key={e.id}>
                <path d={d} fill="none" stroke="#1e293b" strokeWidth={width + 3} strokeLinejoin="round" strokeLinecap="round" opacity="0.9" />
                <path
                  d={d}
                  fill="none"
                  stroke={v.color}
                  strokeWidth={width}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeDasharray={e.kind === 'overflow' && !v.active ? '4 5' : '7 7'}
                  markerEnd={marker}
                  className={v.active ? 'flow-anim' : undefined}
                  style={v.active ? { animationDuration: `${speed}s` } : undefined}
                  opacity={e.kind === 'overflow' && !v.active ? 0.5 : 1}
                />
              </g>
            );
          })}

          {/* Rainfall arrows into inlets */}
          {FLOW_NODES.filter((n) => n.type === 'inlet').map((n) => (
            <g key={`rain-${n.id}`}>
              <line x1={n.x} y1={22} x2={n.x} y2={n.y - HH - 3} stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arr-teal)" />
              <text x={n.x} y={16} textAnchor="middle" fill="#7dd3fc" fontSize="9" fontWeight="bold" fontFamily="monospace">
                {rainNow} mm/h
              </text>
            </g>
          ))}

          {/* Nodes */}
          {FLOW_NODES.map((n) => {
            const s = nodeStyle(n);
            const k = nodeRank[n.id] ?? 0;
            return (
              <g
                key={n.id}
                transform={`translate(${n.x}, ${n.y})`}
                onClick={() => handleNodeClick(n)}
                className="cursor-pointer"
                opacity={s.dim ? 0.6 : 1}
              >
                {k >= 3 && n.type === 'junction' && (
                  <circle r="30" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.5" className="animate-ping" />
                )}
                <rect
                  x={-HW}
                  y={-HH}
                  width={CARD_W}
                  height={CARD_H}
                  rx="10"
                  fill={s.fill}
                  stroke={s.stroke}
                  strokeWidth={k >= 2 && n.type === 'junction' ? 2 : 1.2}
                  strokeDasharray={s.dashed ? '5 4' : undefined}
                />
                <text x="0" y="-4" textAnchor="middle" fill="#f1f5f9" fontSize="12" fontWeight="bold" fontFamily="monospace">
                  {n.short}
                </text>
                <text x="0" y="10" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="sans-serif">
                  {typeWord[n.type]}
                </text>
                <text
                  x="0"
                  y="21"
                  textAnchor="middle"
                  fill={n.type === 'street' && streetFlooding(n) ? '#fdba74' : '#67e8f9'}
                  fontSize="8"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {nodeSub(n)}
                </text>
              </g>
            );
          })}

          {/* Legend */}
          <g fontSize="10" fontFamily="sans-serif" fill="#cbd5e1">
            <rect x="18" y="576" width="12" height="12" rx="3" fill="#0b3b36" stroke="#2dd4bf" />
            <text x="34" y="586">Normal capacity</text>
            <rect x="168" y="576" width="12" height="12" rx="3" fill="#450a0a" stroke="#ef4444" />
            <text x="184" y="586">Surcharging</text>
            <rect x="288" y="576" width="12" height="12" rx="3" fill="#27272a" stroke="#71717a" />
            <text x="304" y="586">Outfall</text>
            <rect x="372" y="576" width="12" height="12" rx="3" fill="#431407" stroke="#fb923c" />
            <text x="388" y="586">Street flooding</text>
            <text x="520" y="586" fill="#64748b" fontSize="9" fontFamily="monospace">
              13 nodes · 11 edges · directed · anim speed ∝ flow
            </text>
          </g>
        </svg>
      </div>
      )}
    </div>
  );
};
