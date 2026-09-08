import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  Key, 
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
  const { bookings, activeBookingId, verifyStartCode, setCurrentScreen, t, tStatus, tSkill } = useApp();
  const currentBooking = bookings.find(b => b.id === activeBookingId) || bookings[0] || null;

  const [pinDigits, setPinDigits] = useState(['', '', '', '']);

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

  const handleDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...pinDigits];
    newPin[index] = value.slice(-1);
    setPinDigits(newPin);

    // Auto focus next input box
    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-digit-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pinDigits[index] && index > 0) {
      const prevInput = document.getElementById(`pin-digit-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyCodeSubmit = async (e) => {
    e.preventDefault();
    const enteredCode = pinDigits.join('');
    if (enteredCode.length !== 4) return;
    
    const success = await verifyStartCode(enteredCode);
    if (success) {
      setPinDigits(['', '', '', '']);
    }
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

        {/* 4-Digit Code Entry Box */}
        {currentBooking.status === 'Confirmed' ? (
          <form onSubmit={handleVerifyCodeSubmit} className="bg-emerald-50/70 border-2 border-emerald-200 p-6 rounded-3xl text-center space-y-5">
            <div className="space-y-1">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                <Key className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-heading pt-2">
                {t('shramik.enterStartCode', "Enter Customer's 4-digit Start Code")}
              </h3>
              <p className="text-xs text-slate-600">
                {t('shramik.askStartCodeNotice', "Ask the customer for the verification code displayed on their screen.")}
              </p>
            </div>

            {/* 4 Pin Boxes */}
            <div className="flex justify-center space-x-3 my-2">
              {pinDigits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`pin-digit-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-12 h-14 bg-white border-2 border-emerald-300 rounded-2xl text-center text-2xl font-bold font-mono text-slate-900 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-200 outline-none shadow-sm transition-all"
                />
              ))}
            </div>

            <div className="space-y-2">
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all text-sm flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{t('shramik.startJob', 'Start Job')}</span>
              </button>
            </div>
          </form>
        ) : (
          /* WORK IN PROGRESS / COMPLETED / PAID STATE */
          <div className="space-y-4">
            <div className="bg-emerald-100/70 border border-emerald-300 p-6 rounded-3xl text-center space-y-4 shadow-sm animate-scale-up">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-emerald-950 font-heading">
                  {currentBooking.status === 'In Progress' && t('shramik.codeVerifiedInProgress', '✓ Code Verified! Job In Progress')}
                  {currentBooking.status === 'Completed' && t('shramik.workDoneConfirmed', '✓ Work Done Confirmed by Customer')}
                  {currentBooking.status === 'Paid' && t('shramik.jobPaid', '✓ Job Completed & Paid')}
                </h3>
                <p className="text-xs text-emerald-800">
                  {t('booking.service', 'Service')}: <strong>{tSkill(currentBooking.serviceName)}</strong> {t('common.for', 'for')} {currentBooking.customerName}
                </p>
              </div>

              {currentBooking.status === 'In Progress' && (
                <p className="text-xs text-slate-600 bg-white/80 p-3 rounded-xl border border-emerald-200">
                  {t('shramik.finishInstruction', 'Once you finish the task, ask the customer to click "Confirm Work Done" on their screen to proceed to payment.')}
                </p>
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
