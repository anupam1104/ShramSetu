import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Play, Sparkles, ChevronRight, CheckCircle, RefreshCw } from 'lucide-react';

export const DemoToolbar = () => {
  const { jumpToDemoStep, role, currentScreen } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const steps = [
    { num: 1, label: 'Shramik Signup' },
    { num: 2, label: 'Pending Review' },
    { num: 3, label: 'Admin Approval' },
    { num: 4, label: 'Worker Profile' },
    { num: 5, label: 'Slot Selection' },
    { num: 6, label: 'Start Code (1472)' },
    { num: 7, label: 'Job Code Entry' },
    { num: 8, label: 'Work Done' },
    { num: 9, label: 'Payment' }
  ];

  return (
    <div className="bg-slate-900 text-white text-xs py-1.5 px-4 sticky top-0 z-50 shadow-md border-b border-slate-800 flex items-center justify-between">
      <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar py-0.5">
        <div className="flex items-center space-x-1.5 bg-emerald-950 text-emerald-400 font-bold px-2 py-1 rounded-md border border-emerald-800 shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SIH Presentation Demo Bar:</span>
        </div>

        <div className="flex items-center space-x-1 shrink-0">
          {steps.map((step) => (
            <button
              key={step.num}
              onClick={() => jumpToDemoStep(step.num)}
              className={`px-2.5 py-1 rounded-md transition-all duration-150 flex items-center space-x-1.5 ${
                (step.num === 1 && currentScreen === 'shramik_signup') ||
                (step.num === 2 && currentScreen === 'shramik_pending') ||
                (step.num === 3 && currentScreen === 'admin_approvals') ||
                (step.num === 4 && currentScreen === 'profile') ||
                (step.num === 5 && currentScreen === 'slot') ||
                (step.num === 6 && currentScreen === 'track_booking') ||
                (step.num === 7 && currentScreen === 'shramik_job') ||
                (step.num === 8 && currentScreen === 'track_booking') ||
                (step.num === 9 && currentScreen === 'payment')
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-slate-900 text-[10px] flex items-center justify-center font-bold">
                {step.num}
              </span>
              <span>{step.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="hidden lg:flex items-center space-x-2 shrink-0 pl-4 border-l border-slate-800">
        <span className="text-slate-400">Current Role:</span>
        <span className="uppercase font-mono font-bold text-emerald-400">{role}</span>
      </div>
    </div>
  );
};
