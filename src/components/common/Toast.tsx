import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icon = {
          success: <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />,
          warning: <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />,
          error: <AlertOctagon className="h-5 w-5 text-rose-400 shrink-0" />,
          info: <Info className="h-5 w-5 text-cyan-400 shrink-0" />,
        }[toast.type];

        const borderStyle = {
          success: 'border-emerald-500/40 bg-command-900/95',
          warning: 'border-amber-500/40 bg-command-900/95',
          error: 'border-rose-500/40 bg-command-900/95',
          info: 'border-cyan-500/40 bg-command-900/95',
        }[toast.type];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-2xl backdrop-blur-md transition-all animate-in slide-in-from-right-8 duration-200 ${borderStyle}`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-white truncate">
                  {toast.title}
                </h4>
                <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                  {toast.timestamp}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-300 line-clamp-2">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
