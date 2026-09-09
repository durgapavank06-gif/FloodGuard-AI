import React from 'react';

export const LoadingSkeleton: React.FC<{ rows?: number; height?: string; className?: string }> = ({
  rows = 3,
  height = 'h-16',
  className = ''
}) => {
  return (
    <div className={`space-y-3 animate-pulse ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={`w-full rounded-xl bg-command-800/60 border border-white/5 ${height}`}
        />
      ))}
    </div>
  );
};

export const EmptyState: React.FC<{
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}> = ({ title, description, actionLabel, onAction, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-white/10 bg-command-900/40">
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-command-800 text-slate-400 mb-3">
          {icon}
        </div>
      )}
      <h4 className="text-base font-semibold text-slate-200">{title}</h4>
      <p className="mt-1 max-w-sm text-xs text-slate-400 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-500 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export const ErrorState: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
}> = ({
  title = 'Sensor Telemetry Unavailable',
  message = 'Unable to establish WebSocket connection with DWR Radar stream.',
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center rounded-xl border border-rose-500/30 bg-rose-950/20">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-900/50 text-rose-300 mb-2">
        <span className="text-lg font-bold">!</span>
      </div>
      <h4 className="text-sm font-semibold text-rose-200">{title}</h4>
      <p className="mt-1 text-xs text-slate-400 max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 text-xs font-semibold text-cyan-400 hover:underline"
        >
          Retry Connection
        </button>
      )}
    </div>
  );
};
