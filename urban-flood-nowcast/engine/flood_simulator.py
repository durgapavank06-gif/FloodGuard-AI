"""Coupled flood simulator: nowcast + DEM routing + drainage surcharge (Req #2/#4).

Couples, per zone and per lead time:
  depth_final = max(overland ponding from dem_processor,
                    manhole overflow head from capacity_calculator)
and derives onset countdowns, risk levels and city aggregates consumed by the
GIS dashboard and the safe-route API.
"""

from __future__ import annotations

from .nowcast_engine import NowcastEngine, LEAD_TIMES
from .dem_processor import DEMProcessor, ZONE_TERRAIN
from .capacity_calculator import CapacityCalculator


ZONE_META = {
    "zone-c01": {"code": "Zone C01", "name": "T. Nagar & Bazullah Road Basin", "population": 22400},
    "zone-c02": {"code": "Zone C02", "name": "Nungambakkam & Seetha Nagar", "population": 16800},
    "zone-c03": {"code": "Zone C03", "name": "Anna Nagar & Aminjikarai", "population": 19800},
    "zone-c04": {"code": "Zone C04", "name": "Velachery & Drivers Colony Low", "population": 24500},
    "zone-c05": {"code": "Zone C05", "name": "Thiruvanmiyur & Adyar", "population": 13200},
}

# Per-zone rainfall modifier (low pockets catch more runoff-producing rain)
ZONE_RAIN_FACTOR = {"zone-c01": 1.06, "zone-c02": 0.94, "zone-c03": 1.0, "zone-c04": 1.12, "zone-c05": 0.82}


def _risk(prob: float, depth: float) -> str:
    if prob >= 80 or depth >= 32:
        return "critical"
    if prob >= 65 or depth >= 22:
        return "high"
    if prob >= 40 or depth >= 12:
        return "moderate"
    return "low"


class FloodSimulator:
    def __init__(self, drainage_capacity_pct: float = 75.0) -> None:
        self.nowcast = NowcastEngine()
        self.dem = DEMProcessor()
        self.hyd = CapacityCalculator(drainage_capacity_pct=drainage_capacity_pct)

    def run(self, base_intensity_mmh: float | None = None,
            drainage_capacity_pct: float | None = None,
            seed: int | None = None, velocity_ms: float | None = None) -> dict:
        if drainage_capacity_pct is not None:
            self.hyd.drainage_capacity_pct = drainage_capacity_pct
        if velocity_ms is not None:
            self.nowcast.u_ms = max(0.0, float(velocity_ms))
            self.nowcast.v_ms = max(0.0, float(velocity_ms) * 0.5)
        series = self.nowcast.run(base_intensity_mmh=base_intensity_mmh, seed=seed)
        hyeto = [p["rainfallMmHr"] for p in series]

        zones = []
        for zid, terrain in ZONE_TERRAIN.items():
            zrain = [round(h * ZONE_RAIN_FACTOR[zid], 1) for h in hyeto]
            route = self.dem.route_storm(zid, zrain, step_min=30 if len(hyeto) == 6 else 30)
            rain_now = zrain[2] if len(zrain) > 2 else zrain[0]
            net = self.hyd.network_state({zid: rain_now}, duration_min=60)
            worst_head = max([c["overflowHeadCm"] for c in net["conduits"]], default=0.0)
            worst_util = max([c["capacityPercent"] for c in net["conduits"]], default=0.0)

            depths = [round(max(d, worst_head), 1) for d in route["depths_cm"]]
            peak = max(depths) if depths else 0.0
            prob = round(min(97.0, max(8.0, 100.0 / (1.0 + __import__("math").exp(-(rain_now - 38.0) / 12.0)) +
                                         (6.0 - terrain["mean_elev"]) * 1.2)), 1)
            onset = self.dem.onset_minutes(depths)
            zones.append({
                "id": zid,
                "code": ZONE_META[zid]["code"],
                "name": ZONE_META[zid]["name"],
                "riskLevel": _risk(prob, peak),
                "floodProbability": prob,
                "expectedOnsetMinutes": onset if onset is not None else 999,
                "estimatedDepthCm": round(peak, 1),
                "depthTraceCm": depths,
                "rainfallMmPerHour": rain_now,
                "drainageUtilization": round(worst_util, 1),
                "elevationMeters": terrain["mean_elev"],
                "populationAtRisk": ZONE_META[zid]["population"],
                "demStats": route["dem_stats"],
                "conduits": net["conduits"],
            })

        zones.sort(key=lambda z: (-z["floodProbability"], -z["estimatedDepthCm"]))
        return {
            "leadTimes": LEAD_TIMES,
            "nowcast": series,
            "zones": zones,
            "engine": "coupled advection + diffusive-wave DEM (6-24m) + Manning/Rational surcharge",
        }
