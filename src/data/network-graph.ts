/** Directed manhole→conduit flow-graph topology (Chennai CMWSSB).
 *
 *  13 nodes (3 inlets + 6 manholes + 2 outfalls + 2 street-ponding) and
 *  11 edges (8 modelled conduits with backend IDs + 2 overflow links +
 *  street-ponding links). Conduit IDs match engine/capacity_calculator.py
 *  and the mock inventory so live + demo statuses join 1:1.
 */
export type FlowNodeType = 'inlet' | 'junction' | 'outfall' | 'street';

export interface FlowNode {
  id: string;
  short: string;
  label: string;
  type: FlowNodeType;
  x: number;
  y: number;
  /** parent manhole for street-ponding nodes */
  parent?: string;
}

export interface FlowEdge {
  id: string;
  from: string;
  to: string;
  /** backend conduit id (drain-c***) — absent for overflow/street links */
  conduitId?: string;
  kind: 'pipe' | 'overflow';
  label: string;
  /** which face of the target card the edge enters (avoids crossings) */
  enter?: 'top' | 'left' | 'right';
  /** vertical bus x for routed overflow links */
  viaX?: number;
}

export const FLOW_NODES: FlowNode[] = [
  { id: 'in-north', short: 'IN-N', label: 'Inlet · Anna Nagar', type: 'inlet', x: 150, y: 64 },
  { id: 'in-west', short: 'IN-W', label: 'Inlet · T. Nagar', type: 'inlet', x: 390, y: 64 },
  { id: 'in-south', short: 'IN-S', label: 'Inlet · Velachery', type: 'inlet', x: 630, y: 64 },
  { id: 'mh-c03a', short: 'M-C03A', label: 'Junction · Anna Nagar', type: 'junction', x: 150, y: 188 },
  { id: 'mh-c01a', short: 'M-C01A', label: 'Junction · G.N. Chetty', type: 'junction', x: 390, y: 188 },
  { id: 'mh-c04a', short: 'M-C04A', label: 'Junction · Velachery Low', type: 'junction', x: 630, y: 188 },
  { id: 'mh-c02a', short: 'M-C02A', label: 'Junction · Sterling Rd', type: 'junction', x: 250, y: 312 },
  { id: 'mh-c01b', short: 'M-C01B', label: 'Junction · Bazullah RUB', type: 'junction', x: 470, y: 312 },
  { id: 'out-canal', short: 'OUT-N', label: 'Outfall · Buckingham Canal', type: 'outfall', x: 130, y: 436 },
  { id: 'mh-c05a', short: 'M-C05A', label: 'Junction · Lattice Bridge', type: 'junction', x: 390, y: 436 },
  { id: 'st-c01', short: 'ST-C01', label: 'Street · Bazullah ponding', type: 'street', x: 640, y: 372, parent: 'mh-c01b' },
  { id: 'out-adyar', short: 'OUT-S', label: 'Outfall · Adyar Estuary', type: 'outfall', x: 390, y: 540 },
  { id: 'st-c04', short: 'ST-C04', label: 'Street · Velachery ponding', type: 'street', x: 640, y: 496, parent: 'mh-c04a' },
];

export const FLOW_EDGES: FlowEdge[] = [
  { id: 'e-c072', from: 'in-north', to: 'mh-c03a', conduitId: 'drain-c072', kind: 'pipe', label: 'C-072 branch' },
  { id: 'e-c034', from: 'mh-c03a', to: 'mh-c02a', conduitId: 'drain-c034', kind: 'pipe', label: 'C-034 connector' },
  { id: 'e-c089', from: 'mh-c02a', to: 'out-canal', conduitId: 'drain-c089', kind: 'pipe', label: 'C-089 branch' },
  { id: 'e-c112', from: 'in-west', to: 'mh-c01a', conduitId: 'drain-c112', kind: 'pipe', label: 'C-112 outfall' },
  { id: 'e-c104', from: 'mh-c01a', to: 'mh-c01b', conduitId: 'drain-c104', kind: 'pipe', label: 'C-104 trunk' },
  { id: 'e-c128', from: 'in-south', to: 'mh-c04a', conduitId: 'drain-c128', kind: 'pipe', label: 'C-128 collector' },
  { id: 'e-c019', from: 'mh-c04a', to: 'mh-c05a', conduitId: 'drain-c019', kind: 'pipe', label: 'C-019 canal link', enter: 'left' },
  { id: 'e-c055', from: 'mh-c05a', to: 'out-adyar', conduitId: 'drain-c055', kind: 'pipe', label: 'C-055 trunk' },
  { id: 'e-ovf-c01', from: 'mh-c01b', to: 'st-c01', kind: 'overflow', label: 'backflow' },
  { id: 'e-ovf-c04', from: 'mh-c04a', to: 'st-c04', kind: 'overflow', label: 'backflow', enter: 'right', viaX: 730 },
  { id: 'e-c01b-adyar', from: 'mh-c01b', to: 'mh-c05a', kind: 'pipe', label: 'Cooum–Adyar link' },
];
