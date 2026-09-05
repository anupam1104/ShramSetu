import React from 'react';
import { useApp } from '../../context/AppContext';
import { ReceiptIndianRupee, Receipt, CircleCheck, Clock4 } from 'lucide-react';
import { formatINR, computeShramikFinance, grossOf, cutOf, netOf, dateLabel, jobLabel, badgeClassFor } from '../../utils/shramikFinance';
import { ShramikFinanceNav } from '../../components/ShramikFinanceNav';

export const ShramikPaymentHistory = () => {
  const { shramiks, activeShramikId, bookings, t, tStatus } = useApp();
  const currentShramik = shramiks.find(s => s.id === activeShramikId) || shramiks[0];

  const { earningBookings } = computeShramikFinance(bookings, currentShramik.id);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6 pb-20">
      <ShramikFinanceNav active="history" />

      {/* Payment History Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
            <ReceiptIndianRupee className="w-5 h-5 text-emerald-600" />
            {t('paymentHistory', 'Payment History')}
          </h2>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
            {earningBookings.length} {t('jobsTotal', 'jobs')}
          </span>
        </div>

        {earningBookings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center shadow-sm">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
              <Receipt className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">{t('noPaymentsYet', 'No payments yet')}</p>
            <p className="text-xs text-slate-500 mt-1">{t('noPaymentsDesc', 'Completed jobs and their payouts will appear here.')}</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md divide-y divide-slate-100 overflow-hidden">
            {earningBookings.map(b => {
              const paid = b.status === 'Paid';
              return (
                <div key={b.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${paid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {paid ? <CircleCheck className="w-5 h-5" /> : <Clock4 className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">{jobLabel(b, t)}</p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {t('customer', 'Customer:')} {b.customerName} • {b.id} • {dateLabel(b)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 sm:w-auto">
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-slate-400">{t('gross', 'Gross')}</p>
                      <p className="text-sm font-mono font-semibold text-slate-600 line-through decoration-slate-300">{formatINR(grossOf(b))}</p>
                      <p className="text-[10px] text-slate-400">{t('cutShort', { amt: formatINR(cutOf(b)) })}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-slate-400">{t('netPayout', 'Net payout')}</p>
                      <p className="text-base font-mono font-extrabold text-emerald-700">{formatINR(netOf(b))}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap ${badgeClassFor(b.status)}`}>
                      ● {tStatus(b.status)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};