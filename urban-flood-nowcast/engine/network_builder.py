"""Full-scale deterministic drainage-network builder (Requirement #3, full inventory).

Generates the documented CMWSSB inventory as a directed graph:
  nodes: 502 manholes (incl. 5 zone outfalls) + 192 inlet junctions = 694
  edges: 253 real mains + 760 inferred hierarchical conduits = 1013

Layout is a deterministic schematic (seeded RNG): five zone lanes, gravity
flow top→bottom, dendritic mains + inferred laterals. Live hydraulic state
per conduit comes from CapacityCalculator (Manning + Rational) driven by
nowcast rainfall, so the whole 1013-edge graph lights up with real statuses.
"""

from __future__ import annotations

import math
import random
from dataclasses import dataclass, field

from .capacity_calculator import manning_circular, rational_flow
from .nowcast_engine import NowcastEngine

WIDTH = 1200
HEIGHT = 820

# Per-zone inventory splits (sum to the documented totals)
ZONE_ORDER = ["zone-c01", "zone-c02", "zone-c03", "zone-c04", "zone-c05"]
ZONE_SHORT = {"zone-c01": "C01", "zone-c02": "C02", "zone-c03": "C03", "zone-c04": "C04", "zone-c05": "C05"}
ZONE_LANE_X = {"zone-c01": 120, "zone-c02": 360, "zone-c03": 600, "zone-c04": 840, "zone-c05": 1080}
ZONE_RAIN_FACTOR = {"zone-c01": 1.06, "zone-c02": 0.94, "zone-c03": 1.0, "zone-c04": 1.12, "zone-c05": 0.82}

MANHOLES_PER_ZONE = {"zone-c01": 110, "zone-c02": 95, "zone-c03": 105, "zone-c04": 115, "zone-c05": 77}
INLETS_PER_ZONE = {"zone-c01": 40, "zone-c02": 36, "zone-c03": 40, "zone-c04": 44, "zone-c05": 32}
REAL_MAINS_PER_ZONE = {"zone-c01": 55, "zone-c02": 48, "zone-c03": 52, "zone-c04": 58, "zone-c05": 40}
INFERRED_PER_ZONE = {"zone-c01": 165, "zone-c02": 145, "zone-c03": 155, "zone-c04": 170, "zone-c05": 125}

DERATE_PCT = 75.0


def _status(util: float) -> str:
    if util >= 1.15:
        return "surcharged"
    if util >= 1.0:
        return "critical"
    if util >= 0.8:
        return "near_limit"
    return "normal"


