import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import {
  Info,
  Palette,
  Bell,
  Mail,
  ShieldCheck,
  Users,
  FileBarChart,
  Settings,
  Save,
  FileText,
  Download,
  Trash2,
  Database,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';

export const AdminSettings = () => {
  const { showToast } = useApp();

  // Platform Information state
  const [platformName, setPlatformName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [tagline, setTagline] = useState('');
  const [supportPhone, setSupportPhone] = useState('');

  // Appearance state
  const [themeMode, setThemeMode] = useState('light');

  // Notifications state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [approvalAlerts, setApprovalAlerts] = useState(true);
  const [autoApprove, setAutoApprove] = useState(false);
  const [dailySummary, setDailySummary] = useState(false);

  const handleSavePlatform = () => {
    showToast('Platform information saved successfully!', 'success');
  };

  const handleSaveAppearance = () => {
    showToast('Appearance settings saved successfully!', 'success');
  };

  const handleSaveNotifications = () => {
    showToast('Notification preferences saved successfully!', 'success');
  };

  const handleSystemAction = (action) => {
    showToast(`${action} initiated...`, 'info');
  };

  // Toggle switch component
  const ToggleSwitch = ({ enabled, onChange, id }) => (
    <button
      id={id}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
        enabled ? 'bg-emerald-500' : 'bg-slate-300'
      }`}
      role="switch"
      aria-checked={enabled}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  // Theme mode icon
  const ThemeIcon = () => {
    if (themeMode === 'light') return <Sun className="w-4 h-4 text-amber-500" />;
    if (themeMode === 'dark') return <Moon className="w-4 h-4 text-slate-400" />;
    return <Monitor className="w-4 h-4 text-blue-500" />;
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-6xl mx-auto">

        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
            Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage platform preferences and system configurations
          </p>
        </div>

        {/* Top Row: Platform Information + Appearance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Platform Information Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex items-center space-x-3 pb-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Info className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-slate-900 text-base font-heading">
                Platform Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Platform Name
                </label>
                <input
                  id="settings-platform-name"
                  type="text"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  placeholder="e.g. Shram Setu"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 font-medium placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Admin Contact Email
                </label>
                <input
                  id="settings-admin-email"
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="e.g. admin@shramsetu.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 font-medium placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Tagline
                </label>
                <input
                  id="settings-tagline"
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Bridging Skills. Building Bharat."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 font-medium placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Support Phone Number
                </label>
                <input
                  id="settings-support-phone"
                  type="text"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 font-medium placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div className="flex justify-center pt-1">
              <button
                id="settings-save-platform"
                onClick={handleSavePlatform}
                className="bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center space-x-2 hover:shadow-md"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>

          {/* Appearance Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex items-center space-x-3 pb-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Palette className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-slate-900 text-base font-heading">
                Appearance
              </h2>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Theme Mode
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ThemeIcon />
                </div>
                <select
                  id="settings-theme-mode"
                  value={themeMode}
                  onChange={(e) => setThemeMode(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="light">Light Mode</option>
                  <option value="dark">Dark Mode</option>
                </select>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Choose the default theme for the admin console
              </p>
            </div>

            <div className="flex justify-end pt-1">
              <button
                id="settings-save-appearance"
                onClick={handleSaveAppearance}
                className="bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center space-x-2 hover:shadow-md"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Notifications & Preferences Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center space-x-3 pb-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-slate-900 text-base font-heading">
              Notifications & Preferences
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            {/* Email Notifications */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Email Notifications</p>
                  <p className="text-[11px] text-slate-500">
                    Receive important system notifications via email
                  </p>
                </div>
              </div>
              <ToggleSwitch
                id="settings-toggle-email"
                enabled={emailNotifications}
                onChange={setEmailNotifications}
              />
            </div>

            {/* Approval Alerts */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Approval Alerts</p>
                  <p className="text-[11px] text-slate-500">
                    Get notified for new registrations and approvals
                  </p>
                </div>
              </div>
              <ToggleSwitch
                id="settings-toggle-approvals"
                enabled={approvalAlerts}
                onChange={setApprovalAlerts}
              />
            </div>

            {/* Auto Approve Shramiks */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Auto Approve Shramiks</p>
                  <p className="text-[11px] text-slate-500">
                    Automatically approve verified Shramiks
                  </p>
                </div>
              </div>
              <ToggleSwitch
                id="settings-toggle-auto-approve"
                enabled={autoApprove}
                onChange={setAutoApprove}
              />
            </div>

            {/* Daily Summary Report */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <FileBarChart className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Daily Summary Report</p>
                  <p className="text-[11px] text-slate-500">
                    Receive daily summary of platform activity
                  </p>
                </div>
              </div>
              <ToggleSwitch
                id="settings-toggle-daily-summary"
                enabled={dailySummary}
                onChange={setDailySummary}
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              id="settings-save-notifications"
              onClick={handleSaveNotifications}
              className="bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center space-x-2 hover:shadow-md"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        {/* System & Data Management Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center space-x-3 pb-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-slate-900 text-base font-heading">
              System & Data Management
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* System Logs */}
            <button
              id="settings-system-logs"
              onClick={() => handleSystemAction('System Logs export')}
              className="group flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-emerald-300 hover:shadow-md transition-all text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">System Logs</p>
                  <p className="text-[10px] text-slate-500">View system activity logs</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
            </button>

            {/* Backup & Export */}
            <button
              id="settings-backup-export"
              onClick={() => handleSystemAction('Backup & Export')}
              className="group flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-emerald-300 hover:shadow-md transition-all text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Backup & Export</p>
                  <p className="text-[10px] text-slate-500">Backup and export data</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
            </button>

            {/* Clear Cache */}
            <button
              id="settings-clear-cache"
              onClick={() => handleSystemAction('Cache clearing')}
              className="group flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-red-300 hover:shadow-md transition-all text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Clear Cache</p>
                  <p className="text-[10px] text-slate-500">Clear system cache</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-red-500 transition-colors" />
            </button>

            {/* Data Retention */}
            <button
              id="settings-data-retention"
              onClick={() => handleSystemAction('Data Retention policy update')}
              className="group flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-emerald-300 hover:shadow-md transition-all text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Data Retention</p>
                  <p className="text-[10px] text-slate-500">Manage data retention policy</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
            </button>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};
