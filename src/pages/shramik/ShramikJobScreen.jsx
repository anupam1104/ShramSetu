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
  Sparkles
} from 'lucide-react';

export const ShramikJobScreen = () => {
  const { bookings, activeBookingId, verifyStartCode, setCurrentScreen } = useApp();
  const currentBooking = bookings.find(b => b.id === activeBookingId) || bookings[0];

  const [pinDigits, setPinDigits] = useState(['', '', '', '']);

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

  const handleVerifyCodeSubmit = (e) => {
    e.preventDefault();
    const enteredCode = pinDigits.join('');
    if (enteredCode.length !== 4) return;
    
    const success = verifyStartCode(enteredCode);
    if (success) {
      setPinDigits(['', '', '', '']);
    }
  };

  const handleAutoFillCode = () => {
    const code = currentBooking.startCode || '1472';
    setPinDigits(code.split(''));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 space-y-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <button
            onClick={() => setCurrentScreen('shramik_dashboard')}
            className="text-slate-600 hover:text-slate-900 text-sm font-semibold flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Jobs
          </button>

          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
            currentBooking.status === 'In Progress' ? 'badge-in-progress' :
            currentBooking.status === 'Completed' ? 'badge-completed' :
            currentBooking.status === 'Paid' ? 'badge-paid' : 'badge-confirmed'
          }`}>
            ● {currentBooking.status}
          </span>
        </div>

        {/* Job Info Summary */}
        <div className="space-y-3">
          <h2 className="text-2xl font-extrabold font-heading text-slate-900">
            {currentBooking.serviceName}
          </h2>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-sm text-slate-700">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Customer:</span>
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-600" />
                {currentBooking.customerName}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Date & Time:</span>
              <span className="font-semibold text-slate-800 font-mono">
                {currentBooking.date} • {currentBooking.time}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-200/60">
              <span className="text-slate-500 font-medium">Address:</span>
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
                Enter Customer's 4-digit Start Code
              </h3>
              <p className="text-xs text-slate-600">
                Ask the customer for the verification code displayed on their screen.
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
                <span>Start Job</span>
              </button>

              <button
                type="button"
                onClick={handleAutoFillCode}
                className="text-xs text-emerald-800 font-semibold hover:underline inline-flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Auto-fill Customer's Code ({currentBooking.startCode})
              </button>
            </div>
          </form>
        ) : (
          /* WORK IN PROGRESS / COMPLETED STATE */
          <div className="bg-emerald-100/70 border border-emerald-300 p-6 rounded-3xl text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-emerald-950 font-heading">
                ✓ Code Verified! Job In Progress
              </h3>
              <p className="text-xs text-emerald-800">
                You are currently performing <strong>{currentBooking.serviceName}</strong>.
              </p>
            </div>

            <p className="text-xs text-slate-600 bg-white/80 p-3 rounded-xl border border-emerald-200">
              Once you finish the task, ask the customer to click <strong>"Confirm Work Done"</strong> on their phone to unlock payment.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
