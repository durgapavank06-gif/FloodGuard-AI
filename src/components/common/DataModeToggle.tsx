import React from 'react';
import { FlaskConical, FlaskRound, Loader2 } from 'lucide-react';
import { useDataMode } from '../../context/DataModeContext';

interface DataModeToggleProps {
  compact?: boolean;
  loading?: boolean;
}

/**
 * Global Real / Fake data toggle.
 *  REAL = live coupled-model Flask API (advection nowcast + DEM routing + Manning).
 *  FAKE = static demo profiles bundled in src/data (offline-friendly).
 */
export const DataModeToggle: React.FC<DataModeToggleProps> = ({ compact = false, loading = false }) => {
  const { mode, setMode } = useDataMode();
  const isReal = mode === 'real';

  return (
    <div
      className={`flex items-center gap-1 rounded-xl border bg-command-900/90 p-1 ${
        isReal ? 'border-emerald-500/30' : 'border-amber-500/30'
      }`}
      title="REAL = live coupled-model API (Flask :5000). FAKE = static demo data for offline use."
    >
      <button
        onClick={() => setMode('real')}
        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition-all ${
          isReal ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
        }`}
      >
        {loading && isReal ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <FlaskConical className="h-3 w-3" />
        )}
        {!compact && <span>REAL</span>}
      </button>
      <button
        onClick={() => setMode('fake')}
        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition-all ${
          !isReal ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
        }`}
      >
        <FlaskRound className="h-3 w-3" />
        {!compact && <span>FAKE</span>}
      </button>
      {!compact && (
        <span className="hidden sm:inline px-1.5 text-[10px] font-mono text-slate-400">
          {isReal ? 'live API :5000' : 'static demo'}
        </span>
      )}
    </div>
  );
};
