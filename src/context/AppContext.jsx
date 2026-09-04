import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const INITIAL_SHRAMIKS = [
  {
    id: 'shr-1',
    name: 'Ramesh Kumar',
    skill: 'Electrician',
    verified: true,
    shramikId: 'SS-10101',
    rating: 4.8,
    jobsCount: 120,
    distance: '2.1 km away',
    hourlyRate: 250,
    phone: '+91 98765 43210',
    city: 'Kolkata',
    area: 'Salt Lake',
    experience: '8+ years',
    services: ['Wiring', 'Repair', 'Installation', 'Lighting'],
    photo: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=250&auto=format&fit=crop&q=80',
    bio: 'Punctual and certified electrical master worker with over 8 years experience in residential and commercial wiring and emergency fault repairs.'
  },
  {
    id: 'shr-2',
    name: 'Deepak Singh',
    skill: 'Plumber',
    verified: true,
    shramikId: 'SS-10102',
    rating: 4.9,
    jobsCount: 85,
    distance: '1.5 km away',
    hourlyRate: 300,
    phone: '+91 98123 45678',
    city: 'Kolkata',
    area: 'Park Street',
    experience: '6 years',
    services: ['Pipe Fitting', 'Leakage Repair', 'Sanitary Installation', 'Water Tank Cleaning'],
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
    bio: 'Specialist in modern sanitary fittings, high-pressure pipe repairs, and household plumbing troubleshooting.'
  },
  {
    id: 'shr-3',
    name: 'Vikash Yadav',
    skill: 'Electrician',
    verified: false,
    shramikId: null,
    rating: 0,
    jobsCount: 0,
    distance: '3.4 km away',
    hourlyRate: 220,
    phone: '+91 98999 11223',
    city: 'Kolkata',
    area: 'New Town',
    experience: '5 years',
    services: ['Wiring', 'Repair', 'Maintenance'],
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80',
    bio: 'Experienced electrician specialized in domestic power distribution and appliance setup.',
    pendingSince: '10 mins ago'
  },
  {
    id: 'shr-4',
    name: 'Sunita Devi',
    skill: 'Painter',
    verified: true,
    shramikId: 'SS-10104',
    rating: 4.7,
    jobsCount: 64,
    distance: '4.0 km away',
    hourlyRate: 280,
    phone: '+91 97777 88899',
    city: 'Kolkata',
    area: 'Bhowanipore',
    experience: '4 years',
    services: ['Wall Painting', 'Texture Design', 'Waterproofing', 'Primer Coat'],
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80',
    bio: 'Professional wall painting artist with expertise in weather-proof coatings and modern interior finishes.'
  }
];

const INITIAL_BOOKINGS = [];

