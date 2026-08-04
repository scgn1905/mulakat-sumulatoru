import React from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'error', onClose }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-2xl text-xs font-bold ${
        type === 'error' 
          ? 'bg-rose-950/95 border-rose-500/50 text-rose-200 shadow-rose-500/20' 
          : 'bg-emerald-950/95 border-emerald-500/50 text-emerald-200 shadow-emerald-500/20'
      }`}>
        {type === 'error' ? <AlertCircle size={18} className="text-rose-400 shrink-0" /> : <CheckCircle size={18} className="text-emerald-400 shrink-0" />}
        <span>{message}</span>
        {onClose && (
          <button onClick={onClose} className="ml-2 text-slate-400 hover:text-white cursor-pointer">
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}