"""FloodGuard Chennai — full coupled nowcasting API.

Requirements coverage:
  #1 Nowcasting 0-3h ......... GET /api/nowcast
  #2 DEM 2D routing ........... GET /api/flood/zones (+ /api/dem/tile)
  #3 Drainage graph ........... GET /api/drainage/network
  #4 Capacity/surcharge ....... POST /api/hydraulics/capacity, POST /api/simulate
  #5 GIS dashboard ............ GET /api/dashboard (aggregates all)
  #6 Safe-route navigation .... GET/POST /api/routes/safe-route  (REST for Mapbox/OSRM/Google)

Data modes (?mode= / body.mode):
  real — live physics engines (advection nowcast + diffusive-wave DEM + Manning).
  fake — deterministic static profiles mirroring the frontend mock data, for
         demos/offline work. The frontend toggle switches between these.
"""

from datetime import datetime, timedelta, timezone

from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS

from engine.nowcast_engine import NowcastEngine, LEAD_TIMES
from engine.dem_processor import DEMProcessor, ZONE_TERRAIN
from engine.capacity_calculator import CapacityCalculator
from engine.drainage_extractor import DrainageExtractor
from engine.flow_analysis import FlowAnalyzer
from engine.flood_simulator import FloodSimulator, ZONE_META
from engine.network_builder import NetworkBuilder

try:
    from zoneinfo import ZoneInfo
    IST = ZoneInfo("Asia/Kolkata")
except Exception:  # pragma: no cover
    IST = timezone(timedelta(hours=5, minutes=30))

app = Flask(__name__, static_folder="static")
CORS(app)

nowcast_engine = NowcastEngine()
dem_processor = DEMProcessor()
flow_analyzer = FlowAnalyzer()
drainage_extractor = DrainageExtractor()
network_builder = NetworkBuilder()

BASE_IST = datetime.now(IST).replace(minute=15, second=0, microsecond=0)


def _ist_labels():
    labels = []
    for lt in LEAD_TIMES:
        t = BASE_IST + timedelta(minutes=lt)
        labels.append(t.strftime("%H:%M"))
    return labels


# ---------------------------------------------------------------- fake data
# Static profiles mirroring src/data/*.ts so FAKE mode == current UI.
FAKE_NOWCAST = [
    {"timeOffsetMinutes": 0, "label": "NOW", "timeString": "19:15", "rainfallMmHr": 32, "floodProbability": 46, "riskLevel": "moderate", "criticalZonesCount": 2, "highRiskZonesCount": 1, "avgDepthCm": 11, "radarEchoDbz": 41},
    {"timeOffsetMinutes": 30, "label": "+30 MIN", "timeString": "19:45", "rainfallMmHr": 56, "floodProbability": 71, "riskLevel": "high", "criticalZonesCount": 3, "highRiskZonesCount": 2, "avgDepthCm": 24, "radarEchoDbz": 50},
    {"timeOffsetMinutes": 60, "label": "+60 MIN", "timeString": "20:15", "rainfallMmHr": 74, "floodProbability": 89, "riskLevel": "critical", "criticalZonesCount": 3, "highRiskZonesCount": 3, "avgDepthCm": 38, "radarEchoDbz": 57},
    {"timeOffsetMinutes": 90, "label": "+90 MIN", "timeString": "20:45", "rainfallMmHr": 70, "floodProbability": 86, "riskLevel": "critical", "criticalZonesCount": 3, "highRiskZonesCount": 3, "avgDepthCm": 36, "radarEchoDbz": 54},
    {"timeOffsetMinutes": 120, "label": "+120 MIN", "timeString": "21:15", "rainfallMmHr": 47, "floodProbability": 67, "riskLevel": "high", "criticalZonesCount": 2, "highRiskZonesCount": 2, "avgDepthCm": 26, "radarEchoDbz": 46},
    {"timeOffsetMinutes": 180, "label": "+180 MIN", "timeString": "22:15", "rainfallMmHr": 26, "floodProbability": 39, "riskLevel": "moderate", "criticalZonesCount": 1, "highRiskZonesCount": 1, "avgDepthCm": 13, "radarEchoDbz": 35},
]

