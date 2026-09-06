import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Search, 
  UserCheck, 
  Key, 
  CreditCard, 
  Zap, 
  Wrench, 
  Paintbrush, 
  Hammer, 
  Truck, 
  CheckCircle2, 
  Star, 
  ArrowRight,
  Sparkles,
  Lock,
  Clock,
  PhoneCall
} from 'lucide-react';

export const LandingPage = () => {
  const { 
    switchRole, 
    setCurrentScreen, 
    setSearchCategory, 
    setSelectedWorkerId, 
    shramiks, 
    activeShramikId,
    isLoggedIn,
    setIntendedLoginRole,
    showToast,
    t,
    tSkill
  } = useApp();

  const handleBookService = (category = 'All') => {
    setSearchCategory(category);
    if (!isLoggedIn) {
      setIntendedLoginRole('customer');
      setCurrentScreen('login');
      showToast(t('lpBookServiceToast', 'Please log in as a customer to book services.'), 'info');
      return;
    }
    switchRole('customer');
    setCurrentScreen('search');
  };

  const handleImShramik = () => {
    if (!isLoggedIn) {
      setIntendedLoginRole('shramik');
      setCurrentScreen('login');
      showToast(t('lpShramikToast', 'Please log in as a Shramik or create a new Shramik profile.'), 'info');
      return;
    }
    switchRole('shramik');
    const shramik = shramiks.find(s => s.id === activeShramikId);
    if (shramik && shramik.verified) {
      setCurrentScreen('shramik_dashboard');
    } else {
      setCurrentScreen('shramik_signup');
    }
  };

  const handleOpenWorker = (workerId = '') => {
    if (!workerId) return;
    setSelectedWorkerId(workerId);
    if (!isLoggedIn) {
      setIntendedLoginRole('customer');
      setCurrentScreen('login');
      showToast(t('lpBookWorkerToast', 'Please log in as a customer to book this worker.'), 'info');
      return;
    }
    switchRole('customer');
    setCurrentScreen('profile');
  };

  return (
    <div className="min-h-screen text-slate-900 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-slate-900 text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#86efac_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t('lpBadge', 'Government Verified Skilled Worker Platform')}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight leading-tight">
              {t('lpTitle1', 'Trusted Services.')} <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-300 via-green-200 to-teal-300 bg-clip-text text-transparent">
                {t('lpTitle2', 'Verified Professionals.')}
              </span> <br />
              {t('lpTitle3', 'Right Around You.')}
            </h1>

            <p className="text-lg sm:text-xl text-emerald-100/90 max-w-2xl font-light leading-relaxed">
              {t('lpSubtitle', 'Find verified local skilled workers, book their services with transparent pricing, and track your service from start to finish using secure verification codes.')}
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={() => handleBookService('All')}
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-4 rounded-2xl shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center space-x-3 group"
              >
                <Search className="w-5 h-5 stroke-[2.5]" />
                <span className="text-base">{t('bookServiceBtn', 'Book a Service')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleImShramik}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-2xl border border-white/20 backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center space-x-3"
              >
                <UserCheck className="w-5 h-5 text-emerald-300" />
                <span className="text-base">{t('imShramik', "I'm a Shramik")}</span>
              </button>
            </div>

            <p className="text-xs text-emerald-200/70 pt-2 flex items-center justify-center lg:justify-start gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('lpEndToEnd', 'Full end-to-end secure booking flow with verified professionals.')}</span>
            </p>
          </div>

          {/* Right Column Hero Visual Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-white/10 p-4 rounded-3xl backdrop-blur-xl border border-white/20 shadow-2xl">
              <div className="relative rounded-2xl overflow-hidden shadow-lg group">
                <img 
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80" 
                  alt={t('altVerifiedWorker', 'Verified Skilled Worker')} 
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                
                {/* Floating Verified Worker Card Overlay */}
                <div 
                  onClick={() => handleOpenWorker('shr-1')}
                  className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl text-slate-900 shadow-xl border border-white cursor-pointer hover:bg-white hover:scale-[1.02] transition-all group/card"
                >
                  <div className="flex items-center space-x-3">
                    <img 
                      src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=100&auto=format&fit=crop&q=80" 
                      alt="Ramesh Kumar" 
                      className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <h4 className="font-bold text-slate-900 text-sm">{t('rameshKumar', 'Ramesh Kumar')}</h4>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {t('verified', 'Verified')}
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-bold group-hover/card:translate-x-1 transition-transform">{t('bookNow', 'Book Now')} →</span>
                      </div>
                      <p className="text-xs text-slate-600">{tSkill('Electrician')} • SS-10101</p>
                      <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                        <span className="flex items-center text-amber-500 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" /> 4.8
                        </span>
                        <span>• 120 {t('jobsDone', 'jobs')} • 2.1 km</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Trust Indicators Bar */}
      <section className="-mt-10 relative z-20 max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="pt-2 md:pt-0">
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-heading">500+</p>
            <p className="text-xs sm:text-sm font-medium text-slate-600 mt-1">{t('verifiedShramiks', 'Verified Shramiks')}</p>
          </div>

          <div className="pt-2 md:pt-0">
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-heading">50+</p>
            <p className="text-xs sm:text-sm font-medium text-slate-600 mt-1">{t('skilledServices', 'Skilled Services')}</p>
          </div>

          <div className="pt-4 md:pt-0">
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-heading">2K+</p>
            <p className="text-xs sm:text-sm font-medium text-slate-600 mt-1">{t('happyCustomers', 'Happy Customers')}</p>
          </div>

          <div className="pt-4 md:pt-0">
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-heading flex items-center justify-center gap-1">
              4.8 <Star className="w-6 h-6 fill-amber-400 text-amber-400 inline" />
            </p>
            <p className="text-xs sm:text-sm font-medium text-slate-600 mt-1">{t('averageRating', 'Average Rating')}</p>
          </div>
        </div>
      </section>

      {/* Popular Skilled Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
            {t('exploreServices', 'Explore Skilled Services')}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {t('exploreSub', 'Book verified local technicians with transparent hourly pricing and zero hidden fees.')}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 mt-10">
          {[
            { icon: Zap, rawSkill: 'Electrician', label: tSkill('Electrician'), count: `140+ ${t('workersCount', 'Workers')}`, color: 'bg-amber-500/10 text-amber-600' },
            { icon: Wrench, rawSkill: 'Plumber', label: tSkill('Plumber'), count: `95+ ${t('workersCount', 'Workers')}`, color: 'bg-blue-500/10 text-blue-600' },
            { icon: Hammer, rawSkill: 'Carpenter', label: tSkill('Carpenter'), count: `80+ ${t('workersCount', 'Workers')}`, color: 'bg-orange-500/10 text-orange-600' },
            { icon: Paintbrush, rawSkill: 'Painter', label: tSkill('Painter'), count: `110+ ${t('workersCount', 'Workers')}`, color: 'bg-purple-500/10 text-purple-600' },
            { icon: Truck, rawSkill: 'Mason', label: tSkill('Mason'), count: `65+ ${t('workersCount', 'Workers')}`, color: 'bg-emerald-500/10 text-emerald-600' },
            { icon: ShieldCheck, rawSkill: 'AC Repair', label: tSkill('AC Repair'), count: `75+ ${t('workersCount', 'Workers')}`, color: 'bg-teal-500/10 text-teal-600' }
          ].map((cat, idx) => (
            <div 
              key={idx}
              onClick={() => handleBookService(cat.rawSkill)}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer text-center group"
            >
              <div className={`w-12 h-12 mx-auto rounded-xl ${cat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <cat.icon className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">{cat.label}</h3>
              <p className="text-xs text-slate-500 mt-1">{cat.count}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Workflow Security Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white rounded-3xl border border-slate-200 shadow-xs my-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-emerald-600 text-xs font-bold uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {t('trustTransparency', 'Trust & Transparency First')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
            {t('protectionTitle', 'How Shram Setu Protects Customers & Shramiks')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t('adminVerification', 'Admin Verification')}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t('adminVerificationDesc', 'Every Shramik profile undergoes strict administrator review before receiving a green Verified badge and unique Shramik ID.')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t('startCodeSafety', '4-Digit Start Code Safety')}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t('startCodeSafetyDesc', 'A unique 4-digit code is generated upon booking. The Shramik can only begin the job after entering your code, ensuring work identity verification.')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t('securePaymentFlow', 'Secure Payment Flow')}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t('securePaymentFlowDesc', 'Clear price breakdown showing service fee and platform fee. Payment is processed only after the customer confirms work completion.')}
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
