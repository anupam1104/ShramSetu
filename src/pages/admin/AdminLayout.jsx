import React from 'react';
import { useApp } from '../../context/AppContext';
import { sameCity } from '../../lib/store';
import { 
  Shield, 
  Home, 
  UserCheck, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  CheckCircle2, 
  LogOut 
} from 'lucide-react';

export const AdminLayout = ({ children }) => {
  const { currentScreen, setCurrentScreen, shramiks, currentUser, logout, t, openSettings } = useApp();
  const adminCityLabel = currentUser?.city ? currentUser.city.split(' | ')[0] : 'Kolkata';
  const pendingCount = shramiks.filter(s => !s.verified && (!s.city || sameCity(s.city, currentUser?.city || 'Kolkata'))).length;

  const menuItems = [
    { id: 'admin_dashboard', label: t('admin.dashboard', 'Dashboard'), icon: Home },
    { id: 'admin_approvals', label: t('admin.pendingApprovals', 'Pending Approvals'), icon: UserCheck, badge: pendingCount },
    { id: 'admin_all_shramiks', label: t('admin.allShramiks', 'All Shramiks'), icon: Users },
    { id: 'admin_bookings', label: t('admin.bookings', 'Bookings'), icon: Calendar },
    { id: 'admin_reports', label: t('admin.reports', 'Reports'), icon: BarChart3 },
    { id: 'admin_settings', label: t('admin.settings', 'Settings'), icon: Settings }
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      
      {/* Desktop Sidebar Layout */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 p-4 sm:p-6 flex flex-col justify-between shrink-0 shadow-2xl">
        <div className="space-y-8">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base tracking-wide font-heading">SHRAM SETU</h2>
              <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                {t('admin.adminConsole', 'Admin Console')}
              </p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  currentScreen === item.id
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>

                {item.badge > 0 && (
                  <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-slate-800 px-2 space-y-3">
          <div className="text-xs">
            <p className="font-bold text-white">{t('auth.admin', 'Administrator')}</p>
            <p className="text-[11px] text-slate-500">{adminCityLabel} Operations</p>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center space-x-2 text-xs text-slate-400 hover:text-slate-200 transition-colors py-1.5 px-2 rounded-lg hover:bg-slate-800"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('admin.exitAdmin', 'Exit Admin View')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        {/* Settings Bar - available across all admin pages */}
        <div className="flex items-center justify-end mb-4">
          <button
            onClick={openSettings}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-900 bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 shadow-xs transition-all duration-200"
            title={t('settingsTitle', 'Settings')}
            aria-label="Settings"
          >
            <Settings className="w-4 h-4 text-slate-600 hover:text-emerald-600" />
            <span>{t('settings', 'Settings')}</span>
          </button>
        </div>
        {children}
      </main>

    </div>
  );
};
