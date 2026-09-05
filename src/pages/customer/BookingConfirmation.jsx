import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Calendar, Clock, User, ArrowLeft, CheckCircle2, IndianRupee } from 'lucide-react';

export const BookingConfirmation = () => {
  const { shramiks, selectedWorkerId, bookingDraft, createBooking, setCurrentScreen, t, tSkill } = useApp();
  const worker = shramiks.find(s => s.id === selectedWorkerId) || shramiks[0];

  const estimatedFee = worker.hourlyRate * 2;

  const handleFinalConfirm = () => {
    createBooking();
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 space-y-6">
        
        <button
          onClick={() => setCurrentScreen('slot')}
          className="text-slate-600 hover:text-slate-900 text-sm font-semibold flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> {t('editSlot', 'Edit Slot Selection')}
        </button>

        <div className="text-center space-y-1">
          <span className="text-emerald-700 bg-emerald-100 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
            {t('step3of3', 'Step 3 of 3 • Review & Confirm')}
          </span>
          <h1 className="text-2xl font-bold font-heading text-slate-900 pt-2">
            {t('bookingSummary', 'Booking Summary')}
          </h1>
          <p className="text-xs text-slate-500">
            {t('reviewDetails', 'Please review service details before final confirmation.')}
          </p>
        </div>

        {/* Card Details */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
          
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
            <img
              src={worker.photo}
              alt={worker.name}
              className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500"
            />
            <div>
              <h3 className="font-bold text-slate-900 text-base">{worker.name}</h3>
              <p className="text-xs text-emerald-700 font-semibold">{tSkill(worker.skill)} • {worker.shramikId || 'SS-10101'}</p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-slate-700">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">{t('serviceSelected', 'Service Selected')}</span>
              <span className="font-bold text-slate-900">{bookingDraft.service}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Calendar className="w-4 h-4 text-emerald-600" /> {t('date', 'Date')}
              </span>
              <span className="font-semibold font-mono text-slate-900">{bookingDraft.date}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Clock className="w-4 h-4 text-emerald-600" /> {t('time', 'Time')}
              </span>
              <span className="font-semibold font-mono text-slate-900">{bookingDraft.time}</span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
              <span className="text-slate-500 font-medium">{t('estimatedServiceFee', 'Estimated Service Fee')}</span>
              <span className="text-lg font-bold font-mono text-emerald-800">
                ₹{estimatedFee}
              </span>
            </div>
          </div>

        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-900 flex items-start space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p>
            {t('startCodeNote', 'A 4-Digit Start Code will be generated upon confirmation. Provide this code to the Shramik upon arrival.')}
          </p>
        </div>

        <button
          onClick={handleFinalConfirm}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all text-sm flex items-center justify-center space-x-2"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>{t('confirmBooking', 'Confirm Booking')}</span>
        </button>

      </div>
    </div>
  );
};
