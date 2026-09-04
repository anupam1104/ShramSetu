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
  ArrowRight,
  LogOut
} from 'lucide-react';

export const Navbar = () => {
  const { 
    role, 
    switchRole, 
    currentScreen, 
    setCurrentScreen, 
    activeShramikId, 
    shramiks, 
    setIntendedLoginRole,
    isLoggedIn,
    currentUser,
    logout
  } = useApp();
  const activeShramik = shramiks.find(s => s.id === activeShramikId);

  const handleBrandClick = () => {
    if (!isLoggedIn) {
      switchRole('landing');
      setCurrentScreen('landing');
    } else if (role === 'customer') {
      setCurrentScreen('search');
    } else if (role === 'shramik') {
      setCurrentScreen(activeShramik?.verified ? 'shramik_dashboard' : 'shramik_pending');
    } else if (role === 'admin') {
      setCurrentScreen('admin_dashboard');
    }
  };

  return (
    <>
      {/* Top Main Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo */}
            <div 
              onClick={handleBrandClick} 
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-green-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-200">
                <Shield className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xl font-bold font-heading text-slate-900 tracking-tight block leading-tight">
                  SHRAM SETU
                </span>
                <p className="text-[11px] text-slate-500 hidden sm:block font-body">
                  {!isLoggedIn && 'Trusted Skilled Services'}
                  {isLoggedIn && role === 'customer' && 'Customer Portal'}
                  {isLoggedIn && role === 'shramik' && 'Shramik Partner Portal'}
                  {isLoggedIn && role === 'admin' && 'Admin Operations Console'}
                </p>
              </div>
            </div>

            {/* Navigation links - Strictly isolated by role */}
            <div className="hidden md:flex items-center space-x-6">
              {!isLoggedIn && (
                <button 
                  onClick={() => { switchRole('landing'); setCurrentScreen('landing'); }}
                  className={`flex items-center space-x-2 text-sm font-medium transition-colors ${currentScreen === 'landing' ? 'text-emerald-600 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </button>
              )}

              {/* CUSTOMER PORTAL LINKS ONLY */}
              {isLoggedIn && role === 'customer' && (
                <>
                  <button 
                    onClick={() => setCurrentScreen('search')}
                    className={`flex items-center space-x-2 text-sm font-medium transition-colors ${currentScreen === 'search' || currentScreen === 'profile' || currentScreen === 'slot' || currentScreen === 'booking_confirm' ? 'text-emerald-700 font-bold border-b-2 border-emerald-600 pb-0.5' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    <Search className="w-4 h-4" />
                    <span>Find Workers</span>
                  </button>
                  <button 
                    onClick={() => setCurrentScreen('track_booking')}
                    className={`flex items-center space-x-2 text-sm font-medium transition-colors ${currentScreen === 'track_booking' || currentScreen === 'payment' ? 'text-emerald-700 font-bold border-b-2 border-emerald-600 pb-0.5' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>My Bookings</span>
                  </button>
                </>
              )}

              {/* SHRAMIK PORTAL LINKS ONLY */}
              {isLoggedIn && role === 'shramik' && (
                <>
                  <button 
                    onClick={() => setCurrentScreen(activeShramik?.verified ? 'shramik_dashboard' : 'shramik_pending')}
                    className={`flex items-center space-x-2 text-sm font-medium transition-colors ${currentScreen === 'shramik_dashboard' || currentScreen === 'shramik_pending' ? 'text-emerald-700 font-bold border-b-2 border-emerald-600 pb-0.5' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    <Home className="w-4 h-4" />
                    <span>My Dashboard</span>
                  </button>
                  <button 
                    onClick={() => setCurrentScreen('shramik_job')}
                    className={`flex items-center space-x-2 text-sm font-medium transition-colors ${currentScreen === 'shramik_job' ? 'text-emerald-700 font-bold border-b-2 border-emerald-600 pb-0.5' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Active Job</span>
                  </button>
                </>
              )}

              {/* ADMIN PORTAL LINKS ONLY */}
              {isLoggedIn && role === 'admin' && (
                <>
                  <button 
                    onClick={() => setCurrentScreen('admin_dashboard')}
                    className={`flex items-center space-x-2 text-sm font-medium transition-colors ${currentScreen === 'admin_dashboard' ? 'text-emerald-700 font-bold border-b-2 border-emerald-600 pb-0.5' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    <Home className="w-4 h-4" />
                    <span>Dashboard</span>
                  </button>
                  <button 
                    onClick={() => setCurrentScreen('admin_approvals')}
                    className={`flex items-center space-x-2 text-sm font-medium transition-colors ${currentScreen === 'admin_approvals' ? 'text-emerald-700 font-bold border-b-2 border-emerald-600 pb-0.5' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Pending Approvals</span>
                  </button>
                </>
              )}
            </div>

            {/* Right Side: Auth controls */}
            <div className="flex items-center space-x-3">
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={() => { setIntendedLoginRole('customer'); setCurrentScreen('login'); }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all duration-200 flex items-center space-x-1"
                  >
                    <span>Book a Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => { setIntendedLoginRole('customer'); setCurrentScreen('login'); }}
                    className="text-emerald-700 border border-emerald-300 hover:bg-emerald-50 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  {/* Current Active Portal Badge (NO multi-role switching) */}
                  {role === 'customer' && (
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/90">
                      <User className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Customer Portal</span>
                    </div>
                  )}

                  {role === 'shramik' && (
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200/90">
                      <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                      <span>Shramik Portal</span>
                    </div>
                  )}

                  {role === 'admin' && (
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 text-white border border-slate-700">
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Admin Portal</span>
                    </div>
                  )}

                  {/* User Profile Chip */}
                  <div className="flex items-center space-x-2 bg-slate-100/80 border border-slate-200/80 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-800">
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                      {currentUser?.name ? currentUser.name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="hidden md:inline font-mono">{currentUser?.name || 'User'}</span>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={logout}
                    className="text-slate-600 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-xl border border-slate-200/90 transition-colors text-xs flex items-center gap-1.5"
                    title="Log Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar - Strictly isolated by role */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-4 shadow-lg">
        <div className="flex justify-around items-center">
          {!isLoggedIn ? (
            <>
              <button 
                onClick={() => { switchRole('landing'); setCurrentScreen('landing'); }}
                className={`flex flex-col items-center gap-1 text-[11px] ${currentScreen === 'landing' ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
              <button 
                onClick={() => { setIntendedLoginRole('customer'); setCurrentScreen('login'); }}
                className={`flex flex-col items-center gap-1 text-[11px] ${currentScreen === 'login' ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            </>
          ) : (
            <>
              {role === 'customer' && (
                <>
                  <button 
                    onClick={() => setCurrentScreen('search')}
                    className={`flex flex-col items-center gap-1 text-[11px] ${currentScreen === 'search' || currentScreen === 'profile' || currentScreen === 'slot' || currentScreen === 'booking_confirm' ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}
                  >
                    <Search className="w-4 h-4" />
                    <span>Find Workers</span>
                  </button>
                  <button 
                    onClick={() => setCurrentScreen('track_booking')}
                    className={`flex flex-col items-center gap-1 text-[11px] ${currentScreen === 'track_booking' || currentScreen === 'payment' ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Bookings</span>
                  </button>
                  <button 
                    onClick={logout}
                    className="flex flex-col items-center gap-1 text-[11px] text-red-500 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              )}

              {role === 'shramik' && (
                <>
                  <button 
                    onClick={() => setCurrentScreen(activeShramik?.verified ? 'shramik_dashboard' : 'shramik_pending')}
                    className={`flex flex-col items-center gap-1 text-[11px] ${currentScreen === 'shramik_dashboard' || currentScreen === 'shramik_pending' ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}
                  >
                    <Home className="w-4 h-4" />
                    <span>Dashboard</span>
                  </button>
                  <button 
                    onClick={() => setCurrentScreen('shramik_job')}
                    className={`flex flex-col items-center gap-1 text-[11px] ${currentScreen === 'shramik_job' ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Active Job</span>
                  </button>
                  <button 
                    onClick={logout}
                    className="flex flex-col items-center gap-1 text-[11px] text-red-500 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              )}

              {role === 'admin' && (
                <>
                  <button 
                    onClick={() => setCurrentScreen('admin_dashboard')}
                    className={`flex flex-col items-center gap-1 text-[11px] ${currentScreen === 'admin_dashboard' ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}
                  >
                    <Home className="w-4 h-4" />
                    <span>Dashboard</span>
                  </button>
                  <button 
                    onClick={() => setCurrentScreen('admin_approvals')}
                    className={`flex flex-col items-center gap-1 text-[11px] ${currentScreen === 'admin_approvals' ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Approvals</span>
                  </button>
                  <button 
                    onClick={logout}
                    className="flex flex-col items-center gap-1 text-[11px] text-red-500 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </nav>
    </>
  );
};
