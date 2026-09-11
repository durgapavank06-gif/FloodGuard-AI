import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useDataMode } from '../../context/DataModeContext';
import { CesiumLiveMap } from '../../components/map/CesiumLiveMap';
import { ZoneDetailsPanel } from '../../components/map/ZoneDetailsPanel';
import { RiskBadge } from '../../components/common/RiskBadge';
import { mergeLiveZones } from '../../utils/mergeZones';
import { api, ApiZone, LiveAlert } from '../../services/api';
import { Zone } from '../../types';
import { Search, Radar, RefreshCw, AlertTriangle, ChevronRight } from 'lucide-react';

/**
 * Authority command map — LIVE data only.
 * Zones, drawer telemetry and alerts stream from the backend and
 * auto-refresh. The map canvas itself is untouched.
 */
export const AuthorityMap: React.FC = () => {
  const { selectedZone, setSelectedZone } = useApp();
  const { mode, apiUrl } = useDataMode();

  const [searchQuery, setSearchQuery] = useState('');
  const [showDrawer, setShowDrawer] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const [liveZones, setLiveZones] = useState<ApiZone[] | null>(null);
  const [liveAlerts, setLiveAlerts] = useState<LiveAlert[]>([]);
  const [fetching, setFetching] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);

  const loadLive = useCallback(async () => {
    setFetching(true);
    try {
      const [dash, al] = await Promise.all([
        api.dashboard(apiUrl, mode),
        api.alerts(apiUrl, mode),
      ]);
      setLiveZones(dash.zones || []);
      setLiveAlerts(al.alerts || []);
    } catch {
      setLiveZones(null);
      setLiveAlerts([]);
    } finally {
      setFetching(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, apiUrl, refreshTick]);

  useEffect(() => {
    loadLive();
  }, [loadLive]);

  useEffect(() => {
    const id = setInterval(() => setRefreshTick((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  const mapZones: Zone[] = useMemo(() => mergeLiveZones(liveZones), [liveZones]);

  // Keep the inspection drawer synced with the live feed
  useEffect(() => {
    if (!selectedZone) return;
    const fresh = mapZones.find((z) => z.id === selectedZone.id);
    if (fresh && fresh !== selectedZone) setSelectedZone(fresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapZones]);

  const filteredZones = mapZones.filter((z) => {
    const matchesSearch =
      z.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      z.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || z.riskLevel === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const handleSelectZone = (zone: Zone) => {
    setSelectedZone(zone);
    setShowDrawer(true);
  };

  const criticalCount = liveAlerts.filter((a) => a.severity === 'critical').length;

  return (
    <div className="flex flex-col pb-12 sm:pb-0 space-y-3" style={{ minHeight: 'calc(100vh - 6rem)' }}>
      {/* Top Filter & Command Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-command-900/90 p-3 rounded-xl border border-white/10 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3 flex-1 min-w-[280px] flex-wrap">
          <div className="relative flex-1 max-w-sm min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by zone code, street, culvert..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg bg-command-950 border border-white/10 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {['all', 'critical', 'high', 'moderate'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition-all ${
                  severityFilter === sev
                    ? 'bg-cyan-600 text-white'
                    : 'bg-command-950 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {filteredZones.length !== mapZones.length && (
            <span className="text-[11px] font-mono text-slate-400">
              {filteredZones.length}/{mapZones.length} zones match
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-command-950 px-3 py-1.5 text-[11px] font-bold text-emerald-300">
            <Radar className="h-3 w-3" />
            LIVE
          </span>

          <button
            onClick={() => setRefreshTick((t) => t + 1)}
            className="rounded-lg border border-white/10 bg-command-950 p-2 text-slate-300 hover:text-white transition-colors"
            title="Refresh live feed"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${fetching ? 'animate-spin' : ''}`} />
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Inspecting:</span>
            <span className="rounded bg-cyan-950 border border-cyan-500/30 px-2 py-0.5 text-cyan-300 font-bold">
              {selectedZone ? selectedZone.code : 'Select Zone'}
            </span>
          </div>

          <button
            onClick={() => setShowDrawer(!showDrawer)}
            className="rounded-lg bg-command-800 hover:bg-command-750 px-3 py-1.5 text-xs font-semibold text-slate-200 border border-white/10 transition-colors"
          >
            {showDrawer ? 'Hide Telemetry' : 'Show Telemetry'}
          </button>
        </div>
      </div>

      {/* Live alerts strip */}
      <div className="flex items-center gap-2 overflow-x-auto shrink-0 pb-1">
        <span className="shrink-0 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
          <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
          Live alerts ({liveAlerts.length})
          {criticalCount > 0 && (
            <span className="rounded-full bg-rose-500/20 border border-rose-500/40 px-1.5 text-[10px] text-rose-300">
              {criticalCount} critical
            </span>
          )}
        </span>
        {liveAlerts.slice(0, 6).map((a) => (
          <button
            key={a.id}
            onClick={() => {
              const z = mapZones.find((zz) => zz.id === a.zoneId);
              if (z) handleSelectZone(z);
            }}
            className="shrink-0 flex items-center gap-2 rounded-xl border border-white/10 bg-command-900/90 px-3 py-1.5 text-left hover:border-cyan-500/50 transition-colors"
          >
            <RiskBadge level={a.severity} size="sm" />
            <span className="text-[11px] font-bold text-white font-mono">{a.code}</span>
            <span className="text-[11px] text-slate-300 max-w-[220px] truncate">{a.title}</span>
            <span className="text-[11px] font-mono text-amber-300">
              {a.expectedOnsetMinutes === null ? `${a.estimatedDepthCm ?? '?'}cm` : `in ${a.expectedOnsetMinutes}m`}
            </span>
            <ChevronRight className="h-3 w-3 text-slate-500" />
          </button>
        ))}
        {liveAlerts.length === 0 && (
          <span className="text-[11px] text-slate-500">
            {fetching ? 'Loading live feed…' : 'No high/critical basins right now.'}
          </span>
        )}
      </div>

      {/* Main Full GIS Canvas Layout — MAP UNTOUCHED (fixed height so the iframe fills it) */}
      <div className="flex overflow-hidden rounded-2xl border border-white/10 bg-command-950 relative h-[520px] lg:h-[620px] shrink-0">
        <div className="flex-1 h-full min-w-0">
          <CesiumLiveMap className="h-full rounded-none border-0" />
        </div>

        {/* Authority Comprehensive Zone Inspection Drawer (live values) */}
        {showDrawer && selectedZone && (
          <div className="w-full sm:w-96 shrink-0 h-full border-l border-white/10 z-20 absolute sm:relative right-0 top-0 bottom-0 bg-command-900 shadow-2xl">
            <ZoneDetailsPanel
              zone={selectedZone}
              onClose={() => setShowDrawer(false)}
              isAuthority={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};
