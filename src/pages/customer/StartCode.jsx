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
  MapPin,
  ArrowLeft,
  AlertTriangle,
  Clock3
} from 'lucide-react';

export const StartCode = () => {
  const { bookings, activeBookingId, setCurrentScreen, t, tStatus, shramiks, showToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [blurred, setBlurred] = useState(true);

  const booking = bookings.find(b => b.id === activeBookingId);
  const bookingWorker = booking ? shramiks.find(s => s.id === booking.shramikId) || null : null;
  const bookingLabel = booking
    ? (bookingWorker && bookingWorker.shramikId
        ? `${t('verifiedShramikLabel', 'Verified Shramik')} • ${bookingWorker.shramikId}`
        : t('newShramikLabel', 'New Shramik'))
    : '';

  const hasCode = booking && ['Confirmed', 'In Progress'].includes(booking.status) && booking.startCode;

  const handleCopy = () => {
    if (!hasCode) return;
    navigator.clipboard?.writeText(booking.startCode);
    setCopied(true);
    showToast('Start code copied to clipboard.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const goBack = () => setCurrentScreen('track_booking');

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Back to tracking */}
        <button
          onClick={goBack}
          className="text-slate-600 hover:text-slate-900 text-sm font-semibold flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> {t('backToTracking', 'Back to tracking')}
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          <span className="inline-flex items-center space-x-1.5 text-emerald-700 bg-emerald-100 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
            <Key className="w-3.5 h-3.5" />
            <span>{t('startCodeTitle', 'Your Start Code')}</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 pt-2">
            {booking ? booking.id : ''}
          </h1>
          <p className="text-xs text-slate-500">
            {t('startCodeSubtitleShare', 'Share this code with the Shramik on arrival to begin your service.')}
          </p>
        </div>

        {!hasCode ? (
          /* No code yet — booking still pending */
          <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-8 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Clock3 className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-amber-950 text-lg">
              {t('startCodeWaiting', 'Awaiting acceptance')}
            </h3>
            <p className="text-xs text-amber-800 max-w-xs mx-auto">
              {t('startCodeWaitingDesc', 'The 4-digit start code will appear here as soon as the Shramik accepts your booking request.')}
            </p>
          </div>
        ) : (
          <>
            {/* THE Big Start Code Card */}
            <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white p-8 sm:p-10 rounded-3xl shadow-2xl text-center space-y-5 relative overflow-hidden border-2 border-emerald-500">
              {/* ambient overlay */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#86efac_1px,transparent_1px)] [background-size:18px_18px]"></div>

              <div className="relative z-10 inline-flex items-center space-x-1.5 bg-emerald-500/20 backdrop-blur-md px-3 py-1 rounded-full text-emerald-200 text-xs font-bold border border-emerald-400/30">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('verificationSecurityCode', 'Verification Security Code')}</span>
              </div>

              {/* 4 digits */}
              <div
                className={`relative z-10 flex justify-center items-center space-x-3 my-2 transition-all duration-300 ${blurred ? 'blur-md select-none' : ''}`}
              >
                {booking.startCode.split('').map((char, i) => (
                  <div
                    key={i}
                    className="w-16 h-20 bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl flex items-center justify-center text-4xl font-extrabold font-mono text-emerald-300 shadow-inner"
                  >
                    {char}
                  </div>
                ))}
              </div>

              {/* reveal / hide + copy controls */}
              <div className="relative z-10 flex items-center justify-center gap-3">
                <button
                  onClick={() => setBlurred(prev => !prev)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/25 text-emerald-100 py-2 px-4 rounded-xl transition-all"
                >
                  {blurred ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  {blurred ? t('revealCode', 'Reveal code') : t('hideCode', 'Hide code')}
                </button>
                <button
                  onClick={handleCopy}
                  disabled={blurred}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold py-2 px-4 rounded-xl border transition-all ${
                    blurred
                      ? 'bg-white/5 text-emerald-100/50 border-white/10 cursor-not-allowed'
                      : copied
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'bg-white/10 hover:bg-white/20 border-white/25 text-emerald-100'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? t('copied', 'Copied!') : t('copyCode', 'Copy code')}
                </button>
              </div>

              <p className="relative z-10 text-xs text-emerald-100/80 max-w-sm mx-auto font-light leading-relaxed">
                {booking.status === 'In Progress'
                  ? t('startCodeUsedNote', 'This code has already been verified and the job is now in progress. Keep it private.')
                  : t('shareCodeDesc', { shramik: bookingLabel })}
              </p>
            </div>

            {/* Status note */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <span className={`px-2.5 py-1 rounded-full border font-bold ${
                booking.status === 'In Progress'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {tStatus(booking.status)}
              </span>
              <span>{t('startCodeStatusHint', 'Only active while the job has not started.')}</span>
            </div>
          </>
        )}

        {/* Booking summary */}
        {booking && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">{t('bookingSummary', 'Booking Summary')}</span>
              <span className="text-xs font-bold text-emerald-700">{bookingLabel}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2.5 text-xs text-slate-700">
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
              <div className="flex justify-between items-start gap-2">
                <span className="text-slate-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3.5 h-3.5 text-emerald-600" /> {t('location', 'Location')}</span>
                <span className="font-medium text-slate-800 text-right">{booking.customerAddress}</span>
              </div>
            </div>
          </div>
        )}

        {/* Security tip */}
        <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900">
          <AlertTriangle className="w-5 h-5 text-blue-600 shrink-0" />
          <p>
            {t('startCodeSecurityTip', 'This code is one-time and should only be shared with the assigned verified Shramik when they arrive. Never share it over a call or message with anyone else.')}
          </p>
        </div>
      </div>
    </div>
  );
};
