import React from 'react';
import { useApp } from '../../context/AppContext';
import { Wallet, Percent, TrendingUp, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { formatINR, computeShramikFinance, PLATFORM_CUT_PERCENT } from '../../utils/shramikFinance';
import { ShramikFinanceNav } from '../../components/ShramikFinanceNav';

export const ShramikEarnings = () => {
  const { shramiks, activeShramikId, bookings, t } = useApp();
  const currentShramik = shramiks.find(s => s.id === activeShramikId) || shramiks[0] || null;

  const { receivedBookings, upcomingBookings, receivedNet, upcomingNet, totalNet } =
    computeShramikFinance(bookings, currentShramik?.id);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6 pb-20">
      <ShramikFinanceNav active="earnings" />

      {/* Earnings & Payments Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-600" />
            {t('earningsTitle', 'Earnings & Payments')}
          </h2>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 whitespace-nowrap">
            <Percent className="w-3 h-3 inline-block mr-1 text-emerald-600" />
            {PLATFORM_CUT_PERCENT}% {t('platformCutChip', 'platform & govt cut')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Total Earnings */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase font-bold tracking-wide text-slate-500">{t('totalEarnings', 'Total Earnings')}</p>
              <span className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </span>
            </div>
            <p className="mt-2 text-2xl font-extrabold font-mono text-slate-900">{formatINR(totalNet)}</p>
            <p className="text-[11px] text-slate-500 mt-1">{t('lifetimeNetDesc', 'Lifetime net after platform & govt cut')}</p>
          </div>

          {/* Payments Received */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase font-bold tracking-wide text-slate-500">{t('paymentsReceived', 'Payments Received')}</p>
              <span className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <ArrowDownToLine className="w-5 h-5" />
              </span>
            </div>
            <p className="mt-2 text-2xl font-extrabold font-mono text-indigo-900">{formatINR(receivedNet)}</p>
            <p className="text-[11px] text-slate-500 mt-1">{t('receivedJobsCount', { n: receivedBookings.length })}</p>
          </div>

          {/* Upcoming Payouts */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase font-bold tracking-wide text-slate-500">{t('upcomingPayouts', 'Upcoming Payouts')}</p>
              <span className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <ArrowUpFromLine className="w-5 h-5" />
              </span>
            </div>
            <p className="mt-2 text-2xl font-extrabold font-mono text-amber-900">{formatINR(upcomingNet)}</p>
            <p className="text-[11px] text-slate-500 mt-1">{t('upcomingJobsCount', { n: upcomingBookings.length })}</p>
          </div>
        </div>
      </div>
    </div>
  );
};