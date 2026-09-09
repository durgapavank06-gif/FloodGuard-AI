import React, { useState } from 'react';
import {
  mockHistoricalEvents,
  mockFloodHistoryTimeframes,
  mostFloodProneZonesRanked
} from '../../data/history';
import { StatCard } from '../../components/common/StatCard';
import { RiskBadge } from '../../components/common/RiskBadge';
import {
  History,
  TrendingUp,
  CloudRain,
  Clock,
  Calendar,
  Waves,
  ArrowUpRight,
  Filter
} from 'lucide-react';

export const AuthorityHistory: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    '7 Days' | '30 Days' | '3 Months' | '1 Year'
  >('30 Days');

  const timeframeData = mockFloodHistoryTimeframes[selectedTimeframe];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-white/5 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
            <History className="h-4 w-4" />
            <span>LONGITUDINAL INUNDATION ARCHIVE & HYDROLOGICAL BENCHMARKS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Historical Flood Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Retrospective analysis of extreme precipitation events, drainage backflow frequency, and recovery durations.
          </p>
        </div>

        {/* Timeframe Filter Buttons */}
        <div className="flex items-center gap-1.5 rounded-xl bg-command-900 border border-white/10 p-1 text-xs">
          {(['7 Days', '30 Days', '3 Months', '1 Year'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`rounded-lg px-3 py-1.5 font-semibold transition-all ${
                selectedTimeframe === tf
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Aggregate Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Recorded Flood Events"
          value={timeframeData.eventsCount}
          subtitle={`In the past ${selectedTimeframe}`}
          icon={<Waves className="h-5 w-5 text-rose-400" />}
          riskHighlight="critical"
        />

        <StatCard
          title="Avg Event Rainfall"
          value={timeframeData.avgRainfallMm}
          unit="mm"
          subtitle="Peak 24h accumulation"
          icon={<CloudRain className="h-5 w-5 text-cyan-400" />}
          riskHighlight="cyan"
        />

        <StatCard
          title="Avg Inundation Duration"
          value={timeframeData.avgDurationHours}
          unit="hrs"
          subtitle="Time to normal drainage"
          icon={<Clock className="h-5 w-5 text-amber-400" />}
          riskHighlight="moderate"
        />

        <StatCard
          title="Max Flood Depth"
          value={timeframeData.maxDepthRecordedCm}
          unit="cm"
          subtitle="Begumpet Underpass record"
          icon={<TrendingUp className="h-5 w-5 text-purple-400" />}
          riskHighlight="high"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Rainfall vs Flood Inundation Correlation (2 Cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-command-900/90 p-5 shadow-card-dark">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
                Rainfall vs Inundation Severity ({selectedTimeframe})
              </h3>
              <p className="text-xs text-slate-400">
                Correlation between rainfall volume (bars) and water depth (line)
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1 text-cyan-400">
                <span className="h-3 w-3 rounded-sm bg-cyan-500/50 border border-cyan-400" />
                <span>Rainfall (mm)</span>
              </div>
              <div className="flex items-center gap-1 text-rose-400">
                <span className="h-2 w-4 rounded-full bg-rose-500" />
                <span>Avg Depth (cm)</span>
              </div>
            </div>
          </div>

          {/* SVG Multi-axis Bar & Line Chart */}
          <div className="w-full overflow-x-auto">
            <svg viewBox="0 0 650 240" className="w-full h-56 select-none">
              {/* Gridlines */}
              {[0, 25, 50, 75, 100].map((val) => {
                const y = 30 + 160 - (val / 100) * 160;
                return (
                  <line
                    key={val}
                    x1="45"
                    y1={y}
                    x2="620"
                    y2={y}
                    stroke="rgba(255,255,255,0.06)"
                    strokeDasharray="3,3"
                  />
                );
              })}

              {/* Bars and Line Points */}
              {timeframeData.chartData.map((d, i) => {
                const total = timeframeData.chartData.length;
                const xStep = 550 / (total > 1 ? total - 1 : 1);
                const x = 50 + i * xStep;

                // Max rain in this timeframe
                const maxR = Math.max(...timeframeData.chartData.map(c => c.rainfall), 80);
                const barH = (d.rainfall / maxR) * 150;
                const barY = 190 - barH;

                // Depth line
                const maxD = 80;
                const lineY = 190 - (d.avgDepthCm / maxD) * 150;

                return (
                  <g key={i}>
                    {/* Rain bar */}
                    <rect
                      x={x - 14}
                      y={barY}
                      width="28"
                      height={barH}
                      rx="3"
                      fill="#06b6d4"
                      opacity="0.75"
                    />
                    <text
                      x={x}
                      y={barY - 5}
                      textAnchor="middle"
                      fill="#38bdf8"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {d.rainfall}
                    </text>

                    {/* Depth point */}
                    <circle cx={x} cy={lineY} r="5" fill="#ef4444" stroke="#0b111d" strokeWidth="2" />
                    <text
                      x={x}
                      y={lineY - 8}
                      textAnchor="middle"
                      fill="#fca5a5"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {d.avgDepthCm}cm
                    </text>

                    {/* X axis labels */}
                    <text
                      x={x}
                      y="215"
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      {d.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Most Flood-Prone Zones Ranking (1 Col) */}
        <div className="rounded-2xl border border-white/10 bg-command-900/90 p-5 shadow-card-dark flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
                Most Vulnerable Basins
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">10-Year Index</span>
            </div>

            <div className="space-y-3">
              {mostFloodProneZonesRanked.slice(0, 5).map((zone) => (
                <div key={zone.rank} className="rounded-xl bg-command-950 p-3 border border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-950 text-rose-300 font-mono font-bold text-xs border border-rose-500/40">
                        {zone.rank}
                      </span>
                      <span className="text-xs font-bold text-white">{zone.name}</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-rose-400">
                      {zone.riskIndex}/100
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{zone.historicalEvents} inundation events</span>
                    <span>Avg receded: {zone.avgRecededHours}h</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-slate-400 text-center">
            Based on historical telemetry recorded at Begumpet & Musi river basins.
          </div>
        </div>
      </div>

      {/* Historical Major Disasters Archive Table */}
      <div className="rounded-2xl border border-white/10 bg-command-900/90 shadow-card-dark p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              Major Historical Urban Flood Events Archive
            </h3>
          </div>
          <span className="text-xs text-slate-400">Official Municipal Post-Disaster Records</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockHistoricalEvents.map((event) => (
            <div
              key={event.id}
              className="rounded-xl border border-white/10 bg-command-950 p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">
                      {event.date}
                    </span>
                    <RiskBadge level={event.severity} size="sm" />
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">{event.title}</h4>
                </div>

                <div className="text-right font-mono">
                  <span className="text-xs text-rose-400 font-bold">{event.economicImpact}</span>
                  <span className="text-[10px] text-slate-400 block font-sans">Loss Est.</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {event.description}
              </p>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-center text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Peak Rain</span>
                  <span className="font-bold text-cyan-300">{event.peakRainfallMm} mm</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Duration</span>
                  <span className="font-bold text-slate-200">{event.durationHours} hrs</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Max Depth</span>
                  <span className="font-bold text-rose-400">{event.maxDepthCm} cm</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
