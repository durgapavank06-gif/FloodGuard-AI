import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RiskBadge } from '../../components/common/RiskBadge';
import { Alert } from '../../types';
import {
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Clock,
  MapPin,
  ExternalLink,
  Plus
} from 'lucide-react';

export const AuthorityAlerts: React.FC = () => {
  const { alerts, updateAlertStatus, addToast, navigate, setSelectedZone } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const filteredAlerts = alerts.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.zoneName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.cause.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || a.status === statusFilter;
    const matchesSeverity =
      severityFilter === 'all' || a.severity === severityFilter;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const handleBroadcastNewAlert = () => {
    addToast(
      'New Incident Warning Published',
      'Metropolitan early warning broadcast dispatched to emergency services & public transit dispatchers.',
      'success'
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-white/5 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400">
            <ShieldAlert className="h-4 w-4" />
            <span>INCIDENT COMMAND & EARLY WARNING DISPATCH</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Alerts & Incident Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Triage, acknowledge, escalate, and resolve coupled hydrological alerts in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleBroadcastNewAlert}
            className="flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-rose-600/25 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Broadcast Flash Alert</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-command-900/90 p-4 shadow-card-dark">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by alert ID, zone, cause..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl bg-command-950 border border-white/10 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Status:</span>
          {['all', 'active', 'acknowledged', 'escalated', 'resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-lg px-2.5 py-1 font-medium capitalize transition-all ${
                statusFilter === st
                  ? 'bg-cyan-600 text-white'
                  : 'bg-command-950 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Incident Management Table */}
      <div className="rounded-2xl border border-white/10 bg-command-900/90 shadow-card-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-command-950/80 border-b border-white/10 text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
              <tr>
                <th className="py-3.5 px-4">Alert ID</th>
                <th className="py-3.5 px-4">Catchment Zone</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">Hydrodynamic Cause</th>
                <th className="py-3.5 px-4">Predicted Depth / Onset</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Time</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {filteredAlerts.map((alert) => {
                const statusBadge = {
                  active: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
                  acknowledged: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
                  escalated: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
                  resolved: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
                }[alert.status];

                return (
                  <tr key={alert.id} className="hover:bg-command-800/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                      {alert.code}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-white">{alert.zoneName}</div>
                      <div className="text-[10px] text-slate-400">{alert.affectedStreets[0]}</div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <RiskBadge level={alert.severity} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-300">
                      {alert.cause}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-cyan-300">
                      {alert.prediction}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${statusBadge}`}>
                        {alert.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-400">
                      {alert.timestamp}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {alert.status === 'active' && (
                          <button
                            onClick={() => updateAlertStatus(alert.id, 'acknowledged')}
                            className="rounded-lg bg-command-800 hover:bg-command-750 px-2.5 py-1 text-[11px] font-semibold text-amber-300 border border-amber-500/30 transition-colors"
                          >
                            Acknowledge
                          </button>
                        )}

                        {alert.status !== 'escalated' && alert.status !== 'resolved' && (
                          <button
                            onClick={() => updateAlertStatus(alert.id, 'escalated')}
                            className="rounded-lg bg-purple-950 hover:bg-purple-900 px-2.5 py-1 text-[11px] font-semibold text-purple-300 border border-purple-500/40 transition-colors"
                          >
                            Escalate
                          </button>
                        )}

                        {alert.status !== 'resolved' && (
                          <button
                            onClick={() => updateAlertStatus(alert.id, 'resolved')}
                            className="rounded-lg bg-emerald-950 hover:bg-emerald-900 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 border border-emerald-500/40 transition-colors"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
