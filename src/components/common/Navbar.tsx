import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Waves,
  Shield,
  User,
  Radio,
  MapPin,
  Settings,
  AlertTriangle,
  Menu,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentRole,
    currentPath,
    navigate,
    sidebarCollapsed,
    setSidebarCollapsed,
    setIsReportModalOpen,
    alerts
  } = useApp();

  const activeAlertsCount = alerts.filter(a => a.status === 'active' && (a.severity === 'critical' || a.severity === 'high')).length;

  const isAuthority = currentRole === 'authority';
  const isCitizen = currentRole === 'citizen';
  const isPublic = currentRole === 'public';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-command-950/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Brand & Sidebar Toggle */}
        <div className="flex items-center gap-3">
          {isAuthority && (
            <button
              onClick={() => setSidebarCollapsed(prev => !prev)}
              className="hidden lg:flex rounded-lg p-2 text-slate-400 hover:bg-command-800 hover:text-white transition-colors"
              title="Toggle Sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
              <Waves className="h-5 w-5 text-white animate-pulse-subtle" />
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-command-950" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  FloodGuard <span className="text-cyan-400">AI</span>
                </span>
                <span className="hidden md:inline-flex rounded border border-cyan-500/30 bg-cyan-950/40 px-1.5 py-0.2 text-[9px] font-semibold text-cyan-300">
                  MoES / NCMRWF
                </span>
              </div>
              <p className="hidden sm:block text-[11px] font-medium text-slate-400">
                Urban Flood Intelligence & Nowcasting
              </p>
            </div>
          </div>
        </div>

        {/* Center: Citizen navigation tabs on desktop */}
        {isCitizen && (
          <nav className="hidden md:flex items-center gap-1 rounded-xl bg-command-900/90 p-1 border border-white/5">
            <button
              onClick={() => navigate('/citizen')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                currentPath === '/citizen'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigate('/citizen/map')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                currentPath === '/citizen/map'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Live Map
            </button>
            <button
              onClick={() => navigate('/citizen/forecast')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                currentPath === '/citizen/forecast'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Forecast
            </button>
            <button
              onClick={() => navigate('/citizen/alerts')}
              className={`relative rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                currentPath === '/citizen/alerts'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Alerts
              {activeAlertsCount > 0 && (
                <span className="ml-1.5 rounded-full bg-rose-500 px-1.5 py-0.2 text-[10px] text-white">
                  {activeAlertsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate('/citizen/routes')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                currentPath === '/citizen/routes'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Safe Routes
            </button>
          </nav>
        )}

        {/* Right Controls & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Location badge */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-lg bg-command-900 border border-white/10 px-2.5 py-1.5 text-xs text-slate-300">
            <MapPin className="h-3.5 w-3.5 text-rose-400" />
            <span className="font-semibold text-white">Hyderabad</span>
            <span className="text-[10px] text-slate-400 font-mono">19:15 IST</span>
          </div>

          {/* Live stream indicator */}
          <div className="hidden lg:flex items-center gap-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-300">
            <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
            <span>DWR Coupled Nowcast</span>
          </div>

          {/* Report Flooding CTA for Citizen */}
          {isCitizen && (
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm shadow-rose-600/30 transition-all"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Report Flooding</span>
              <span className="sm:hidden">Report</span>
            </button>
          )}

          {/* Role Switching Dropdown/Button */}
          {isCitizen ? (
            <button
              onClick={() => navigate('/authority')}
              className="flex items-center gap-1.5 rounded-lg bg-command-800 hover:bg-command-750 px-3 py-1.5 text-xs font-medium text-slate-300 border border-white/10 transition-colors"
              title="Switch to Authority Command Center"
            >
              <Shield className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Authority EOC</span>
              <ChevronRight className="h-3 w-3 text-slate-400" />
            </button>
          ) : isAuthority ? (
            <button
              onClick={() => navigate('/citizen')}
              className="flex items-center gap-1.5 rounded-lg bg-command-800 hover:bg-command-750 px-3 py-1.5 text-xs font-medium text-slate-300 border border-white/10 transition-colors"
              title="Switch to Citizen View"
            >
              <User className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Citizen View</span>
              <ChevronRight className="h-3 w-3 text-slate-400" />
            </button>
          ) : (
            <button
              onClick={() => navigate('/role-selection')}
              className="flex items-center gap-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md transition-all"
            >
              <span>Access System</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Settings button */}
          <button
            onClick={() => navigate('/settings')}
            className={`rounded-lg p-2 text-slate-400 hover:bg-command-800 hover:text-white transition-colors ${
              currentPath === '/settings' ? 'text-cyan-400 bg-command-800' : ''
            }`}
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
