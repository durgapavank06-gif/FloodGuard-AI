import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import { ZoneDetailsPanel } from '../../components/map/ZoneDetailsPanel';
import { mockZones } from '../../data/zones';
import { Search, Filter, Layers, Maximize2, Shield, Radio, Droplets } from 'lucide-react';
import { Zone } from '../../types';

export const AuthorityMap: React.FC = () => {
  const { selectedZone, setSelectedZone } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDrawer, setShowDrawer] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const filteredZones = mockZones.filter((z) => {
    const matchesSearch =
      z.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      z.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity =
      severityFilter === 'all' || z.riskLevel === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const handleSelectZone = (zone: Zone) => {
    setSelectedZone(zone);
    setShowDrawer(true);
  };

  return (
    <div className="h-[calc(100vh-6rem)] sm:h-[calc(100vh-7rem)] flex flex-col pb-12 sm:pb-0">
      {/* Top Filter & Command Bar */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 bg-command-900/90 p-3 rounded-xl border border-white/10 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by zone code, street, culvert..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg bg-command-950 border border-white/10 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {['all', 'critical', 'high', 'moderate'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition-all ${
                  severityFilter === sev
                    ? 'bg-cyan-600 text-white'
                    : 'bg-command-950 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Inspecting:</span>
            <span className="rounded bg-cyan-950 border border-cyan-500/30 px-2 py-0.5 text-cyan-300 font-bold">
              {selectedZone ? selectedZone.code : 'Select Zone'}
            </span>
          </div>

          <button
            onClick={() => setShowDrawer(!showDrawer)}
            className="rounded-lg bg-command-800 hover:bg-command-750 px-3 py-1.5 text-xs font-semibold text-slate-200 border border-white/10 transition-colors"
          >
            {showDrawer ? 'Hide Telemetry' : 'Show Telemetry'}
          </button>
        </div>
      </div>

      {/* Main Full GIS Canvas Layout */}
      <div className="flex-1 flex overflow-hidden rounded-2xl border border-white/10 bg-command-950 relative">
        <div className="flex-1 h-full min-w-0">
          <InteractiveMap
            selectedZoneId={selectedZone?.id}
            onSelectZone={handleSelectZone}
            isAuthority={true}
            className="h-full rounded-none border-0"
          />
        </div>

        {/* Authority Comprehensive Zone Inspection Drawer */}
        {showDrawer && selectedZone && (
          <div className="w-full sm:w-96 shrink-0 h-full border-l border-white/10 z-20 absolute sm:relative right-0 top-0 bottom-0 bg-command-900 shadow-2xl">
            <ZoneDetailsPanel
              zone={selectedZone}
              onClose={() => setShowDrawer(false)}
              isAuthority={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};