FAKE_ZONES = [
    {"id": "zone-c01", "code": "Zone C01", "name": "T. Nagar & Bazullah Road Basin", "riskLevel": "critical", "floodProbability": 89, "expectedOnsetMinutes": 22, "estimatedDepthCm": 38, "rainfallMmPerHour": 72, "drainageUtilization": 91, "elevationMeters": 7, "populationAtRisk": 22400},
    {"id": "zone-c02", "code": "Zone C02", "name": "Nungambakkam & Seetha Nagar", "riskLevel": "high", "floodProbability": 76, "expectedOnsetMinutes": 35, "estimatedDepthCm": 28, "rainfallMmPerHour": 58, "drainageUtilization": 82, "elevationMeters": 11, "populationAtRisk": 16800},
    {"id": "zone-c03", "code": "Zone C03", "name": "Anna Nagar & Aminjikarai", "riskLevel": "critical", "floodProbability": 85, "expectedOnsetMinutes": 26, "estimatedDepthCm": 34, "rainfallMmPerHour": 68, "drainageUtilization": 88, "elevationMeters": 9, "populationAtRisk": 19800},
    {"id": "zone-c04", "code": "Zone C04", "name": "Velachery & Drivers Colony Low", "riskLevel": "critical", "floodProbability": 91, "expectedOnsetMinutes": 18, "estimatedDepthCm": 42, "rainfallMmPerHour": 78, "drainageUtilization": 94, "elevationMeters": 6, "populationAtRisk": 24500},
    {"id": "zone-c05", "code": "Zone C05", "name": "Thiruvanmiyur & Adyar", "riskLevel": "moderate", "floodProbability": 54, "expectedOnsetMinutes": 70, "estimatedDepthCm": 16, "rainfallMmPerHour": 42, "drainageUtilization": 62, "elevationMeters": 14, "populationAtRisk": 13200},
]

# Candidate road graph for the safe-route API. Edge weights are re-weighted
# live by flood depth: cost = duration_min * (1 + depth_cm/12).
ROUTE_GRAPH = {
    "nodes": {
        "t_nagar": {"name": "T. Nagar Pondy Bazaar", "elev_m": 7.0, "zone": "zone-c01"},
        "bazullah": {"name": "Bazullah Road Underpass", "elev_m": 6.5, "zone": "zone-c01"},
        "gn_chetty": {"name": "G.N. Chetty Road Ridge", "elev_m": 8.5, "zone": "zone-c01"},
        "sterling": {"name": "Sterling Road Flyover", "elev_m": 11.0, "zone": "zone-c02"},
        "nungam": {"name": "Nungambakkam College Road", "elev_m": 11.0, "zone": "zone-c02"},
        "anna": {"name": "Anna Nagar 2nd Ave", "elev_m": 9.0, "zone": "zone-c03"},
        "velachery": {"name": "Velachery 100ft Dip", "elev_m": 6.0, "zone": "zone-c04"},
        "thiru": {"name": "Thiruvanmiyur ECR", "elev_m": 14.0, "zone": "zone-c05"},
    },
    "edges": [
        {"from": "t_nagar", "to": "bazullah", "km": 1.1, "min": 9, "street": "Bazullah Road dip"},
        {"from": "bazullah", "to": "nungam", "km": 3.8, "min": 33, "street": "Cooum Culvert link"},
        {"from": "t_nagar", "to": "gn_chetty", "km": 1.2, "min": 8, "street": "G.N. Chetty Road"},
        {"from": "gn_chetty", "to": "sterling", "km": 2.6, "min": 10, "street": "Sterling Rd elevated"},
        {"from": "sterling", "to": "nungam", "km": 2.0, "min": 7, "street": "Valluvar Kottam link"},
        {"from": "t_nagar", "to": "velachery", "km": 2.9, "min": 16, "street": "Velachery link"},
        {"from": "velachery", "to": "anna", "km": 2.4, "min": 14, "street": "Drivers Colony"},
        {"from": "anna", "to": "nungam", "km": 2.9, "min": 13, "street": "Aminjikarai link"},
        {"from": "velachery", "to": "thiru", "km": 4.1, "min": 18, "street": "Taramani link"},
        {"from": "thiru", "to": "nungam", "km": 6.8, "min": 26, "street": "ECR-Adyar bypass"},
    ],
}

