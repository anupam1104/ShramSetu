import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import {
  Info,
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
} from 'lucide-react';

export const AdminSettings = () => {
  const { showToast, t } = useApp();

  // Platform Information state
  const [platformName, setPlatformName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [tagline, setTagline] = useState('');
  const [supportPhone, setSupportPhone] = useState('');

  // Notifications state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [approvalAlerts, setApprovalAlerts] = useState(true);
  const [autoApprove, setAutoApprove] = useState(false);
  const [dailySummary, setDailySummary] = useState(false);

  const handleSavePlatform = () => {
    showToast(t('admin.platformInfoSaved', 'Platform information saved successfully!'), 'success');
  };

  const handleSaveNotifications = () => {
    showToast(t('admin.notificationsSaved', 'Notification preferences saved successfully!'), 'success');
  };

  const handleSystemAction = (action) => {
    showToast(t('admin.actionInitiated', '{action} initiated...', { action }), 'info');
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

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-6xl mx-auto">

        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
            {t('admin.settings', 'Settings')}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {t('admin.settingsSubtitle', 'Manage platform preferences and system configurations')}
          </p>
        </div>

        {/* Platform Information */}
        <div>

          {/* Platform Information Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex items-center space-x-3 pb-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Info className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-slate-900 text-base font-heading">
                {t('admin.platformInformation', 'Platform Information')}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t('admin.platformName', 'Platform Name')}
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
                  {t('admin.adminEmail', 'Admin Contact Email')}
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
                  {t('admin.tagline', 'Tagline')}
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
                  {t('admin.supportPhone', 'Support Phone Number')}
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
                <span>{t('common.saveChanges', 'Save Changes')}</span>
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
              {t('admin.notificationsAndPreferences', 'Notifications & Preferences')}
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
                  <p className="text-sm font-bold text-slate-900">{t('admin.emailNotifications', 'Email Notifications')}</p>
                  <p className="text-[11px] text-slate-500">
                    {t('admin.emailNotificationsDesc', 'Receive important system notifications via email')}
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
                  <p className="text-sm font-bold text-slate-900">{t('admin.approvalAlerts', 'Approval Alerts')}</p>
                  <p className="text-[11px] text-slate-500">
                    {t('admin.approvalAlertsDesc', 'Get notified for new registrations and approvals')}
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
                  <p className="text-sm font-bold text-slate-900">{t('admin.autoApproveShramiks', 'Auto Approve Shramiks')}</p>
                  <p className="text-[11px] text-slate-500">
                    {t('admin.autoApproveShramiksDesc', 'Automatically approve verified Shramiks')}
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
                  <p className="text-sm font-bold text-slate-900">{t('admin.dailySummaryReport', 'Daily Summary Report')}</p>
                  <p className="text-[11px] text-slate-500">
                    {t('admin.dailySummaryReportDesc', 'Receive daily summary of platform activity')}
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
              <span>{t('common.saveChanges', 'Save Changes')}</span>
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
              {t('admin.systemDataManagement', 'System & Data Management')}
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
                  <p className="text-sm font-bold text-slate-900">{t('admin.systemLogs', 'System Logs')}</p>
                  <p className="text-[10px] text-slate-500">{t('admin.systemLogsDesc', 'View system activity logs')}</p>
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
                  <p className="text-sm font-bold text-slate-900">{t('admin.backupExport', 'Backup & Export')}</p>
                  <p className="text-[10px] text-slate-500">{t('admin.backupExportDesc', 'Backup and export data')}</p>
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
                  <p className="text-sm font-bold text-slate-900">{t('admin.clearCache', 'Clear Cache')}</p>
                  <p className="text-[10px] text-slate-500">{t('admin.clearCacheDesc', 'Clear system cache')}</p>
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
                  <p className="text-sm font-bold text-slate-900">{t('admin.dataRetention', 'Data Retention')}</p>
                  <p className="text-[10px] text-slate-500">{t('admin.dataRetentionDesc', 'Manage data retention policy')}</p>
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
