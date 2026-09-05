import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  Clock, 
  Key, 
  User, 
  Calendar, 
  Phone, 
  MapPin, 
  CreditCard, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  XCircle
} from 'lucide-react';

export const TrackBooking = () => {
  const { bookings, activeBookingId, confirmWorkDone, cancelBooking, setCurrentScreen, switchRole, setActiveShramikId } = useApp();
  const booking = bookings.find(b => b.id === activeBookingId) || bookings[0];

  const handleProceedToPayment = () => {
    setCurrentScreen('payment');
  };

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="text-center space-y-1">
          <span className="text-emerald-700 bg-emerald-100 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
            Service Tracking
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 pt-1">
            Track Your Booking
          </h1>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg">No bookings done yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You haven't placed any service bookings yet. Book a skilled worker to see live tracking here.
          </p>
          <button
            onClick={() => setCurrentScreen('search')}
            className="mt-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all text-xs"
          >
            Book a Service
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto space-y-6 pb-20">
      
      {/* Top Header */}
      <div className="text-center space-y-1">
        <span className={`${booking.status === 'Cancelled' ? 'bg-red-100 text-red-700 border-red-200' : 'text-emerald-700 bg-emerald-100 border-emerald-200'} text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wider`}>
          Service Tracking • {booking.id}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 pt-1">
          Track Your Booking
        </h1>
      </div>

      {/* Cancelled notice */}
      {booking.status === 'Cancelled' && (
        <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-6 text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
            <XCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-heading text-red-800">Booking Cancelled</h3>
          <p className="text-xs text-red-700 max-w-sm mx-auto">
            This booking has been cancelled. No charges were applied.
          </p>
          <button
            onClick={() => setCurrentScreen('search')}
            className="mt-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all text-xs"
          >
            Book Another Service
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
              width: booking.status === 'Confirmed' ? '0%' :
                     booking.status === 'In Progress' ? '33%' :
                     booking.status === 'Completed' ? '66%' : '100%'
            }}
          ></div>

          {[
            { step: 'Confirmed', label: 'Confirmed' },
            { step: 'In Progress', label: 'In Progress' },
            { step: 'Completed', label: 'Completed' },
            { step: 'Paid', label: 'Paid' }
          ].map((st, idx) => {
            const isDone = 
              st.step === 'Confirmed' ||
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
      {booking.status === 'Confirmed' && (
        <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl text-center space-y-4 relative overflow-hidden border-2 border-emerald-500">
          <div className="inline-flex items-center space-x-1.5 bg-emerald-500/20 backdrop-blur-md px-3 py-1 rounded-full text-emerald-200 text-xs font-bold border border-emerald-400/30">
            <Key className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verification Security Code</span>
          </div>

          <p className="text-xs text-emerald-100/90 font-medium">Your Start Code</p>

          {/* 4-Digit Code Big Display */}
          <div className="flex justify-center items-center space-x-3 my-3">
            {booking.startCode.split('').map((char, i) => (
              <div 
                key={i} 
                className="w-14 h-16 bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl flex items-center justify-center text-3xl font-extrabold font-mono text-emerald-300 shadow-inner"
              >
                {char}
              </div>
            ))}
          </div>

          <p className="text-xs text-emerald-100/80 max-w-sm mx-auto font-light">
            Share this 4-digit code with the Shramik (<strong>{booking.shramikName}</strong>) when they arrive at your location.
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
            <h3 className="font-bold text-slate-900 text-lg">{booking.shramikName}</h3>
            <p className="text-xs text-emerald-700 font-semibold">{booking.skill} • {booking.shramikPhone}</p>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs text-slate-700">
          <div className="flex justify-between">
            <span className="text-slate-500">Service:</span>
            <span className="font-bold text-slate-900">{booking.serviceName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Scheduled:</span>
            <span className="font-semibold font-mono text-slate-800">{booking.date} • {booking.time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Service Address:</span>
            <span className="font-medium text-slate-800">{booking.customerAddress}</span>
          </div>
        </div>

        {/* Cancel Booking option (below service address) */}
        {['Confirmed', 'In Progress'].includes(booking.status) && (
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to cancel this booking?')) {
                  cancelBooking(booking.id);
                }
              }}
              className="w-full flex items-center justify-center space-x-2 bg-red-50 hover:bg-red-100 border-2 border-red-200 text-red-700 font-bold py-3 rounded-xl transition-all text-sm"
            >
              <XCircle className="w-5 h-5" />
              <span>Cancel My Booking</span>
            </button>
          </div>
        )}
      </div>

      {/* Customer Work Completion Box */}
      {booking.status === 'In Progress' && (
        <div className="bg-emerald-50 border-2 border-emerald-300 p-6 rounded-3xl text-center space-y-4 shadow-md">
          <h3 className="text-lg font-bold font-heading text-slate-900">
            Is the work completed?
          </h3>
          <p className="text-xs text-slate-600">
            Service: <strong>{booking.serviceName}</strong> by <strong>{booking.shramikName}</strong>
          </p>

          <button
            onClick={() => confirmWorkDone(booking.id)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all text-sm flex items-center justify-center space-x-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Confirm Work Done</span>
          </button>
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
              ✓ Work Completed
            </h3>
            <p className="text-xs text-emerald-800">
              Your service has been completed successfully. Please proceed to payment.
            </p>
          </div>

          <button
            onClick={handleProceedToPayment}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all text-sm flex items-center justify-center space-x-2"
          >
            <CreditCard className="w-5 h-5" />
            <span>Proceed to Payment</span>
          </button>
        </div>
      )}

      {/* Paid State */}
      {booking.status === 'Paid' && (
        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-xl font-bold font-heading text-emerald-950">✓ Payment Received</h3>
          <p className="text-xs text-slate-600">
            Thank you! Service is complete and paid.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setCurrentScreen('search')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all text-xs"
            >
              Book Another Service
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
