import React from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Shield,
  ArrowRight,
  Radio,
  MapPin,
  TrendingUp,
  AlertTriangle,
  SlidersHorizontal,
  GitBranch,
  ShieldCheck,
  Building2
} from 'lucide-react';

export const RoleSelectionPage: React.FC = () => {
  const { navigate, setRole } = useApp();

  const handleSelectRole = (role: 'citizen' | 'authority') => {
    setRole(role);
    if (role === 'citizen') navigate('/citizen');
    else navigate('/authority');
  };

  return (
    <div className="min-h-screen bg-command-950 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background radar effects */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-cyan-500/10 opacity-40 animate-pulse-subtle" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] h-[950px] rounded-full border border-cyan-500/5 opacity-20" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between max-w-5xl mx-auto w-full pt-4">
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-glow-cyan">
            <Radio className="h-4 w-4 text-white animate-pulse" />
          </div>
          <span className="text-base font-extrabold text-white tracking-tight">
            FloodGuard <span className="text-cyan-400">AI</span>
          </span>
        </div>

        <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">
          MoES / NCMRWF • SIH 26085
        </span>
      </div>

      {/* Main Selection Body */}
      <div className="relative z-10 max-w-4xl mx-auto w-full my-auto py-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-command-900 border border-white/10 px-3.5 py-1 text-xs text-cyan-300 font-medium mb-3">
            <ShieldCheck className="h-3.5 w-3.5" />
            Persona Access Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How are you using FloodGuard AI?
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
            Choose your experience to get tailored flood intelligence and decision-support tools.
          </p>
        </div>

        {/* Dual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Citizen */}
          <div
            onClick={() => handleSelectRole('citizen')}
            className="group relative cursor-pointer rounded-3xl border border-white/10 bg-command-900/90 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/50 hover:bg-command-900 hover:shadow-glow-low flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 group-hover:scale-110 transition-transform">
                  <User className="h-7 w-7" />
                </div>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                  Public Portal
                </span>
              </div>

              <h3 className="mt-6 text-2xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                Citizen
              </h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                Check flood risk, alerts and safer routes around you.
              </p>

              <div className="mt-6 space-y-2.5 border-t border-white/5 pt-5 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Your current street flood probability</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>0–3 hour rainfall and water depth nowcast</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Flood-safe route recommendations</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Crowdsourced flood incident reporting</span>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSelectRole('citizen');
              }}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 transition-all group-hover:scale-[1.02]"
            >
              <span>Continue as Citizen</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Card 2: Authority */}
          <div
            onClick={() => handleSelectRole('authority')}
            className="group relative cursor-pointer rounded-3xl border border-white/10 bg-command-900/90 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/50 hover:bg-command-900 hover:shadow-glow-cyan flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 group-hover:scale-110 transition-transform">
                  <Building2 className="h-7 w-7" />
                </div>
                <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-[11px] font-bold text-cyan-300 border border-cyan-500/30 uppercase tracking-wider font-mono">
                  EOC Dashboard
                </span>
              </div>

              <h3 className="mt-6 text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                Authority
              </h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                Monitor urban flood conditions and coordinate response.
              </p>

              <div className="mt-6 space-y-2.5 border-t border-white/5 pt-5 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Radio className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  <span>Real-time command center telemetry</span>
                </div>
                <div className="flex items-center gap-2">
                  <GitBranch className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  <span>Underground drainage network graph & surcharge states</span>
                </div>
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  <span>Scenario simulation engine (rainfall & desilting)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  <span>Alert lifecycle management & emergency pump dispatch</span>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSelectRole('authority');
              }}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-600/30 transition-all group-hover:scale-[1.02]"
            >
              <span>Continue as Authority</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center text-xs text-slate-500 pb-4">
        <span>You can switch between Citizen and Authority roles at any time using the navigation bar.</span>
      </div>
    </div>
  );
};
