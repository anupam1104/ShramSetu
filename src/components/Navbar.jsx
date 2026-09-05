import React, { useState } from 'react';
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
  LogOut,
  Menu,
  X
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMenu = () => setMobileOpen(false);

  const navigate = (screen) => {
    setCurrentScreen(screen);
    closeMenu();
  };

  const handleBrandClick = () => {
    if (!isLoggedIn) {
      switchRole('landing');
      navigate('landing');
    } else if (role === 'customer') {
      navigate('search');
    } else if (role === 'shramik') {
      navigate(activeShramik?.verified ? 'shramik_dashboard' : 'shramik_pending');
    } else if (role === 'admin') {
      navigate('admin_dashboard');
    }
  };

  /* Build the role-isolated mobile menu items */
  const mobileItems = [];
  if (!isLoggedIn) {
    mobileItems.push({
      label: 'Home',
      icon: Home,
      active: currentScreen === 'landing',
      onClick: () => { switchRole('landing'); navigate('landing'); }
    });
    mobileItems.push({
      label: 'Sign In',
      icon: User,
      active: currentScreen === 'login',
      onClick: () => { setIntendedLoginRole('customer'); navigate('login'); }
    });
  } else if (role === 'customer') {
    mobileItems.push({
      label: 'Find Workers',
      icon: Search,
      active: ['search', 'profile', 'slot', 'booking_confirm'].includes(currentScreen),
      onClick: () => navigate('search')
    });
    mobileItems.push({
      label: 'My Bookings',
      icon: Calendar,
      active: ['track_booking', 'payment'].includes(currentScreen),
      onClick: () => navigate('track_booking')
    });
    mobileItems.push({
      label: 'Logout',
      icon: LogOut,
      danger: true,
      active: false,
      onClick: () => { closeMenu(); logout(); }
    });
  } else if (role === 'shramik') {
    mobileItems.push({
      label: 'Dashboard',
      icon: Home,
      active: ['shramik_dashboard', 'shramik_pending', 'shramik_signup'].includes(currentScreen),
      onClick: () => navigate(activeShramik?.verified ? 'shramik_dashboard' : 'shramik_pending')
    });
    mobileItems.push({
      label: 'Active Job',
      icon: Briefcase,
      active: currentScreen === 'shramik_job',
      onClick: () => navigate('shramik_job')
    });
    mobileItems.push({
      label: 'Logout',
      icon: LogOut,
      danger: true,
      active: false,
      onClick: () => { closeMenu(); logout(); }
    });
  } else if (role === 'admin') {
    mobileItems.push({
      label: 'Dashboard',
      icon: Home,
      active: currentScreen === 'admin_dashboard',
      onClick: () => navigate('admin_dashboard')
    });
    mobileItems.push({
      label: 'Pending Approvals',
      icon: UserCheck,
      active: currentScreen === 'admin_approvals',
      onClick: () => navigate('admin_approvals')
    });
    mobileItems.push({
      label: 'Logout',
      icon: LogOut,
      danger: true,
      active: false,
      onClick: () => { closeMenu(); logout(); }
    });
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 md:h-16">
          
          {/* Brand Logo (smaller on mobile) */}
          <div 
            onClick={handleBrandClick} 
            className="flex items-center space-x-2 md:space-x-3 cursor-pointer group"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-green-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-200">
              <Shield className="w-5 h-5 md:w-6 md:h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-base md:text-xl font-bold font-heading text-slate-900 tracking-tight block leading-tight">
                SHRAM SETU
              </span>
              <p className="text-[10px] md:text-[11px] text-slate-500 hidden sm:block font-body">
                {!isLoggedIn && 'Trusted Skilled Services'}
                {isLoggedIn && role === 'customer' && 'Customer Portal'}
                {isLoggedIn && role === 'shramik' && 'Shramik Partner Portal'}
                {isLoggedIn && role === 'admin' && 'Admin Operations Console'}
              </p>
            </div>
          </div>

          {/* Navigation links - Strictly isolated by role (desktop) */}
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
          <div className="flex items-center space-x-2 md:space-x-3">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => { setIntendedLoginRole('customer'); setCurrentScreen('login'); }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-xs font-semibold shadow-xs transition-all duration-200 flex items-center space-x-1"
                >
                  <span className="hidden sm:inline">Book a Service</span>
                  <span className="sm:hidden">Book</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => { setIntendedLoginRole('customer'); setCurrentScreen('login'); }}
                  className="hidden sm:inline-flex text-emerald-700 border border-emerald-300 hover:bg-emerald-50 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                {/* Current Active Portal Badge - desktop only */}
                {role === 'customer' && (
                  <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/90">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Customer Portal</span>
                  </div>
                )}

                {role === 'shramik' && (
                  <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200/90">
                    <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                    <span>Shramik Portal</span>
                  </div>
                )}

                {role === 'admin' && (
                  <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 text-white border border-slate-700">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Admin Portal</span>
                  </div>
                )}

                {/* User Profile Chip */}
                <div className="flex items-center space-x-2 bg-slate-100/80 border border-slate-200/80 px-2.5 md:px-3 py-1.5 rounded-lg md:rounded-xl text-xs font-semibold text-slate-800">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {currentUser?.name ? currentUser.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden md:inline font-mono">{currentUser?.name || 'User'}</span>
                </div>

                {/* Logout Button - desktop only (mobile has it in the menu) */}
                <button
                  onClick={logout}
                  className="hidden md:flex text-slate-600 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-xl border border-slate-200/90 transition-colors text-xs flex items-center gap-1.5"
                  title="Log Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </>
            )}

            {/* Hamburger toggle (mobile only) */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu (under the navbar) */}
      {mobileOpen && (
        <nav className="md:hidden absolute top-full left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-lg">
          <div className="px-3 py-2 space-y-1">
            {/* Signed-in user info header */}
            {isLoggedIn && (
              <div className="px-3 py-2.5 mb-1 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold">
                  {currentUser?.name ? currentUser.name[0].toUpperCase() : 'U'}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-slate-900 truncate">{currentUser?.name || 'User'}</p>
                  <p className="text-[11px] text-slate-500 capitalize">
                    {role} {role === 'admin' ? 'Operations Console' : role === 'shramik' ? 'Partner Portal' : 'Portal'}
                  </p>
                </div>
              </div>
            )}

            {mobileItems.map((item, idx) => (
              <button
                key={idx}
                onClick={item.onClick}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  item.danger
                    ? 'text-red-600 hover:bg-red-50'
                    : item.active
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <item.icon className={`w-4 h-4 shrink-0 ${item.danger ? 'text-red-500' : ''}`} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};
