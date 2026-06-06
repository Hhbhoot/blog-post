import { useState, useCallback } from 'react';
import ToastContext from '../Context/Toast';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  AlertCircle,
} from 'lucide-react';

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container overlay */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none select-none">
        {toasts.map((toast) => {
          let bg = 'bg-slate-900 border-white/10 text-white';
          let icon = <Info className="w-5 h-5 text-indigo-400 shrink-0" />;

          if (toast.type === 'success') {
            bg =
              'bg-slate-900/95 border-white/10 text-white shadow-[0_4px_25px_rgba(16,185,129,0.2)]';
            icon = (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            );
          } else if (toast.type === 'error') {
            bg =
              'bg-slate-900/95 border-white/10 text-white shadow-[0_4px_25px_rgba(244,63,94,0.2)]';
            icon = <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
          } else if (toast.type === 'warning') {
            bg =
              'bg-slate-900/95 border-white/10 text-white shadow-[0_4px_25px_rgba(245,158,11,0.2)]';
            icon = (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            );
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-xl animate-slide-in ${bg}`}
            >
              <div className="flex items-center gap-3">
                {icon}
                <p className="text-xs font-semibold tracking-wide text-slate-100">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-500 hover:text-slate-300 transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
