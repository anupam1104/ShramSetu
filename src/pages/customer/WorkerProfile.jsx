import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  Star, 
  MapPin, 
  Clock, 
  IndianRupee, 
  ShieldCheck, 
  ArrowLeft, 
  Calendar, 
  Check, 
  Award 
} from 'lucide-react';

export const WorkerProfile = () => {
  const { shramiks, selectedWorkerId, setCurrentScreen, t, tSkill } = useApp();
  const worker = shramiks.find(s => s.id === selectedWorkerId) || shramiks[0] || null;

  // Anonymized display label — customer never sees the shramik's real name.
  const workerLabel = worker
    ? (worker.verified && worker.shramikId
        ? `${t('verifiedShramikLabel', 'Verified Shramik')} • ${worker.shramikId}`
        : t('newShramikLabel', 'New Shramik'))
    : '';

  if (!worker) {
    return (
      <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center space-y-3">
          <p className="font-bold text-slate-900">{t('noWorkerProfile', 'No verified worker found')}</p>
          <p className="text-xs text-slate-500">{t('workerProfileEmpty', 'Workers appear here once approved by an admin.')}</p>
          <button
            onClick={() => setCurrentScreen('search')}
            className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all"
          >
            {t('backToSearch', 'Back to Search Results')}
          </button>
        </div>
      </div>
    );
  }

  const handleBookNow = () => {
    setCurrentScreen('slot');
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6 pb-28">
      
      {/* Back Button */}
      <button
        onClick={() => setCurrentScreen('search')}
        className="text-slate-600 hover:text-slate-900 text-sm font-semibold flex items-center gap-1"
      >
        <ArrowLeft className="w-4 h-4" /> {t('backToSearch', 'Back to Search Results')}
      </button>

      {/* Top Section — Worker Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-lg space-y-6">
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
          <img
            src={worker.photo}
            alt={workerLabel}
            className="w-28 h-28 rounded-3xl object-cover border-4 border-emerald-500 shadow-md shrink-0"
          />

          <div className="space-y-2 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
                {workerLabel}
              </h1>

              {worker.verified ? (
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300 self-center sm:self-auto">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {t('verifiedShramikBadge', 'Verified Shramik')}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-300">
                  ● {t('pendingVerification', 'Pending Verification')}
                </span>
              )}
            </div>

            <p className="text-base font-semibold text-emerald-700">{tSkill(worker.skill)}</p>

            {/* Quick Stats Pill Row */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-slate-600 pt-1">
              <div className="flex items-center text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                {worker.rating > 0 ? worker.rating : t('ratingNew', 'New')} ({worker.jobsCount} {t('completedJobs', 'completed jobs')})
              </div>

              <div className="flex items-center text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                <MapPin className="w-4 h-4 text-slate-400 mr-1" />
                {worker.distance}
              </div>

              <div className="flex items-center text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                <Award className="w-4 h-4 text-slate-400 mr-1" />
                {worker.experience}
              </div>
            </div>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* About Section */}
        <div className="space-y-2">
          <h2 className="text-lg font-bold font-heading text-slate-900">{t('about', 'About')}</h2>
          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            {worker.bio || t('bioFallback', { name: workerLabel, skill: tSkill(worker.skill) })}
          </p>
        </div>

        {/* Specific Services Checklist */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold font-heading text-slate-900">{t('skillsServices', 'Skills & Services')}</h2>
          <div className="flex flex-wrap gap-2">
            {worker.services.map((skill, idx) => (
              <span 
                key={idx}
                className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing Card */}
        <div className="bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">{t('pricingRate', 'Pricing Rate')}</p>
            <p className="text-2xl font-extrabold font-mono text-slate-900">
              ₹{worker.hourlyRate}
            </p>
          </div>

          <button
            onClick={handleBookNow}
            className="hidden sm:flex bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all text-sm items-center space-x-2"
          >
            <Calendar className="w-4 h-4" />
            <span>{t('bookNow', 'Book Now')}</span>
          </button>
        </div>

      </div>

      {/* Sticky Bottom Booking Bar for Mobile */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 p-4 shadow-2xl flex items-center justify-between">
        <div>
          <p className="text-[10px] text-slate-500 font-bold uppercase">{t('rate', 'Rate')}</p>
          <p className="text-xl font-bold font-mono text-slate-900">₹{worker.hourlyRate}</p>
        </div>

        <button
          onClick={handleBookNow}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition-all text-sm flex items-center space-x-2"
        >
          <Calendar className="w-4 h-4" />
          <span>{t('bookNow', 'Book Now')}</span>
        </button>
      </div>

    </div>
  );
};
