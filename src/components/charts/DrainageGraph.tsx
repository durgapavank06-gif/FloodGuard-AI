import React, { useState } from 'react';
import { mockDrainageGraphNodes, mockDrainageConduits } from '../../data/drainage';
import { GitBranch, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface DrainageGraphProps {
  onSelectNode?: (nodeId: string) => void;
  className?: string;
}

export const DrainageGraph: React.FC<DrainageGraphProps> = ({
  onSelectNode,
  className = ''
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>('MH-01');

  return (
    <div className={`rounded-2xl border border-white/10 bg-command-950 p-5 shadow-2xl relative overflow-hidden ${className}`}>
      {/* Background Grid */}
      <div className="absolute inset-0 radar-grid opacity-25 pointer-events-none" />

      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
              Directed Hydraulic Graph Network
            </span>
          </div>
          <h3 className="text-base font-bold text-white mt-0.5">
            Manhole Nodes & Conduit Edge Topography
          </h3>
          <p className="text-xs text-slate-400">
            Real-time hydrodynamic flow routing & street-level backflow prediction
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-rose-400">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span>Surcharged Manhole</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span>Near Capacity</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span>Normal Flow</span>
          </div>
        </div>
      </div>

      {/* Directed Graph Canvas SVG */}
      <div className="w-full overflow-x-auto">
        <svg viewBox="0 0 740 360" className="w-full h-80 select-none">
          <defs>
            {/* Arrow marker for directed conduits */}
            <marker
              id="flowArrowNormal"
              viewBox="0 0 10 10"
              refX="16"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#06b6d4" />
            </marker>

            <marker
              id="flowArrowSurcharge"
              viewBox="0 0 10 10"
              refX="16"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444" />
            </marker>
          </defs>

          {/* Drainage Edges (Conduits with directed flow) */}
          <g id="conduitEdges">
            {/* MH-07 to MH-03 (Jubilee to Ameerpet) */}
            <line
              x1="270"
              y1="120"
              x2="400"
              y2="150"
              stroke="#06b6d4"
              strokeWidth="3"
              markerEnd="url(#flowArrowNormal)"
            />

            {/* MH-03 to MH-01 (Ameerpet to Begumpet Prakash Nagar) */}
            <line
              x1="400"
              y1="150"
              x2="480"
              y2="110"
              stroke="#f59e0b"
              strokeWidth="4"
              strokeDasharray="4,2"
              markerEnd="url(#flowArrowNormal)"
            />

            {/* MH-01 to MH-02 (Prakash Nagar to Begumpet RUB - Surcharged Backflow) */}
            <line
              x1="480"
              y1="110"
              x2="550"
              y2="170"
              stroke="#ef4444"
              strokeWidth="5"
              markerEnd="url(#flowArrowSurcharge)"
              className="animate-pulse"
            />

            {/* MH-08 to MH-04 (Cyber towers to Shaikpet) */}
            <line
              x1="180"
              y1="220"
              x2="280"
              y2="280"
              stroke="#06b6d4"
              strokeWidth="3"
              markerEnd="url(#flowArrowNormal)"
            />

            {/* MH-04 to Musi Basin Outfall */}
            <line
              x1="280"
              y1="280"
              x2="420"
              y2="300"
              stroke="#ef4444"
              strokeWidth="4"
              strokeDasharray="6,3"
              markerEnd="url(#flowArrowSurcharge)"
            />

            {/* MH-05 to MH-06 (Malakpet to Moosarambagh Sluice - Critical) */}
            <line
              x1="550"
              y1="270"
              x2="650"
              y2="310"
              stroke="#ef4444"
              strokeWidth="5"
              markerEnd="url(#flowArrowSurcharge)"
            />
          </g>

          {/* Surcharge Warning Indicators */}
          <g transform="translate(515, 135)">
            <rect x="-40" y="-12" width="80" height="18" rx="4" fill="#450a0a" stroke="#ef4444" strokeWidth="1" />
            <text x="0" y="1" textAnchor="middle" fill="#fca5a5" fontSize="8" fontWeight="bold">
              BACKFLOW RISK
            </text>
          </g>

          {/* Graph Nodes (Manholes / Drop Inlets) */}
          {[
            { id: 'MH-07', name: 'MH-01-A (Jubilee Hills)', x: 270, y: 120, status: 'normal', elev: 578, depth: 1.2 },
            { id: 'MH-03', name: 'MH-21-A (Ameerpet)', x: 400, y: 150, status: 'near_limit', elev: 516, depth: 3.1 },
            { id: 'MH-01', name: 'MH-14-A (Prakash Nagar)', x: 480, y: 110, status: 'surcharge', elev: 494, depth: 4.1 },
            { id: 'MH-02', name: 'MH-14-B (Begumpet RUB)', x: 550, y: 170, status: 'surcharge', elev: 493, depth: 3.8 },
            { id: 'MH-08', name: 'MH-08-A (Cyber Towers)', x: 180, y: 220, status: 'normal', elev: 550, depth: 1.8 },
            { id: 'MH-04', name: 'MH-09-A (Shaikpet Outfall)', x: 280, y: 280, status: 'surcharge', elev: 499, depth: 4.3 },
            { id: 'MH-05', name: 'MH-11-A (Malakpet Vent)', x: 550, y: 270, status: 'surcharge', elev: 488, depth: 3.9 },
            { id: 'MH-06', name: 'MH-10-A (Moosarambagh Sluice)', x: 650, y: 310, status: 'critical', elev: 481, depth: 5.1 },
          ].map((node) => {
            const isSelected = selectedNode === node.id;
            const nodeColor =
              node.status === 'surcharge' || node.status === 'critical'
                ? '#ef4444'
                : node.status === 'near_limit'
                ? '#f59e0b'
                : '#10b981';

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => {
                  setSelectedNode(node.id);
                  if (onSelectNode) onSelectNode(node.id);
                }}
                className="cursor-pointer group"
              >
                {/* Ping wave for surcharging nodes */}
                {(node.status === 'surcharge' || node.status === 'critical') && (
                  <circle r="18" fill="none" stroke="#ef4444" strokeWidth="1.5" className="animate-ping" opacity="0.5" />
                )}

                {/* Selection ring */}
                {isSelected && (
                  <circle r="16" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3,2" />
                )}

                {/* Node circle */}
                <circle
                  r={isSelected ? 10 : 8}
                  fill={nodeColor}
                  stroke="#070b12"
                  strokeWidth="2.5"
                  className="shadow-lg"
                />

                {/* Node Label badge */}
                <rect
                  x="-35"
                  y="-26"
                  width="70"
                  height="16"
                  rx="3"
                  fill="#0b111d"
                  stroke={nodeColor}
                  strokeWidth="1"
                  opacity="0.9"
                />
                <text
                  x="0"
                  y="-15"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="8.5"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {node.id}
                </text>

                {/* Subtitle depth */}
                <text
                  x="0"
                  y="20"
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  {node.depth}m / {node.elev}m
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Node Telemetry Card */}
      {selectedNode && (
        <div className="mt-3 rounded-xl bg-command-900/90 p-3 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white font-mono">{selectedNode}</span>
            <span className="text-slate-300">Hydraulic Pressure Head:</span>
            <span className="font-mono text-rose-400 font-bold">118 kPa (Over Hydraulic Grade Line)</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
            <span>Invert Elev: 494.5m</span>
            <span>Backflow: <strong className="text-rose-400">ACTIVE (Roadway Ponding)</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};
