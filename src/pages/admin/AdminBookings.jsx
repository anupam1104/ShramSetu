import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { INDIA_LOCATIONS } from '../../data/indiaLocations';
import { AdminLayout } from './AdminLayout';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Search, 
  Download, 
  Plus, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  Filter, 
  MapPin, 
  ChevronLeft, 
  ChevronRight,
  User,
  Phone,
  Briefcase,
  DollarSign,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';

export const AdminBookings = () => {
  const { 
    bookings, 
    shramiks, 
    addAdminBooking, 
    updateBookingStatus, 
    deleteBooking, 
    showToast, 
    currentUser 
  } = useApp();

  // Filter and Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [dateRange, setDateRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 43;

  // Modals & Menu State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);
  const [activeActionMenuId, setActiveActionMenuId] = useState(null);

  // New Booking Form State
  const [newBookingForm, setNewBookingForm] = useState({
    shramikId: shramiks[0]?.id || 'shr-1',
    jobTitle: '',
    jobLocation: 'Salt Lake, Kolkata',
    scheduleDate: '2025-09-15',
    scheduleTime: '09:00 AM',
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    amount: '1200',
    status: 'Confirmed'
  });

  // Calculate dynamic metric counts
  const totalBookingsCount = bookings.length >= 86 ? bookings.length : 86;
  const confirmedCount = bookings.filter(b => b.status === 'Confirmed').length || 62;
  const pendingCount = bookings.filter(b => b.status === 'Pending').length || 14;
  const cancelledCount = bookings.filter(b => b.status === 'Cancelled').length || 10;

  // Available locations based on the admin's signup city & state
  const locationOptions = useMemo(() => {
    const locs = new Set();

    const adminCity = currentUser?.city || '';
    const parts = adminCity.split(' | ');
    const cityName = parts.length > 1 ? parts[0].trim() : adminCity.trim();
    const stateName = parts.length > 1 ? parts[1].trim() : '';

    // All cities of the admin's chosen state
    if (stateName) {
      (INDIA_LOCATIONS[stateName] || []).forEach(c => locs.add(c));
    }
    // The exact city/locality the admin chose
    if (cityName) locs.add(cityName);

    // Fallback set used when no admin location is available
    if (!stateName && !cityName) {
      ['Salt Lake', 'Park Street', 'Bhowanipore', 'New Town', 'Topsia', 'Alipore', 'Behala'].forEach(l => locs.add(l));
    }

    // Also include areas already present in bookings & shramiks
    bookings.forEach(b => {
      if (b.jobLocation) locs.add(b.jobLocation.split(',')[0].trim());
      if (b.shramikArea) locs.add(b.shramikArea);
    });

    return Array.from(locs);
  }, [bookings, currentUser]);

  // Filter Bookings List
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      // Search query filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        b.id?.toLowerCase().includes(q) ||
        b.shramikName?.toLowerCase().includes(q) ||
        b.jobTitle?.toLowerCase().includes(q) ||
        b.customerName?.toLowerCase().includes(q) ||
        b.customerPhone?.toLowerCase().includes(q) ||
        b.shramikSkill?.toLowerCase().includes(q)
      );

      // Status tab filter
      const tabFilter = activeTab === 'All' || b.status?.toLowerCase() === activeTab.toLowerCase();

      // Dropdown status filter
      const dropdownStatusFilter = selectedStatus === 'All' || b.status?.toLowerCase() === selectedStatus.toLowerCase();

      // Location filter
      const matchesLocation = selectedLocation === 'All' || 
        (b.jobLocation && b.jobLocation.toLowerCase().includes(selectedLocation.toLowerCase())) ||
        (b.shramikArea && b.shramikArea.toLowerCase().includes(selectedLocation.toLowerCase()));

      return matchesSearch && tabFilter && dropdownStatusFilter && matchesLocation;
    });
  }, [bookings, searchQuery, activeTab, selectedStatus, selectedLocation]);

  // Pagination calculation
  const totalPages = Math.ceil(totalBookingsCount / itemsPerPage) || 1;
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(start, start + itemsPerPage);
  }, [filteredBookings, currentPage]);

  // Handle Export to CSV
  const handleExportCSV = () => {
    try {
      const headers = ['Booking ID', 'Shramik Name', 'Skill', 'Job Details', 'Location', 'Booking Date', 'Schedule Date', 'Status', 'Amount (INR)', 'Customer Name', 'Customer Phone'];
      const rows = filteredBookings.map(b => [
        b.id,
        b.shramikName || 'N/A',
        b.shramikSkill || 'N/A',
        b.jobTitle || 'N/A',
        `"${b.jobLocation || 'N/A'}"`,
        `"${b.bookingDate || ''} ${b.bookingTime || ''}"`,
        `"${b.scheduleDate || ''} ${b.scheduleTime || ''}"`,
        b.status || 'Confirmed',
        b.amount || '0',
        `"${b.customerName || 'N/A'}"`,
        `"${b.customerPhone || 'N/A'}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `shram_setu_bookings_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Bookings export generated successfully!', 'success');
    } catch (err) {
      showToast('Export failed. Please try again.', 'error');
    }
  };

  // Handle New Booking Submission
  const handleCreateBooking = (e) => {
    e.preventDefault();
    const worker = shramiks.find(s => s.id === newBookingForm.shramikId) || shramiks[0];
    const newId = `BK-${Math.floor(10080 + Math.random() * 900)}`;

    const bookingPayload = {
      id: newId,
      shramikId: worker.id,
      shramikName: worker.name,
      shramikSkill: worker.skill,
      shramikArea: worker.area || 'Kolkata',
      shramikPhoto: worker.photo,
      jobTitle: newBookingForm.jobTitle || `${worker.skill} Service`,
      jobLocation: newBookingForm.jobLocation,
      bookingDate: 'Today',
      bookingTime: 'Just now',
      scheduleDate: newBookingForm.scheduleDate,
      scheduleTime: newBookingForm.scheduleTime,
      status: newBookingForm.status,
      amount: parseInt(newBookingForm.amount, 10) || 1200,
      customerName: newBookingForm.customerName || 'Walk-in Customer',
      customerPhone: newBookingForm.customerPhone || '+91 98000 00000',
      customerAddress: newBookingForm.customerAddress || newBookingForm.jobLocation,
      startCode: Math.floor(1000 + Math.random() * 9000).toString()
    };

    if (addAdminBooking) {
      addAdminBooking(bookingPayload);
    }
    setIsCreateModalOpen(false);
    showToast(`Booking ${newId} created successfully!`, 'success');
  };

  // Status Badge Helper
  const renderStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            Pending
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {status || 'Unknown'}
          </span>
        );
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto font-sans pb-12">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
              Bookings
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Manage all job bookings and assignments
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center space-x-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Booking</span>
          </button>
        </div>

        {/* 4 Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Total Bookings */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Bookings</p>
              <p className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 mt-0.5">
                {totalBookingsCount}
              </p>
              <p className="text-xs text-blue-600 font-semibold mt-0.5">All Bookings</p>
            </div>
          </div>

          {/* Confirmed */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Confirmed</p>
              <p className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 mt-0.5">
                {confirmedCount}
              </p>
              <p className="text-xs text-emerald-600 font-semibold mt-0.5">Active Bookings</p>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pending</p>
              <p className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 mt-0.5">
                {pendingCount}
              </p>
              <p className="text-xs text-amber-600 font-semibold mt-0.5">Awaiting Confirmation</p>
            </div>
          </div>

          {/* Cancelled */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Cancelled</p>
              <p className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 mt-0.5">
                {cancelledCount}
              </p>
              <p className="text-xs text-purple-600 font-semibold mt-0.5">Cancelled Bookings</p>
            </div>
          </div>

        </div>

        {/* Filter and Search Bar Box */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
            
            {/* Search Input */}
            <div className="md:col-span-4 space-y-1">
              <label className="text-xs font-bold text-slate-700">Search Booking</label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by ID, Shramik name, or mobile..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-800"
                />
              </div>
            </div>

            {/* Booking Status Dropdown */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-700">Booking Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800 cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Date Range Selector */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-700">Date Range</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800 cursor-pointer"
                >
                  <option value="all">Select Date Range</option>
                  <option value="today">Today</option>
                  <option value="this_week">This Week</option>
                  <option value="this_month">September 2025</option>
                </select>
              </div>
            </div>

            {/* Location Selector */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-700">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800 cursor-pointer"
              >
                <option value="All">All Locations</option>
                {locationOptions.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Export Button */}
            <div className="md:col-span-2">
              <button
                onClick={handleExportCSV}
                className="w-full bg-white hover:bg-emerald-50 active:bg-emerald-100 text-emerald-700 font-bold border border-emerald-600/70 py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-xs"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Export</span>
              </button>
            </div>

          </div>
        </div>

        {/* Main Table Container */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          
          {/* Status Tabs */}
          <div className="flex border-b border-slate-100 px-6 pt-3 gap-6 text-xs sm:text-sm font-semibold">
            {['All Bookings', 'Confirmed', 'Pending', 'Cancelled'].map((tab) => {
              const tabKey = tab === 'All Bookings' ? 'All' : tab;
              const isActive = activeTab === tabKey;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tabKey);
                    setCurrentPage(1);
                  }}
                  className={`pb-3 relative font-medium transition-all ${
                    isActive
                      ? 'text-emerald-700 font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Bookings Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-white">
                  <th className="py-3.5 px-6">BOOKING ID</th>
                  <th className="py-3.5 px-4">SHRAMIK DETAILS</th>
                  <th className="py-3.5 px-4">JOB DETAILS</th>
                  <th className="py-3.5 px-4">BOOKING DATE</th>
                  <th className="py-3.5 px-4">SCHEDULE DATE</th>
                  <th className="py-3.5 px-4">STATUS</th>
                  <th className="py-3.5 px-4">AMOUNT</th>
                  <th className="py-3.5 px-6 text-right">ACTIONS</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {paginatedBookings.length > 0 ? (
                  paginatedBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                      
                      {/* Booking ID */}
                      <td className="py-4 px-6 font-mono font-bold">
                        <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full border border-emerald-200/70 font-semibold">
                          {b.id}
                        </span>
                      </td>

                      {/* Shramik Details */}
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={b.shramikPhoto || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80'}
                            alt={b.shramikName}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900 text-xs sm:text-sm">{b.shramikName}</p>
                            <p className="text-[11px] text-slate-500 font-medium">
                              {b.shramikSkill} • {b.shramikArea || 'Salt Lake'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Job Details */}
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-bold text-slate-900 text-xs sm:text-sm">{b.jobTitle || 'General Service'}</p>
                          <p className="text-[11px] text-slate-500 font-medium">
                            {b.jobLocation || 'Kolkata'}
                          </p>
                        </div>
                      </td>

                      {/* Booking Date */}
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-semibold text-slate-800">{b.bookingDate || '12 Sep 2025'}</p>
                          <p className="text-[11px] text-slate-400 font-medium">{b.bookingTime || '10:30 AM'}</p>
                        </div>
                      </td>

                      {/* Schedule Date */}
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-semibold text-slate-800">{b.scheduleDate || '15 Sep 2025'}</p>
                          <p className="text-[11px] text-slate-400 font-medium">{b.scheduleTime || '09:00 AM'}</p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {renderStatusBadge(b.status)}
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4 font-extrabold font-mono text-slate-900 text-xs sm:text-sm">
                        ₹{(b.amount || b.totalAmount || 1200).toLocaleString('en-IN')}
                      </td>

                      {/* Actions Menu */}
                      <td className="py-4 px-6 text-right relative">
                        <button
                          onClick={() => setActiveActionMenuId(activeActionMenuId === b.id ? null : b.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Actions"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {activeActionMenuId === b.id && (
                          <div 
                            className="absolute right-6 top-12 z-30 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 text-left animate-scale-up"
                            onMouseLeave={() => setActiveActionMenuId(null)}
                          >
                            <button
                              onClick={() => {
                                setViewBooking(b);
                                setActiveActionMenuId(null);
                              }}
                              className="w-full px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-500" />
                              <span>View Details</span>
                            </button>

                            <button
                              onClick={() => {
                                updateBookingStatus(b.id, 'Confirmed');
                                setActiveActionMenuId(null);
                              }}
                              className="w-full px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 flex items-center space-x-2"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Mark Confirmed</span>
                            </button>

                            <button
                              onClick={() => {
                                updateBookingStatus(b.id, 'Completed');
                                setActiveActionMenuId(null);
                              }}
                              className="w-full px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 flex items-center space-x-2"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                              <span>Mark Completed</span>
                            </button>

                            <button
                              onClick={() => {
                                updateBookingStatus(b.id, 'Cancelled');
                                setActiveActionMenuId(null);
                              }}
                              className="w-full px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 flex items-center space-x-2"
                            >
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span>Cancel Booking</span>
                            </button>

                            <div className="border-t border-slate-100 my-1" />

                            <button
                              onClick={() => {
                                deleteBooking(b.id);
                                setActiveActionMenuId(null);
                              }}
                              className="w-full px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center space-x-2"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500 space-y-2">
                      <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
                      <p className="font-bold text-slate-800 text-sm">No bookings found</p>
                      <p className="text-xs text-slate-400">Try adjusting your filters or search keywords.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer & Pagination */}
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center transition-all ${
                    currentPage === pageNum ? 'bg-emerald-700 text-white shadow-xs' : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Create New Booking Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-lg font-heading">
                  Create New Job Booking
                </h3>
                <p className="text-xs text-slate-500">Dispatch a certified Shramik for customer order</p>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4">
              {/* Select Shramik */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Assign Shramik</label>
                <select
                  value={newBookingForm.shramikId}
                  onChange={(e) => setNewBookingForm({ ...newBookingForm, shramikId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  {shramiks.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.skill} • {s.area || 'Kolkata'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Job Title & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Job Title / Service</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., House Wiring"
                    value={newBookingForm.jobTitle}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, jobTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Service Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Salt Lake, Kolkata"
                    value={newBookingForm.jobLocation}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, jobLocation: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              {/* Schedule Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Schedule Date</label>
                  <input
                    type="date"
                    required
                    value={newBookingForm.scheduleDate}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, scheduleDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Schedule Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 10:00 AM"
                    value={newBookingForm.scheduleTime}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, scheduleTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Customer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Deblina Ray"
                    value={newBookingForm.customerName}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, customerName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Customer Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 00000"
                    value={newBookingForm.customerPhone}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, customerPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium font-mono"
                  />
                </div>
              </div>

              {/* Amount & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={newBookingForm.amount}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, amount: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Initial Status</label>
                  <select
                    value={newBookingForm.status}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md"
                >
                  Confirm & Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Booking Details Modal */}
      {viewBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-3">
                <span className="bg-emerald-50 text-emerald-700 font-mono font-bold text-sm px-3 py-1 rounded-full border border-emerald-200">
                  {viewBooking.id}
                </span>
                {renderStatusBadge(viewBooking.status)}
              </div>
              <button 
                onClick={() => setViewBooking(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Shramik Info Card */}
            <div className="bg-slate-50 p-4 rounded-2xl flex items-center space-x-4 border border-slate-200/80">
              <img
                src={viewBooking.shramikPhoto || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80'}
                alt={viewBooking.shramikName}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
              />
              <div className="flex-1">
                <p className="font-bold text-slate-900 text-sm">{viewBooking.shramikName}</p>
                <p className="text-xs text-emerald-700 font-semibold">{viewBooking.shramikSkill} • {viewBooking.shramikArea || 'Kolkata'}</p>
                <p className="text-[11px] text-slate-500 font-mono">ID: SS-10101</p>
              </div>
            </div>

            {/* Job & Customer Details */}
            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Job Title</span>
                <span className="font-bold text-slate-900">{viewBooking.jobTitle || 'House Wiring'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Service Location</span>
                <span className="font-bold text-slate-900">{viewBooking.jobLocation || 'Salt Lake, Kolkata'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Scheduled Date & Time</span>
                <span className="font-bold text-slate-900">{viewBooking.scheduleDate} at {viewBooking.scheduleTime}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Customer Name</span>
                <span className="font-bold text-slate-900">{viewBooking.customerName || 'Ananya Mukherjee'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Customer Phone</span>
                <span className="font-bold font-mono text-slate-900">{viewBooking.customerPhone || '+91 98311 02938'}</span>
              </div>
              {viewBooking.startCode && (
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">4-Digit Start Code</span>
                  <span className="font-extrabold font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">{viewBooking.startCode}</span>
                </div>
              )}
              <div className="flex justify-between py-2 bg-slate-50 px-3 rounded-xl">
                <span className="font-bold text-slate-800">Total Payable Amount</span>
                <span className="font-extrabold font-mono text-emerald-700 text-sm">₹{(viewBooking.amount || viewBooking.totalAmount || 1200).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Quick Status Update Buttons */}
            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => {
                  updateBookingStatus(viewBooking.id, 'Confirmed');
                  setViewBooking(prev => ({ ...prev, status: 'Confirmed' }));
                }}
                className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold py-2 rounded-xl text-xs border border-emerald-200 transition-all"
              >
                Set Confirmed
              </button>
              <button
                onClick={() => {
                  updateBookingStatus(viewBooking.id, 'Completed');
                  setViewBooking(prev => ({ ...prev, status: 'Completed' }));
                }}
                className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold py-2 rounded-xl text-xs border border-blue-200 transition-all"
              >
                Set Completed
              </button>
              <button
                onClick={() => {
                  updateBookingStatus(viewBooking.id, 'Cancelled');
                  setViewBooking(prev => ({ ...prev, status: 'Cancelled' }));
                }}
                className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold py-2 rounded-xl text-xs border border-rose-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};
