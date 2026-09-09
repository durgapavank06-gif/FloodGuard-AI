import React from 'react';
import { RiskLevel } from '../../types';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  size = 'md',
  showDot = true,
  className = ''
}) => {
  const styles = {
    critical: {
      bg: 'bg-rose-950/70 border-rose-500/50 text-rose-300',
      dot: 'bg-rose-500 shadow-[0_0_8px_#ef4444]',
      label: 'CRITICAL',
    },
    high: {
      bg: 'bg-orange-950/70 border-orange-500/50 text-orange-300',
      dot: 'bg-orange-500 shadow-[0_0_8px_#f97316]',
      label: 'HIGH',
    },
    moderate: {
      bg: 'bg-amber-950/70 border-amber-500/50 text-amber-300',
      dot: 'bg-amber-500 shadow-[0_0_8px_#f59e0b]',
      label: 'MODERATE',
    },
    low: {
      bg: 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300',
      dot: 'bg-emerald-500 shadow-[0_0_8px_#10b981]',
      label: 'LOW',
    },
  }[level];

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold tracking-wide',
    lg: 'text-sm px-3.5 py-1.5 font-bold tracking-wider',
  }[size];

  const dotSizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${styles.bg} ${sizeClasses} ${className}`}
    >
      {showDot && (
        <span
          className={`rounded-full ${styles.dot} ${dotSizeClasses} animate-pulse`}
        />
      )}
      <span>{styles.label}</span>
    </span>
  );
};
