import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Map,
  TrendingUp,
  AlertTriangle,
  Navigation,
  Shield,
  LayoutDashboard
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentPath, navigate, currentRole, alerts } = useApp();

  const activeAlertsCount = alerts.filter(a => a.status === 'active' && (a.severity === 'critical' || a.severity === 'high')).length;

  if (currentRole === 'public') return null;

  if (currentRole === 'authority') {
    const authorityItems = [
      { path: '/authority', label: 'EOC', icon: LayoutDashboard },
      { path: '/authority/map', label: 'Map', icon: Map },
      { path: '/authority/forecast', label: 'Forecast', icon: TrendingUp },
      { path: '/authority/alerts', label: 'Alerts', icon: AlertTriangle, badge: activeAlertsCount },
      { path: '/authority/simulation', label: 'Sim', icon: Navigation },
    ];

    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-white/10 bg-command-950/95 backdrop-blur-xl px-2 py-1">
        <div className="flex items-center justify-around">
          {authorityItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`relative flex flex-col items-center py-1.5 px-3 rounded-lg transition-colors ${
                  isActive ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="mt-1 text-[10px] tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Citizen items
  const citizenItems = [
    { path: '/citizen', label: 'Home', icon: Home },
    { path: '/citizen/map', label: 'Map', icon: Map },
    { path: '/citizen/forecast', label: 'Forecast', icon: TrendingUp },
    { path: '/citizen/alerts', label: 'Alerts', icon: AlertTriangle, badge: activeAlertsCount },
    { path: '/citizen/routes', label: 'Routes', icon: Navigation },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-white/10 bg-command-950/95 backdrop-blur-xl px-2 py-1 shadow-2xl">
      <div className="flex items-center justify-around">
        {citizenItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-cyan-400 font-semibold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="mt-1 text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
