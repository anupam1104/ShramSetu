import React from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import { sameCity } from '../../lib/store';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp 
} from 'lucide-react';

export const AdminDashboard = () => {
  const { shramiks, bookings, setCurrentScreen, approveShramik, currentUser, t, tSkill } = useApp();

  // Only this admin's city: registrations are routed to admins of the same
  // locality, so the dashboard reflects the local queue only.
  const cityScoped = (s) => !s.city || sameCity(s.city, currentUser?.city || 'Kolkata');
  const pendingShramiks = shramiks.filter(s => !s.verified && cityScoped(s));
  const verifiedShramiks = shramiks.filter(s => s.verified && cityScoped(s));

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
              {t('admin.operationsDashboard', 'Operations Dashboard')}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {t('admin.dashboardSubtitle', 'Shram Setu Platform Overview & Verification Activity')}
            </p>
          </div>

          <button
            onClick={() => setCurrentScreen('admin_approvals')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center space-x-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>{t('admin.reviewPending', 'Review Pending ({count})', { count: pendingShramiks.length })}</span>
          </button>
        </div>

        {/* Top 3 Metric Cards (Section 19 Specs) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('admin.pending', 'Pending')}
              </p>
              <p className="text-3xl font-extrabold font-mono text-slate-900 mt-1">
                {pendingShramiks.length}
              </p>
              <p className="text-[11px] text-amber-700 font-semibold mt-0.5">
                {t('admin.awaitingVerification', 'Awaiting Verification')}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('admin.verified', 'Verified')}
              </p>
              <p className="text-3xl font-extrabold font-mono text-slate-900 mt-1">
                {verifiedShramiks.length}
              </p>
              <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                {t('admin.activeShramiks', 'Active Shramiks')}
              </p>
            </div>
          </div>

          <div 
            onClick={() => setCurrentScreen('admin_bookings')}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-4 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Calendar className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('admin.bookings', 'Bookings')}
              </p>
              <p className="text-3xl font-extrabold font-mono text-slate-900 mt-1">
                {bookings.length}
              </p>
              <p className="text-[11px] text-blue-700 font-semibold mt-0.5">
                {bookings.length === 0 ? t('admin.noBookingsYet', 'No bookings yet') : t('admin.completedAndActive', 'Completed & Active')}
              </p>
            </div>
          </div>

        </div>

        {/* Pending Approval Priority Alert Banner */}
        {pendingShramiks.length > 0 && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center animate-bounce-subtle shrink-0">
                !
              </div>
              <div>
                <h3 className="font-bold text-amber-950 text-base">
                  {t('admin.registrationsRequireReview', '{count} Shramik Registration(s) Require Review', { count: pendingShramiks.length })}
                </h3>
              </div>
            </div>

            <button
              onClick={() => setCurrentScreen('admin_approvals')}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md transition-all flex items-center space-x-1.5 shrink-0"
            >
              <span>{t('admin.goToApprovals', 'Go to Approvals Queue')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Recent Approvals & Activity Feed */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-lg font-heading">
              {t('admin.recentlyVerified', 'Recently Verified Shramiks')}
            </h3>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {t('admin.autoSyncActive', 'Auto Sync Active')}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {verifiedShramiks.slice(0, 3).map((worker) => (
              <div key={worker.id} className="py-3.5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={worker.photo}
                    alt={worker.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{worker.name}</p>
                    <p className="text-xs text-slate-500">{tSkill(worker.skill)} • {worker.area}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {worker.shramikId || 'SS-10101'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};
