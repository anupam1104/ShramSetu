import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LifeBuoy, Clock, ShieldQuestionMark, ShieldCheck, CircleCheck, Headphones, Mail, MessageCircle } from 'lucide-react';
import { ShramikFinanceNav } from '../../components/ShramikFinanceNav';

const RECENT_GRIEVANCES = [
  { id: 'GR-2026-1043', categoryKey: 'catPayment', snippetKey: 'recentGrievance1', statusKey: 'statusResolved', statusClass: 'bg-emerald-100 text-emerald-700' },
  { id: 'GR-2026-1042', categoryKey: 'catBooking', snippetKey: 'recentGrievance2', statusKey: 'statusInReview', statusClass: 'bg-amber-100 text-amber-700' }
];

export const ShramikGrievance = () => {
  const { showToast, t } = useApp();

  const [grievance, setGrievance] = useState({ category: '', message: '' });
  const [grievanceSubmitted, setGrievanceSubmitted] = useState(false);

  const handleSupportAction = (toastKey, fallback) => {
    showToast(t(toastKey, fallback), 'info');
  };

  const handleGrievanceSubmit = (e) => {
    e.preventDefault();
    if (!grievance.category || !grievance.message.trim()) {
      showToast(t('grievanceEmpty', 'Please choose a category and describe your issue.'), 'error');
      return;
    }
    showToast(t('grievanceSubmitted', 'Grievance submitted! Our team will reach out within 24 hours.'), 'success');
    setGrievance({ category: '', message: '' });
    setGrievanceSubmitted(true);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6 pb-20">
      <ShramikFinanceNav active="grievance" />

      {/* Grievance & Support Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-emerald-600" />
            {t('grievanceTitle', 'Grievance & Support')}
          </h2>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 whitespace-nowrap">
            <Clock className="w-3 h-3 inline-block mr-1" />
            {t('resolutionTime', 'Avg. resolution')} 24h
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Support Channels + Recent Grievances */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md space-y-4">
            <h3 className="font-bold font-heading text-slate-900 text-base">{t('supportTitle', 'Support Channels')}</h3>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl p-3.5">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Headphones className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t('helplineTitle', '24×7 Helpline')}</p>
                    <p className="text-xs font-mono text-slate-500">1800 419 8130</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSupportAction('callingToast', 'Connecting you to the Shram Setu helpline…')}
                  className="text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg"
                >
                  {t('callNow', 'Call')}
                </button>
              </div>

              <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl p-3.5">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t('emailSupportTitle', 'Email Support')}</p>
                    <p className="text-xs font-mono text-slate-500">support@shramsetu.gov.in</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSupportAction('emailToast', 'Opening your mail app…')}
                  className="text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg"
                >
                  {t('emailNow', 'Email')}
                </button>
              </div>

              <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl p-3.5">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t('liveChatTitle', 'Live Chat')}</p>
                    <p className="text-xs text-slate-500">{t('liveChatDesc', 'Connect with a live agent now')}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSupportAction('chatToast', 'Connecting you to a live support agent…')}
                  className="text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg"
                >
                  {t('chatNow', 'Chat')}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase font-bold tracking-wide text-slate-400">{t('recentGrievances', 'Recent Grievances')}</p>
              {RECENT_GRIEVANCES.map(g => (
                <div key={g.id} className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800">{g.id} • {t(g.categoryKey, '')}</p>
                    <p className="text-[11px] text-slate-500 truncate">{t(g.snippetKey, '')}</p>
                  </div>
                  <span className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-full ${g.statusClass}`}>{t(g.statusKey, '')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Raise a Grievance */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md space-y-4">
            <div>
              <h3 className="font-bold font-heading text-slate-900 text-base flex items-center gap-2">
                <ShieldQuestionMark className="w-5 h-5 text-emerald-600" />
                {t('raiseGrievance', 'Raise a Grievance')}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{t('grievanceDesc', 'Facing an issue with a payment, booking or a customer? Report it here.')}</p>
            </div>

            <form onSubmit={handleGrievanceSubmit} className="space-y-3">
              <select
                value={grievance.category}
                onChange={(e) => setGrievance(prev => ({ ...prev, category: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
              >
                <option value="">{t('selectCategory', 'Select category…')}</option>
                <option value="Payment">{t('catPayment', 'Payment / Deduction')}</option>
                <option value="Booking">{t('catBooking', 'Booking Issue')}</option>
                <option value="Behavior">{t('catBehavior', 'Customer Behavior')}</option>
                <option value="Other">{t('catOther', 'Other')}</option>
              </select>

              <textarea
                rows={4}
                value={grievance.message}
                onChange={(e) => setGrievance(prev => ({ ...prev, message: e.target.value }))}
                placeholder={t('grievancePh', 'Describe your issue in 2-3 lines…')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 resize-none"
              />

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl shadow-md transition-all text-xs flex items-center justify-center space-x-2"
              >
                <ShieldQuestionMark className="w-4 h-4" />
                <span>{t('submitGrievance', 'Submit Grievance')}</span>
              </button>
            </form>

            {grievanceSubmitted && (
              <p className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2">
                <CircleCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                {t('grievanceSubmitted', 'Grievance submitted! Our team will reach out within 24 hours.')}
              </p>
            )}

            <p className="text-[11px] text-slate-500 flex items-start gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              {t('grievanceProtection', 'Your complaint is confidential and reviewed by senior support staff.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};