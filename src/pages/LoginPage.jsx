import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Phone, Lock, UserCheck, Briefcase, Sparkles, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const { switchRole, setCurrentScreen, showToast, setActiveShramikId, intendedLoginRole } = useApp();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [activeRoleTab, setActiveRoleTab] = useState(intendedLoginRole || 'customer'); // customer | shramik | admin

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!phoneNumber) {
      showToast('Please enter your phone number.', 'error');
      return;
    }
    showToast(`Logged in successfully as ${activeRoleTab.toUpperCase()}!`, 'success');
    switchRole(activeRoleTab);
    if (activeRoleTab === 'shramik') {
      setCurrentScreen('shramik_signup');
    }
  };

  const handleFillDemoCredentials = (roleType) => {
    setActiveRoleTab(roleType);
    if (roleType === 'customer') {
      setPhoneNumber('9988776655');
      setPassword('customer123');
      showToast('Customer demo credentials filled (Amit Sharma)', 'info');
    } else if (roleType === 'shramik') {
      setPhoneNumber('9876543210');
      setPassword('shramik123');
      setActiveShramikId('shr-1');
      showToast('Shramik demo credentials filled (Ramesh Kumar - Verified)', 'info');
    } else if (roleType === 'admin') {
      setPhoneNumber('9000000000');
      setPassword('admin123');
      showToast('Admin demo credentials filled (Shram Setu Official)', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side — Illustration & Brand Info */}
        <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-slate-900 text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#86efac_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Shield className="w-6 h-6 text-emerald-300" />
              </div>
              <span className="font-bold text-xl font-heading tracking-wide">SHRAM SETU</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-heading pt-6 text-emerald-100 leading-snug">
              Connecting Skilled Hands with Local Demand.
            </h2>

            <p className="text-sm text-emerald-100/80 leading-relaxed font-light">
              Simple, trustworthy, and transparent platform for Shramiks, Customers, and System Administrators.
            </p>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/10 mt-8 space-y-3">
            <div className="flex items-center space-x-2 text-xs text-emerald-300 font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>SIH Prototype Quick Action</span>
            </div>
            
            <p className="text-xs text-slate-300">
              Click below to pre-fill credentials for instant presentation review:
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleFillDemoCredentials('customer')}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all flex items-center space-x-1"
              >
                <span>👤 Demo Customer</span>
              </button>
              <button
                type="button"
                onClick={() => handleFillDemoCredentials('shramik')}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all flex items-center space-x-1"
              >
                <span>🛠️ Demo Shramik</span>
              </button>
              <button
                type="button"
                onClick={() => handleFillDemoCredentials('admin')}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all flex items-center space-x-1"
              >
                <span>🛡️ Demo Admin</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side — Login Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center space-y-6">
          
          <div>
            <h3 className="text-2xl font-bold font-heading text-slate-900">Welcome back</h3>
            <p className="text-sm text-slate-500 mt-1">Please enter your credentials to log in.</p>
          </div>

          {/* Role selector tab */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold">
            <button
              onClick={() => setActiveRoleTab('customer')}
              className={`flex-1 py-2 rounded-lg transition-all ${activeRoleTab === 'customer' ? 'bg-white text-emerald-700 shadow-xs border border-slate-200' : 'text-slate-600'}`}
            >
              Customer
            </button>
            <button
              onClick={() => setActiveRoleTab('shramik')}
              className={`flex-1 py-2 rounded-lg transition-all ${activeRoleTab === 'shramik' ? 'bg-white text-emerald-700 shadow-xs border border-slate-200' : 'text-slate-600'}`}
            >
              Shramik
            </button>
            <button
              onClick={() => setActiveRoleTab('admin')}
              className={`flex-1 py-2 rounded-lg transition-all ${activeRoleTab === 'admin' ? 'bg-white text-emerald-700 shadow-xs border border-slate-200' : 'text-slate-600'}`}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Enter 10-digit mobile number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm"
            >
              <span>Login as {activeRoleTab.toUpperCase()}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500 space-y-2">
            <p>
              Don't have a Shramik account?{' '}
              <button 
                onClick={() => { switchRole('shramik'); setCurrentScreen('shramik_signup'); }}
                className="text-emerald-700 font-bold hover:underline"
              >
                Register as Shramik
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
