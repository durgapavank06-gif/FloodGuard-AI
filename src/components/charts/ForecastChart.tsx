import React, { useState } from 'react';
import { RainfallNowcastPoint } from '../../types';
import { mockRainfallNowcast } from '../../data/rainfall';
import { CloudRain, Droplets, Waves, Info } from 'lucide-react';

interface ForecastChartProps {
  activePoint?: RainfallNowcastPoint;
  onSelectPoint?: (point: RainfallNowcastPoint) => void;
  className?: string;
  /** Override series (live API). Defaults to bundled demo profile. */
  data?: RainfallNowcastPoint[];
}

export const ForecastChart: React.FC<ForecastChartProps> = ({
  activePoint,
  onSelectPoint,
  className = '',
  data,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const dataSeries = data && data.length > 0 ? data : mockRainfallNowcast;
  const maxRain = 90; // max rainfall scale
  const maxProb = 100; // max probability scale

  const width = 720;
  const height = 240;
  const padding = { top: 30, right: 40, bottom: 40, left: 50 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Generate SVG path for rainfall bars and flood probability line
  const xStep = chartWidth / (dataSeries.length - 1);

  const probabilityPoints = dataSeries.map((d, i) => {
    const x = padding.left + i * xStep;
    const y = padding.top + chartHeight - (d.floodProbability / maxProb) * chartHeight;
    return { x, y, ...d };
  });

  const linePath = probabilityPoints.reduce(
    (acc, curr, i) => (i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`),
    ''
  );

  const areaPath = `${linePath} L ${padding.left + chartWidth} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`;

  return (
    <div className={`rounded-2xl border border-white/10 bg-command-900/90 p-5 shadow-card-dark ${className}`}>
      {/* Header with legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Hydraulic Nowcasting: Rainfall vs Inundation Probability
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Coupled Doppler radar precipitation rate and surface accumulation curve
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <span className="h-3 w-3 rounded-sm bg-cyan-500/50 border border-cyan-400" />
            <span>Rainfall Rate (mm/h)</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-400">
            <span className="h-2 w-4 rounded-full bg-rose-500" />
            <span>Flood Probability (%)</span>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56 select-none">
          <defs>
            <linearGradient id="probAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="rainBarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((val) => {
            const y = padding.top + chartHeight - (val / 100) * chartHeight;
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + chartWidth}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeDasharray="3,3"
                />
                <text
                  x={padding.left - 10}
                  y={y + 3}
                  textAnchor="end"
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {val}%
                </text>
              </g>
            );
          })}

          {/* Rainfall Column Bars */}
          {dataSeries.map((d, i) => {
            const barWidth = 28;
            const x = padding.left + i * xStep - barWidth / 2;
            const barHeight = (d.rainfallMmHr / maxRain) * chartHeight;
            const y = padding.top + chartHeight - barHeight;
            const isHovered = hoveredIndex === i;

            return (
              <g
                key={i}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onSelectPoint && onSelectPoint(d)}
              >
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx="4"
                  fill="url(#rainBarGradient)"
                  stroke={isHovered ? '#38bdf8' : 'none'}
                  strokeWidth="1.5"
                  opacity={isHovered ? 1 : 0.8}
                />
                <text
                  x={x + barWidth / 2}
                  y={y - 6}
                  textAnchor="middle"
                  fill="#38bdf8"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {d.rainfallMmHr}
                </text>
              </g>
            );
          })}

          {/* Area Fill for Flood Probability */}
          <path d={areaPath} fill="url(#probAreaGradient)" />

          {/* Probability Trendline */}
          <path d={linePath} fill="none" stroke="#ef4444" strokeWidth="3" />

          {/* Points on the Trendline */}
          {probabilityPoints.map((pt, i) => {
            const isHovered = hoveredIndex === i;
            const isSelected = activePoint?.timeOffsetMinutes === pt.timeOffsetMinutes;

            return (
              <g
                key={i}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onSelectPoint && onSelectPoint(pt)}
              >
                {(isHovered || isSelected) && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="10"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="1.5"
                    className="animate-ping"
                  />
                )}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isSelected ? 6 : 4.5}
                  fill="#ef4444"
                  stroke="#0b111d"
                  strokeWidth="2"
                />
                <text
                  x={pt.x}
                  y={pt.y - 10}
                  textAnchor="middle"
                  fill="#fca5a5"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {pt.floodProbability}%
                </text>

                {/* X Axis Labels */}
                <text
                  x={pt.x}
                  y={padding.top + chartHeight + 20}
                  textAnchor="middle"
                  fill="#cbd5e1"
                  fontSize="10"
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  fontFamily="monospace"
                >
                  {pt.label}
                </text>
                <text
                  x={pt.x}
                  y={padding.top + chartHeight + 32}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="8.5"
                  fontFamily="monospace"
                >
                  {pt.timeString}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected/Hovered Point Details Card */}
      {activePoint && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-command-950/80 p-3 border border-white/5 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white font-mono bg-command-800 px-2 py-0.5 rounded">
              {activePoint.label} ({activePoint.timeString})
            </span>
            <span className="text-slate-300">
              Expected Water Depth Avg:{' '}
              <strong className="text-cyan-400 font-mono">{activePoint.avgDepthCm} cm</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono">
            <span className="text-rose-400">
              Critical Zones: <strong>{activePoint.criticalZonesCount}</strong>
            </span>
            <span className="text-orange-400">
              High Risk: <strong>{activePoint.highRiskZonesCount}</strong>
            </span>
            <span className="text-slate-400">
              Radar Echo: <strong>{activePoint.radarEchoDbz} dBZ</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
