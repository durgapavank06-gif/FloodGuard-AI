import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Bell,
  Map,
  Shield,
  Palette,
  Globe,
  Info,
  Save,
  CheckCircle2,
  Radio,
  Sliders,
  Volume2
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { addToast } = useApp();

  // Mock settings state
  const [enableSound, setEnableSound] = useState(true);
  const [criticalSmsAlerts, setCriticalSmsAlerts] = useState(true);
  const [autoLocate, setAutoLocate] = useState(true);
  const [defaultBasin, setDefaultBasin] = useState('zone-14');
  const [contourDensity, setContourDensity] = useState('high');
  const [themeMode, setThemeMode] = useState('dark');
  const [language, setLanguage] = useState('en');
  const [leadTimeAlertThreshold, setLeadTimeAlertThreshold] = useState('45');

  const handleSaveSettings = () => {
    addToast(
      'Preferences Saved',
      'Telemetry alert configuration & GIS map preferences updated successfully.',
      'success'
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="border-b border-white/5 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
            <Settings className="h-4 w-4" />
            <span>SYSTEM CONFIGURATION & OPERATIONAL PREFERENCES</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Settings & Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Configure telemetry polling thresholds, map visualization layers, and audio alert signals.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="flex items-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-600/25 transition-all"
        >
          <Save className="h-4 w-4" />
          <span>Save Preferences</span>
        </button>
      </div>

      {/* Settings Sections */}
      <div className="space-y-5">
        {/* Section 1: Notifications & Emergency Alerts */}
        <div className="rounded-2xl border border-white/10 bg-command-900/90 p-5 shadow-card-dark space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <Bell className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              Notifications & Audio Alerts
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-command-950 border border-white/5">
              <div>
                <span className="font-semibold text-white block">Critical Incident Audio Alert</span>
                <span className="text-[11px] text-slate-400">Audible siren ping on Level-4 underpass surcharge events</span>
              </div>
              <input
                type="checkbox"
                checked={enableSound}
                onChange={() => setEnableSound(!enableSound)}
                className="h-4 w-4 rounded bg-command-800 border-white/20 text-cyan-500 focus:ring-0 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-command-950 border border-white/5">
              <div>
                <span className="font-semibold text-white block">Automated CAP Emergency SMS Relay</span>
                <span className="text-[11px] text-slate-400">Push flash notifications to registered emergency cell broadcast towers</span>
              </div>
              <input
                type="checkbox"
                checked={criticalSmsAlerts}
                onChange={() => setCriticalSmsAlerts(!criticalSmsAlerts)}
                className="h-4 w-4 rounded bg-command-800 border-white/20 text-cyan-500 focus:ring-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Map & GIS Preferences */}
        <div className="rounded-2xl border border-white/10 bg-command-900/90 p-5 shadow-card-dark space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <Map className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              GIS Map & Drainage Visualization
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Default Focus Catchment Basin
              </label>
              <select
                value={defaultBasin}
                onChange={(e) => setDefaultBasin(e.target.value)}
                className="w-full rounded-xl bg-command-950 border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="zone-14">Zone 14 - Begumpet Underpass</option>
                <option value="zone-10">Zone 10 - Moosarambagh Causeway</option>
                <option value="zone-09">Zone 09 - Tolichowki Nadeem Colony</option>
                <option value="zone-21">Zone 21 - Ameerpet Metro Junction</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Digital Elevation Model (DEM) Resolution
              </label>
              <select
                value={contourDensity}
                onChange={(e) => setContourDensity(e.target.value)}
                className="w-full rounded-xl bg-command-950 border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="high">1-Meter Ultra High-Res (LIDAR)</option>
                <option value="medium">5-Meter Standard DEM</option>
                <option value="low">10-Meter Coarse Mesh</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Risk Alert Preferences */}
        <div className="rounded-2xl border border-white/10 bg-command-900/90 p-5 shadow-card-dark space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <Shield className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              Nowcasting Lead Time Alert Thresholds
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-slate-300">
                  Pre-Onset Flash Notification Window:
                </span>
                <span className="font-mono font-bold text-amber-300">
                  {leadTimeAlertThreshold} Minutes Before Ponding
                </span>
              </div>
              <input
                type="range"
                min="15"
                max="90"
                step="5"
                value={leadTimeAlertThreshold}
                onChange={(e) => setLeadTimeAlertThreshold(e.target.value)}
                className="w-full accent-amber-500 bg-command-950 rounded-lg cursor-pointer h-2"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>15 min (Immediate)</span>
                <span>45 min (Standard)</span>
                <span>90 min (Early Warning)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Appearance & Language */}
        <div className="rounded-2xl border border-white/10 bg-command-900/90 p-5 shadow-card-dark space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <Palette className="h-4 w-4 text-purple-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              Appearance & Language
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Command Center Theme
              </label>
              <select
                value={themeMode}
                onChange={(e) => setThemeMode(e.target.value)}
                className="w-full rounded-xl bg-command-950 border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="dark">Dark Command Center (Standard)</option>
                <option value="midnight">Obsidian Midnight Blue</option>
                <option value="high_contrast">High-Contrast Emergency Ops</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                UI Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-xl bg-command-950 border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="en">English (Official Operations)</option>
                <option value="te">తెలుగు (Telugu - Localized)</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 5: About FloodGuard AI */}
        <div className="rounded-2xl border border-white/10 bg-command-900/90 p-6 shadow-card-dark space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <Info className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              About FloodGuard AI
            </h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            FloodGuard AI is a high-resolution, real-time Urban Flood Nowcasting System developed for SIH Problem Statement 26085. Designed for the <strong>Ministry of Earth Sciences (MoES)</strong> and the <strong>National Centre for Medium Range Weather Forecasting (NCMRWF)</strong>.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
            <div className="rounded-xl bg-command-950 p-3 border border-white/5">
              <span className="text-[10px] text-slate-400 block font-sans">System Version</span>
              <span className="font-bold text-white">v2.4-Production</span>
            </div>
            <div className="rounded-xl bg-command-950 p-3 border border-white/5">
              <span className="text-[10px] text-slate-400 block font-sans">Organization</span>
              <span className="font-bold text-cyan-300">MoES / NCMRWF</span>
            </div>
            <div className="rounded-xl bg-command-950 p-3 border border-white/5">
              <span className="text-[10px] text-slate-400 block font-sans">Hydraulic Solver</span>
              <span className="font-bold text-emerald-400">Coupled 2D/1D</span>
            </div>
            <div className="rounded-xl bg-command-950 p-3 border border-white/5">
              <span className="text-[10px] text-slate-400 block font-sans">Lead Window</span>
              <span className="font-bold text-purple-300">0 – 180 Minutes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