@dataclass
class NetworkBuilder:
    seed: int = 42
    zones_built: dict = field(default_factory=dict)

    # -- layout (deterministic; built once per seed) ----------------------
    # Tidy layered schematic: nodes spread evenly across their level row,
    # every pipe links to a nearby downhill node (short, near-vertical
    # edges -> minimal crossings). Seeded jitter only.
    def build_layout(self) -> dict:
        if self.zones_built.get("seed") == self.seed and "nodes" in self.zones_built:
            return self.zones_built
        rng = random.Random(self.seed)
        nodes: list[dict] = []
        edges: list[dict] = []
        specs: dict[str, dict] = {}
        HALF_W = 95.0

        def _real_spec(rng: random.Random) -> dict:
            return {"diameter_mm": rng.choice([900, 1000, 1200, 1400, 1500, 1600, 1800, 2000, 2400, 2800]),
                    "slope": rng.uniform(0.0005, 0.0011), "n": 0.013,
                    "catch_ha": rng.uniform(3, 7), "C": rng.uniform(0.78, 0.9), "real": True}

        def _inf_spec(rng: random.Random) -> dict:
            return {"diameter_mm": rng.choice([225, 300, 375, 450, 525, 600, 750, 900]),
                    "slope": rng.uniform(0.0006, 0.0012), "n": 0.015,
                    "catch_ha": rng.uniform(0.1, 0.5), "C": rng.uniform(0.7, 0.85), "real": False}

        def _add_edge(eid: str, a: str, b: str, kind: str, zid: str, spec: dict) -> None:
            specs[eid] = spec
            edges.append({"id": eid, "from": a, "to": b, "kind": kind, "zone": zid})

        for zid in ZONE_ORDER:
            s = ZONE_SHORT[zid]
            cx = ZONE_LANE_X[zid]
            by_id: dict[str, dict] = {}
            indeg: dict[str, int] = {}

            def _reg(n: dict) -> str:
                nodes.append(n)
                by_id[n["id"]] = n
                indeg[n["id"]] = 0
                return n["id"]

            # --- inlets: two staggered rows --------------------------------
            n_in = INLETS_PER_ZONE[zid]
            inlets: list[str] = []
            rows: list[list[int]] = [[], []]
            for i in range(n_in):
                rows[i % 2].append(i)
            for r, members in enumerate(rows):
                m = len(members)
                for k, i in enumerate(members):
                    x = cx - HALF_W + (k / max(m - 1, 1)) * 2 * HALF_W + rng.uniform(-3, 3)
                    nid = f"IN-{s}-{i + 1:03d}"
                    _reg({"id": nid, "x": round(x, 1), "y": round(36 + r * 26, 1),
                          "type": "inlet", "zone": zid, "level": 0})
                    inlets.append(nid)

            # --- manholes: levels 1..6, evenly spread -----------------------
            n_mh = MANHOLES_PER_ZONE[zid]
            levels: dict[int, list[str]] = {lvl: [] for lvl in range(1, 7)}
            for i in range(n_mh - 1):  # last slot reserved for the outfall
                lvl = 1 + min(5, int(i / max(n_mh - 1, 1) * 6))
                levels[lvl].append(f"MH-{s}-{i + 1:03d}")
            outfall = f"MH-{s}-{n_mh:03d}"
            for lvl in range(1, 7):
                members = levels[lvl]
                m = len(members)
                for k, nid in enumerate(members):
                    x = cx - HALF_W + (k / max(m - 1, 1)) * 2 * HALF_W + rng.uniform(-6, 6)
                    y = 62 + lvl * 100 + rng.uniform(-8, 8)
                    _reg({"id": nid, "x": round(x, 1), "y": round(y, 1),
                          "type": "manhole", "zone": zid, "level": lvl})
            _reg({"id": outfall, "x": float(cx), "y": 772.0,
                  "type": "outfall", "zone": zid, "level": 7})

            def _nearest_deeper(a: str, exclude: set[str] | None = None) -> str | None:
                pa = by_id[a]
                best, best_d = None, 1e18
                for nid, p in by_id.items():
                    if nid == a or p["level"] <= pa["level"]:
                        continue
                    if exclude and nid in exclude:
                        continue
                    d = abs(p["x"] - pa["x"]) + (p["level"] - pa["level"]) * 18.0
                    if d < best_d:
                        best, best_d = nid, d
                return best

            # --- real mains: trunk paths through aligned primary nodes -----
            made_real = 0
            target_real = REAL_MAINS_PER_ZONE[zid]
            primaries: dict[int, list[str]] = {}
            for lvl in range(1, 7):
                members = levels[lvl]
                primaries[lvl] = [members[int(len(members) * f)] for f in (1 / 7, 3 / 7, 5 / 7)
                                  if members][:3] or members[:1]
            n_paths = max(len(v) for v in primaries.values())
            for p in range(n_paths):
                prev = None
                for lvl in range(1, 7):
                    col = primaries[lvl]
                    node = col[min(p, len(col) - 1)]
                    if prev is not None and made_real < target_real:
                        eid = f"RP-{s}-{made_real + 1:03d}"
                        _add_edge(eid, prev, node, "main", zid, _real_spec(rng))
                        indeg[node] += 1
                        made_real += 1
                    prev = node
                if made_real < target_real:
                    eid = f"RP-{s}-{made_real + 1:03d}"
                    _add_edge(eid, prev, outfall, "main", zid, _real_spec(rng))
                    indeg[outfall] += 1
                    made_real += 1
            # inlet feeders (real): every other inlet -> nearest level-1 node
            for i in range(0, len(inlets), 2):
                if made_real >= target_real:
                    break
                b = _nearest_deeper(inlets[i])
                if b is None:
                    continue
                eid = f"RP-{s}-{made_real + 1:03d}"
                _add_edge(eid, inlets[i], b, "main", zid, _real_spec(rng))
                indeg[b] += 1
                made_real += 1
            # any leftover real quota: shortest downhill links
            if made_real < target_real:
                for eid_a, eid_b, _d in self._shortest_pairs(by_id):
                    if made_real >= target_real:
                        break
                    a = eid_a
                    if self._linked(edges, a, eid_b) or indeg[eid_b] >= 5:
                        continue
                    eid = f"RP-{s}-{made_real + 1:03d}"
                    _add_edge(eid, a, eid_b, "main", zid, _real_spec(rng))
                    indeg[eid_b] += 1
                    made_real += 1

            # --- inferred laterals ------------------------------------------
            made_inf = 0
            target_inf = INFERRED_PER_ZONE[zid]
            have_out = {e["from"] for e in edges if e["zone"] == zid}

            def _try_inf(a: str, b: str | None) -> bool:
                nonlocal made_inf
                if b is None or made_inf >= target_inf:
                    return False
                if self._linked(edges, a, b) or indeg[b] >= 5:
                    return False
                eid = f"IF-{s}-{made_inf + 1:03d}"
                _add_edge(eid, a, b, "inferred", zid, _inf_spec(rng))
                indeg[b] += 1
                made_inf += 1
                return True

            # (a) every node without an outgoing edge drains somewhere near
            for n in [x for x in nodes if x["zone"] == zid and x["type"] != "outfall" and x["id"] not in have_out]:
                if _try_inf(n["id"], _nearest_deeper(n["id"])):
                    have_out.add(n["id"])
            # (b) fill quota with the shortest remaining downhill pairs
            if made_inf < target_inf:
                for a, b, _d in self._shortest_pairs(by_id):
                    if made_inf >= target_inf:
                        break
                    _try_inf(a, b)

        layout = {"seed": self.seed, "nodes": nodes, "edges": edges, "specs": specs}
        self.zones_built = layout
        return layout

    @staticmethod
    def _linked(edges: list[dict], a: str, b: str) -> bool:
        return any(e["from"] == a and e["to"] == b for e in edges)

    @staticmethod
    def _shortest_pairs(by_id: dict) -> list[tuple[str, str, float]]:
        ids = list(by_id)
        pairs: list[tuple[str, str, float]] = []
        for a in ids:
            pa = by_id[a]
            for b in ids:
                pb = by_id[b]
                if pb["level"] <= pa["level"]:
                    continue
                d = abs(pb["x"] - pa["x"]) + (pb["level"] - pa["level"]) * 18.0
                pairs.append((a, b, d))
        pairs.sort(key=lambda t: (t[2], t[0], t[1]))
        return pairs

    # -- live hydraulic state ----------------------------------------------
    def solve(self, rainfall_mmh: float | None = None,
              rainfall_by_zone: dict | None = None,
              derate_pct: float = DERATE_PCT) -> dict:
        layout = self.build_layout()
        if rainfall_by_zone is None:
            base = rainfall_mmh
            if base is None:
                base = NowcastEngine().run()[0]["rainfallMmHr"]
            rainfall_by_zone = {z: round(base * ZONE_RAIN_FACTOR[z], 1) for z in ZONE_ORDER}

        edge_states: dict[str, dict] = {}
        for e in layout["edges"]:
            spec = layout["specs"][e["id"]]
            rain = float(rainfall_by_zone.get(e["zone"], 50.0))
            d_m = spec["diameter_mm"] / 1000.0
            qcap = manning_circular(d_m, spec["slope"], spec["n"]) * (derate_pct / 100.0)
            qin = rational_flow(spec["C"], rain, spec["catch_ha"])
            util = (qin / qcap) if qcap > 0 else 0.0
            edge_states[e["id"]] = {
                "util": round(util, 3),
                "flow": round(qin, 3),
                "cap": round(qcap, 3),
                "status": _status(util),
                "rain": rain,
            }

        # node severity = worst incident edge
        node_rank = {n["id"]: 0 for n in layout["nodes"]}
        order = {"normal": 0, "near_limit": 1, "critical": 2, "surcharged": 3}
        for e in layout["edges"]:
            k = order[edge_states[e["id"]]["status"]]
            node_rank[e["from"]] = max(node_rank[e["from"]], k)
            node_rank[e["to"]] = max(node_rank[e["to"]], k)
        inv = {v: k for k, v in order.items()}
        nodes_out = [{**n, "status": inv[node_rank[n["id"]]],
                      "util": self._node_util(n["id"], layout, edge_states)}
                     for n in layout["nodes"]]
        edges_out = [{**e, **edge_states[e["id"]]} for e in layout["edges"]]

        counts = {"nodes": len(nodes_out), "edges": len(edges_out)}
        for st in ("normal", "near_limit", "critical", "surcharged"):
            counts[f"edges_{st}"] = sum(1 for e in edges_out if e["status"] == st)
            counts[f"nodes_{st}"] = sum(1 for n in nodes_out if n["status"] == st)
        return {"counts": counts, "nodes": nodes_out, "edges": edges_out,
                "rainfall_by_zone": rainfall_by_zone, "derate_pct": derate_pct}

    @staticmethod
    def _node_util(nid: str, layout: dict, edge_states: dict) -> float:
        best = 0.0
        for e in layout["edges"]:
            if e["from"] == nid or e["to"] == nid:
                best = max(best, edge_states[e["id"]]["util"])
        return round(best, 3)
