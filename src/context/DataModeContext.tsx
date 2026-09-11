import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type DataMode = 'real' | 'fake';

interface DataModeContextType {
  mode: DataMode;
  setMode: (m: DataMode) => void;
  toggleMode: () => void;
  /** Base URL of the Flask coupled-model API. Override via VITE_API_URL. */
  apiUrl: string;
}

const DataModeContext = createContext<DataModeContextType | undefined>(undefined);

const STORAGE_KEY = 'floodguard-data-mode';

export const DataModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<DataMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === 'fake' ? 'fake' : 'real';
    } catch {
      return 'real';
    }
  });

  const apiUrl =
    (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_URL ||
    'http://localhost:5000';

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
  }, [mode]);

  const setMode = (m: DataMode) => setModeState(m);
  const toggleMode = () => setModeState((p) => (p === 'real' ? 'fake' : 'real'));

  return (
    <DataModeContext.Provider value={{ mode, setMode, toggleMode, apiUrl }}>
      {children}
    </DataModeContext.Provider>
  );
};

export const useDataMode = () => {
  const ctx = useContext(DataModeContext);
  if (!ctx) throw new Error('useDataMode must be used within a DataModeProvider');
  return ctx;
};
