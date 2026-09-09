import React from 'react';
import { useApp } from '../../context/AppContext';
import { RiskCard } from '../../components/common/RiskCard';
import { AlertCard } from '../../components/common/AlertCard';
import {
  MapPin,
  Map,
  Navigation,
  AlertTriangle,
  Send,
  CloudRain,
  TrendingUp,
  Clock,
  ShieldCheck,
  Droplets,
  ArrowRight
} from 'lucide-react';
import { mockRainfallNowcast, hourlyRadarGrid } from '../../data/rainfall';

export const CitizenHome: React.FC = () => {
  const { navigate, setIsReportModalOpen, alerts } = useApp();

  const activeNearbyAlerts = alerts
    .filter((a) => a.status === 'active' || a.status === 'acknowledged')
    .slice(0, 3);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Greeting */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Good Afternoon</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
            Stay informed. Stay safe.
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Coupled hydrological model updated 2 minutes ago with DWR radar data.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-command-900 px-3.5 py-2 border border-white/10">
          <MapPin className="h-4 w-4 text-rose-400" />
          <div>
            <span className="text-xs font-bold text-white block">Hyderabad Metro</span>
            <span className="text-[10px] text-slate-400 font-mono">Begumpet Catchment</span>
          </div>
        </div>
      </div>

      {/* Large Current Risk Card */}
      <RiskCard
        level="high"
        probability={78}
        expectedOnsetMinutes={42}
        rainfallMmHr={48}
        locationName="Hyderabad • Zone 21 / Zone 14 Catchment Corridors"
        onViewMap={() => navigate('/citizen/map')}
      />

      {/* Quick Actions Bar */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => navigate('/citizen/map')}
            className="flex items-center gap-3 rounded-xl bg-command-900/90 border border-white/10 p-3.5 hover:border-cyan-500/40 hover:bg-command-850 transition-all text-left shadow-card-dark group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 group-hover:scale-110 transition-transform">
              <Map className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">View Map</span>
              <span className="text-[10px] text-slate-400">Street inundation</span>
            </div>
          </button>

          <button
            onClick={() => navigate('/citizen/routes')}
            className="flex items-center gap-3 rounded-xl bg-command-900/90 border border-white/10 p-3.5 hover:border-emerald-500/40 hover:bg-command-850 transition-all text-left shadow-card-dark group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 group-hover:scale-110 transition-transform">
              <Navigation className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Safe Route</span>
              <span className="text-[10px] text-slate-400">Avoid submerged roads</span>
            </div>
          </button>

          <button
            onClick={() => navigate('/citizen/alerts')}
            className="flex items-center gap-3 rounded-xl bg-command-900/90 border border-white/10 p-3.5 hover:border-amber-500/40 hover:bg-command-850 transition-all text-left shadow-card-dark group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-950/70 border border-amber-500/30 text-amber-400 group-hover:scale-110 transition-transform">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Alerts</span>
              <span className="text-[10px] text-slate-400">Live emergency notices</span>
            </div>
          </button>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-3 rounded-xl bg-command-900/90 border border-white/10 p-3.5 hover:border-rose-500/40 hover:bg-command-850 transition-all text-left shadow-card-dark group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-950/70 border border-rose-500/30 text-rose-400 group-hover:scale-110 transition-transform">
              <Send className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Report Flooding</span>
              <span className="text-[10px] text-slate-400">Crowdsourced update</span>
            </div>
          </button>
        </div>
      </div>

      {/* Grid: Rainfall Forecast (Small chart) & Nearby Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Nearby Alerts */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Nearby Alerts & Warnings ({activeNearbyAlerts.length})
            </h3>
            <button
              onClick={() => navigate('/citizen/alerts')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
            >
              <span>View All Alerts</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {activeNearbyAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onViewOnMap={() => navigate('/citizen/map')}
              />
            ))}
          </div>
        </div>

        {/* Right 1 Col: Rainfall Forecast Widget */}
        <div className="rounded-2xl border border-white/10 bg-command-900/90 p-5 shadow-card-dark flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
              <div className="flex items-center gap-2">
                <CloudRain className="h-4 w-4 text-cyan-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Rainfall Forecast
                </h4>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">DWR Next 4h</span>
            </div>

            <p className="text-xs text-slate-300">
              Convective cloud cluster intensifying over central Hyderabad basin with expected peak at 20:00 IST.
            </p>

            {/* Hourly Sparkline Bars */}
            <div className="mt-5 space-y-2.5">
              {hourlyRadarGrid.slice(4, 9).map((hr, i) => (
                <div key={i} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-400 text-[11px]">{hr.hour}</span>
                    <span className="font-mono font-bold text-cyan-300 text-[11px]">
                      {hr.rainfall} mm/h
                    </span>
                  </div>
                  <div className="w-full bg-command-950 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        hr.rainfall > 60 ? 'bg-rose-500' : hr.rainfall > 40 ? 'bg-orange-500' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${(hr.rainfall / 80) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5">
            <button
              onClick={() => navigate('/citizen/forecast')}
              className="w-full rounded-xl bg-command-800 hover:bg-command-750 py-2.5 text-xs font-semibold text-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Explore 3-Hour Flood Timeline</span>
              <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
