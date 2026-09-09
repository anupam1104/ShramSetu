import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Shield, 
  Search, 
  Briefcase, 
  UserCheck, 
  Home, 
  Calendar, 
  Key,
  User, 
  ArrowRight,
  LogOut,
  Menu,
  X,
  Settings,
  Wallet,
  CirclePercent,
  ReceiptIndianRupee,
  LifeBuoy
} from 'lucide-react';

const NavBtn = ({ active, onClick, icon: Icon, children }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full transition-all duration-200 ${
      active
        ? 'bg-emerald-600 text-white font-semibold shadow-sm'
        : 'text-slate-600 font-medium hover:bg-emerald-50 hover:text-emerald-700'
    }`}
  >
    <Icon className={`w-4 h-4 ${active ? 'text-emerald-200' : 'text-slate-400'}`} />
    {children}
  </button>
);

const NavDivider = () => <span className="w-px h-5 bg-slate-200 mx-1.5" />;

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
    logout,
    openSettings,
    t
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
      label: t('home', 'Home'),
      icon: Home,
      active: currentScreen === 'landing',
      onClick: () => { switchRole('landing'); navigate('landing'); }
    });
    mobileItems.push({
      label: t('signIn', 'Sign In'),
      icon: User,
      active: currentScreen === 'login',
      onClick: () => { setIntendedLoginRole('customer'); navigate('login'); }
    });
    mobileItems.push({
      label: t('settings', 'Settings'),
      icon: Settings,
      active: false,
      onClick: () => { closeMenu(); openSettings(); }
    });
  } else if (role === 'customer') {
    mobileItems.push({
      label: t('findWorkers', 'Find Workers'),
      icon: Search,
      active: ['search', 'profile', 'slot', 'booking_confirm'].includes(currentScreen),
      onClick: () => navigate('search')
    });
    mobileItems.push({
      label: t('myBookings', 'My Bookings'),
      icon: Calendar,
      active: ['track_booking', 'payment'].includes(currentScreen),
      onClick: () => navigate('track_booking')
    });
    mobileItems.push({
      label: t('startCodeNav', 'Start Code'),
      icon: Key,
      active: currentScreen === 'start_code',
      onClick: () => navigate('start_code')
    });
    mobileItems.push({
      label: t('settings', 'Settings'),
      icon: Settings,
      active: false,
      onClick: () => { closeMenu(); openSettings(); }
    });
    mobileItems.push({
      label: t('signOut', 'Logout'),
      icon: LogOut,
      danger: true,
      active: false,
      onClick: () => { closeMenu(); logout(); }
    });
  } else if (role === 'shramik') {
    mobileItems.push({
      label: t('myDashboard', 'Dashboard'),
      icon: Home,
      active: ['shramik_dashboard', 'shramik_pending', 'shramik_signup'].includes(currentScreen),
      onClick: () => navigate(activeShramik?.verified ? 'shramik_dashboard' : 'shramik_pending')
    });
    mobileItems.push({
      label: t('activeJob', 'Active Job'),
      icon: Briefcase,
      active: currentScreen === 'shramik_job',
      onClick: () => navigate('shramik_job')
    });
    mobileItems.push({
      label: t('earningsNav', 'Earnings'),
      icon: Wallet,
      active: currentScreen === 'shramik_earnings',
      onClick: () => navigate('shramik_earnings')
    });
    mobileItems.push({
      label: t('cutRatioNav', 'Cut Ratio'),
      icon: CirclePercent,
      active: currentScreen === 'shramik_cut_ratio',
      onClick: () => navigate('shramik_cut_ratio')
    });
    mobileItems.push({
      label: t('paymentsNav', 'Payments'),
      icon: ReceiptIndianRupee,
      active: currentScreen === 'shramik_payment_history',
      onClick: () => navigate('shramik_payment_history')
    });
    mobileItems.push({
      label: t('supportNav', 'Support'),
      icon: LifeBuoy,
      active: currentScreen === 'shramik_grievance',
      onClick: () => navigate('shramik_grievance')
    });
    mobileItems.push({
      label: t('settings', 'Settings'),
      icon: Settings,
      active: false,
      onClick: () => { closeMenu(); openSettings(); }
    });
    mobileItems.push({
      label: t('signOut', 'Logout'),
      icon: LogOut,
      danger: true,
      active: false,
      onClick: () => { closeMenu(); logout(); }
    });
  } else if (role === 'admin') {
    mobileItems.push({
      label: t('dashboard', 'Dashboard'),
      icon: Home,
      active: currentScreen === 'admin_dashboard',
      onClick: () => navigate('admin_dashboard')
    });
    mobileItems.push({
      label: t('pendingApprovals', 'Pending Approvals'),
      icon: UserCheck,
      active: currentScreen === 'admin_approvals',
      onClick: () => navigate('admin_approvals')
    });
    mobileItems.push({
      label: t('signOut', 'Logout'),
      icon: LogOut,
      danger: true,
      active: false,
      onClick: () => { closeMenu(); logout(); }
    });
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95  backdrop-blur-md border-b border-slate-200/90  shadow-xs relative transition-colors duration-300">
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
              <span className="text-base md:text-xl font-bold font-heading text-slate-900  tracking-tight block leading-tight">
                {t('brandName', 'SHRAM SETU')}
              </span>
              <p className="text-[10px] md:text-[11px] text-slate-500  hidden sm:block font-body">
                {!isLoggedIn && t('brandTagline', 'Trusted Skilled Services')}
                {isLoggedIn && role === 'customer' && t('customerPortal', 'Customer Portal')}
                {isLoggedIn && role === 'shramik' && t('shramikPortal', 'Shramik Partner Portal')}
                {isLoggedIn && role === 'admin' && t('adminPortal', 'Admin Operations Console')}
              </p>
            </div>
          </div>

          {/* Navigation links - Strictly isolated by role (desktop) */}
          <div className="hidden md:flex items-center gap-1">
            {!isLoggedIn && (
              <NavBtn
                icon={Home}
                active={currentScreen === 'landing'}
                onClick={() => { switchRole('landing'); setCurrentScreen('landing'); }}
              >
                {t('home', 'Home')}
              </NavBtn>
            )}

            {/* CUSTOMER PORTAL LINKS ONLY */}
            {isLoggedIn && role === 'customer' && (
              <>
                <NavBtn
                  icon={Search}
                  active={['search', 'profile', 'slot', 'booking_confirm'].includes(currentScreen)}
                  onClick={() => setCurrentScreen('search')}
                >
                  {t('findWorkers', 'Find Workers')}
                </NavBtn>
                <NavBtn
                  icon={Calendar}
                  active={['track_booking', 'payment'].includes(currentScreen)}
                  onClick={() => setCurrentScreen('track_booking')}
                >
                  {t('myBookings', 'My Bookings')}
                </NavBtn>
                <NavBtn
                  icon={Key}
                  active={currentScreen === 'start_code'}
                  onClick={() => setCurrentScreen('start_code')}
                >
                  {t('startCodeNav', 'Start Code')}
                </NavBtn>
              </>
            )}

            {/* SHRAMIK PORTAL LINKS ONLY */}
            {isLoggedIn && role === 'shramik' && (
              <>
                {/* Work group */}
                <NavBtn
                  icon={Home}
                  active={['shramik_dashboard', 'shramik_pending', 'shramik_signup'].includes(currentScreen)}
                  onClick={() => setCurrentScreen(activeShramik?.verified ? 'shramik_dashboard' : 'shramik_pending')}
                >
                  {t('myDashboard', 'Dashboard')}
                </NavBtn>
                <NavBtn
                  icon={Briefcase}
                  active={currentScreen === 'shramik_job'}
                  onClick={() => setCurrentScreen('shramik_job')}
                >
                  {t('activeJob', 'Active Job')}
                </NavBtn>

                {/* Finance group */}
                <NavDivider />
                <NavBtn
                  icon={Wallet}
                  active={currentScreen === 'shramik_earnings'}
                  onClick={() => setCurrentScreen('shramik_earnings')}
                >
                  {t('earningsNav', 'Earnings')}
                </NavBtn>
                <NavBtn
                  icon={CirclePercent}
                  active={currentScreen === 'shramik_cut_ratio'}
                  onClick={() => setCurrentScreen('shramik_cut_ratio')}
                >
                  {t('cutRatioNav', 'Cut Ratio')}
                </NavBtn>
                <NavBtn
                  icon={ReceiptIndianRupee}
                  active={currentScreen === 'shramik_payment_history'}
                  onClick={() => setCurrentScreen('shramik_payment_history')}
                >
                  {t('paymentsNav', 'Payments')}
                </NavBtn>

                {/* Support group */}
                <NavDivider />
                <NavBtn
                  icon={LifeBuoy}
                  active={currentScreen === 'shramik_grievance'}
                  onClick={() => setCurrentScreen('shramik_grievance')}
                >
                  {t('supportNav', 'Support')}
                </NavBtn>
              </>
            )}

            {/* ADMIN PORTAL LINKS ONLY */}
            {isLoggedIn && role === 'admin' && (
              <>
                <NavBtn
                  icon={Home}
                  active={currentScreen === 'admin_dashboard'}
                  onClick={() => setCurrentScreen('admin_dashboard')}
                >
                  {t('dashboard', 'Dashboard')}
                </NavBtn>
                <NavBtn
                  icon={UserCheck}
                  active={currentScreen === 'admin_approvals'}
                  onClick={() => setCurrentScreen('admin_approvals')}
                >
                  {t('pendingApprovals', 'Pending Approvals')}
                </NavBtn>
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
                  <span className="hidden sm:inline">{t('bookService', 'Book a Service')}</span>
                  <span className="sm:hidden">{t('bookShort', 'Book')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => { setIntendedLoginRole('customer'); setCurrentScreen('login'); }}
                  className="hidden sm:inline-flex items-center gap-1.5 text-emerald-700  border border-emerald-300  hover:bg-emerald-50  px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
                >
                  <span>{t('signIn', 'Sign In')}</span>
                </button>
                <button
                  onClick={openSettings}
                  className="p-2 text-slate-600  hover:text-emerald-700  border border-slate-200  hover:border-emerald-300  hover:bg-emerald-50  rounded-xl transition-all duration-200 flex items-center justify-center"
                  title={t('settingsTitle', 'Settings')}
                  aria-label="Settings"
                >
                  <Settings className="w-4 h-4 text-slate-600  hover:text-emerald-600 " />
                </button>
              </>
            ) : (
              <>
                {/* Current Active Portal Badge - desktop only */}
                {role === 'customer' && (
                  <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/90">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t('customerPortal', 'Customer Portal')}</span>
                  </div>
                )}

                {role === 'shramik' && (
                  <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200/90">
                    <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t('shramikPortal', 'Shramik Portal')}</span>
                  </div>
                )}

                {role === 'admin' && (
                  <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 text-white border border-slate-700">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t('adminPortal', 'Admin Portal')}</span>
                  </div>
                )}

                {/* User Profile Chip */}
                <div className="flex items-center space-x-2 bg-slate-100/80 border border-slate-200/80 px-2.5 md:px-3 py-1.5 rounded-lg md:rounded-xl text-xs font-semibold text-slate-800">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {currentUser?.name ? currentUser.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden xl:inline font-mono">{currentUser?.name || t('user', 'User')}</span>
                </div>

                {/* Settings Button - available on all logged-in portal pages */}
                <button
                  onClick={openSettings}
                  className="p-2 text-slate-600 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 rounded-xl transition-all duration-200 flex items-center justify-center"
                  title={t('settingsTitle', 'Settings')}
                  aria-label="Settings"
                >
                  <Settings className="w-4 h-4 text-slate-600 hover:text-emerald-600" />
                </button>

                {/* Logout Button - desktop only (mobile has it in the menu) */}
                <button
                  onClick={logout}
                  className="hidden md:flex items-center space-x-1.5 text-xs text-slate-600 hover:text-red-600 py-1.5 px-2.5 rounded-lg border border-slate-200 hover:border-red-200 hover:bg-red-50/50 transition-colors"
                  title={t('signOut', 'Logout')}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">{t('signOut', 'Logout')}</span>
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
                  <p className="font-bold text-sm text-slate-900 truncate">{currentUser?.name || t('user', 'User')}</p>
                  <p className="text-[11px] text-slate-500 capitalize">
                    {role === 'admin' ? t('adminPortal', 'Admin Operations Console') : role === 'shramik' ? t('shramikPortal', 'Shramik Partner Portal') : t('customerPortal', 'Customer Portal')}
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
