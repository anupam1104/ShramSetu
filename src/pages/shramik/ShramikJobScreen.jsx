import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2, 
  MapPin, 
  User, 
  Calendar, 
  Clock, 
  ArrowLeft, 
  ShieldCheck,
  Phone,
  ArrowRight
} from 'lucide-react';

export const ShramikJobScreen = () => {
  const { bookings, activeBookingId, acceptBooking, confirmWorkDone, setCurrentScreen, t, tStatus, tSkill } = useApp();
  // Only the actual selected booking is shown. No mock fallback job.
  const currentBooking = bookings.find(b => b.id === activeBookingId) || null;

  const [finalAmount, setFinalAmount] = useState('');

  if (!currentBooking) {
    return (
      <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center space-y-3">
          <p className="font-bold text-slate-900">{t('noActiveJob', 'No active job')}</p>
          <p className="text-xs text-slate-500">{t('activeJobEmpty', 'Booked jobs appear here once a customer books your service.')}</p>
          <button
            onClick={() => setCurrentScreen('shramik_dashboard')}
            className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all"
          >
            {t('backToJobs', 'Back to Dashboard')}
          </button>
        </div>
      </div>
    );
  }

  const handleFinishJob = async () => {
    await confirmWorkDone(currentBooking.id, finalAmount);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 space-y-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <button
            onClick={() => setCurrentScreen('shramik_dashboard')}
            className="text-slate-600 hover:text-slate-900 text-sm font-semibold flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> {t('shramik.backToJobs', 'Back to Jobs')}
          </button>

          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
            currentBooking.status === 'In Progress' ? 'badge-in-progress' :
            currentBooking.status === 'Completed' ? 'badge-completed' :
            currentBooking.status === 'Paid' ? 'badge-paid' : 'badge-confirmed'
          }`}>
            ● {tStatus(currentBooking.status)}
          </span>
        </div>

        {/* Job Info Summary */}
        <div className="space-y-3">
          <h2 className="text-2xl font-extrabold font-heading text-slate-900">
            {tSkill(currentBooking.serviceName)}
          </h2>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-sm text-slate-700">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">{t('booking.customer', 'Customer')}:</span>
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-600" />
                {currentBooking.customerName}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">{t('booking.dateTime', 'Date & Time')}:</span>
              <span className="font-semibold text-slate-800 font-mono">
                {currentBooking.date} • {currentBooking.time}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-200/60">
              <span className="text-slate-500 font-medium">{t('booking.address', 'Address')}:</span>
              <span className="font-medium text-slate-800 text-right max-w-xs">
                {currentBooking.customerAddress}
              </span>
            </div>
          </div>
        </div>

        {/* The customer starts work after the Shramik has arrived. */}
        {currentBooking.status === 'Pending' ? (
          <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-3xl text-center space-y-4">
            <h3 className="text-lg font-bold text-slate-900">New booking request</h3>
            <p className="text-xs text-slate-600">Review the customer, address and schedule above before accepting this request.</p>
            <button onClick={() => acceptBooking(currentBooking.id)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all text-sm">
              Accept Request
            </button>
          </div>
        ) : currentBooking.status === 'Confirmed' ? (
          <div className="bg-emerald-50/70 border-2 border-emerald-200 p-6 rounded-3xl text-center space-y-5">
            <div className="space-y-1">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading pt-2">
                Booking accepted
              </h3>
              <p className="text-xs text-slate-600">
                Travel to the customer’s service address. The customer will start the job after you arrive.
              </p>
            </div>

          </div>
        ) : (
          /* WORK IN PROGRESS / COMPLETED / PAID STATE */
          <div className="space-y-4">
            <div className="bg-emerald-100/70 border border-emerald-300 p-6 rounded-3xl text-center space-y-4 shadow-sm animate-scale-up">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-emerald-950 font-heading">
                  {currentBooking.status === 'In Progress' && '✓ Customer started the job — work in progress'}
                  {currentBooking.status === 'Completed' && t('shramik.workDoneConfirmed', '✓ Work Done Confirmed by Customer')}
                  {currentBooking.status === 'Paid' && t('shramik.jobPaid', '✓ Job Completed & Paid')}
                </h3>
                <p className="text-xs text-emerald-800">
                  {t('booking.service', 'Service')}: <strong>{tSkill(currentBooking.serviceName)}</strong> {t('common.for', 'for')} {currentBooking.customerName}
                </p>
              </div>

              {currentBooking.status === 'In Progress' && (
                <div className="space-y-3 bg-white/80 p-4 rounded-xl border border-emerald-200 text-left">
                  <label className="block text-xs font-bold text-slate-700">Final amount for the whole job (₹)</label>
                  <input type="number" min="1" value={finalAmount} onChange={(e) => setFinalAmount(e.target.value)} placeholder={String(currentBooking.serviceFee)} className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-mono focus:ring-2 focus:ring-emerald-400 outline-none" />
                  <button type="button" onClick={handleFinishJob} className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-sm">Finish Job & Send Payment Request</button>
                  <p className="text-[11px] text-slate-600">The customer will see the final total and choose cash or online payment.</p>
                </div>
              )}

              {currentBooking.status === 'Paid' && (
                <p className="text-xs text-emerald-900 bg-emerald-200/60 p-3 rounded-xl border border-emerald-300 font-bold">
                  {t('shramik.creditedNotice', '₹{amount} credited to your daily earnings.', { amount: currentBooking.serviceFee })}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setCurrentScreen('shramik_dashboard')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-md transition-all text-xs"
            >
              {t('shramik.backToDashboard', 'Back to Shramik Dashboard')}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
