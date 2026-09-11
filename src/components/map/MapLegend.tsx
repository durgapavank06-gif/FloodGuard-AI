import React from 'react';

interface MapLegendProps {
  className?: string;
}

export const MapLegend: React.FC<MapLegendProps> = ({ className = '' }) => {
  return (
    <div
      className={`rounded-xl border border-white/10 bg-command-950/90 p-3.5 backdrop-blur-md shadow-2xl text-xs text-slate-300 ${className}`}
    >
      <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-2.5">
        <span className="font-semibold text-white tracking-wide uppercase text-[10px]">
          Flood Risk Inundation Legend
        </span>
        <span className="text-[10px] text-slate-400 font-mono">0-3h Lead</span>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-500 shadow-[0_0_8px_#ef4444]" />
            <span className="font-medium text-slate-200">Critical (&gt;80%)</span>
          </div>
          <span className="text-[10px] text-rose-300 font-mono">&gt;35cm depth</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]" />
            <span className="font-medium text-slate-200">High (60-80%)</span>
          </div>
          <span className="text-[10px] text-orange-300 font-mono">20-35cm</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
            <span className="font-medium text-slate-200">Moderate (40-60%)</span>
          </div>
          <span className="text-[10px] text-amber-300 font-mono">10-20cm</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            <span className="font-medium text-slate-200">Low (&lt;40%)</span>
          </div>
          <span className="text-[10px] text-emerald-300 font-mono">&lt;10cm</span>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-white/5 space-y-1 text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-4 bg-cyan-400 rounded-full" />
          <span>Drainage Conduit (Active Flow)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-4 bg-blue-500 rounded-full" />
          <span>Waterbodies (Cooum / Adyar / Bay of Bengal)</span>
        </div>
      </div>
    </div>
  );
};
