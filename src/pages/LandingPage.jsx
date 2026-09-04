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
  const { switchRole, setCurrentScreen, setIntendedLoginRole } = useApp();

  const handleBookService = () => {
    setIntendedLoginRole('customer');
    switchRole('landing');
    setCurrentScreen('login');
  };

  const handleImShramik = () => {
    setIntendedLoginRole('shramik');
    switchRole('landing');
    setCurrentScreen('login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-slate-900 text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#86efac_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>SIH Prototype • Government Skilled Worker Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight leading-tight">
              Trusted Services. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-300 via-green-200 to-teal-300 bg-clip-text text-transparent">
                Verified Professionals.
              </span> <br />
              Right Around You.
            </h1>

            <p className="text-lg sm:text-xl text-emerald-100/90 max-w-2xl font-light leading-relaxed">
              Find verified local skilled workers, book their services with transparent pricing, and track your service from start to finish using secure verification codes.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={handleBookService}
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-4 rounded-2xl shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center space-x-3 group"
              >
                <Search className="w-5 h-5 stroke-[2.5]" />
                <span className="text-base">Book a Service</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleImShramik}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-2xl border border-white/20 backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center space-x-3"
              >
                <UserCheck className="w-5 h-5 text-emerald-300" />
                <span className="text-base">I'm a Shramik</span>
              </button>
            </div>

            {/* Quick Demo Fill hint */}
            <p className="text-xs text-emerald-200/70 pt-2 flex items-center justify-center lg:justify-start gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Full end-to-end interactive simulation ready for SIH evaluation.</span>
            </p>
          </div>

          {/* Right Column Hero Visual Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-white/10 p-4 rounded-3xl backdrop-blur-xl border border-white/20 shadow-2xl">
              <div className="relative rounded-2xl overflow-hidden shadow-lg group">
                <img 
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80" 
                  alt="Verified Skilled Worker" 
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                
                {/* Floating Verified Worker Card Overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl text-slate-900 shadow-xl border border-white">
                  <div className="flex items-center space-x-3">
                    <img 
                      src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=100&auto=format&fit=crop&q=80" 
                      alt="Ramesh Kumar" 
                      className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h4 className="font-bold text-slate-900 text-sm">Ramesh Kumar</h4>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">Master Electrician • SS-10101</p>
                      <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                        <span className="flex items-center text-amber-500 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" /> 4.8
                        </span>
                        <span>• 120 jobs done</span>
                        <span>• 2.1 km away</span>
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
            <p className="text-xs sm:text-sm font-medium text-slate-600 mt-1">Verified Shramiks</p>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mt-0.5">(Demo Label)</span>
          </div>

          <div className="pt-2 md:pt-0">
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-heading">50+</p>
            <p className="text-xs sm:text-sm font-medium text-slate-600 mt-1">Skilled Services</p>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mt-0.5">(Demo Label)</span>
          </div>

          <div className="pt-4 md:pt-0">
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-heading">2K+</p>
            <p className="text-xs sm:text-sm font-medium text-slate-600 mt-1">Happy Customers</p>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mt-0.5">(Demo Label)</span>
          </div>

          <div className="pt-4 md:pt-0">
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-heading flex items-center justify-center gap-1">
              4.8 <Star className="w-6 h-6 fill-amber-400 text-amber-400 inline" />
            </p>
            <p className="text-xs sm:text-sm font-medium text-slate-600 mt-1">Average Rating</p>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mt-0.5">(Demo Label)</span>
          </div>
        </div>
      </section>

      {/* Popular Skilled Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
            Explore Skilled Services
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Book verified local technicians with transparent hourly pricing and zero hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 mt-10">
          {[
            { icon: Zap, label: 'Electrician', count: '140+ Workers', color: 'bg-amber-500/10 text-amber-600' },
            { icon: Wrench, label: 'Plumber', count: '95+ Workers', color: 'bg-blue-500/10 text-blue-600' },
            { icon: Hammer, label: 'Carpenter', count: '80+ Workers', color: 'bg-orange-500/10 text-orange-600' },
            { icon: Paintbrush, label: 'Painter', count: '110+ Workers', color: 'bg-purple-500/10 text-purple-600' },
            { icon: Truck, label: 'Masonry', count: '65+ Workers', color: 'bg-emerald-500/10 text-emerald-600' },
            { icon: ShieldCheck, label: 'AC Repair', count: '75+ Workers', color: 'bg-teal-500/10 text-teal-600' }
          ].map((cat, idx) => (
            <div 
              key={idx}
              onClick={handleBookService}
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
            Trust & Transparency First
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
            How Shram Setu Protects Customers & Shramiks
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900">Admin Verification</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every Shramik profile undergoes strict administrator review before receiving a green <strong>✓ Verified</strong> badge and unique Shramik ID (`SS-XXXXXX`).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900">4-Digit Start Code Safety</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              A unique 4-digit code is generated upon booking. The Shramik can only begin the job after entering your code, ensuring work identity verification.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900">Transparent Demo Payment</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Clear price breakdown showing service fee and platform fee. Payment is processed only after the customer confirms work completion.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
