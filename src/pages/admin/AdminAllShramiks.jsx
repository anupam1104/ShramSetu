import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import { 
  Users, 
  ShieldCheck, 
  Clock, 
  UserX,
  Search, 
  Eye, 
  MoreVertical, 
  CheckCircle2, 
  X,
  Filter, 
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Star,
  Trash2,
  UserCheck
} from 'lucide-react';

export const AdminAllShramiks = () => {
  const { 
    shramiks, 
    setShramiks,
    approveShramik, 
    toggleShramikStatus,
    deleteShramik,
    showToast, 
    t, 
    tSkill 
  } = useApp();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals & Menu States
  const [selectedWorkerDetails, setSelectedWorkerDetails] = useState(null);
  const [activeActionMenuId, setActiveActionMenuId] = useState(null);

  // Helper to determine status string for a shramik
  const getWorkerStatus = (worker) => {
    if (worker.isActive === false || worker.status === 'Inactive') return 'Inactive';
    if (worker.verified || worker.status === 'Verified') return 'Verified';
    return 'Pending';
  };

  // Helper to get formatted registration date
  const getRegisteredDate = (worker) => {
    // Works with a ready-to-show string OR an ISO timestamp, from local seed
    // data, a new registration, or a server row (created_at / registered_on).
    const raw = worker.registeredOn || worker.registered_on || worker.createdAt || worker.created_at;
    if (raw) {
      const d = new Date(raw);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      }
      if (typeof raw === 'string') return raw;
    }
    return '—';
  };

  // KPI Metric Calculations from real data
  const totalCount = shramiks.length;
  const verifiedCount = shramiks.filter(s => getWorkerStatus(s) === 'Verified').length;
  const pendingCount = shramiks.filter(s => getWorkerStatus(s) === 'Pending').length;
  const inactiveCount = shramiks.filter(s => getWorkerStatus(s) === 'Inactive').length;

  // Extract unique filter options from real data
  const uniqueSkills = useMemo(() => {
    const skills = new Set();
    shramiks.forEach(s => {
      if (s.skill) skills.add(s.skill);
    });
    return Array.from(skills).sort();
  }, [shramiks]);

  const uniqueLocations = useMemo(() => {
    const locs = new Set();
    shramiks.forEach(s => {
      const loc = s.area && s.city ? `${s.area}, ${s.city}` : (s.city || s.area);
      if (loc) locs.add(loc);
    });
    return Array.from(locs).sort();
  }, [shramiks]);

  // Filtered Shramiks based on user input
  const filteredShramiks = useMemo(() => {
    return shramiks.filter(worker => {
      const status = getWorkerStatus(worker);
      const location = worker.area && worker.city ? `${worker.area}, ${worker.city}` : (worker.city || worker.area || '');

      // Search Query filter (matches name, skill, phone, or shramikId)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (worker.name || '').toLowerCase().includes(q);
        const matchesSkill = (worker.skill || '').toLowerCase().includes(q);
        const matchesId = (worker.shramikId || '').toLowerCase().includes(q) || (worker.id || '').toLowerCase().includes(q);
        const matchesPhone = (worker.phone || '').toLowerCase().includes(q);
        const matchesLocation = location.toLowerCase().includes(q);
        if (!matchesName && !matchesSkill && !matchesId && !matchesPhone && !matchesLocation) {
          return false;
        }
      }

      // Skill filter
      if (selectedSkill !== 'All' && worker.skill !== selectedSkill) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'All' && status !== selectedStatus) {
        return false;
      }

      // Location filter
      if (selectedLocation !== 'All' && !location.includes(selectedLocation)) {
        return false;
      }

      return true;
    });
  }, [shramiks, searchQuery, selectedSkill, selectedStatus, selectedLocation]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredShramiks.length / itemsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const paginatedShramiks = filteredShramiks.slice(startIndex, startIndex + itemsPerPage);

  // Toggle Action Menu
  const handleToggleMenu = (e, workerId) => {
    e.stopPropagation();
    setActiveActionMenuId(prev => (prev === workerId ? null : workerId));
  };

  // Close menus on outside click
  React.useEffect(() => {
    const handleClickOutside = () => setActiveActionMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Handle Toggle Active/Inactive
  const handleToggleStatus = (worker) => {
    const currentStatus = getWorkerStatus(worker);
    const newStatus = currentStatus === 'Inactive' ? 'Verified' : 'Inactive';
    const isNowActive = newStatus !== 'Inactive';

    if (toggleShramikStatus) {
      toggleShramikStatus(worker.id);
    } else if (setShramiks) {
      setShramiks(prev => prev.map(s => s.id === worker.id ? { ...s, isActive: isNowActive, status: newStatus } : s));
    }
    showToast?.(`Shramik marked as ${newStatus}.`, 'info');
    setActiveActionMenuId(null);
    if (selectedWorkerDetails && selectedWorkerDetails.id === worker.id) {
      setSelectedWorkerDetails(prev => ({ ...prev, isActive: isNowActive, status: newStatus }));
    }
  };

  // Handle Delete Worker
  const handleDeleteWorker = (workerId) => {
    if (deleteShramik) {
      deleteShramik(workerId);
    } else if (setShramiks) {
      setShramiks(prev => prev.filter(s => s.id !== workerId));
    }
    showToast?.('Shramik removed from platform.', 'info');
    setActiveActionMenuId(null);
    if (selectedWorkerDetails?.id === workerId) {
      setSelectedWorkerDetails(null);
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSkill('All');
    setSelectedStatus('All');
    setSelectedLocation('All');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery !== '' || selectedSkill !== 'All' || selectedStatus !== 'All' || selectedLocation !== 'All';

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        
        {/* Top Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
              {t('admin.allShramiks', 'All Shramiks')}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {t('admin.allShramiksSubtitle', 'Manage and view all registered Shramiks on the platform')}
            </p>
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Card 1: Total Shramiks */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4 transition-all hover:shadow-md">
            <div className="w-13 h-13 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-500">
                {t('admin.totalShramiks', 'Total Shramiks')}
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5 font-mono">
                {totalCount.toLocaleString()}
              </p>
              <p className="text-[11px] font-medium text-emerald-600 mt-0.5 truncate">
                {t('admin.registeredOnPlatform', 'Registered on platform')}
              </p>
            </div>
          </div>

          {/* Card 2: Verified Shramiks */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4 transition-all hover:shadow-md">
            <div className="w-13 h-13 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-500">
                {t('admin.verifiedShramiks', 'Verified Shramiks')}
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5 font-mono">
                {verifiedCount.toLocaleString()}
              </p>
              <p className="text-[11px] font-medium text-blue-600 mt-0.5 truncate">
                {t('admin.activeAndVerified', 'Active and verified')}
              </p>
            </div>
          </div>

          {/* Card 3: Pending Verification */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4 transition-all hover:shadow-md">
            <div className="w-13 h-13 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-500">
                {t('admin.pendingVerification', 'Pending Verification')}
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5 font-mono">
                {pendingCount.toLocaleString()}
              </p>
              <p className="text-[11px] font-medium text-amber-600 mt-0.5 truncate">
                {t('admin.awaitingAdminReview', 'Awaiting admin review')}
              </p>
            </div>
          </div>

          {/* Card 4: Inactive Shramiks */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4 transition-all hover:shadow-md">
            <div className="w-13 h-13 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <UserX className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-500">
                {t('admin.inactiveShramiks', 'Inactive Shramiks')}
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5 font-mono">
                {inactiveCount.toLocaleString()}
              </p>
              <p className="text-[11px] font-medium text-indigo-600 mt-0.5 truncate">
                {t('admin.deactivatedAccounts', 'Deactivated accounts')}
              </p>
            </div>
          </div>

        </div>

        {/* Filter & Search Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder={t('admin.searchShramiksPlaceholder', 'Search by name, skill or ID...')}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400 text-slate-900"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
            {/* Skill Filter */}
            <div className="relative flex-1 sm:flex-initial min-w-[130px]">
              <select
                value={selectedSkill}
                onChange={(e) => { setSelectedSkill(e.target.value); setCurrentPage(1); }}
                className="w-full appearance-none pl-3 pr-8 py-2 text-xs sm:text-sm font-medium bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 cursor-pointer"
              >
                <option value="All">{t('admin.allSkills', 'All Skills')}</option>
                {uniqueSkills.map(skill => (
                  <option key={skill} value={skill}>{tSkill(skill)}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative flex-1 sm:flex-initial min-w-[120px]">
              <select
                value={selectedStatus}
                onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                className="w-full appearance-none pl-3 pr-8 py-2 text-xs sm:text-sm font-medium bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 cursor-pointer"
              >
                <option value="All">{t('admin.allStatus', 'All Status')}</option>
                <option value="Verified">{t('admin.verified', 'Verified')}</option>
                <option value="Pending">{t('admin.pending', 'Pending')}</option>
                <option value="Inactive">{t('admin.inactive', 'Inactive')}</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Location Filter */}
            <div className="relative flex-1 sm:flex-initial min-w-[140px]">
              <select
                value={selectedLocation}
                onChange={(e) => { setSelectedLocation(e.target.value); setCurrentPage(1); }}
                className="w-full appearance-none pl-3 pr-8 py-2 text-xs sm:text-sm font-medium bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 cursor-pointer"
              >
                <option value="All">{t('admin.allLocations', 'All Locations')}</option>
                {uniqueLocations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Filter Reset/Active Button */}
            {hasActiveFilters ? (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-all shrink-0"
                title="Reset Filters"
              >
                <X className="w-3.5 h-3.5" />
                <span>{t('common.clear', 'Clear')}</span>
              </button>
            ) : (
              <button
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all shrink-0"
              >
                <Filter className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('admin.filter', 'Filter')}</span>
              </button>
            )}
          </div>

        </div>

        {/* Shramiks Data Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4 sm:px-6">{t('admin.shramikId', 'Shramik ID')}</th>
                  <th className="py-3.5 px-4">{t('auth.name', 'Name')}</th>
                  <th className="py-3.5 px-4">{t('common.skill', 'Skill')}</th>
                  <th className="py-3.5 px-4">{t('admin.location', 'Location')}</th>
                  <th className="py-3.5 px-4">{t('booking.status', 'Status')}</th>
                  <th className="py-3.5 px-4">{t('admin.registeredOn', 'Registered On')}</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">{t('common.actions', 'Actions')}</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-sm">
                {paginatedShramiks.length > 0 ? (
                  paginatedShramiks.map((worker) => {
                    const status = getWorkerStatus(worker);
                    const location = worker.area && worker.city ? `${worker.area}, ${worker.city}` : (worker.city || worker.area || '—');
                    const registeredDate = getRegisteredDate(worker);

                    return (
                      <tr 
                        key={worker.id} 
                        className="hover:bg-slate-50/70 transition-colors group"
                      >
                        {/* Shramik ID */}
                        <td className="py-4 px-4 sm:px-6 font-mono font-bold text-xs sm:text-sm text-emerald-600">
                          {worker.shramikId || '—'}
                        </td>

                        {/* Name with Avatar */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={worker.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=250&auto=format&fit=crop&q=80'}
                              alt={worker.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                                {worker.name}
                              </p>
                              <p className="text-[11px] text-slate-400 font-mono sm:hidden">
                                {worker.phone}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Skill Pill */}
                        <td className="py-4 px-4">
                          <span className="inline-block bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-lg">
                            {tSkill(worker.skill)}
                          </span>
                        </td>

                        {/* Location */}
                        <td className="py-4 px-4 text-xs sm:text-sm text-slate-600 font-medium">
                          {location}
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-4">
                          {status === 'Verified' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{t('admin.verified', 'Verified')}</span>
                            </span>
                          )}
                          {status === 'Pending' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              <span>{t('admin.pending', 'Pending')}</span>
                            </span>
                          )}
                          {status === 'Inactive' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                              <X className="w-3.5 h-3.5 text-indigo-600" />
                              <span>{t('admin.inactive', 'Inactive')}</span>
                            </span>
                          )}
                        </td>

                        {/* Registered On */}
                        <td className="py-4 px-4 text-xs text-slate-600 font-medium">
                          {registeredDate}
                        </td>

                        {/* Action Buttons */}
                        <td className="py-4 px-4 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5 relative">
                            {/* View Profile */}
                            <button
                              onClick={() => setSelectedWorkerDetails(worker)}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                              title={t('common.viewDetails', 'View Details')}
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Dropdown Menu */}
                            <div className="relative">
                              <button
                                onClick={(e) => handleToggleMenu(e, worker.id)}
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                                title={t('common.moreOptions', 'More Options')}
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>

                              {/* Dropdown Popup */}
                              {activeActionMenuId === worker.id && (
                                <div 
                                  onClick={(e) => e.stopPropagation()}
                                  className="absolute right-0 top-full mt-1 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-40 animate-scale-up text-left text-xs font-medium"
                                >
                                  <button
                                    onClick={() => {
                                      setSelectedWorkerDetails(worker);
                                      setActiveActionMenuId(null);
                                    }}
                                    className="w-full px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{t('common.viewProfile', 'View Profile')}</span>
                                  </button>

                                  {status === 'Pending' && (
                                    <button
                                      onClick={() => {
                                        approveShramik(worker.id);
                                        setActiveActionMenuId(null);
                                      }}
                                      className="w-full px-3.5 py-2 text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 font-semibold"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>{t('admin.approve', 'Approve')}</span>
                                    </button>
                                  )}

                                  <button
                                    onClick={() => handleToggleStatus(worker)}
                                    className="w-full px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                  >
                                    {status === 'Inactive' ? (
                                      <>
                                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>{t('admin.activate', 'Activate Account')}</span>
                                      </>
                                    ) : (
                                      <>
                                        <UserX className="w-3.5 h-3.5 text-amber-600" />
                                        <span>{t('admin.deactivate', 'Deactivate')}</span>
                                      </>
                                    )}
                                  </button>

                                  <div className="my-1 border-t border-slate-100" />

                                  <button
                                    onClick={() => handleDeleteWorker(worker.id)}
                                    className="w-full px-3.5 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                    <span>{t('common.delete', 'Delete')}</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-500 space-y-3">
                      <Users className="w-12 h-12 text-slate-300 mx-auto" />
                      <p className="font-bold text-slate-800 text-base">
                        {t('admin.noShramiksFound', 'No Shramiks found matching criteria')}
                      </p>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        {hasActiveFilters 
                          ? t('admin.tryAdjustingFilters', 'Try adjusting your search terms or clearing active filters.') 
                          : t('admin.addNewShramikToStart', 'Add a new Shramik or encourage local workers to register on the platform.')}
                      </p>
                      {hasActiveFilters && (
                        <button
                          onClick={handleResetFilters}
                          className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xs hover:bg-slate-800 transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>{t('admin.resetAllFilters', 'Reset All Filters')}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Pagination */}
          <div className="p-4 sm:p-5 border-t border-slate-100 flex items-center justify-between gap-4 text-xs font-medium text-slate-500 bg-white">
            {totalPages > 1 && (
              <>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={validCurrentPage === 1}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{t('admin.prevPage', 'Previous')}</span>
                </button>

                <span className="font-semibold text-slate-500">
                  {t('admin.pageOf', 'Page {current} of {total}', { current: validCurrentPage, total: totalPages })}
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={validCurrentPage === totalPages}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold"
                >
                  <span>{t('admin.nextPage', 'Next')}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

        </div>

      </div>

      {/* Modal: View Details */}
      {selectedWorkerDetails && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-6 animate-scale-up max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedWorkerDetails.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=250&auto=format&fit=crop&q=80'}
                  alt={selectedWorkerDetails.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shrink-0 shadow-sm"
                />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg font-heading">
                    {selectedWorkerDetails.name}
                  </h3>
                  <p className="text-xs font-bold text-emerald-600 font-mono">
                    {selectedWorkerDetails.shramikId || 'Verification Pending'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedWorkerDetails(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400">Rate</p>
                <p className="text-base font-extrabold text-slate-900 mt-0.5">₹{selectedWorkerDetails.hourlyRate}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400">Experience</p>
                <p className="text-base font-extrabold text-slate-900 mt-0.5">{selectedWorkerDetails.experience || '3 years'}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400">Rating</p>
                <p className="text-base font-extrabold text-emerald-600 flex items-center justify-center gap-1 mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-emerald-600" />
                  {selectedWorkerDetails.rating ? selectedWorkerDetails.rating.toFixed(1) : 'New'}
                </p>
              </div>
            </div>

            {/* Information Grid */}
            <div className="space-y-3 text-xs text-slate-700 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Primary Skill:</span>
                <span className="font-bold text-slate-900">{tSkill(selectedWorkerDetails.skill)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Phone Number:</span>
                <span className="font-mono font-bold text-slate-900">{selectedWorkerDetails.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Location:</span>
                <span className="font-bold text-slate-900">{selectedWorkerDetails.area ? `${selectedWorkerDetails.area}, ${selectedWorkerDetails.city}` : selectedWorkerDetails.city}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Account Status:</span>
                <span className="font-bold text-slate-900">{getWorkerStatus(selectedWorkerDetails)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Registered On:</span>
                <span className="font-bold text-slate-900">{getRegisteredDate(selectedWorkerDetails)}</span>
              </div>
              <div className="pt-1">
                <span className="text-slate-400 font-medium block mb-1">Services Offered:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {(selectedWorkerDetails.services || []).map((s, idx) => (
                    <span key={idx} className="bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-lg text-[11px] font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              {selectedWorkerDetails.bio && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 font-medium block mb-1">Bio / Profile:</span>
                  <p className="text-slate-600 leading-relaxed italic">{selectedWorkerDetails.bio}</p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 pt-2">
              {!selectedWorkerDetails.verified && (
                <button
                  onClick={() => {
                    approveShramik(selectedWorkerDetails.id);
                    setSelectedWorkerDetails(prev => ({ ...prev, verified: true, shramikId: `SS-${Math.floor(10000 + Math.random() * 90000)}` }));
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow-md transition-all text-xs flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('admin.approveAndVerify', 'Approve & Verify')}</span>
                </button>
              )}

              <button
                onClick={() => handleToggleStatus(selectedWorkerDetails)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-1.5"
              >
                {getWorkerStatus(selectedWorkerDetails) === 'Inactive' ? (
                  <>
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>{t('admin.activate', 'Activate')}</span>
                  </>
                ) : (
                  <>
                    <UserX className="w-4 h-4 text-amber-600" />
                    <span>{t('admin.deactivate', 'Deactivate')}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleDeleteWorker(selectedWorkerDetails.id)}
                className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors"
                title="Delete Shramik"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

    </AdminLayout>
  );
};
