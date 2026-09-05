import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-50 animate-bounce-subtle">
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-medium backdrop-blur-md ${
        toast.type === 'error'
          ? 'bg-red-50/95 text-red-900 border-red-200 shadow-red-500/10'
          : toast.type === 'info'
          ? 'bg-blue-50/95 text-blue-900 border-blue-200 shadow-blue-500/10'
          : 'bg-emerald-50/95 text-emerald-900 border-emerald-200 shadow-emerald-500/10'
      }`}>
        {toast.type === 'error' ? (
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
        ) : toast.type === 'info' ? (
          <Info className="w-5 h-5 text-blue-600 shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
        )}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};
