import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Map,
  TrendingUp,
  AlertTriangle,
  GitBranch,
  BrainCircuit,
  SlidersHorizontal,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
  Radio
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    currentPath,
    navigate,
    sidebarCollapsed,
    setSidebarCollapsed,
    alerts
  } = useApp();

  const criticalAlertsCount = alerts.filter(a => a.status === 'active' && a.severity === 'critical').length;

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/authority',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      title: 'Live Map',
      path: '/authority/map',
      icon: Map,
      badge: 'Live',
    },
    {
      title: 'Forecast',
      path: '/authority/forecast',
      icon: TrendingUp,
      badge: '0-3h',
    },
    {
      title: 'Alerts',
      path: '/authority/alerts',
      icon: AlertTriangle,
      badge: criticalAlertsCount > 0 ? `${criticalAlertsCount}` : null,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      title: 'Drainage Network',
      path: '/authority/drainage',
      icon: GitBranch,
      badge: 'Graph',
    },
    {
      title: 'AI Risk Analysis',
      path: '/authority/risk-analysis',
      icon: BrainCircuit,
      badge: null,
    },
    {
      title: 'Simulation',
      path: '/authority/simulation',
      icon: SlidersHorizontal,
      badge: 'Engine',
    },
    {
      title: 'Historical Data',
      path: '/authority/history',
      icon: History,
      badge: null,
    },
    {
      title: 'Settings',
      path: '/settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside
      className={`fixed top-16 bottom-0 left-0 z-30 flex flex-col border-r border-white/10 bg-command-950/95 backdrop-blur-xl transition-all duration-300 ${
        sidebarCollapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Operations Center Header */}
      <div className="flex items-center justify-between border-b border-white/5 p-4">
        {!sidebarCollapsed && (
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
              EOC Command Center
            </div>
            <p className="text-xs font-semibold text-slate-300 mt-0.5">
              Hydrology & Drainage Division
            </p>
          </div>
        )}
        <button
          onClick={() => setSidebarCollapsed(prev => !prev)}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-command-800 hover:text-white transition-colors ml-auto"
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              title={sidebarCollapsed ? item.title : undefined}
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:bg-command-800/80 hover:text-slate-200'
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 transition-colors ${
                  isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />

              {!sidebarCollapsed && (
                <div className="flex flex-1 items-center justify-between overflow-hidden">
                  <span className="truncate">{item.title}</span>
                  {item.badge && (
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        item.badgeColor || 'bg-command-800 text-slate-300 border border-white/5'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer System Status Banner */}
      {!sidebarCollapsed && (
        <div className="p-3 border-t border-white/5 bg-command-900/60 m-2 rounded-xl">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 font-medium text-emerald-400">
              <Radio className="h-3 w-3 animate-pulse" />
              Solver Coupled
            </span>
            <span className="font-mono text-[10px] text-slate-400">v2.4-nowcast</span>
          </div>
          <div className="mt-1.5 text-[10px] text-slate-400 leading-tight">
            Coupled 2D-DEM & 1D-Graph hydraulic solver active.
          </div>
        </div>
      )}
    </aside>
  );
};
