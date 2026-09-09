import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  ArrowRight,
  Wallet,
  Briefcase,
  CirclePercent,
  ReceiptIndianRupee,
  LifeBuoy,
  Star,
  CheckCircle2,
  Sparkles,
  XCircle
} from 'lucide-react';
import { formatINR, computeShramikFinance } from '../../utils/shramikFinance';

const getGreetingKey = () => {
  const h = new Date().getHours();
  if (h < 12) return 'goodMorning';
  if (h < 17) return 'goodAfternoon';
  return 'goodEvening';
};

export const ShramikDashboard = () => {
  const { shramiks, activeShramikId, bookings, setCurrentScreen, setActiveBookingId, currentUser, t, tStatus, tSkill, cancelBooking } = useApp();

  const [greetingKey, setGreetingKey] = useState(getGreetingKey());

  // Live update the greeting as the time of day changes
  useEffect(() => {
    const now = new Date();
    const msToNextMinute = (60 - now.getSeconds()) * 1000;
    const timer = setTimeout(() => setGreetingKey(getGreetingKey()), msToNextMinute);
    return () => clearTimeout(timer);
  }, [greetingKey]);

  const currentShramik = shramiks.find(s => s.id === currentUser?.id || s.id === activeShramikId || s.phone === currentUser?.phone) || null;
  const currentShramikId = currentShramik?.id || currentUser?.id;

  const myBookings = bookings.filter(b => 
    b.shramikId === currentShramikId || 
    (currentShramik?.shramikId && b.shramikId === currentShramik.shramikId) ||
    (currentUser?.phone && b.shramikPhone === currentUser.phone)
  );

  const confirmedJobs = myBookings.filter(b => ['Pending', 'Confirmed', 'In Progress'].includes(b.status));
  const completedCount = myBookings.filter(b => ['Completed', 'Paid'].includes(b.status)).length;

  // Prefer the actual logged-in Shramik identity for display
  const displayName = currentUser?.name || currentShramik?.name || t('shramikLabel', 'Shramik');
  const displaySkill = currentUser?.skill || currentShramik?.skill || '';
  const displayId = currentUser?.shramikId || currentShramik?.shramikId || '';
  const displayCity = currentUser?.city || currentShramik?.city || '';

  const finance = computeShramikFinance(myBookings, currentShramikId);

  const navigate = (screen) => setCurrentScreen(screen);

  const handleOpenJob = (bookingId) => {
    setActiveBookingId(bookingId);
    setCurrentScreen('shramik_job');
  };

  const handleCancelRequest = (bookingId) => {
    if (window.confirm(t('cancelBookingConfirm', 'Are you sure you want to cancel this booking?'))) {
      cancelBooking(bookingId);
    }
  };

  // Fallbacks cover both `serviceName`, `jobTitle`, and `skill` field patterns
  const jobLabel = (b) => b.serviceName || b.jobTitle || b.skill || t('generalService', 'General Service');

  const quickActions = [
    { icon: Briefcase, label: t('activeJob', 'Active Job'), screen: 'shramik_job' },
    { icon: Wallet, label: t('earningsNav', 'Earnings'), screen: 'shramik_earnings' },
    { icon: CirclePercent, label: t('cutRatioNav', 'Cut Ratio'), screen: 'shramik_cut_ratio' },
    { icon: ReceiptIndianRupee, label: t('paymentsNav', 'Payments'), screen: 'shramik_payment_history' },
    { icon: LifeBuoy, label: t('supportNav', 'Support'), screen: 'shramik_grievance' }
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 pb-20">

      {/* Profile Hero Header */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#86efac_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
            {/* Avatar */}
            {currentShramik?.photo ? (
              <img
                src={currentShramik.photo}
                alt={displayName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-400/50 shadow-lg shrink-0"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400/50 flex items-center justify-center shrink-0">
                <User className="w-8 h-8 text-emerald-300" />
              </div>
            )}

            <div className="min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] sm:text-[11px] bg-white/10 border border-white/20 text-emerald-100 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  {t('dashboardOverview', 'Dashboard Overview')}
                </span>
                <span className="text-[11px] font-mono bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 px-2.5 py-1 rounded-full font-bold tracking-wider">
                  {displayId}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight truncate">
                {t(greetingKey, 'Good morning')}, {displayName.split(' ')[0]} 👋
              </h1>

              <p className="text-sm text-emerald-100/85 flex items-center gap-2 flex-wrap">
                {t('primarySkillLine', { skill: tSkill(displaySkill), city: displayCity })}
                <span className="inline-flex items-center gap-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3" /> {t('verified', 'Verified')}
                </span>
              </p>
            </div>
          </div>

          {/* Rating + jobs done summary */}
          <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1 shrink-0">
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-2 rounded-2xl">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-extrabold text-base">{Number(currentShramik?.rating || 0).toFixed(1)}</span>
              <span className="text-[10px] text-emerald-100/70 font-medium capitalize">{t('averageRating', 'Average Rating')}</span>
            </span>
            <span className="text-[11px] text-emerald-100/60">
{t('jobsDoneCount', { n: currentShramik?.jobsCount || completedCount })}
              </span>
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={() => navigate('shramik_earnings')}
          className="text-left bg-white rounded-3xl border border-slate-200 p-5 shadow-md hover:shadow-lg hover:border-emerald-300 transition-all group"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase font-bold tracking-wide text-slate-500">{t('totalEarnings', 'Total Earnings')}</p>
            <span className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Wallet className="w-5 h-5" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-extrabold font-mono text-slate-900">{formatINR(finance.totalNet)}</p>
          <p className="text-[11px] text-slate-500 mt-1">{t('lifetimeNetDesc', 'Lifetime net after platform & govt cut')}</p>
        </button>

        <button
          onClick={() => navigate('shramik_dashboard')}
          className="text-left bg-white rounded-3xl border border-slate-200 p-5 shadow-md hover:shadow-lg hover:border-emerald-300 transition-all group"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase font-bold tracking-wide text-slate-500">{t('activeJobs', 'Active Jobs')}</p>
            <span className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-extrabold font-mono text-slate-900">{confirmedJobs.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">{t('activeJobsDesc', 'Confirmed & in-progress')}</p>
        </button>

        <button
          onClick={() => navigate('shramik_payment_history')}
          className="text-left bg-white rounded-3xl border border-slate-200 p-5 shadow-md hover:shadow-lg hover:border-emerald-300 transition-all group"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase font-bold tracking-wide text-slate-500">{t('jobsCompleted', 'Completed Jobs')}</p>
            <span className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-extrabold font-mono text-slate-900">{completedCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">{t('jobsCompletedDesc', 'Paid & completed')}</p>
        </button>

        <div className="text-left bg-white rounded-3xl border border-slate-200 p-5 shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase font-bold tracking-wide text-slate-500">{t('averageRating', 'Average Rating')}</p>
            <span className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Star className="w-5 h-5 fill-amber-500/70 text-amber-500" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-extrabold font-mono text-slate-900 flex items-center gap-1">
            {Number(currentShramik?.rating || 0).toFixed(1)}
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </p>
          <p className="text-[11px] text-slate-500 mt-1">{t('jobsDoneCount', { n: currentShramik?.jobsCount || completedCount })}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6">
        <h2 className="font-bold font-heading text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          {t('quickActions', 'Quick Actions')}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
          {quickActions.map((a) => (
            <button
              key={a.screen}
              onClick={() => navigate(a.screen)}
              className="flex flex-col items-center gap-2.5 p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-emerald-50 hover:border-emerald-300 hover:shadow-sm transition-all group"
            >
              <span className="w-11 h-11 rounded-xl bg-white border border-slate-200 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-colors">
                <a.icon className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold text-slate-800 text-center leading-tight">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Today's Jobs Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            {t('todaysJobs', "Today's Jobs")}
          </h2>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {confirmedJobs.length} {t('activeSchedule', 'Active Schedule')}
          </span>
        </div>

        {/* Active Job Cards */}
        {confirmedJobs.length > 0 ? (
          <div className="space-y-4">
            {confirmedJobs.map((booking) => (
              <div key={booking.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md hover:shadow-lg transition-all space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-sm font-mono shadow-inner">
                      {booking.time || 'Today'}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{jobLabel(booking)}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {t('customer', 'Customer:')} <strong>{booking.customerName}</strong> {booking.customerPhone ? `(${booking.customerPhone})` : ''}
                      </p>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    booking.status === 'In Progress' ? 'badge-in-progress' :
                    booking.status === 'Completed' ? 'badge-completed' :
                    booking.status === 'Paid' ? 'badge-paid' : 'badge-confirmed'
                  }`}>
                    ● {tStatus(booking.status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                  <div className="flex items-start space-x-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900">{t('serviceAddress', 'Service Address')}</p>
                      <p className="text-slate-600 mt-0.5">{booking.customerAddress || 'Local Address'}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-emerald-950 font-medium">
                    <div>
                      <p className="text-[10px] text-emerald-800 uppercase font-bold">{t('estimatedPayout', 'Estimated Payout')}</p>
                      <p className="text-lg font-bold font-mono text-emerald-900">{formatINR(booking.serviceFee ?? booking.totalAmount ?? booking.amount)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500">{t('distance', 'Distance')}</p>
                      <p className="text-xs font-bold text-slate-800">{booking.distance || '2.1 km'}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  {booking.status === 'Pending' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        onClick={() => handleOpenJob(booking.id)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm"
                      >
                        <span>Review & Accept Request</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleCancelRequest(booking.id)}
                        className="w-full bg-white hover:bg-red-50 text-red-600 border border-red-300 hover:border-red-500 font-bold py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2 text-sm"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>{t('cancelRequest', 'Cancel Request')}</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenJob(booking.id)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm"
                    >
                      <span>{t('viewJobEnterCode', 'View Job & Enter Start Code')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center shadow-sm">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">{t('noBookingsYet', 'No active work requests right now')}</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {t('waitingDesc', 'Once a customer books your service, new work requests will pop up here in real-time.')}
            </p>
            <span className="inline-flex items-center gap-1.5 mt-4 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-200">
              <Clock className="w-3.5 h-3.5" />
              {t('waitingForBookings', 'Waiting for new incoming requests...')}
            </span>
          </div>
        )}

      </div>

    </div>
  );
};
