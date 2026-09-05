import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Wallet, CirclePercent, ReceiptIndianRupee, LifeBuoy } from 'lucide-react';

export const ShramikFinanceNav = ({ active }) => {
  const { setCurrentScreen, t } = useApp();

  const tabs = [
    {
      id: 'earnings',
      screen: 'shramik_earnings',
      icon: Wallet,
      label: t('earningsTitle', 'Earnings & Payments'),
      short: t('earningsNav', 'Earnings')
    },
    {
      id: 'cut',
      screen: 'shramik_cut_ratio',
      icon: CirclePercent,
      label: t('cutRatioTitle', 'Payout Split / Cut Ratio'),
      short: t('cutRatioNav', 'Cut Ratio')
    },
    {
      id: 'history',
      screen: 'shramik_payment_history',
      icon: ReceiptIndianRupee,
      label: t('paymentHistory', 'Payment History'),
      short: t('paymentsNav', 'Payments')
    },
    {
      id: 'grievance',
      screen: 'shramik_grievance',
      icon: LifeBuoy,
      label: t('grievanceTitle', 'Grievance & Support'),
      short: t('supportNav', 'Support')
    }
  ];

  return (
    <div className="space-y-3">
      <button
        onClick={() => setCurrentScreen('shramik_dashboard')}
        className="text-slate-600 hover:text-slate-900 text-sm font-semibold flex items-center gap-1"
      >
        <ArrowLeft className="w-4 h-4" /> {t('backToShramikDashboard', 'Back to Shramik Dashboard')}
      </button>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentScreen(tab.screen)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold border transition-all ${
              active === tab.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-700'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${active === tab.id ? 'text-emerald-400' : ''}`} />
            <span className="hidden sm:inline whitespace-nowrap">{tab.label}</span>
            <span className="sm:hidden whitespace-nowrap">{tab.short}</span>
          </button>
        ))}
      </div>
    </div>
  );
};