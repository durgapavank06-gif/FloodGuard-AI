import React from 'react';

interface FactorBarProps {
  label: string;
  percentage: number;
  weightDescription?: string;
  colorTheme?: 'critical' | 'high' | 'moderate' | 'cyan' | 'purple';
  className?: string;
}

export const FactorBar: React.FC<FactorBarProps> = ({
  label,
  percentage,
  weightDescription,
  colorTheme = 'critical',
  className = ''
}) => {
  const barColors = {
    critical: 'bg-rose-500',
    high: 'bg-orange-500',
    moderate: 'bg-amber-500',
    cyan: 'bg-cyan-500',
    purple: 'bg-purple-500',
  }[colorTheme];

  const textColor = {
    critical: 'text-rose-400',
    high: 'text-orange-400',
    moderate: 'text-amber-400',
    cyan: 'text-cyan-400',
    purple: 'text-purple-400',
  }[colorTheme];

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200">{label}</span>
          {weightDescription && (
            <span className="text-[10px] text-slate-400">({weightDescription})</span>
          )}
        </div>
        <span className={`font-mono font-bold ${textColor}`}>
          {percentage}%
        </span>
      </div>

      <div className="h-2 w-full rounded-full bg-command-950 p-0.5 border border-white/5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColors}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};
