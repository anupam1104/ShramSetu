import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Clock,
  Key,
  User,
  Calendar,
  CreditCard,
  XCircle
} from '../lucide-react';

export const TrackBooking = () => {
  const { bookings, activeBookingId, cancelBooking, setCurrentScreen, t, tStatus, tSkill, shramiks } = useApp();
  const booking = bookings.find(b => b.id === activeBookingId) || bookings[0];

  // Anonymized label for the assigned shramik — customer never sees the real name.
  const bookingWorker = booking ? shramiks.find(s => s.id === booking.shramikId) || null : null;
  const bookingLabel = booking
    ? (bookingWorker && bookingWorker.shramikId
        ? `${t('verifiedShramikLabel', 'Verified Shramik')} • ${bookingWorker.shramikId}`
        : t('newShramikLabel', 'New Shramik'))
    : '';

  const handleProceedToPayment = () => {
    setCurrentScreen('payment');
  };


  if (!booking) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="text-center space-y-1">
          <span className="text-emerald-700 bg-emerald-100 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
            {t('serviceTracking', 'Service Tracking')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 pt-1">
            {t('trackYourBooking', 'Track Your Booking')}
          </h1>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg">{t('noBookingsYet', 'No bookings done yet')}</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {t('noBookingsDesc', "You haven't placed any service bookings yet. Book a skilled worker to see live tracking here.")}
          </p>
          <button
            onClick={() => setCurrentScreen('search')}
            className="mt-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all text-xs"
          >
            {t('bookServiceBtn', 'Book a Service')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto space-y-6 pb-20">
      
      {/* Top Header */}
      <div className="text-center space-y-1">
        <span className={`${booking.status === 'Cancelled' ? 'bg-red-100 text-red-700 border-red-200' : 'text-emerald-700 bg-emerald-100 border-emerald-200'} text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wider`}>
          {t('serviceTrackingId', { id: booking.id })}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 pt-1">
          {t('trackYourBooking', 'Track Your Booking')}
        </h1>
      </div>

      {/* Cancelled notice */}
      {booking.status === 'Cancelled' && (
        <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-6 text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
            <XCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-heading text-red-800">{t('bookingCancelled', 'Booking Cancelled')}</h3>
          <p className="text-xs text-red-700 max-w-sm mx-auto">
            {t('bookingCancelledDesc', 'This booking has been cancelled. No charges were applied.')}
          </p>
          <button
            onClick={() => setCurrentScreen('search')}
            className="mt-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all text-xs"
          >
            {t('bookAnotherService', 'Book Another Service')}
          </button>
        </div>
      )}

      {/* Visual Status Stepper Bar */}
      {booking.status !== 'Cancelled' && (
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex justify-between items-center relative">
          
          {/* Stepper Bar Line */}
          <div className="absolute top-1/2 left-6 right-6 h-1 bg-slate-200 -translate-y-1/2 -z-0"></div>
          <div 
            className="absolute top-1/2 left-6 h-1 bg-emerald-600 -translate-y-1/2 transition-all duration-500 -z-0"
            style={{
              width: booking.status === 'Pending' ? '0%' : booking.status === 'Confirmed' ? '25%' :
                     booking.status === 'In Progress' ? '50%' :
                     booking.status === 'Completed' ? '75%' : '100%'
            }}
          ></div>

          {[
            { step: 'Pending', label: 'Requested' },
            { step: 'Confirmed', label: tStatus('Confirmed') },
            { step: 'In Progress', label: tStatus('In Progress') },
            { step: 'Completed', label: tStatus('Completed') },
            { step: 'Paid', label: tStatus('Paid') }
          ].map((st, idx) => {
            const isDone = 
              (st.step === 'Pending') ||
              (st.step === 'Confirmed' && ['Confirmed', 'In Progress', 'Completed', 'Paid'].includes(booking.status)) ||
              (st.step === 'In Progress' && ['In Progress', 'Completed', 'Paid'].includes(booking.status)) ||
              (st.step === 'Completed' && ['Completed', 'Paid'].includes(booking.status)) ||
              (st.step === 'Paid' && booking.status === 'Paid');

            const isCurrent = booking.status === st.step;

            return (
              <div key={st.step} className="flex flex-col items-center relative z-10 bg-white px-2">
                <div className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs transition-all ${
                  isDone 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' 
                    : 'bg-slate-100 text-slate-400 border border-slate-300'
                } ${isCurrent ? 'ring-4 ring-emerald-100 scale-110' : ''}`}>
                  {isDone ? '✓' : idx + 1}
                </div>
                <span className={`text-[11px] font-bold mt-2 ${isCurrent ? 'text-emerald-700' : isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                  {st.label}
                </span>
              </div>
            );
          })}

        </div>
      </div>
      )}

      {/* PROMINENT START-CODE CARD (Key SIH UX Requirement) */}
      {booking.status === 'Pending' && (
        <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-3xl text-center space-y-2">
          <Clock className="w-8 h-8 text-amber-600 mx-auto" />
          <h3 className="font-bold text-amber-950">Request sent to {bookingLabel}</h3>
          <p className="text-xs text-amber-800">The start code will appear here as soon as the Shramik accepts your booking.</p>
        </div>
      )}

      {['Confirmed', 'In Progress'].includes(booking.status) && booking.startCode && (
        <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl text-center space-y-4 relative overflow-hidden border-2 border-emerald-500">
          <div className="inline-flex items-center space-x-1.5 bg-emerald-500/20 backdrop-blur-md px-3 py-1 rounded-full text-emerald-200 text-xs font-bold border border-emerald-400/30">
            <Key className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('verificationSecurityCode', 'Verification Security Code')}</span>
          </div>

          <p className="text-xs text-emerald-100/90 font-medium">
            {booking.status === 'In Progress'
              ? 'Start code used to begin this job'
              : t('yourStartCode', 'Your Start Code')}
          </p>

          {/* 4-Digit Code Big Display */}
          <div className="flex justify-center items-center space-x-3 my-3">
            {booking.start_Code.split('').map((char, i) => (
              <div 
                key={i} 
                className="w-14 h-16 bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl flex items-center justify-center text-3xl font-extrabold font-mono text-emerald-300 shadow-inner"
              >
                {char}
              </div>
            ))}
          </div>

          <p className="text-xs text-emerald-100/80 max-w-sm mx-auto font-light">
            {booking.status === 'In Progress'
              ? 'Keep this code private. It has already been verified and the job is now in progress.'
              : t('shareCodeDesc', { shramik: bookingLabel })}
          </p>
        </div>
      )}

      {/* Booking Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">{bookingLabel}</h3>
            <p className="text-xs text-emerald-700 font-semibold">{tSkill(booking.skill)}</p>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs text-slate-700">
          <div className="flex justify-between">
            <span className="text-slate-500">{t('service', 'Service:')}</span>
            <span className="font-bold text-slate-900">{booking.serviceName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">{t('scheduled', 'Scheduled:')}</span>
            <span className="font-semibold font-mono text-slate-800">{booking.date} • {booking.time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">{t('serviceAddressLbl', 'Service Address:')}</span>
            <span className="font-medium text-slate-800">{booking.customerAddress}</span>
          </div>
        </div>

        {/* Cancel Booking option (below service address) */}
        {['Pending', 'Confirmed', 'In Progress'].includes(booking.status) && (
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                if (window.confirm(t('cancelBookingConfirm', 'Are you sure you want to cancel this booking?'))) {
                  cancelBooking(booking.id);
                }
              }}
              className="w-full flex items-center justify-center space-x-2 bg-red-50 hover:bg-red-100 border-2 border-red-200 text-red-700 font-bold py-3 rounded-xl transition-all text-sm"
            >
              <XCircle className="w-5 h-5" />
              <span>{t('cancelMyBooking', 'Cancel My Booking')}</span>
            </button>
          </div>
        )}
      </div>

      {/* Shramik finishes the job and sets the final whole-job amount. */}
      {booking.status === 'In Progress' && (
        <div className="bg-emerald-50 border-2 border-emerald-300 p-6 rounded-3xl text-center space-y-4 shadow-md">
          <h3 className="text-lg font-bold font-heading text-slate-900">
            {t('jobInProgress', 'Job in progress')}
          </h3>
          <p className="text-xs text-slate-600">
            {bookingLabel} will record the final whole-job amount when the work is finished.
          </p>

        </div>
      )}

      {/* Work Completed -> Proceed to Payment CTA */}
      {booking.status === 'Completed' && (
        <div className="bg-emerald-100 border border-emerald-300 p-6 rounded-3xl text-center space-y-4 shadow-md animate-scale-up">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold font-heading text-emerald-950">
              {t('workCompleted', '✓ Work Completed')}
            </h3>
            <p className="text-xs text-emerald-800">
              {t('workCompletedDesc', 'Your service has been completed successfully. Please proceed to payment.')}
            </p>
          </div>

          <button
            onClick={handleProceedToPayment}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all text-sm flex items-center justify-center space-x-2"
          >
            <CreditCard className="w-5 h-5" />
            <span>{t('proceedToPayment', 'Proceed to Payment')}</span>
          </button>
        </div>
      )}

      {/* Paid State */}
      {booking.status === 'Paid' && (
        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-xl font-bold font-heading text-emerald-950">{t('paymentReceived', '✓ Payment Received')}</h3>
          <p className="text-xs text-slate-600">
            {t('paymentReceivedDesc', 'Thank you! Service is complete and paid.')}
          </p>
          <div className="pt-2">
            <button
              onClick={() => setCurrentScreen('search')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all text-xs"
            >
              {t('bookAnotherService', 'Book Another Service')}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
