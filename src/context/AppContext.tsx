import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Zone, Alert } from '../types';
import { mockZones } from '../data/zones';
import { mockAlerts } from '../data/alerts';

export type UserRole = 'citizen' | 'authority' | 'public';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  timestamp: string;
}

interface AppContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  currentPath: string;
  navigate: (path: string) => void;
  selectedZone: Zone | null;
  setSelectedZone: (zone: Zone | null) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  alerts: Alert[];
  updateAlertStatus: (id: string, status: Alert['status']) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Sync with browser hash / path
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || window.location.pathname || '/';
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    if (currentPath.startsWith('/citizen')) return 'citizen';
    if (currentPath.startsWith('/authority')) return 'authority';
    return 'public';
  });

  const [selectedZone, setSelectedZone] = useState<Zone | null>(mockZones[0]); // default to Zone 14
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const path = hash || '/';
      setCurrentPath(path);
      if (path.startsWith('/citizen')) setCurrentRole('citizen');
      else if (path.startsWith('/authority')) setCurrentRole('authority');
      else if (path === '/' || path === '/role-selection') setCurrentRole('public');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (path.startsWith('/citizen')) setCurrentRole('citizen');
    else if (path.startsWith('/authority')) setCurrentRole('authority');
    else if (path === '/' || path === '/role-selection') setCurrentRole('public');
  };

  const addToast = (title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    const newToast: ToastMessage = {
      id,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateAlertStatus = (id: string, status: Alert['status']) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    const alert = alerts.find((a) => a.id === id);
    const actionName = status === 'acknowledged' ? 'Acknowledged' : status === 'resolved' ? 'Resolved' : 'Escalated to Emergency Services';
    addToast(
      `Alert ${actionName}`,
      `${alert?.code || 'Alert'} has been marked as ${status.toUpperCase()}.`,
      status === 'resolved' ? 'success' : status === 'escalated' ? 'error' : 'info'
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setRole: setCurrentRole,
        currentPath,
        navigate,
        selectedZone,
        setSelectedZone,
        isReportModalOpen,
        setIsReportModalOpen,
        sidebarCollapsed,
        setSidebarCollapsed,
        toasts,
        addToast,
        removeToast,
        alerts,
        updateAlertStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
