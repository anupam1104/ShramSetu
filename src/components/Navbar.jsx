import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Shield, 
  Search, 
  Briefcase, 
  UserCheck, 
  Home, 
  Calendar, 
  User, 
  ChevronDown, 
  Sparkles,
  ArrowRight,
  Menu,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const Navbar = () => {
  const { role, switchRole, currentScreen, setCurrentScreen, activeShramikId, shramiks, setIntendedLoginRole } = useApp();
  const activeShramik = shramiks.find(s => s.id === activeShramikId);

  return (
    <>
      {/* Top Main Navigation */}
      <header className="sticky top-[42px] z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo */}
            <div 
              onClick={() => switchRole('landing')} 
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
                <Shield className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xl font-bold font-heading text-slate-900 tracking-tight flex items-center gap-1.5">
                  SHRAM SETU
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    SIH Demo
                  </span>
                </span>
                <p className="text-xs text-slate-500 hidden sm:block">Trusted Skilled Services</p>
              </div>
            </div>

            {/* Navigation links based on active role */}
            <div className="hidden md:flex items-center space-x-6">
              {role === 'customer' && (
                <>
                  <button 
                    onClick={() => setCurrentScreen('search')}
                    className={`flex items-center space-x-2 text-sm font-medium transition-colors ${currentScreen === 'search' || currentScreen === 'profile' ? 'text-emerald-600 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    <Search className="w-4 h-4" />
                    <span>Find Workers</span>
                  </button>
                  <button 
                    onClick={() => setCurrentScreen('track_booking')}
                    className={`flex items-center space-x-2 text-sm font-medium transition-colors ${currentScreen === 'track_booking' || currentScreen === 'payment' ? 'text-emerald-600 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>My Bookings</span>
                  </button>
                </>
              )}

              {role === 'shramik' && (
                <>
                  <button 
                    onClick={() => setCurrentScreen(activeShramik?.verified ? 'shramik_dashboard' : 'shramik_pending')}
                    className={`flex items-center space-x-2 text-sm font-medium transition-colors ${currentScreen === 'shramik_dashboard' || currentScreen === 'shramik_pending' ? 'text-emerald-600 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    <Home className="w-4 h-4" />
                    <span>My Dashboard</span>
                  </button>
                  <button 
                    onClick={() => setCurrentScreen('shramik_job')}
                    className={`flex items-center space-x-2 text-sm font-medium transition-colors ${currentScreen === 'shramik_job' ? 'text-emerald-600 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Active Job</span>
                  </button>
                </>
              )}

              {role === 'admin' && (
                <>
                  <button 
                    onClick={() => setCurrentScreen('admin_dashboard')}
                    className={`flex items-center space-x-2 text-sm font-medium transition-colors ${currentScreen === 'admin_dashboard' ? 'text-emerald-600 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    <Home className="w-4 h-4" />
                    <span>Dashboard</span>
                  </button>
                  <button 
                    onClick={() => setCurrentScreen('admin_approvals')}
                    className={`flex items-center space-x-2 text-sm font-medium transition-colors ${currentScreen === 'admin_approvals' ? 'text-emerald-600 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Pending Approvals</span>
                  </button>
                </>
              )}
            </div>

            {/* Quick Role Switcher Pill */}
            <div className="flex items-center space-x-3">
              <div className="relative bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
                <button
                  onClick={() => switchRole('customer')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${role === 'customer' ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/60' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <User className="w-3.5 h-3.5" />
                  Customer
                </button>
                <button
                  onClick={() => switchRole('shramik')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${role === 'shramik' ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/60' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  Shramik
                </button>
                <button
                  onClick={() => switchRole('admin')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${role === 'admin' ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/60' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin
                </button>
              </div>

              {role === 'landing' && (
                <>
                  <button
                    onClick={() => switchRole('customer')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition-all duration-200 flex items-center space-x-1"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { setIntendedLoginRole('customer'); setCurrentScreen('login'); }}
                    className="text-emerald-700 border border-emerald-300 hover:bg-emerald-50 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                  >
                    Login
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 py-2 px-4 shadow-lg">
        <div className="flex justify-around items-center">
          {role === 'customer' && (
            <>
              <button 
                onClick={() => setCurrentScreen('search')}
                className={`flex flex-col items-center gap-1 text-xs ${currentScreen === 'search' ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}
              >
                <Search className="w-5 h-5" />
                <span>Search</span>
              </button>
              <button 
                onClick={() => setCurrentScreen('track_booking')}
                className={`flex flex-col items-center gap-1 text-xs ${currentScreen === 'track_booking' ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}
              >
                <Calendar className="w-5 h-5" />
                <span>Bookings</span>
              </button>
              <button 
                onClick={() => switchRole('landing')}
                className={`flex flex-col items-center gap-1 text-xs ${currentScreen === 'landing' ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </button>
            </>
          )}

          {role === 'shramik' && (
            <>
              <button 
                onClick={() => setCurrentScreen('shramik_dashboard')}
                className={`flex flex-col items-center gap-1 text-xs ${currentScreen === 'shramik_dashboard' ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}
              >
                <Home className="w-5 h-5" />
                <span>Jobs</span>
              </button>
              <button 
                onClick={() => setCurrentScreen('shramik_job')}
                className={`flex flex-col items-center gap-1 text-xs ${currentScreen === 'shramik_job' ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}
              >
                <Briefcase className="w-5 h-5" />
                <span>Active Job</span>
              </button>
              <button 
                onClick={() => setCurrentScreen('shramik_pending')}
                className={`flex flex-col items-center gap-1 text-xs ${currentScreen === 'shramik_pending' ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}
              >
                <UserCheck className="w-5 h-5" />
                <span>Status</span>
              </button>
            </>
          )}

          {role === 'admin' && (
            <>
              <button 
                onClick={() => setCurrentScreen('admin_dashboard')}
                className={`flex flex-col items-center gap-1 text-xs ${currentScreen === 'admin_dashboard' ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}
              >
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
              <button 
                onClick={() => setCurrentScreen('admin_approvals')}
                className={`flex flex-col items-center gap-1 text-xs ${currentScreen === 'admin_approvals' ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}
              >
                <UserCheck className="w-5 h-5" />
                <span>Approvals</span>
              </button>
            </>
          )}
        </div>
      </nav>
    </>
  );
};
