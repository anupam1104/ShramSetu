import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Key,
  ShieldCheck,
  Copy,
  Check,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  AlertTriangle,
  Clock3,
  UserRound,
  Briefcase
} from 'lucide-react';

export const StartCode = () => {
  const { bookings, activeBookingId, setCurrentScreen, t, tStatus, tSkill, shramiks, showToast } = useApp();
  const [revealed, setRevealed] = useState({});
  const [copied, setCopied] = useState({});

  const workerFor = (booking) => (booking ? shramiks.find(s => s.id === booking.shramikId) || null : null);

  const bookingLabel = (booking) => {
    const worker = workerFor(booking);
    return worker && worker.shramikId
      ? `${t('verifiedShramikLabel', 'Verified Shramik')} • ${worker.shramikId}`
      : (booking.shramikName
          ? booking.shramikName
          : t('newShramikLabel', 'New Shramik'));
  };

  const toggleReveal = (id) => setRevealed(prev => ({ ...prev, [id]: !prev[id] }));

  const handleCopy = (booking) => {
    if (!booking?.startCode) return;
    navigator.clipboard?.writeText(booking.startCode);
    setCopied(prev => ({ ...prev, [booking.id]: true }));
    showToast('Start code copied to clipboard.', 'success');
    setTimeout(() => setCopied(prev => ({ ...prev, [booking.id]: false })), 2000);
  };

  const codeStatusOf = (booking) => {
    if (booking.status === 'Pending') return 'pending';
    if (booking.status === 'Cancelled' || booking.status === 'Paid') return 'inactive';
    return 'ready';
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <span className="inline-flex items-center space-x-1.5 text-emerald-700 bg-emerald-100 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
            <Key className="w-3.5 h-3.5" />
            <span>{t('startCodeNav', 'Start Code')}</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 pt-2">
            {t('startCodePageTitle', 'Your Start Codes')}
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {t('startCodePageSubtitle', 'Each booking gets a unique 4-digit code generated when the Shramik accepts it. Share the code on arrival to begin the job.')}
          </p>
        </div>

        {bookings.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center shadow-sm space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
              <Briefcase className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">{t('startCodeEmpty', 'No bookings yet')}</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {t('startCodeEmptyDesc', 'Book a service and once the Shramik accepts, the start code for your job will appear here.')}
            </p>
            <button
              onClick={() => setCurrentScreen('search')}
              className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all text-xs"
            >
              {t('bookServiceBtn', 'Book a Service')}
            </button>
          </div>
        )}

        {bookings.map((booking) => {
          const worker = workerFor(booking);
          const label = bookingLabel(booking);
          const codeStatus = codeStatusOf(booking);
          const isActive = booking.id === activeBookingId;
          const codeShown = revealed[booking.id];
          const copiedFlag = copied[booking.id];

          return (
            <div
              key={booking.id}
              className={`bg-white rounded-3xl border shadow-sm overflow-hidden ${
                isActive ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200'
              }`}
            >
              {/* Booking head */}
              <div className="p-5 sm:p-6 space-y-3">
                {/* Status row */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2.5 py-1 rounded-full border text-[11px] font-bold ${
                    booking.status === 'Cancelled'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : booking.status === 'Pending'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : booking.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {tStatus(booking.status)}
                  </span>
                  <span className="text-[11px] font-bold font-mono text-slate-400">{booking.id}</span>
                </div>

                {/* Shramik */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <UserRound className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 text-sm truncate">{label}</p>
                    <p className="text-xs text-emerald-700 font-semibold">{tSkill(worker?.skill || booking.skill)}</p>
                  </div>
                </div>

                {/* Service + schedule */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t('service', 'Service:')}</span>
                    <span className="font-bold text-slate-900">{booking.serviceName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-emerald-600" /> {t('date', 'Date')}</span>
                    <span className="font-semibold font-mono text-slate-800">{booking.date}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-emerald-600" /> {t('time', 'Time')}</span>
                    <span className="font-semibold font-mono text-slate-800">{booking.time}</span>
                  </div>
                </div>
              </div>

              {/* Code card */}
              {codeStatus === 'pending' && (
                <div className="bg-amber-50 border-t-2 border-amber-200 p-5 text-center space-y-2">
                  <Clock3 className="w-7 h-7 text-amber-600 mx-auto" />
                  <p className="text-sm font-bold text-amber-950">{t('startCodeWaiting', 'Awaiting acceptance')}</p>
                  <p className="text-xs text-amber-800">{t('startCodeWaitingDesc', 'The 4-digit start code will appear here as soon as the Shramik accepts your booking request.')}</p>
                </div>
              )}

              {codeStatus === 'inactive' && (
                <div className="bg-slate-50 border-t-2 border-slate-200 p-5 text-center space-y-2">
                  <ShieldCheck className="w-7 h-7 text-slate-400 mx-auto" />
                  <p className="text-sm font-bold text-slate-600">
                    {booking.status === 'Paid'
                      ? t('startCodePaidNote', 'This job is complete and paid.')
                      : t('startCodeCancelledNote', 'This booking was cancelled — no start code.')}
                  </p>
                  {booking.startCode && (
                    <p className="text-xs text-slate-400">{t('startCodeArchived', 'Historical code was {code}', { code: booking.startCode })}</p>
                  )}
                </div>
              )}

              {codeStatus === 'ready' && booking.startCode && (
                <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white p-6 pt-5 rounded-b-3xl text-center space-y-4 relative overflow-hidden border-t-2 border-emerald-400">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#86efac_1px,transparent_1px)] [background-size:18px_18px]"></div>

                  <div className="relative z-10 inline-flex items-center space-x-1.5 bg-emerald-500/20 backdrop-blur-md px-3 py-1 rounded-full text-emerald-200 text-xs font-bold border border-emerald-400/30">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t('verificationSecurityCode', 'Verification Security Code')}</span>
                  </div>

                  <div className={`relative z-10 flex justify-center items-center space-x-2.5 transition-all duration-300 ${codeShown ? '' : 'blur-md select-none'}`}>
                    {booking.startCode.split('').map((char, i) => (
                      <div
                        key={i}
                        className="w-12 h-14 bg-white/10 backdrop-blur-xl border border-white/30 rounded-xl flex items-center justify-center text-3xl font-extrabold font-mono text-emerald-300 shadow-inner"
                      >
                        {char}
                      </div>
                    ))}
                  </div>

                  <div className="relative z-10 flex items-center justify-center gap-3">
                    <button
                      onClick={() => toggleReveal(booking.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/25 text-emerald-100 py-2 px-4 rounded-xl transition-all"
                    >
                      {codeShown ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {codeShown ? t('hideCode', 'Hide code') : t('revealCode', 'Reveal code')}
                    </button>
                    <button
                      onClick={() => handleCopy(booking)}
                      disabled={!codeShown}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold py-2 px-4 rounded-xl border transition-all ${
                        !codeShown
                          ? 'bg-white/5 text-emerald-100/50 border-white/10 cursor-not-allowed'
                          : copiedFlag
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                            : 'bg-white/10 hover:bg-white/20 border-white/25 text-emerald-100'
                      }`}
                    >
                      {copiedFlag ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copiedFlag ? t('copied', 'Copied!') : t('copyCode', 'Copy code')}
                    </button>
                  </div>

                  <p className="relative z-10 text-xs text-emerald-100/80 font-light leading-relaxed">
                    {booking.status === 'In Progress'
                      ? t('startCodeUsedNote', 'This code has already been verified and the job is now in progress. Keep it private.')
                      : t('shareCodeDesc', { shramik: label })}
                  </p>
                </div>
              )}

              {/* Link to tracking */}
              {booking.status === 'Confirmed' && (
                <button
                  onClick={() => setCurrentScreen('track_booking')}
                  className="w-full text-center text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-t border-emerald-100 py-3 transition-colors"
                >
                  {t('viewBookingTracking', 'View booking tracking')}
                </button>
              )}
            </div>
          );
        })}

        {/* Security tip */}
        <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900">
          <AlertTriangle className="w-5 h-5 text-blue-600 shrink-0" />
          <p>
            {t('startCodeSecurityTip', 'Each code is one-time and should only be shared with the assigned verified Shramik when they arrive. Never share it over a call or message with anyone else.')}
          </p>
        </div>
      </div>
    </div>
  );
};