export const AppProvider = ({ children }) => {
  // Navigation & Role State
  const [role, setRole] = useState('landing'); // 'landing' | 'customer' | 'shramik' | 'admin'
  const [currentScreen, setCurrentScreen] = useState('landing'); // landing, login, search, profile, slot, booking_confirm, track_booking, shramik_signup, shramik_pending, shramik_dashboard, shramik_job, admin_dashboard, admin_approvals
  
  // Data States
  const [shramiks, setShramiks] = useState(INITIAL_SHRAMIKS);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [selectedWorkerId, setSelectedWorkerId] = useState('shr-1');
  const [activeBookingId, setActiveBookingId] = useState('');
  const [activeShramikId, setActiveShramikId] = useState('shr-1'); // Default active Shramik (Ramesh Kumar) or new registered
  
  // Transient Booking Selection state
  const [bookingDraft, setBookingDraft] = useState({
    date: '',
    time: '',
    service: ''
  });

  // Selected Category filter for CustomerSearch
  const [searchCategory, setSearchCategory] = useState('All');

  // Notification Toast state
  const [toast, setToast] = useState(null);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Which login tab should be pre-selected (customer | shramik), set by landing CTAs
  const [intendedLoginRole, setIntendedLoginRole] = useState('customer');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const login = (userData) => {
    setCurrentUser(userData);
    setIsLoggedIn(true);
    setRole(userData.role);
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setRole('landing');
    setCurrentScreen('landing');
    showToast('Logged out successfully.', 'info');
  };

  // Synchronize screen when role changes
  const switchRole = (newRole) => {
    // Strict Portal Isolation: when logged in, do not allow changing to another portal
    if (isLoggedIn && currentUser?.role && newRole !== currentUser.role && newRole !== 'landing') {
      return;
    }
    setRole(newRole);
    if (newRole === 'landing') setCurrentScreen('landing');
    else if (newRole === 'customer') {
      if (!isLoggedIn) {
        setIntendedLoginRole('customer');
        setCurrentScreen('login');
      } else {
        setCurrentScreen('search');
      }
    }
    else if (newRole === 'shramik') {
      if (!isLoggedIn) {
        setIntendedLoginRole('shramik');
        setCurrentScreen('login');
      } else {
        // Check if current Shramik is verified or pending
        const activeShramik = shramiks.find(s => s.id === activeShramikId);
        if (activeShramik && !activeShramik.verified) {
          setCurrentScreen('shramik_pending');
        } else {
          setCurrentScreen('shramik_dashboard');
        }
      }
    } else if (newRole === 'admin') {
      if (!isLoggedIn) {
        setIntendedLoginRole('admin');
        setCurrentScreen('login');
      } else {
        setCurrentScreen('admin_dashboard');
      }
    }
  };

  // Shramik Registration Flow
  const registerShramik = (formData) => {
    const newId = `shr-${Date.now()}`;
    const newShramik = {
      id: newId,
      name: formData.fullName || 'New Shramik',
      skill: formData.primarySkill || 'Electrician',
      verified: false,
      shramikId: null,
      rating: 0,
      jobsCount: 0,
      distance: '1.8 km away',
      hourlyRate: 250,
      phone: formData.phone || '+91 98000 00000',
      city: formData.city || 'Kolkata',
      area: formData.serviceArea || 'Salt Lake',
      experience: formData.experience || '3 years',
      services: formData.selectedServices || ['General Repair'],
      photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=250&auto=format&fit=crop&q=80',
      bio: 'Skilled local technician dedicated to quality and safety.',
      pendingSince: 'Just now'
    };

    setShramiks(prev => [newShramik, ...prev]);
    setActiveShramikId(newId);
    setRole('shramik');
    setCurrentScreen('shramik_pending');
    showToast('Registration submitted! Verification pending admin review.', 'info');
  };

  // Admin Approval Action
  const approveShramik = (id) => {
    const nextIdNum = Math.floor(100000 + Math.random() * 900000);
    const assignedShramikId = `SS-${nextIdNum}`;

    setShramiks(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          verified: true,
          shramikId: assignedShramikId
        };
      }
      return s;
    }));

    showToast(`Shramik Approved! Assigned ID: ${assignedShramikId}`, 'success');
  };

  // Admin Reject Action
  const rejectShramik = (id) => {
    setShramiks(prev => prev.filter(s => s.id !== id));
    showToast('Shramik registration rejected.', 'error');
  };

  // Booking Flow Actions
  const createBooking = () => {
    const worker = shramiks.find(s => s.id === selectedWorkerId) || shramiks[0];
    const newBookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const randomStartCode = Math.floor(1000 + Math.random() * 9000).toString();

    const customerName = currentUser?.name || 'Customer';
    const customerPhone = currentUser?.phone ? (currentUser.phone.startsWith('+91') ? currentUser.phone : `+91 ${currentUser.phone}`) : '+91 00000 00000';
    const customerAddress = currentUser?.address || currentUser?.city || '';

    const newBooking = {
      id: newBookingId,
      shramikId: worker.id,
      shramikName: worker.name,
      shramikPhone: worker.phone,
      skill: worker.skill,
      serviceName: bookingDraft.service || `${worker.skill} Service`,
      date: bookingDraft.date,
      time: bookingDraft.time,
      customerName,
      customerPhone,
      customerAddress,
      distance: worker.distance,
      serviceFee: worker.hourlyRate * 2,
      platformFee: 50,
      totalAmount: (worker.hourlyRate * 2) + 50,
      startCode: randomStartCode,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    setBookings(prev => [newBooking, ...prev]);
    setActiveBookingId(newBookingId);
    setCurrentScreen('track_booking');
    showToast(`Booking Confirmed! Your Start Code is ${randomStartCode}`, 'success');
  };

  // Customer Cancels Booking
  const cancelBooking = (bookingId) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'Cancelled' } : b));
    showToast('Booking cancelled successfully.', 'info');
  };

  // 4-Digit Code Verification by Shramik
  const verifyStartCode = (code) => {
    const currentBooking = bookings.find(b => b.id === activeBookingId);
    if (!currentBooking) return false;

    if (currentBooking.startCode === code) {
      setBookings(prev => prev.map(b => b.id === activeBookingId ? { ...b, status: 'In Progress' } : b));
      showToast('✓ Code verified! Job started successfully.', 'success');
      return true;
    } else {
      showToast('Invalid Start Code! Please check with customer.', 'error');
      return false;
    }
  };

  // Customer Confirms Work Completion
  const confirmWorkDone = (bookingId) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'Completed' } : b));
    showToast('Work completed confirmed! Please proceed to payment.', 'success');
  };

  // Customer Payment
  const processPayment = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'Paid' } : b));
    
    // Update Shramik earnings and completed job count
    if (booking) {
      setShramiks(prev => prev.map(s => {
        if (s.id === booking.shramikId) {
          return {
            ...s,
            jobsCount: s.jobsCount + 1
          };
        }
        return s;
      }));
    }
    showToast(`₹${booking?.totalAmount || 550} Paid Successfully! Thank you for using Shram Setu.`, 'success');
  };

  // Quick Demo Step Launcher (Backbone Flow Preset)
  const jumpToDemoStep = (stepNumber) => {
    if (stepNumber === 1) { // Shramik Signup
      switchRole('shramik');
      setCurrentScreen('shramik_signup');
    } else if (stepNumber === 2) { // Shramik Pending
      switchRole('shramik');
      // Create pending shramik if needed
      const pending = shramiks.find(s => !s.verified);
      if (pending) setActiveShramikId(pending.id);
      setCurrentScreen('shramik_pending');
    } else if (stepNumber === 3) { // Admin Approval
      switchRole('admin');
      setCurrentScreen('admin_approvals');
    } else if (stepNumber === 4) { // Verified Shramik Profile
      switchRole('customer');
      setSelectedWorkerId('shr-1');
      setCurrentScreen('profile');
    } else if (stepNumber === 5) { // Slot Pick & Booking Summary
      switchRole('customer');
      setSelectedWorkerId('shr-1');
      setCurrentScreen('slot');
    } else if (stepNumber === 6) { // Track Booking & 4-Digit Code
      switchRole('customer');
      setActiveBookingId('BK-8891');
      setCurrentScreen('track_booking');
    } else if (stepNumber === 7) { // Shramik Enters 4-Digit Code
      switchRole('shramik');
      setActiveShramikId('shr-1');
      setCurrentScreen('shramik_job');
    } else if (stepNumber === 8) { // Customer Work Completion & Payment
      switchRole('customer');
      setActiveBookingId('BK-8891');
      // Set booking to completed or in progress for payment transition
      setCurrentScreen('track_booking');
    } else if (stepNumber === 9) { // Payment Screen
      switchRole('customer');
      setActiveBookingId('BK-8891');
      setCurrentScreen('payment');
    }
  };

  return (
    <AppContext.Provider value={{
      role,
      switchRole,
      currentScreen,
      setCurrentScreen,
      shramiks,
      bookings,
      selectedWorkerId,
      setSelectedWorkerId,
      activeBookingId,
      setActiveBookingId,
      activeShramikId,
      setActiveShramikId,
      bookingDraft,
      setBookingDraft,
      registerShramik,
      approveShramik,
      rejectShramik,
      createBooking,
      verifyStartCode,
      confirmWorkDone,
      processPayment,
      cancelBooking,
      jumpToDemoStep,
      toast,
      showToast,
      intendedLoginRole,
      setIntendedLoginRole,
      searchCategory,
      setSearchCategory,
      currentUser,
      isLoggedIn,
      login,
      logout,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
