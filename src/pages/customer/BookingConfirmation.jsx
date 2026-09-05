import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Calendar, Clock, User, ArrowLeft, CheckCircle2, IndianRupee } from 'lucide-react';

export const BookingConfirmation = () => {
<<<<<<< HEAD
  const { shramiks, selectedWorkerId, bookingDraft, createBooking, setCurrentScreen } = useApp();
=======
  const { shramiks, selectedWorkerId, bookingDraft, createBooking, setCurrentScreen, t, tSkill } = useApp();
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
  const worker = shramiks.find(s => s.id === selectedWorkerId) || shramiks[0];

  const estimatedFee = worker.hourlyRate * 2;

  const handleFinalConfirm = () => {
    createBooking();
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
=======
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 space-y-6">
        
        <button
          onClick={() => setCurrentScreen('slot')}
          className="text-slate-600 hover:text-slate-900 text-sm font-semibold flex items-center gap-1"
        >
<<<<<<< HEAD
          <ArrowLeft className="w-4 h-4" /> Edit Slot Selection
=======
          <ArrowLeft className="w-4 h-4" /> {t('editSlot', 'Edit Slot Selection')}
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
        </button>

        <div className="text-center space-y-1">
          <span className="text-emerald-700 bg-emerald-100 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
<<<<<<< HEAD
            Step 3 of 3 • Review & Confirm
          </span>
          <h1 className="text-2xl font-bold font-heading text-slate-900 pt-2">
            Booking Summary
          </h1>
          <p className="text-xs text-slate-500">
            Please review service details before final confirmation.
=======
            {t('step3of3', 'Step 3 of 3 • Review & Confirm')}
          </span>
          <h1 className="text-2xl font-bold font-heading text-slate-900 pt-2">
            {t('bookingSummary', 'Booking Summary')}
          </h1>
          <p className="text-xs text-slate-500">
            {t('reviewDetails', 'Please review service details before final confirmation.')}
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
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
<<<<<<< HEAD
              <p className="text-xs text-emerald-700 font-semibold">{worker.skill} • {worker.shramikId || 'SS-10101'}</p>
=======
              <p className="text-xs text-emerald-700 font-semibold">{tSkill(worker.skill)} • {worker.shramikId || 'SS-10101'}</p>
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
            </div>
          </div>

          <div className="space-y-3 text-sm text-slate-700">
            <div className="flex justify-between items-center">
<<<<<<< HEAD
              <span className="text-slate-500 font-medium">Service Selected</span>
=======
              <span className="text-slate-500 font-medium">{t('serviceSelected', 'Service Selected')}</span>
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
              <span className="font-bold text-slate-900">{bookingDraft.service}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium flex items-center gap-1">
<<<<<<< HEAD
                <Calendar className="w-4 h-4 text-emerald-600" /> Date
=======
                <Calendar className="w-4 h-4 text-emerald-600" /> {t('date', 'Date')}
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
              </span>
              <span className="font-semibold font-mono text-slate-900">{bookingDraft.date}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium flex items-center gap-1">
<<<<<<< HEAD
                <Clock className="w-4 h-4 text-emerald-600" /> Time
=======
                <Clock className="w-4 h-4 text-emerald-600" /> {t('time', 'Time')}
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
              </span>
              <span className="font-semibold font-mono text-slate-900">{bookingDraft.time}</span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
<<<<<<< HEAD
              <span className="text-slate-500 font-medium">Estimated Service Fee</span>
=======
              <span className="text-slate-500 font-medium">{t('estimatedServiceFee', 'Estimated Service Fee')}</span>
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
              <span className="text-lg font-bold font-mono text-emerald-800">
                ₹{estimatedFee}
              </span>
            </div>
          </div>

        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-900 flex items-start space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p>
<<<<<<< HEAD
            A <strong>4-Digit Start Code</strong> will be generated upon confirmation. Provide this code to the Shramik upon arrival.
=======
            {t('startCodeNote', 'A 4-Digit Start Code will be generated upon confirmation. Provide this code to the Shramik upon arrival.')}
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
          </p>
        </div>

        <button
          onClick={handleFinalConfirm}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all text-sm flex items-center justify-center space-x-2"
        >
          <CheckCircle2 className="w-5 h-5" />
<<<<<<< HEAD
          <span>Confirm Booking</span>
=======
          <span>{t('confirmBooking', 'Confirm Booking')}</span>
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
        </button>

      </div>
    </div>
  );
};
