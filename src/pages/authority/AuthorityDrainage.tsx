import React, { useState } from 'react';
import { drainageOverview, mockDrainageConduits } from '../../data/drainage';
import { StatCard } from '../../components/common/StatCard';
import { DrainageCard } from '../../components/charts/DrainageCard';
import { DrainageGraph } from '../../components/charts/DrainageGraph';
import {
  GitBranch,
  AlertTriangle,
  CheckCircle2,
  Waves,
  Search,
  Sliders,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuthorityDrainage: React.FC = () => {
  const { addToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredConduits = mockDrainageConduits.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleInspectTelemetry = (id: string) => {
    addToast(
      'Acoustic Flow Sensor Calibrated',
      `Live sensor feed for conduit ${id} re-synchronized with hydraulic mesh solver.`,
      'info'
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-white/5 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400">
            <GitBranch className="h-4 w-4" />
            <span>UNDERGROUND CONDUIT & MANHOLE HYDRAULIC REPOSITORY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Drainage Network Monitoring
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time hydraulic capacity, hydraulic grade line (HGL), and street-level backflow surcharge prediction.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-purple-950/50 border border-purple-500/30 px-3.5 py-2 text-xs font-mono">
            <span className="text-slate-400">Total System Discharge: </span>
            <strong className="text-purple-300">245.8 m³/s</strong>
          </div>
        </div>
      </div>

      {/* Top KPI Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Drains"
          value={drainageOverview.totalDrains}
          unit="Monitored"
          subtitle="Underground trunks & nalas"
          icon={<GitBranch className="h-5 w-5 text-cyan-400" />}
        />

        <StatCard
          title="Critical Surcharge"
          value={drainageOverview.critical}
          subtitle="Backflow onto street level"
          riskHighlight="critical"
          icon={<ShieldAlert className="h-5 w-5 text-rose-400" />}
        />

        <StatCard
          title="Near Capacity"
          value={drainageOverview.nearCapacity}
          subtitle=">80% Cross-section full"
          riskHighlight="moderate"
          icon={<AlertTriangle className="h-5 w-5 text-amber-400" />}
        />

        <StatCard
          title="Normal Operations"
          value={drainageOverview.normal}
          subtitle="Free gravity discharge"
          riskHighlight="low"
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-400" />}
        />
      </div>

      {/* Drainage Network Directed Graph Visualization */}
      <DrainageGraph />

      {/* Conduit Telemetry Cards Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              Stormwater Trunk Lines & Arterial Conduits ({filteredConduits.length})
            </h3>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search drain D-104, canal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-lg bg-command-950 border border-white/10 pl-8 pr-3 py-1 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {['all', 'surcharged', 'critical', 'near_limit', 'normal'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition-all ${
                  statusFilter === st
                    ? 'bg-purple-600 text-white'
                    : 'bg-command-900 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Conduit Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredConduits.map((conduit) => (
            <DrainageCard
              key={conduit.id}
              conduit={conduit}
              onInspect={handleInspectTelemetry}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
