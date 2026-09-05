import React from 'react';
import { useApp } from '../../context/AppContext';
import { CirclePercent, HandCoins, BadgePercent, IndianRupee } from 'lucide-react';
import { formatINR, computeShramikFinance, WORKER_SHARE_PERCENT, PLATFORM_CUT_PERCENT } from '../../utils/shramikFinance';
import { ShramikFinanceNav } from '../../components/ShramikFinanceNav';

export const ShramikCutRatio = () => {
  const { shramiks, activeShramikId, bookings, t } = useApp();
  const currentShramik = shramiks.find(s => s.id === activeShramikId) || shramiks[0];

  const { totalNet, totalGross, govtCut, workerPct, govtPct } =
    computeShramikFinance(bookings, currentShramik.id);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6 pb-20">
      <ShramikFinanceNav active="cut" />

      {/* Cut Ratio Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md space-y-5">
        <div>
          <h2 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
            <CirclePercent className="w-5 h-5 text-emerald-600" />
            {t('cutRatioTitle', 'Payout Split / Cut Ratio')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">{t('cutRatioSub', 'How every paid rupee is distributed')}</p>
        </div>

        <div className="flex h-4 w-full rounded-full overflow-hidden bg-slate-200 shadow-inner">
          <div className="h-full bg-emerald-500" style={{ width: `${workerPct}%` }} />
          <div className="h-full bg-amber-400" style={{ width: `${govtPct}%` }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center justify-between bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4">
            <div className="flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <HandCoins className="w-5 h-5" />
              </span>
              <div>
                <p className="font-bold text-slate-900">{t('workerShare', 'Worker Share')}</p>
                <p className="text-[11px] text-slate-500">{WORKER_SHARE_PERCENT}% {t('ofEveryRupee', 'of every rupee')}</p>
              </div>
            </div>
            <span className="font-mono font-extrabold text-emerald-800">{formatINR(totalNet)}</span>
          </div>

          <div className="flex items-center justify-between bg-amber-50/70 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                <BadgePercent className="w-5 h-5" />
              </span>
              <div>
                <p className="font-bold text-slate-900">{t('platformGovtShare', 'Government & Platform')}</p>
                <p className="text-[11px] text-slate-500">{PLATFORM_CUT_PERCENT}% {t('towardsSafety', 'towards verification & support')}</p>
              </div>
            </div>
            <span className="font-mono font-extrabold text-amber-800">{formatINR(govtCut)}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-500 bg-slate-50 rounded-xl border border-slate-100 px-4 py-3">
          <span className="flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
            {t('customerPays', 'Customer pays')}: <strong className="text-slate-800 font-mono">{formatINR(totalGross)}</strong>
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span>{t('workerGets', 'Worker receives')}: <strong className="text-emerald-800 font-mono">{formatINR(totalNet)}</strong></span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span>{t('cutApplied', 'Cut applied')}: <strong className="text-amber-800 font-mono">{formatINR(govtCut)}</strong></span>
        </div>
      </div>
    </div>
  );
};