ALIASES = {
    "t. nagar pondy bazaar": "t_nagar", "t nagar": "t_nagar", "pondy bazaar": "t_nagar",
    "nungambakkam college road": "nungam", "nungambakkam": "nungam",
    "anna nagar 2nd avenue": "anna", "anna nagar": "anna",
    "thiruvanmiyur ecr": "thiru", "thiruvanmiyur": "thiru",
    "velachery vijayanagar": "velachery", "velachery": "velachery",
}


def _mode() -> str:
    m = (request.args.get("mode") or "").lower()
    if m in ("real", "fake"):
        return m
    try:
        body = request.get_json(silent=True) or {}
        if str(body.get("mode", "")).lower() in ("real", "fake"):
            return str(body.get("mode")).lower()
    except Exception:
        pass
    return "real"


def _flood_depth_by_zone(sim: dict) -> dict:
    return {z["id"]: z["estimatedDepthCm"] for z in sim["zones"]}


def _dijkstra(origin: str, dest: str, depth_by_zone: dict, avoid_cm: float = 15.0):
    import heapq
    nodes = ROUTE_GRAPH["nodes"]
    adj: dict[str, list] = {k: [] for k in nodes}
    for e in ROUTE_GRAPH["edges"]:
        for a, b in ((e["from"], e["to"]), (e["to"], e["from"])):
            node = nodes[b]
            depth = float(depth_by_zone.get(node["zone"], 0.0))
            # Elevated flyover edges are flood-resilient
            resilient = "flyover" in e["street"] or "elevated" in e["street"]
            eff_depth = depth * 0.15 if resilient else depth
            if eff_depth >= avoid_cm and not resilient:
                penalty = 6.0
            else:
                penalty = 1.0 + eff_depth / 12.0
            adj[a].append((b, e["min"] * penalty, e, eff_depth))
    dist = {k: float("inf") for k in nodes}
    prev: dict[str, tuple] = {}
    dist[origin] = 0.0
    pq = [(0.0, origin)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        if u == dest:
            break
        for v, w, e, dep in adj[u]:
            nd = d + w
            if nd < dist[v]:
                dist[v] = nd
                prev[v] = (u, e, dep)
                heapq.heappush(pq, (nd, v))
    if dest not in prev and origin != dest:
        return None
    # reconstruct
    legs, depths, node_path = [], [], [dest]
    cur = dest
    total_km, total_min = 0.0, 0.0
    while cur != origin:
        u, e, dep = prev[cur]
        legs.append({"from": nodes[u]["name"], "to": nodes[cur]["name"],
                     "via": e["street"], "km": e["km"], "depthCm": round(dep, 1)})
        depths.append(dep)
        total_km += e["km"]
        total_min += e["min"]
        cur = u
        node_path.append(cur)
    legs.reverse()
    node_path.reverse()
    max_depth = max(depths) if depths else 0.0
    return {"legs": legs, "node_path": node_path, "distanceKm": round(total_km, 1),
            "durationMin": round(total_min), "costMin": round(dist[dest], 1),
            "maxDepthCm": round(max_depth, 1), "depths": depths}


# ------------------------------------------------------------- static pages
@app.route("/")
def index():
    return send_from_directory("static", "index.html")


@app.route("/static/<path:path>")
def serve_static(path):
    return send_from_directory("static", path)


# ------------------------------------------------------------------ health
@app.route("/api/health", methods=["GET"])
def health():
    inv = drainage_extractor.inventory()
    return jsonify({
        "status": "ok",
        "service": "floodguard-chennai",
        "radar": "DWR Chennai (advective nowcast)",
        "dem": "synthetic 6-24m tile honouring Copernicus/Bhuvan proxy",
        "network": inv["documented"],
        "modes": ["real", "fake"],
        "endpoints": ["/api/nowcast", "/api/flood/zones", "/api/hydraulics/capacity",
                      "/api/drainage/network", "/api/simulate", "/api/routes/safe-route",
                      "/api/dashboard", "/api/dem/tile", "/api/flow/analysis"],
    })


# ----------------------------------------------------------------- nowcast
@app.route("/api/nowcast", methods=["GET"])
def nowcast():
    mode = _mode()
    if mode == "fake":
        return jsonify({"mode": "fake", "leadTimeWindow": "0-180 min (0-3h)",
                        "radar": "DWR Chennai (static demo profile)",
                        "series": FAKE_NOWCAST})
    base = request.args.get("base_intensity_mmh", type=float)
    seed = request.args.get("seed", type=int)
    vel = request.args.get("velocity_ms", type=float)
    series = nowcast_engine.run(base_intensity_mmh=base, seed=seed, velocity_ms=vel)
    labels = _ist_labels()
    for p, t in zip(series, labels):
        p["timeString"] = t
    snapshot = nowcast_engine.fetch_live_snapshot()
    return jsonify({"mode": "real", "leadTimeWindow": "0-180 min (0-3h)",
                    "radar": "DWR Chennai", "method": "Lagrangian advection + Marshall-Palmer Z-R",
                    "live_snapshot": {"live": snapshot["live"], "provider": snapshot["provider"]},
                    "series": series})


# ------------------------------------------------------------- flood zones
@app.route("/api/flood/zones", methods=["GET"])
def flood_zones():
    mode = _mode()
    if mode == "fake":
        return jsonify({"mode": "fake", "zones": FAKE_ZONES})
    sim = FloodSimulator().run(seed=request.args.get("seed", type=int))
    return jsonify({"mode": "real", "engine": sim["engine"], "zones": sim["zones"]})


# ---------------------------------------------------------------- hydraulics
@app.route("/api/hydraulics/capacity", methods=["POST"])
def hydraulics_capacity():
    body = request.get_json(force=True, silent=True) or {}
    mode = str(body.get("mode", request.args.get("mode", "real"))).lower()
    rainfall = float(body.get("rainfall_intensity", body.get("rainfall_mmh", 60)))
    duration = int(body.get("storm_duration", body.get("duration_min", 60)))
    derate = float(body.get("drainage_capacity_pct", body.get("drainageCapacity", 75)))
    if mode == "fake":
        calc = CapacityCalculator(drainage_capacity_pct=derate)
        rain_by_zone = {z["id"]: z["rainfallMmPerHour"] for z in FAKE_ZONES}
        net = calc.network_state(rain_by_zone, duration_min=duration)
        return jsonify({"mode": "fake", "method": "Manning + Rational (static demo rainfall)",
                        "rainfall_mmh": rainfall, "result": net})
    calc = CapacityCalculator(drainage_capacity_pct=derate)
    rain_by_zone = body.get("rainfall_by_zone")
    if not rain_by_zone:
        rain_by_zone = {zid: rainfall for zid in ZONE_TERRAIN}
    net = calc.network_state({k: float(v) for k, v in rain_by_zone.items()}, duration_min=duration)
    return jsonify({"mode": "real", "method": "Manning Q=(1/n)AR^(2/3)S^(1/2) + Rational Q=CiA",
                    "rainfall_mmh": rainfall, "duration_min": duration,
                    "drainage_capacity_pct": derate, "result": net})


# ------------------------------------------------------------------ simulate
@app.route("/api/simulate", methods=["POST"])
def simulate():
    body = request.get_json(force=True, silent=True) or {}
    mode = str(body.get("mode", request.args.get("mode", "real"))).lower()
    rainfall = float(body.get("rainfall_intensity", 60))
    duration = int(body.get("storm_duration", 60))
    derate = float(body.get("drainage_capacity_pct", 75))
    vel = body.get("velocity_ms", body.get("storm_velocity_ms"))
    vel = float(vel) if vel is not None else None
    if mode == "fake":
        # Deterministic stress scaling of the static profile (offline demo)
        stress = (rainfall / 68.0) * (100.0 / max(derate, 15.0)) / (100.0 / 75.0)
        zones = []
        for z in FAKE_ZONES:
            depth = round(min(120.0, z["estimatedDepthCm"] * stress), 1)
            prob = round(min(97.0, z["floodProbability"] * (0.6 + 0.4 * stress)), 1)
            zones.append({**z, "estimatedDepthCm": depth, "floodProbability": prob})
        return jsonify({"status": "ok", "mode": "fake", "zones": zones,
                        "message": "Static-profile what-if scaling (offline demo)."})
    sim = FloodSimulator(drainage_capacity_pct=derate).run(
        base_intensity_mmh=rainfall, drainage_capacity_pct=derate,
        seed=body.get("seed"), velocity_ms=vel)
    calc = CapacityCalculator(drainage_capacity_pct=derate)
    net = calc.network_state({z["id"]: z["rainfallMmPerHour"] for z in sim["zones"]},
                             duration_min=duration)
    # What-if aggregates for the simulator page
    critical = sum(1 for z in sim["zones"] if z["riskLevel"] == "critical")
    return jsonify({"status": "ok", "mode": "real", "engine": sim["engine"],
                    "nowcast": sim["nowcast"], "zones": sim["zones"],
                    "hydraulics": net["summary"],
                    "aggregates": {
                        "criticalZones": critical,
                        "maxFloodDepthCm": max(z["estimatedDepthCm"] for z in sim["zones"]),
                        "totalOverflowM3": round(sum(c.get("overflowVolumeM3", 0) for z in sim["zones"] for c in z["conduits"]), 1),
                    },
                    "message": "Coupled advection + DEM routing + Manning surcharge."})


# ------------------------------------------------------------------ drainage
@app.route("/api/drainage/network", methods=["GET"])
def drainage_network():
    return jsonify({"mode": _mode(), **drainage_extractor.inventory()})


@app.route("/api/drainage/graph/full", methods=["GET"])
def drainage_graph_full():
    """Full 694-node / 1013-edge directed network with live hydraulic state.

    Query: ?mode=real|fake&rainfall_mmh=..&seed=42&derate_pct=75
    (rainfall omitted in real mode -> nowcast NOW point drives it).
    """
    mode = _mode()
    seed = request.args.get("seed", type=int, default=42)
    derate = request.args.get("derate_pct", type=float, default=75.0)
    rain = request.args.get("rainfall_mmh", type=float)
    builder = network_builder if seed == 42 else NetworkBuilder(seed=seed)
    if mode == "fake" and rain is None:
        rain = 68.0  # static demo storm
    solved = builder.solve(rainfall_mmh=rain, derate_pct=derate)
    return jsonify({"mode": mode, "engine": "Manning + Rational per conduit, nowcast-driven",
                    "layout": "5 zone lanes, gravity top→bottom, seeded deterministic",
                    **solved})


@app.route("/api/dem/tile", methods=["GET"])
def dem_tile():
    zone_id = request.args.get("zone", "zone-c04")
    if zone_id not in ZONE_TERRAIN:
        return jsonify({"error": f"unknown zone {zone_id}", "valid": sorted(ZONE_TERRAIN)}), 400
    tile = dem_processor.build_tile(zone_id)
    rain = request.args.get("rainfall_mmh", type=float, default=60.0)
    route = dem_processor.route_storm(zone_id, [rain] * 6)
    return jsonify({"mode": _mode(), "zone": zone_id, "terrain": ZONE_TERRAIN[zone_id],
                    "tile": tile, "route_6x30min_cm": route["depths_cm"],
                    "dem_stats": route["dem_stats"]})


@app.route("/api/flow/analysis", methods=["GET"])
def flow_analysis():
    zone_id = request.args.get("zone", "zone-c04")
    if zone_id not in ZONE_TERRAIN:
        return jsonify({"error": f"unknown zone {zone_id}"}), 400
    return jsonify(flow_analyzer.analyse(zone_id))


# ------------------------------------------------------------------ dashboard
@app.route("/api/dashboard", methods=["GET"])
def dashboard():
    mode = _mode()
    if mode == "fake":
        return jsonify({"mode": "fake", "nowcast": FAKE_NOWCAST, "zones": FAKE_ZONES,
                        "city": {"overallCityRiskScore": 71, "earliestFloodOnsetMinutes": 18}})
    sim = FloodSimulator().run(seed=request.args.get("seed", type=int))
    zones = sim["zones"]
    crit = sum(1 for z in zones if z["riskLevel"] == "critical")
    high = sum(1 for z in zones if z["riskLevel"] == "high")
    onsets = [z["expectedOnsetMinutes"] for z in zones if z["expectedOnsetMinutes"] < 900]
    return jsonify({"mode": "real", "engine": sim["engine"], "nowcast": sim["nowcast"],
                    "zones": zones,
                    "city": {"overallCityRiskScore": round(sum(z["floodProbability"] for z in zones) / len(zones), 1),
                             "criticalZones": crit, "highRiskZones": high,
                             "earliestFloodOnsetMinutes": min(onsets) if onsets else None,
                             "maxDepthCm": max(z["estimatedDepthCm"] for z in zones)}})


def _alerts_from_zones(zones: list, rain_by_zone: dict | None = None) -> list:
    """Derive live alerts from coupled-model zone states (high/critical)."""
    alerts = []
    code_n = 104
    for z in sorted(zones, key=lambda x: (x.get("expectedOnsetMinutes", 999))):
        if z.get("riskLevel") not in ("high", "critical"):
            continue
        onset = z.get("expectedOnsetMinutes", 999)
        crit = z.get("riskLevel") == "critical"
        alerts.append({
            "id": f"alt-{z['id']}",
            "code": f"ALT-2026-{code_n}",
            "title": (f"{'Severe ponding predicted'}: {z['name']}" if crit
                       else f"Ponding warning: {z['name']}"),
            "description": (f"Coupled model: {z.get('rainfallMmPerHour', '?')}mm/h over "
                            f"{z.get('elevationMeters', '?')}m basin, drainage "
                            f"{z.get('drainageUtilization', '?')}% -> {z.get('estimatedDepthCm', '?')}cm ponding."),
            "severity": z["riskLevel"],
            "zoneId": z["id"],
            "zoneName": f"{z['name']} ({z.get('code', '')})",
            "expectedOnsetMinutes": None if onset >= 900 else onset,
            "estimatedDepthCm": z.get("estimatedDepthCm"),
            "recommendation": ("Avoid underpasses, divert via flyovers; pre-deploy pumps."
                               if crit else "Avoid low dips; monitor inlets."),
            "status": "active",
            "timestamp": datetime.now(IST).strftime("%H:%M IST"),
        })
        code_n -= 1
    return alerts


# ------------------------------------------------------------------- alerts
@app.route("/api/alerts", methods=["GET"])
def alerts():
    mode = _mode()
    if mode == "fake":
        return jsonify({"mode": "fake", "alerts": _alerts_from_zones(FAKE_ZONES)})
    vel = request.args.get("velocity_ms", type=float)
    sim = FloodSimulator().run(seed=request.args.get("seed", type=int), velocity_ms=vel)
    return jsonify({"mode": "real", "engine": sim["engine"],
                    "alerts": _alerts_from_zones(sim["zones"])})


# --------------------------------------------------------------- safe-route
# Requirement #6 — REST utility for external nav maps (Mapbox / OSRM / Google).
# Query:  GET /api/routes/safe-route?origin=T.Nagar&destination=Nungambakkam&mode=real
# Body (POST): {"origin": "...", "destination": "...", "mode": "real",
#               "avoid_depth_cm": 15, "alternatives": 3}
@app.route("/api/routes/safe-route", methods=["GET", "POST"])
def safe_route():
    if request.method == "POST":
        body = request.get_json(force=True, silent=True) or {}
        origin_q = str(body.get("origin", "T. Nagar"))
        dest_q = str(body.get("destination", "Nungambakkam"))
        mode = str(body.get("mode", request.args.get("mode", "real"))).lower()
        avoid = float(body.get("avoid_depth_cm", 15))
        want_alts = int(body.get("alternatives", 3))
        seed = body.get("seed")
    else:
        origin_q = str(request.args.get("origin", "T. Nagar"))
        dest_q = str(request.args.get("destination", "Nungambakkam"))
        mode = _mode()
        avoid = float(request.args.get("avoid_depth_cm", 15))
        want_alts = int(request.args.get("alternatives", 3))
        seed = request.args.get("seed", type=int)

    def resolve(q: str) -> str | None:
        ql = q.strip().lower()
        if ql in ROUTE_GRAPH["nodes"]:
            return ql
        for alias, nid in ALIASES.items():
            if alias in ql or ql in alias:
                return nid
        # fuzzy: match node display names
        for nid, n in ROUTE_GRAPH["nodes"].items():
            if ql in n["name"].lower() or n["name"].lower() in ql:
                return nid
        return None

    origin = resolve(origin_q)
    dest = resolve(dest_q)
    if not origin or not dest:
        return jsonify({"error": "unknown origin/destination",
                        "hint": "try T. Nagar, Nungambakkam, Anna Nagar, Velachery, Thiruvanmiyur",
                        "known_nodes": {k: v["name"] for k, v in ROUTE_GRAPH["nodes"].items()}}), 400
    if origin == dest:
        return jsonify({"error": "origin == destination"}), 400

    if mode == "fake":
        depth_by_zone = {z["id"]: z["estimatedDepthCm"] for z in FAKE_ZONES}
        src = "static demo depths"
    else:
        sim = FloodSimulator().run(seed=seed)
        depth_by_zone = _flood_depth_by_zone(sim)
        src = sim["engine"]

    primary = _dijkstra(origin, dest, depth_by_zone, avoid_cm=avoid)
    if not primary:
        return jsonify({"error": "no path found"}), 404

    # Alternatives: penalise primary corridor streets and re-solve
    alternatives = [primary]
    banned: set[str] = set()
    for leg in primary["legs"]:
        banned.add(leg["via"])
    for _ in range(max(0, want_alts - 1)):
        import heapq
        nodes = ROUTE_GRAPH["nodes"]
        adj: dict[str, list] = {k: [] for k in nodes}
        for e in ROUTE_GRAPH["edges"]:
            extra = 4.0 if e["street"] in banned else 1.0
            for a, b in ((e["from"], e["to"]), (e["to"], e["from"])):
                depth = float(depth_by_zone.get(nodes[b]["zone"], 0.0))
                resilient = "flyover" in e["street"] or "elevated" in e["street"]
                eff = depth * 0.15 if resilient else depth
                w = e["min"] * (1.0 + eff / 12.0) * extra
                adj[a].append((b, w, e, eff))
        dist = {k: float("inf") for k in nodes}
        prev: dict = {}
        dist[origin] = 0.0
        pq = [(0.0, origin)]
        while pq:
            d, u = heapq.heappop(pq)
            if d > dist[u]:
                continue
            for v, w, e, dep in adj[u]:
                nd = d + w
                if nd < dist[v]:
                    dist[v] = nd
                    prev[v] = (u, e, dep)
                    heapq.heappush(pq, (nd, v))
        if dest not in prev:
            break
        legs, depths, total_km, total_min = [], [], 0.0, 0.0
        cur = dest
        while cur != origin:
            u, e, dep = prev[cur]
            legs.append({"from": nodes[u]["name"], "to": nodes[cur]["name"],
                         "via": e["street"], "km": e["km"], "depthCm": round(dep, 1)})
            depths.append(dep)
            total_km += e["km"]
            total_min += e["min"]
            banned.add(e["street"])
            cur = u
        legs.reverse()
        alt = {"legs": legs, "distanceKm": round(total_km, 1), "durationMin": round(total_min),
               "costMin": round(dist[dest], 1), "maxDepthCm": round(max(depths), 1),
               "depths": depths}
        # dedupe
        sig = tuple(l["via"] for l in legs)
        if all(tuple(l["via"] for l in a["legs"]) != sig for a in alternatives):
            alternatives.append(alt)
        if len(alternatives) >= want_alts:
            break

    def risk_of(a):
        m = a["maxDepthCm"]
        return "critical" if m >= 30 else ("high" if m >= 15 else ("moderate" if m >= 8 else "low"))

    ranked = sorted(alternatives, key=lambda a: (a["maxDepthCm"], a["costMin"]))
    routes = []
    for i, a in enumerate(ranked):
        routes.append({
            "id": f"route-{chr(65 + i)}",
            "rank": i + 1,
            "recommended": i == 0,
            "distanceKm": a["distanceKm"],
            "durationMin": a["durationMin"],
            "maxDepthCm": a["maxDepthCm"],
            "riskLevel": risk_of(a),
            "floodExposureScore": round(min(100.0, a["maxDepthCm"] * 2.4), 1),
            "legs": a["legs"],
            "summary": ("Recommended — lowest flood exposure via "
                        + ", ".join(l["via"] for l in a["legs"][:2])) if i == 0 else
                       ("Alternate via " + ", ".join(l["via"] for l in a["legs"][:2])),
        })

    return jsonify({"mode": mode, "origin": ROUTE_GRAPH["nodes"][origin]["name"],
                    "destination": ROUTE_GRAPH["nodes"][dest]["name"],
                    "depthsByZoneCm": depth_by_zone, "depthSource": src,
                    "avoidDepthCm": avoid, "routes": routes,
                    "integration": {
                        "mapbox": "POST legs[].via geometry to Mapbox Directions as waypoints; exclude legs with depthCm > avoidDepthCm",
                        "osrm": "GET /route/v1/driving/{lng,lat} with exclude=zones(depth>threshold); this response gives the ranked order",
                        "google": "Use routes[] order as waypoint preference input to Routes API",
                    }})


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
