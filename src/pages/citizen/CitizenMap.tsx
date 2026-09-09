import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import { ZoneDetailsPanel } from '../../components/map/ZoneDetailsPanel';
import { Zone } from '../../types';
import { mockZones } from '../../data/zones';
import { Search, MapPin, SlidersHorizontal, Info } from 'lucide-react';

export const CitizenMap: React.FC = () => {
  const { selectedZone, setSelectedZone } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSidePanel, setShowSidePanel] = useState<boolean>(true);

  const filteredZones = searchQuery
    ? mockZones.filter(
        (z) =>
          z.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          z.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockZones;

  const handleSelectZone = (zone: Zone) => {
    setSelectedZone(zone);
    setShowSidePanel(true);
  };

  return (
    <div className="h-[calc(100vh-6rem)] sm:h-[calc(100vh-7rem)] flex flex-col pb-12 sm:pb-0">
      {/* Top Search & Filter Bar */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 bg-command-900/80 p-2.5 rounded-xl border border-white/10 backdrop-blur-md shrink-0">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search zones, underpasses, streets (e.g. Begumpet, Ameerpet)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg bg-command-950 border border-white/10 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline">Selected:</span>
          <span className="rounded-md bg-cyan-950 border border-cyan-500/30 px-2.5 py-1 text-xs font-mono font-bold text-cyan-300">
            {selectedZone ? `${selectedZone.code} (${selectedZone.name.split('&')[0]})` : 'Select a Zone'}
          </span>
          <button
            onClick={() => setShowSidePanel(!showSidePanel)}
            className={`rounded-lg p-1.5 border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              showSidePanel
                ? 'bg-cyan-600 border-cyan-500 text-white'
                : 'bg-command-800 border-white/10 text-slate-300'
            }`}
          >
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">{showSidePanel ? 'Hide Details' : 'Show Details'}</span>
          </button>
        </div>
      </div>

      {/* Main Map + Side Panel Layout */}
      <div className="flex-1 flex overflow-hidden rounded-2xl border border-white/10 bg-command-950 relative">
        {/* Interactive Map Area */}
        <div className="flex-1 h-full min-w-0">
          <InteractiveMap
            selectedZoneId={selectedZone?.id}
            onSelectZone={handleSelectZone}
            isAuthority={false}
            className="h-full rounded-none border-0"
          />
        </div>

        {/* Detailed Side Panel */}
        {showSidePanel && selectedZone && (
          <div className="w-full sm:w-88 md:w-96 shrink-0 h-full border-l border-white/10 z-20 absolute sm:relative right-0 top-0 bottom-0 bg-command-900 shadow-2xl">
            <ZoneDetailsPanel
              zone={selectedZone}
              onClose={() => setShowSidePanel(false)}
              isAuthority={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};
