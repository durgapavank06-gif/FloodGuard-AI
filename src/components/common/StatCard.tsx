import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: string;
  isIncreasePositive?: boolean;
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
  icon?: ReactNode;
  riskHighlight?: 'critical' | 'high' | 'moderate' | 'low' | 'cyan';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  change,
  subtitle,
  icon,
  riskHighlight,
  className = ''
}) => {
  const borderStyle = {
    critical: 'border-rose-500/40 hover:border-rose-500/70',
    high: 'border-orange-500/40 hover:border-orange-500/70',
    moderate: 'border-amber-500/40 hover:border-amber-500/70',
    low: 'border-emerald-500/40 hover:border-emerald-500/70',
    cyan: 'border-cyan-500/40 hover:border-cyan-500/70',
  }[riskHighlight || 'cyan'];

  const valueColor = {
    critical: 'text-rose-400',
    high: 'text-orange-400',
    moderate: 'text-amber-400',
    low: 'text-emerald-400',
    cyan: 'text-cyan-400',
  }[riskHighlight || 'cyan'];

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-command-900/80 p-4 border transition-all duration-200 backdrop-blur-md shadow-card-dark ${borderStyle} ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-command-800/80 text-slate-300">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className={`text-2xl font-bold tracking-tight font-mono ${valueColor}`}>
          {value}
        </span>
        {unit && <span className="text-xs font-semibold text-slate-400">{unit}</span>}
      </div>

      {(subtitle || change) && (
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          {subtitle && <span>{subtitle}</span>}
          {change && (
            <span className="font-medium text-cyan-400 font-mono">
              {change}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
