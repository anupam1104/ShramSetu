import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, CheckCircle2, Clock, Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';

export const ShramikPending = () => {
  const { activeShramikId, shramiks, approveShramik, setCurrentScreen, switchRole, t, tSkill } = useApp();
  
  const currentShramik = shramiks.find(s => s.id === activeShramikId) || shramiks[2]; // fallback to Vikash (pending)
  const isVerified = currentShramik?.verified;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 text-center relative overflow-hidden">
        
        {/* Top Decorative Header */}
        <div className={`absolute top-0 left-0 right-0 h-3 ${isVerified ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`}></div>

        {!isVerified ? (
          /* PENDING STATE UX */
          <div className="space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 border-4 border-amber-200 flex items-center justify-center text-amber-600 shadow-inner">
              <Clock className="w-10 h-10 animate-spin-slow" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-300">
                â— {t('registrationSubmitted', 'Registration Submitted')}
              </span>
              <h2 className="text-2xl font-bold font-heading text-slate-900">
                {t('reviewInProgress', 'Your profile is being reviewed')}
              </h2>
              <p className="text-sm text-slate-600">
                {t('reviewDesc', 'Shram Setu administrators are verifying your professional credentials and phone details.')}
              </p>
            </div>

            {/* Verification Stepper Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('verificationProgress', 'Verification Progress')}
              </h3>

              <div className="space-y-3 relative pl-6">
                <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-200"></div>

                <div className="flex items-center space-x-3 relative z-10">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                    âœ“
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{t('registrationSubmitted', 'Registration Submitted')}</p>
                    <p className="text-[11px] text-slate-500">{t('applicationReceived', 'Application details received')}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 relative z-10">
                  <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold animate-pulse">
                    â—
                  </div>
                  <div>
                    <p className="text-xs font-bold text-amber-900">{t('adminReview', 'Admin Review')}</p>
                    <p className="text-[11px] text-amber-700">{t('verificationInProgress', 'Verification in progress...')}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 relative z-10 opacity-50">
                  <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-xs font-bold">
                    â—‹
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600">{t('verifiedBadgeIssued', 'Verified Badge Issued')}</p>
                    <p className="text-[11px] text-slate-400">{t('unlocksBookings', 'Unlocks customer bookings')}</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              {t('notifyAuto', "We'll notify you automatically when your profile is approved.")}
            </p>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                onClick={() => approveShramik(currentShramik.id)}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>{t('simulateApproval', 'Simulate Verification Approval')}</span>
              </button>
            </div>
          </div>
        ) : (
          /* VERIFIED STATE UX (THE WOW MOMENT) */
          <div className="space-y-6 animate-scale-up">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 border-4 border-emerald-300 flex items-center justify-center text-emerald-600 shadow-lg shadow-emerald-500/20 animate-badge-glow">
              <ShieldCheck className="w-12 h-12 stroke-[2.2]" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {t('verifiedShramikBadge', 'Verified Shramik')}
              </span>
              <h2 className="text-3xl font-extrabold font-heading text-slate-900">
                {t('youAreVerified', "You're Verified!")}
              </h2>
              <p className="text-sm text-slate-600">
                {t('verifiedCongrats', { name: currentShramik.name })}
              </p>
            </div>

            {/* Shramik ID Card Highlight */}
            <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white p-5 rounded-2xl shadow-xl text-left space-y-2 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-emerald-200 uppercase font-semibold">{t('officialShramikId', 'Official Shramik ID')}</p>
                  <p className="text-2xl font-mono font-bold text-white tracking-wider mt-0.5">
                    {currentShramik.shramikId || 'SS-10234'}
                  </p>
                </div>
                <ShieldCheck className="w-8 h-8 text-emerald-400 opacity-80" />
              </div>

              <div className="pt-3 border-t border-emerald-700/60 flex justify-between items-center text-xs text-emerald-100">
                <span>{t('skillLabel', 'Skill:')} <strong>{tSkill(currentShramik.skill)}</strong></span>
                <span>{t('cityLabel', 'City:')} <strong>{currentShramik.city}</strong></span>
              </div>
            </div>

            <button
              onClick={() => setCurrentScreen('shramik_dashboard')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 text-sm"
            >
              <span>{t('goToDashboard', 'Go to Shramik Dashboard')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
