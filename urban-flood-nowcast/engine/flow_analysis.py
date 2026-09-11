"""Flow-path analysis over the DEM tile (slope/aspect + accumulation proxy)."""

from __future__ import annotations

from .dem_processor import DEMProcessor


class FlowAnalyzer:
    def __init__(self) -> None:
        self.dem = DEMProcessor()

    def analyse(self, zone_id: str) -> dict:
        tile = self.dem.build_tile(zone_id)
        n = len(tile)
        # D8 steepest-descent accumulation proxy
        accum = [[1] * n for _ in range(n)]
        order = sorted(((tile[i][j], i, j) for i in range(n) for j in range(n)), reverse=True)
        dirs = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]
        for _, i, j in order:
            best = None
            best_drop = 0.0
            for di, dj in dirs:
                ni, nj = i + di, j + dj
                if 0 <= ni < n and 0 <= nj < n:
                    drop = tile[i][j] - tile[ni][nj]
                    if drop > best_drop:
                        best_drop = drop
                        best = (ni, nj)
            if best is not None:
                accum[best[0]][best[1]] += accum[i][j]
        flat = [v for row in accum for v in row]
        pour = max(flat)
        # outlet = lowest boundary cell
        outlet = min(
            [(tile[i][j], i, j) for i in range(n) for j in range(n)
             if i in (0, n - 1) or j in (0, n - 1)]
        )
        return {
            "zoneId": zone_id,
            "max_accumulation_cells": pour,
            "ponding_hotspot_cells": sum(1 for v in flat if v >= pour * 0.5),
            "outlet": {"row": outlet[1], "col": outlet[2], "elev_m": outlet[0]},
            "method": "D8 steepest descent on synthetic 6-24m DEM tile",
        }
