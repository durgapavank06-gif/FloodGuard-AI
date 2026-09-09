import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { mockZones } from '../../data/zones';
import { AlertTriangle, Camera, MapPin, Send, CheckCircle } from 'lucide-react';

export const ReportFloodingModal: React.FC = () => {
  const { isReportModalOpen, setIsReportModalOpen, addToast, selectedZone } = useApp();

  const [zoneId, setZoneId] = useState<string>(selectedZone?.id || 'zone-14');
  const [depthOption, setDepthOption] = useState<string>('knee');
  const [issueType, setIssueType] = useState<string>('manhole_overflow');
  const [streetAddress, setStreetAddress] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsReportModalOpen(false);
      addToast(
        'Flood Report Received',
        'Citizen ground observation verified and ingested into coupled hydraulic nowcast solver. Thank you for keeping Hyderabad safe!',
        'success'
      );
      // Reset form
      setDescription('');
      setStreetAddress('');
    }, 600);
  };

  return (
    <Modal
      isOpen={isReportModalOpen}
      onClose={() => setIsReportModalOpen(false)}
      title="Report Street-Level Flooding"
      subtitle="Crowdsourced ground telemetry helps calibrate the AI drainage-rainfall nowcasting engine."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-300">
        {/* Zone Selection */}
        <div>
          <label className="block font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-cyan-400" />
            Catchment Zone
          </label>
          <select
            value={zoneId}
            onChange={(e) => setZoneId(e.target.value)}
            className="w-full rounded-xl bg-command-950 border border-white/10 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
          >
            {mockZones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.code} - {z.name}
              </option>
            ))}
          </select>
        </div>

        {/* Specific Street / Landmark */}
        <div>
          <label className="block font-semibold text-slate-200 mb-1.5">
            Exact Street / Landmark (Optional)
          </label>
          <input
            type="text"
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
            placeholder="e.g. Near Prakash Nagar Metro Pillar 1042"
            className="w-full rounded-xl bg-command-950 border border-white/10 px-3 py-2 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Estimated Flood Depth */}
        <div>
          <label className="block font-semibold text-slate-200 mb-1.5">
            Estimated Water Depth
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'ankle', label: 'Ankle Deep', depth: '~10 cm' },
              { id: 'knee', label: 'Knee Deep', depth: '~30 cm' },
              { id: 'waist', label: 'Waist Deep', depth: '~60 cm' },
              { id: 'submerged', label: 'Over 1 Meter', depth: 'Vehicles Submerged' },
            ].map((d) => (
              <button
                type="button"
                key={d.id}
                onClick={() => setDepthOption(d.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                  depthOption === d.id
                    ? 'bg-cyan-600/30 border-cyan-400 text-white shadow-sm'
                    : 'bg-command-950/70 border-white/5 text-slate-400 hover:bg-command-800'
                }`}
              >
                <span className="font-semibold text-xs text-white">{d.label}</span>
                <span className="text-[10px] text-cyan-300 font-mono mt-0.5">{d.depth}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Observed Hazard Condition */}
        <div>
          <label className="block font-semibold text-slate-200 mb-1.5">
            Hazard Condition Observed
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'manhole_overflow', label: 'Manhole / Sump Backflow Geyser' },
              { id: 'rapid_rise', label: 'Rapid Rising Water Sheet' },
              { id: 'stalled_traffic', label: 'Stalled Vehicles / Gridlock' },
              { id: 'culvert_blockage', label: 'Debris Blocking Drain Intake' },
            ].map((t) => (
              <button
                type="button"
                key={t.id}
                onClick={() => setIssueType(t.id)}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                  issueType === t.id
                    ? 'bg-cyan-600/30 border-cyan-400 text-white'
                    : 'bg-command-950/70 border-white/5 text-slate-400 hover:bg-command-800'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${issueType === t.id ? 'bg-cyan-400' : 'bg-slate-600'}`} />
                <span className="text-xs">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block font-semibold text-slate-200 mb-1.5">
            Additional Observations / Warning Notes
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe immediate danger, stranded persons, or road closures..."
            className="w-full rounded-xl bg-command-950 border border-white/10 p-2.5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Upload Mock */}
        <div className="rounded-xl border border-dashed border-white/10 bg-command-950/50 p-3 text-center flex items-center justify-center gap-2 text-slate-400 hover:border-cyan-500/40 cursor-pointer">
          <Camera className="h-4 w-4 text-cyan-400" />
          <span className="text-xs">Attach Geo-tagged Photo (Simulated)</span>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={() => setIsReportModalOpen(false)}
            className="rounded-xl px-4 py-2 text-slate-400 hover:bg-command-800 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-600/30 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Transmitting...</span>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>Submit Ground Report</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
