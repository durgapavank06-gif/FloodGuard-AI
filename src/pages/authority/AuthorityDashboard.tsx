import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import { ZoneDetailsPanel } from '../../components/map/ZoneDetailsPanel';
import { AlertCard } from '../../components/common/AlertCard';
import {
  AlertTriangle,
  Clock,
  Droplets,
  Activity,
  Radio,
  MapPin,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight,
  ShieldAlert,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { cityOverviewStats } from '../../data/zones';

export const AuthorityDashboard: React.FC = () => {
  const {
    navigate,
    selectedZone,
    setSelectedZone,
    alerts,
    updateAlertStatus
  } = useApp();

  const criticalAlerts = alerts.filter(
    (a) => a.severity === 'critical' || a.severity === 'high'
  ).slice(0, 3);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Emergency Operations Center (EOC) Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Urban Flood Monitoring Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Hyderabad Metropolitan Region • Coupled 2D-DEM & 1D-Graph Solver
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-950/60 border border-emerald-500/40 px-3.5 py-2 flex items-center gap-2">
            <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
            <div>
              <span className="text-xs font-bold text-emerald-300 block">Monitoring Active</span>
              <span className="text-[10px] text-emerald-400/80 font-mono">DWR + 412 IoT Sensors</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Critical Zones"
          value={cityOverviewStats.criticalZonesCount}
          subtitle="Urgent inundation imminent"
          riskHighlight="critical"
          icon={<AlertTriangle className="h-5 w-5 text-rose-400" />}
        />

        <StatCard
          title="High Risk Zones"
          value={cityOverviewStats.highRiskZonesCount}
          subtitle="Surcharge warning threshold"
          riskHighlight="high"
          icon={<Droplets className="h-5 w-5 text-orange-400" />}
        />

        <StatCard
          title="Overall Flood Risk"
          value={`${cityOverviewStats.overallCityRiskScore}%`}
          subtitle="Metropolitan stress index"
          riskHighlight="moderate"
          icon={<Activity className="h-5 w-5 text-amber-400" />}
        />

        <StatCard
          title="Earliest Flood Onset"
          value={cityOverviewStats.earliestFloodOnsetMinutes}
          unit="min"
          subtitle="Zone 14 (Begumpet) RUB"
          riskHighlight="cyan"
          icon={<Clock className="h-5 w-5 text-cyan-400" />}
        />
      </div>

      {/* MAIN SECTION: LIVE FLOOD RISK MAP (Large Component) */}
      <div className="rounded-2xl border border-white/10 bg-command-900/90 p-4 sm:p-5 shadow-card-dark">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-3 w-3 rounded-full bg-rose-500 animate-ping" />
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Live Flood Risk Map & Catchment GIS
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline">
              Click any zone to inspect hydraulic surcharge telemetry
            </span>
            <button
              onClick={() => navigate('/authority/map')}
              className="rounded-lg bg-command-800 hover:bg-command-750 px-3 py-1.5 text-xs font-semibold text-cyan-300 border border-cyan-500/30 transition-colors flex items-center gap-1"
            >
              <span>Full Screen GIS</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Map Canvas + Zone Details Drawer */}
        <div className="h-[460px] sm:h-[540px] flex rounded-xl border border-white/10 bg-command-950 overflow-hidden relative">
          <div className="flex-1 h-full min-w-0">
            <InteractiveMap
              selectedZoneId={selectedZone?.id}
              onSelectZone={setSelectedZone}
              isAuthority={true}
              className="h-full rounded-none border-0"
            />
          </div>

          {selectedZone && (
            <div className="w-80 sm:w-96 shrink-0 h-full border-l border-white/10 z-20 absolute sm:relative right-0 top-0 bottom-0 bg-command-900 shadow-2xl">
              <ZoneDetailsPanel
                zone={selectedZone}
                onClose={() => setSelectedZone(null)}
                isAuthority={true}
              />
            </div>
          )}
        </div>
      </div>

      {/* Grid: Active Alerts Feed & System Status Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Active Alerts Feed (2 Cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                Active Priority Incident Alerts ({criticalAlerts.length})
              </h3>
            </div>
            <button
              onClick={() => navigate('/authority/alerts')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
            >
              <span>Manage All Incidents</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {criticalAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                isAuthorityView={true}
                onAcknowledge={(id) => updateAlertStatus(id, 'acknowledged')}
                onResolve={(id) => updateAlertStatus(id, 'resolved')}
                onEscalate={(id) => updateAlertStatus(id, 'escalated')}
                onViewOnMap={() => navigate('/authority/map')}
              />
            ))}
          </div>
        </div>

        {/* System Status & Hydrological Health (1 Col) */}
        <div className="rounded-2xl border border-white/10 bg-command-900/90 p-5 shadow-card-dark space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-cyan-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Hydrological Solver Status
              </h4>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">100% HEALTH</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-command-950 border border-white/5">
              <div>
                <span className="font-semibold text-slate-200 block">Doppler Weather Radar</span>
                <span className="text-[10px] text-slate-400">IMD Hyderabad (10-min sweep)</span>
              </div>
              <span className="rounded-full bg-emerald-500/20 text-emerald-300 px-2 py-0.5 text-[10px] font-bold border border-emerald-500/30">
                CONNECTED
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-command-950 border border-white/5">
              <div>
                <span className="font-semibold text-slate-200 block">1m LIDAR DEM Terrain</span>
                <span className="text-[10px] text-slate-400">2D Overland Overland Mesh</span>
              </div>
              <span className="rounded-full bg-emerald-500/20 text-emerald-300 px-2 py-0.5 text-[10px] font-bold border border-emerald-500/30">
                CONVERGED
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-command-950 border border-white/5">
              <div>
                <span className="font-semibold text-slate-200 block">1D Drainage Network</span>
                <span className="text-[10px] text-slate-400">148 conduits • 412 manholes</span>
              </div>
              <span className="rounded-full bg-amber-500/20 text-amber-300 px-2 py-0.5 text-[10px] font-bold border border-amber-500/30">
                SURCHARGED (18)
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-command-950 border border-white/5">
              <div>
                <span className="font-semibold text-slate-200 block">Lead-Time Window</span>
                <span className="text-[10px] text-slate-400">0 to 180 minutes forward nowcast</span>
              </div>
              <span className="font-mono text-cyan-400 font-bold text-xs">
                3.0 HOURS
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => navigate('/authority/simulation')}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 py-2.5 text-xs font-semibold text-white transition-colors"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Launch Scenario Simulator</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
