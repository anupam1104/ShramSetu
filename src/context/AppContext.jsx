import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { TRANSLATIONS, LANGUAGES } from '../data/translations';
import { acceptBooking as acceptBookingApi, approveShramik as approveShramikApi, clearAdminToken, completeBooking as completeBookingApi, createBooking as createBookingApi, createShramik, getBooking as getBookingApi, getCustomerBookings, getPendingShramiks, getShramikBookings, getShramikStatus, getShramiks, isSupabaseConfigured, payBooking as payBookingApi, rejectBooking as rejectBookingApi, rejectShramik as rejectShramikApi, setAdminToken, startBooking as startBookingApi, getAllBookings, getAllCustomers } from '../lib/supabase';
import {
  STORAGE_KEYS,
  clearSession,
  ensureSeedAccounts,
  findAccount,
  loadAccounts,
  loadAppliedData,
  loadSession,
  normalizeCity,
  removeAccount,
  sameCity,
  saveAppliedData,
  saveSession,
  updateAccount,
  upsertAccount,
} from '../lib/store';

const AppContext = createContext();

// ---------------------------------------------------------------------------
// Demo dataset — pre-seeded mock workers + bookings so every portal, screen
// and demo-toolbar step renders a realistic flow even fully offline. Live
// server data (when VITE_API_URL is configured) replaces these on refresh.
// ---------------------------------------------------------------------------

const INITIAL_SHRAMIKS = [
  {
    id: 'shr-1',
    name: 'Ramesh Kumar',
    skill: 'Electrician',
    verified: true,
    shramikId: 'SS-10101',
    rating: 4.8,
    jobsCount: 120,
    distance: '2.1 km',
    hourlyRate: 250,
    phone: '+91 98765 43210',
    city: 'Kolkata',
    area: 'Salt Lake',
    experience: '8 years',
    services: ['Wiring & Rewiring', 'Light Fitting', 'Switch & Socket', 'AC & Appliance'],
    photo: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=250&auto=format&fit=crop&q=80',
    bio: 'Licensed electrician with 8+ years of experience in residential and commercial wiring.',
    registeredOn: '12 May 2025',
    isActive: true,
  },
  {
    id: 'shr-2',
    name: 'Mohammed Irfan',
    skill: 'Plumber',
    verified: true,
    shramikId: 'SS-10242',
    rating: 4.7,
    jobsCount: 89,
    distance: '1.4 km',
    hourlyRate: 220,
    phone: '+91 98123 45678',
    city: 'Kolkata',
    area: 'Behala',
    experience: '6 years',
    services: ['Leak Repair', 'Pipe Installation', 'Tap Fitting', 'Bathroom Fitting'],
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
    bio: 'Certified plumber skilled in leak detection, pipeline installation and bathroom fittings.',
    registeredOn: '10 May 2025',
    isActive: true,
  },
  {
    id: 'shr-3',
    name: 'Vikash Singh',
    skill: 'Carpenter',
    verified: false,
    shramikId: null,
    rating: 0,
    jobsCount: 0,
    distance: '2.8 km',
    hourlyRate: 240,
    phone: '+91 91234 09876',
    city: 'Kolkata',
    area: 'Ballygunge',
    experience: '4 years',
    services: ['Furniture Assembly', 'Door Repair', 'Cabinet Fitting'],
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80',
    bio: 'Carpenter focused on furniture assembly, door repair and custom cabinet work.',
    pendingSince: '2 days ago',
    registeredOn: '09 May 2025',
    isActive: true,
  },
  {
    id: 'shr-4',
    name: 'Arun Verma',
    skill: 'Mason',
    verified: true,
    shramikId: 'SS-10456',
    rating: 4.9,
    jobsCount: 210,
    distance: '3.2 km',
    hourlyRate: 280,
    phone: '+91 99887 66554',
    city: 'Kolkata',
    area: 'Howrah',
    experience: '12 years',
    services: ['Wall Construction', 'Plastering', 'Flooring', 'Waterproofing'],
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=250&auto=format&fit=crop&q=80',
    bio: 'Senior mason with over a decade of experience in construction and finishing work.',
    registeredOn: '08 May 2025',
    isActive: true,
  },
  {
    id: 'shr-5',
    name: 'Suresh Yadav',
    skill: 'Painter',
    verified: true,
    shramikId: 'SS-10333',
    rating: 4.6,
    jobsCount: 64,
    distance: '1.9 km',
    hourlyRate: 200,
    phone: '+91 97766 54432',
    city: 'Kolkata',
    area: 'Park Street',
    experience: '5 years',
    services: ['Wall Painting', 'Texture Painting', 'False Ceiling', 'Putty Work'],
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=250&auto=format&fit=crop&q=80',
    bio: 'Interior painter delivering clean finishes for homes and commercial spaces.',
    registeredOn: '07 May 2025',
    isActive: true,
  },
];

const INITIAL_BOOKINGS = [
  {
    id: 'BK-8891',
    shramikId: 'shr-1',
    shramikName: 'Ramesh Kumar',
    shramikPhone: '+91 98765 43210',
    skill: 'Electrician',
    serviceName: 'Electrical Repair',
    date: '12 September 2026',
    time: '10:00 AM',
    customerName: 'Priya Sharma',
    customerPhone: '+91 91234 56789',
    customerAddress: 'B-402, Salt Lake City, Kolkata',
    distance: '2.1 km',
    serviceFee: 500,
    platformFee: 50,
    totalAmount: 550,
    status: 'Confirmed',
  },
  {
    id: 'BK-8892',
    shramikId: 'shr-1',
    shramikName: 'Ramesh Kumar',
    shramikPhone: '+91 98765 43210',
    skill: 'Electrician',
    serviceName: 'AC & Appliance Repair',
    date: '11 September 2026',
    time: '03:00 PM',
    customerName: 'Rahul Banerjee',
    customerPhone: '+91 90020 10020',
    customerAddress: 'House 14, Salt Lake Sector II, Kolkata',
    distance: '2.1 km',
    serviceFee: 600,
    platformFee: 50,
    totalAmount: 650,
    status: 'In Progress',
  },
  {
    id: 'BK-8893',
    shramikId: 'shr-2',
    shramikName: 'Mohammed Irfan',
    shramikPhone: '+91 98123 45678',
    skill: 'Plumber',
    serviceName: 'Pipe Installation',
    date: '10 September 2026',
    time: '11:00 AM',
    customerName: 'Sneha Ghosh',
    customerPhone: '+91 90909 80808',
    customerAddress: 'Flat 2A, Behala Chowrasta, Kolkata',
    distance: '1.4 km',
    serviceFee: 440,
    platformFee: 50,
    totalAmount: 490,
    status: 'Completed',
  },
  {
    id: 'BK-8894',
    shramikId: 'shr-2',
    shramikName: 'Mohammed Irfan',
    shramikPhone: '+91 98123 45678',
    skill: 'Plumber',
    serviceName: 'Leak Repair',
    date: '9 September 2026',
    time: '05:00 PM',
    customerName: 'Amit Roy',
    customerPhone: '+91 88998 87766',
    customerAddress: '16/C Behala Road, Kolkata',
    distance: '1.4 km',
    serviceFee: 330,
    platformFee: 50,
    totalAmount: 380,
    status: 'Paid',
  },
  {
    id: 'BK-8895',
    shramikId: 'shr-4',
    shramikName: 'Arun Verma',
    shramikPhone: '+91 99887 66554',
    skill: 'Mason',
    serviceName: 'Wall Construction',
    date: '12 September 2026',
    time: '09:00 AM',
    customerName: 'Farhan Ali',
    customerPhone: '+91 81111 22233',
    customerAddress: 'G.T. Road, Bally, Howrah',
    distance: '3.2 km',
    serviceFee: 840,
    platformFee: 50,
    totalAmount: 890,
    status: 'Confirmed',
  },
  {
    id: 'BK-8896',
    shramikId: 'shr-4',
    shramikName: 'Arun Verma',
    shramikPhone: '+91 99887 66554',
    skill: 'Mason',
    serviceName: 'Plastering',
    date: '8 September 2026',
    time: '02:00 PM',
    customerName: 'Meera Nair',
    customerPhone: '+91 82200 11122',
    customerAddress: '8, Andul Road, Howrah',
    distance: '3.2 km',
    serviceFee: 700,
    platformFee: 50,
    totalAmount: 750,
    status: 'Paid',
  },
  {
    id: 'BK-8897',
    shramikId: 'shr-5',
    shramikName: 'Suresh Yadav',
    shramikPhone: '+91 97766 54432',
    skill: 'Painter',
    serviceName: 'Wall Painting',
    date: '7 September 2026',
    time: '10:00 AM',
    customerName: 'Karan Malhotra',
    customerPhone: '+91 90110 22334',
    customerAddress: 'Flat 9A, Park Street, Kolkata',
    distance: '1.9 km',
    serviceFee: 400,
    platformFee: 50,
    totalAmount: 450,
    status: 'Completed',
  },
  {
    id: 'BK-8898',
    shramikId: 'shr-1',
    shramikName: 'Ramesh Kumar',
    shramikPhone: '+91 98765 43210',
    skill: 'Electrician',
    serviceName: 'Wiring & Rewiring',
    date: '6 September 2026',
    time: '12:00 PM',
    customerName: 'Deepa Sen',
    customerPhone: '+91 91221 10099',
    customerAddress: '3, Major Arterial Road, Salt Lake, Kolkata',
    distance: '2.1 km',
    serviceFee: 750,
    platformFee: 50,
    totalAmount: 800,
    status: 'Cancelled',
  },
];

// Only show the "offline mode" notice once per session, so a down backend
// doesn't spam a toast on every page load.
let offlineNoticeShown = false;

export const AppProvider = ({ children }) => {
  // Persisted session + applied data (localStorage) so login and live data survive page refresh
  const [bootSession] = useState(() => {
    const session = loadSession();
    if (session?.currentUser?.token) setAdminToken(session.currentUser.token);
    return session;
  });
  const [bootData] = useState(() => loadAppliedData());
  const boot = bootSession || {};

  // Navigation & Role State (rehydrated from the persisted session)
  const [role, setRole] = useState(boot.role || 'landing'); // 'landing' | 'customer' | 'shramik' | 'admin'
  const [currentScreen, setCurrentScreen] = useState(boot.currentScreen || 'landing'); // landing, login, search, profile, slot, booking_confirm, track_booking, shramik_signup, shramik_pending, shramik_dashboard, shramik_job, admin_dashboard, admin_approvals
  
  // Data States (rehydrated from persisted applied data, seeded with mock data)
  const hasStoredShramiks = Array.isArray(bootData?.shramiks) && bootData.shramiks.length > 0;
  const hasStoredBookings = Array.isArray(bootData?.bookings) && bootData.bookings.length > 0;
  const [shramiks, setShramiks] = useState(() => {
    if (hasStoredShramiks) {
      // Backfill registration dates for demo workers saved by older builds
      // that lacked the field, so admin lists show each one's actual day.
      const seedById = new Map(INITIAL_SHRAMIKS.map((s) => [s.id, s]));
      return bootData.shramiks.map((s) => {
        if (!s.registeredOn && !s.registeredAt && !s.createdAt && seedById.has(s.id)) {
          const seed = seedById.get(s.id);
          return { ...s, registeredOn: seed.registeredOn, registeredAt: seed.registeredAt };
        }
        return s;
      });
    }
    return INITIAL_SHRAMIKS;
  });
  const [bookings, setBookings] = useState(() => (hasStoredBookings ? bootData.bookings : INITIAL_BOOKINGS));

  const [selectedWorkerId, setSelectedWorkerId] = useState('shr-1');
  const [activeBookingId, setActiveBookingId] = useState(boot.activeBookingId || '');
  const [activeShramikId, setActiveShramikId] = useState(boot.activeShramikId || 'shr-1');
  
  // Transient Booking Selection state
  const [bookingDraft, setBookingDraft] = useState({
    date: '',
    time: '',
    service: ''
  });

  // Selected Category filter for CustomerSearch
  const [searchCategory, setSearchCategory] = useState('All');
  // Selected Job sub-option within a service (e.g. "Fan Repair" under Electrician)
  const [selectedJob, setSelectedJob] = useState(null);

  // Language & Settings Modal State
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('shram_lang') || 'en';
  });
  const [selectedLocation, setSelectedLocationState] = useState(() => {
    return localStorage.getItem('shram_location') || 'West Bengal';
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('shram_lang', language);
  }, [language]);

  // Seed the demo administrator account once (idempotent) so the Admin
  // portal is usable offline right after a fresh load.
  useEffect(() => {
    ensureSeedAccounts();
  }, []);

  const setLanguage = (newLang) => setLanguageState(newLang);
  const setSelectedLocation = (loc) => {
    setSelectedLocationState(loc);
    localStorage.setItem('shram_location', loc);
  };
  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);
  const toggleSettings = () => setIsSettingsOpen(prev => !prev);

  // Dot-notation alias map: maps dot-notation keys used in components to flat dict keys
  const DOT_KEY_ALIASES = {
    // admin.* keys â†’ flat keys
    'admin.bookings': 'bookings', 'admin.manageAllBookings': 'bookingsSubtitle',
    'admin.createNewBooking': 'createNewBooking', 'admin.totalBookings': 'totalBookings',
    'admin.allBookings': 'allBookings', 'admin.activeBookings': 'activeBookings',
    'admin.awaitingConfirmation': 'awaitingConfirmation', 'admin.cancelledBookings': 'cancelledBookings',
    'admin.searchBooking': 'searchBooking', 'admin.searchBookingPlaceholder': 'searchBookingPh',
    'admin.bookingStatus': 'bookingStatus', 'admin.allStatus': 'allStatus',
    'admin.dateRange': 'dateRange', 'admin.selectDateRange': 'selectDateRange',
    'admin.location': 'location', 'admin.allLocations': 'allLocations',
    'admin.export': 'export', 'admin.allBookingsTabs': 'tabAllBookings',
    'admin.noBookingsFound': 'noBookingsFound', 'admin.adjustFiltersNotice': 'noBookingsFoundDesc',
    'admin.shramikDetails': 'thShramikDetails', 'admin.jobDetails': 'thJobDetails',
    'admin.bookingDate': 'thBookingDate', 'admin.scheduleDate': 'scheduleDate',
    'admin.scheduleTime': 'scheduleTime', 'admin.markConfirmed': 'markConfirmed',
    'admin.markCompleted': 'markCompleted', 'admin.cancelBooking': 'cancelBooking',
    'admin.createNewJobBooking': 'createJobBooking', 'admin.dispatchNotice': 'dispatchShramik',
    'admin.assignShramik': 'assignShramik', 'admin.jobTitleService': 'jobTitleService',
    'admin.serviceLocation': 'serviceLocation', 'admin.initialStatus': 'initialStatus',
    'admin.confirmAndCreate': 'confirmAndCreate', 'admin.setConfirmed': 'setConfirmed',
    'admin.setCompleted': 'setCompleted', 'admin.settings': 'settingsNav',
    'admin.settingsSubtitle': 'settingsAdminSubtitle', 'admin.platformInformation': 'platformInformation',
    'admin.platformName': 'platformName', 'admin.adminEmail': 'adminContactEmail',
    'admin.tagline': 'tagline', 'admin.supportPhone': 'supportPhone',
    'admin.platformInfoSaved': 'adminPlatformSaved', 'admin.notificationsAndPreferences': 'notificationsPrefs',
    'admin.emailNotifications': 'emailNotifications', 'admin.emailNotificationsDesc': 'emailNotifDesc',
    'admin.approvalAlerts': 'approvalAlerts', 'admin.approvalAlertsDesc': 'approvalAlertsDesc',
    'admin.autoApproveShramiks': 'autoApproveShramiks', 'admin.autoApproveShramiksDesc': 'autoApproveDesc',
    'admin.dailySummaryReport': 'dailySummaryReport', 'admin.dailySummaryReportDesc': 'dailySummaryDesc',
    'admin.notificationsSaved': 'adminNotifSaved', 'admin.actionInitiated': 'adminSystemAction',
    'admin.systemDataManagement': 'systemDataManagement', 'admin.systemLogs': 'systemLogs',
    'admin.systemLogsDesc': 'systemLogsDesc', 'admin.backupExport': 'backupExport',
    'admin.backupExportDesc': 'backupExportDesc', 'admin.clearCache': 'clearCache',
    'admin.clearCacheDesc': 'clearCacheDesc', 'admin.dataRetention': 'dataRetention',
    'admin.dataRetentionDesc': 'dataRetentionDesc', 'admin.verificationQueue': 'verificationQueue',
    'admin.verificationQueueSubtitle': 'queueDesc', 'admin.pendingCount': 'pendingApprovalCount',
    'admin.pendingRegistrations': 'pendingRegistrations', 'admin.liveManagement': 'liveManagement',
    'admin.approve': 'approve', 'admin.approveAndIssueId': 'approveAndIssue',
    'admin.reject': 'rejectRegistration', 'admin.noPendingApprovals': 'noPendingQueue',
    'admin.allShramiksVerified': 'allRegisteredVerified', 'admin.verifiedDirectory': 'verifiedDirectory',
    'admin.verifiedActive': 'verifiedActive', 'admin.profileApplication': 'profileApplication',
    // auth.* keys
    'auth.phone': 'phoneNumber', 'auth.shramik': 'thShramik',
    // booking.* keys
    'booking.id': 'thBookingId', 'booking.status': 'thStatus',
    'booking.amount': 'thAmount', 'booking.customer': 'customerName',
    'booking.service': 'jobTitle', 'booking.dateTime': 'scheduledDateTime',
    'booking.totalPayable': 'totalPayableAmount',
    // common.* keys
    'common.skill': 'thSkill', 'common.experience': 'thExperience',
    'common.action': 'thActions', 'common.view': 'viewDetails',
    'common.cancel': 'cancel', 'common.delete': 'delete',
    'common.saveChanges': 'saveChanges', 'common.cityArea': 'cityArea',
    'common.servicesOffered': 'servicesOffered',
  };

  const t = (key, fallbackOrParams = '', params = null) => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en || {};
    // Resolve dot-notation aliases to flat keys
    const flatKey = DOT_KEY_ALIASES[key] || key;
    let val = dict[flatKey] ?? TRANSLATIONS.en?.[flatKey];

    // Determine the params object and fallback string
    let interpolateParams = null;
    let fallback = '';
    if (typeof fallbackOrParams === 'object' && fallbackOrParams !== null) {
      interpolateParams = fallbackOrParams;
    } else if (typeof fallbackOrParams === 'string') {
      fallback = fallbackOrParams;
      interpolateParams = params;
    }

    if (val === undefined) {
      val = fallback || key;
    }

    if (interpolateParams && typeof interpolateParams === 'object') {
      return String(val).replace(/\{(\w+)\}/g, (match, paramKey) => {
        return interpolateParams[paramKey] !== undefined ? interpolateParams[paramKey] : match;
      });
    }
    return val;
  };

  const tSkill = (skill) => {
    if (!skill) return '';
    const keyMap = {
      'Electrician': 'skillElectrician',
      'Plumber': 'skillPlumber',
      'Carpenter': 'skillCarpenter',
      'Painter': 'skillPainter',
      'Mason': 'skillMason',
      'AC Repair': 'skillAcRepair',
      'Welder': 'skillWelder',
      'Mechanic': 'skillMechanic',
      'Tailor': 'skillTailor',
      'Cook': 'skillCook'
    };
    const key = keyMap[skill];
    return key ? t(key, skill) : skill;
  };

  const tStatus = (status) => {
    if (!status) return '';
    const keyMap = {
      'Confirmed': 'statusConfirmed',
      'Pending': 'statusPending',
      'In Progress': 'statusInProgress',
      'Completed': 'statusCompleted',
      'Paid': 'statusPaid',
      'Cancelled': 'statusCancelled'
    };
    const key = keyMap[status];
    return key ? t(key, status) : status;
  };

  // Notification Toast state
  const [toast, setToast] = useState(null);

  // Authentication State (rehydrated from the persisted session)
  const [currentUser, setCurrentUser] = useState(boot.currentUser || null);
  const [isRefreshingBookings, setIsRefreshingBookings] = useState(false);
  const [bookingSyncError, setBookingSyncError] = useState('');
  const bookingRefreshInFlight = useRef(false);

  const refreshBookings = useCallback(async () => {
    // Vite embeds VITE_* values at build time. Without a configured API, each
    // device has isolated browser state, so a customer cannot receive a
    // Shramik's acceptance from another device.
    if (!isSupabaseConfigured) {
      setBookingSyncError('Live booking sync is not configured. Set VITE_API_URL for this deployment and redeploy the frontend.');
      return;
    }

    // A customer and Shramik normally use different devices, so accepting a
    // request cannot update the customer's in-memory React state. Always read
    // the authoritative booking row, but avoid overlapping interval/focus
    // requests which can otherwise apply responses out of order.
    if (bookingRefreshInFlight.current) return;
    const hasTarget = role === 'shramik'
      ? Boolean(currentUser?.id || activeShramikId || currentUser?.phone)
      : role === 'customer'
        ? Boolean(currentUser?.id || currentUser?.phone)
        : role === 'admin';
    if (!hasTarget) return;

    bookingRefreshInFlight.current = true;
    setIsRefreshingBookings(true);

    try {
      if (role === 'shramik' && (currentUser?.id || activeShramikId || currentUser?.phone)) {
        const targetId = currentUser?.id || activeShramikId || currentUser?.phone;
        const remoteBookings = await getShramikBookings(targetId);
        if (Array.isArray(remoteBookings)) {
          const mapped = remoteBookings.map((b) => ({
            id: b.id,
            shramikId: b.shramik_id || targetId,
            shramikName: b.shramiks?.name || 'Assigned Worker',
            shramikPhone: b.shramiks?.phone || '',
            skill: b.shramiks?.skill || '',
            serviceName: b.service_name,
            date: b.scheduled_date,
            time: b.scheduled_time,
            customerId: b.customer_id,
            customerName: b.customers?.name || b.customer_name || 'Customer',
            customerPhone: b.customers?.phone || b.customer_phone || '',
            customerAddress: b.customers?.address || b.customer_address || '',
            serviceFee: b.service_fee,
            platformFee: b.platform_fee,
            totalAmount: b.total_amount,
            status: b.status,
            startedAt: b.started_at,
            completedAt: b.completed_at,
            durationMinutes: b.duration_minutes,
            serverBacked: true,
          }));
          setBookings((current) => [...mapped, ...current.filter((booking) => (!mapped.some((remote) => remote.id === booking.id) && (booking.serverBacked || !isSupabaseConfigured)) || booking.status === 'Cancelled')]);
        }
      } else if (role === 'customer' && (currentUser?.id || currentUser?.phone)) {
        const targetId = currentUser?.id || currentUser?.phone;
        const remoteCustomer = await getCustomerBookings(targetId);
        if (Array.isArray(remoteCustomer)) {
          const mapped = remoteCustomer.map((b) => ({
            id: b.id,
            shramikId: b.shramik_id,
            shramikName: b.shramiks?.name || 'Assigned Worker',
            shramikPhone: b.shramiks?.phone || '',
            skill: b.shramiks?.skill || '',
            serviceName: b.service_name,
            date: b.scheduled_date,
            time: b.scheduled_time,
            customerId: b.customer_id,
            customerName: b.customers?.name || b.customer_name || 'Customer',
            customerPhone: b.customers?.phone || b.customer_phone || '',
            customerAddress: b.customers?.address || b.customer_address || '',
            serviceFee: b.service_fee,
            platformFee: b.platform_fee,
            totalAmount: b.total_amount,
            status: b.status,
            startedAt: b.started_at,
            completedAt: b.completed_at,
            durationMinutes: b.duration_minutes,
            serverBacked: true,
          }));
          setBookings((current) => [...mapped, ...current.filter((booking) => (!mapped.some((remote) => remote.id === booking.id) && (booking.serverBacked || !isSupabaseConfigured)) || booking.status === 'Cancelled')]);
        }
      } else if (role === 'admin') {
        const allRemote = await getAllBookings();
        if (Array.isArray(allRemote)) {
          const mappedAll = allRemote.map((b) => ({
            id: b.id,
            shramikId: b.shramik_id,
            shramikName: b.shramiks?.name || b.shramik_name || 'Shramik',
            shramikPhone: b.shramiks?.phone || '',
            skill: b.shramiks?.skill || '',
            serviceName: b.service_name,
            date: b.scheduled_date,
            time: b.scheduled_time,
            customerId: b.customer_id,
            customerName: b.customers?.name || b.customer_name || 'Customer',
            customerPhone: b.customers?.phone || b.customer_phone || '',
            customerAddress: b.customers?.address || b.customer_address || '',
            serviceFee: b.service_fee,
            platformFee: b.platform_fee,
            totalAmount: b.total_amount,
            status: b.status,
            startedAt: b.started_at,
            completedAt: b.completed_at,
            durationMinutes: b.duration_minutes,
            serverBacked: true,
          }));
          setBookings((current) => [...mappedAll, ...current.filter((booking) => !mappedAll.some((remote) => remote.id === booking.id) || booking.status === 'Cancelled')]);
        }
      }
      setBookingSyncError('');
    } catch (err) {
      console.warn('Booking sync warning:', err.message || err);
      setBookingSyncError('Could not refresh booking status. Check your connection and try again.');
    } finally {
      bookingRefreshInFlight.current = false;
      setIsRefreshingBookings(false);
    }
  }, [currentUser?.id, currentUser?.phone, activeShramikId, role]);

  useEffect(() => {
    refreshBookings();
    const interval = setInterval(refreshBookings, 5000);
    return () => clearInterval(interval);
  }, [refreshBookings]);

  const refreshBookingStatus = useCallback(async (bookingId) => {
    if (!isSupabaseConfigured || !bookingId) return null;
    try {
      const remote = await getBookingApi(bookingId);
      const mapped = {
        id: remote.id,
        shramikId: remote.shramik_id,
        shramikName: remote.shramiks?.name || 'Assigned Worker',
        shramikPhone: remote.shramiks?.phone || '',
        skill: remote.shramiks?.skill || '',
        serviceName: remote.service_name,
        date: remote.scheduled_date,
        time: remote.scheduled_time,
        customerId: remote.customer_id,
        customerName: remote.customers?.name || remote.customer_name || 'Customer',
        customerPhone: remote.customers?.phone || remote.customer_phone || '',
        customerAddress: remote.customers?.address || remote.customer_address || '',
        serviceFee: remote.service_fee,
        platformFee: remote.platform_fee,
        totalAmount: remote.total_amount,
        status: remote.status,
        startedAt: remote.started_at,
        completedAt: remote.completed_at,
        durationMinutes: remote.duration_minutes,
        serverBacked: true,
      };
      setBookings((current) => [mapped, ...current.filter((booking) => booking.id !== mapped.id)]);
      setBookingSyncError('');
      return mapped;
    } catch (error) {
      console.warn('Booking status sync warning:', error.message || error);
      setBookingSyncError('Could not refresh booking status. Check your connection and try again.');
      return null;
    }
  }, []);

  // Refresh immediately when the customer returns to the tab instead of
  // making them wait for the next polling interval after a worker accepts.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') refreshBookings();
    };
    window.addEventListener('focus', refreshBookings);
    document.addEventListener('visibilitychange', refreshWhenVisible);
    return () => {
      window.removeEventListener('focus', refreshBookings);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    };
  }, [refreshBookings]);
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(boot.isLoggedIn));

  // Which login tab should be pre-selected (customer | shramik), set by landing CTAs
  const [intendedLoginRole, setIntendedLoginRole] = useState('customer');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Remember the last seen status of each booking so the customer only gets
  // the "accepted" notification once, when a request actually flips from
  // Pending to Confirmed/In Progress (via polling or local actions).
  const tRef = useRef(t);
  useEffect(() => {
    tRef.current = t;
  });
  const seenBookingStatus = useRef({});
  useEffect(() => {
    if (role !== 'customer' || !isLoggedIn) return;
    bookings.forEach((booking) => {
      const previous = seenBookingStatus.current[booking.id];
      const next = booking.status;
      const justAccepted = previous === 'Pending' && (next === 'Confirmed' || next === 'In Progress');
      if (justAccepted) {
        const shramikName = booking.shramikName || 'Shramik';
        showToast(tRef.current('bookingAcceptedToast', 'Your Shramik has accepted your booking. You can start work after they arrive.', { shramik: shramikName }), 'success');
      }
      seenBookingStatus.current[booking.id] = next;
    });
  }, [bookings, role, isLoggedIn]);

  // Shramik-side: detect when the customer starts the job (Confirmed → In Progress)
  // and notify the Shramik with a toast — mirrors the customer notification above.
  const seenBookingStatusForShramik = useRef({});
  useEffect(() => {
    if (role !== 'shramik' || !isLoggedIn) return;
    bookings.forEach((booking) => {
      const previous = seenBookingStatusForShramik.current[booking.id];
      const next = booking.status;
      const justStarted = previous === 'Confirmed' && next === 'In Progress';
      if (justStarted) {
        const customerName = booking.customerName || 'Customer';
        showToast(tRef.current('jobStartedByCustomerToast', 'The customer has started the job — you can begin work!', { customer: customerName }), 'success');
      }
      seenBookingStatusForShramik.current[booking.id] = next;
    });
  }, [bookings, role, isLoggedIn]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    getShramiks()
      .then((rows) => setShramiks(rows.map((row) => ({
        ...row,
        shramikId: row.shramik_id,
        jobsCount: row.jobs_count,
        hourlyRate: row.hourly_rate,
        lastAssignedAt: row.last_assigned_at,
      }))))
      .catch((error) => {
        // Backend unreachable â€” keep the persisted demo workers instead of
        // failing with an error. Remaining flows (register, refresh status,
        // admin sync) already degrade to the local store the same way.
        console.warn('Could not load workers from server, using local data:', error.message || error);
        if (!offlineNoticeShown) {
          offlineNoticeShown = true;
          showToast('Server unreachable â€” running on saved demo workers.', 'info');
        }
      });
  }, []);

  // Persist the auth session so a refresh keeps the user logged in.
  // Passwords never enter the persisted session object (they live in the account store only).
  useEffect(() => {
    const session = {
      isLoggedIn,
      role,
      currentScreen,
      activeShramikId,
      activeBookingId,
    };
    if (currentUser) {
      const { password: _password, ...safeUser } = currentUser;
      session.currentUser = safeUser;
    }
    saveSession(session);
  }, [isLoggedIn, role, currentScreen, activeShramikId, activeBookingId, currentUser]);

  // Persist applied live data (directory + bookings) across refreshes
  useEffect(() => {
    saveAppliedData({ shramiks, bookings });
  }, [shramiks, bookings]);

  // Cross-tab sync: apply login changes / admin approvals made in another tab
  useEffect(() => {
    const onStorage = (event) => {
      if (!event.key) return;
      if (event.key === STORAGE_KEYS.session) {
        const next = loadSession();
        if (!next || !next.isLoggedIn) {
          setCurrentUser(null);
          setIsLoggedIn(false);
          setRole('landing');
          setCurrentScreen('landing');
          return;
        }
        setCurrentUser(next.currentUser || null);
        setIsLoggedIn(true);
        setRole(next.role || 'landing');
        if (next.currentScreen) setCurrentScreen(next.currentScreen);
        if (next.activeShramikId) setActiveShramikId(next.activeShramikId);
        if (next.activeBookingId !== undefined) setActiveBookingId(next.activeBookingId);
      }
      if (event.key === STORAGE_KEYS.data) {
        const next = loadAppliedData();
        if (next) {
          if (next.shramiks) setShramiks(next.shramiks);
          if (next.bookings) setBookings(next.bookings);
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const login = (userData) => {
    if (userData?.role === 'admin' && userData.token) setAdminToken(userData.token);
    if (userData?.role !== 'admin') clearAdminToken();
    setCurrentUser(userData);
    setIsLoggedIn(true);
    setRole(userData.role);
  };

  const logout = () => {
    clearAdminToken();
    clearSession();
    setCurrentUser(null);
    setIsLoggedIn(false);
    setRole('landing');
    setCurrentScreen('landing');
    setActiveBookingId('');
    showToast(t('tLoggedOut', 'Logged out successfully.'), 'info');
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
        // Gate dashboard access behind admin verification
        const targetId = activeShramikId || currentUser?.id;
        const activeShramik = shramiks.find(s => s.id === targetId)
          || (currentUser?.id ? shramiks.find(s => s.id === currentUser.id) : null);
        const verified = activeShramik ? activeShramik.verified : Boolean(currentUser?.verified && currentUser?.shramikId);
        setCurrentScreen(verified ? 'shramik_dashboard' : 'shramik_pending');
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

  // Shramik Registration Flow.
  // A Shramik ID (SS-XXXXXX) is NEVER issued here. The application is queued for
  // admin review; the ID is generated server-side only when an admin approves
  // the profile (see the `approve_shramik` RPC).
  const registerShramik = async (formData) => {
    const newId = `shr-${Date.now()}`;
    const expectedRate = Number(formData.expectedHourlyRate ?? formData.hourlyRate ?? 250) || 250;
    const newShramik = {
      id: newId,
      name: formData.fullName || 'New Shramik',
      skill: formData.primarySkill || 'Electrician',
      verified: false,
      shramikId: null,
      rating: 0,
      jobsCount: 0,
      distance: '1.8 km away',
      hourlyRate: expectedRate,
      phone: formData.phone || '+91 98000 00000',
      city: formData.city || 'Kolkata',
      area: formData.serviceArea || 'Salt Lake',
      experience: formData.experience || '3 years',
      services: formData.selectedServices || ['General Repair'],
      photo: formData.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=250&auto=format&fit=crop&q=80',
      bio: 'Skilled local technician dedicated to quality and safety.',
      registeredOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      registeredAt: new Date().toISOString(),
      pendingSince: 'Just now'
    };

    if (isSupabaseConfigured) {
      try {
        const savedShramik = await createShramik({
          name: newShramik.name,
          skill: newShramik.skill,
          phone: newShramik.phone,
          city: newShramik.city,
          area: newShramik.area,
          experience: newShramik.experience,
          services: newShramik.services,
          photo: newShramik.photo,
          bio: newShramik.bio,
          hourly_rate: expectedRate,
          password: formData.password,
        });
        if (savedShramik?.id) newShramik.id = savedShramik.id;
      } catch (error) {
        console.warn('Shramik registration fell back to local storage:', error.message || error);
        showToast('Server is unavailable right now — your registration has been saved locally and will stay pending review.', 'info');
      }
    }

    const shramikUser = {
      ...newShramik,
      age: formData.age,
      password: formData.password,
      role: 'shramik',
      verified: false,
      shramikId: null,
    };

    upsertAccount(shramikUser);
    setShramiks(prev => [newShramik, ...prev]);
    setActiveShramikId(newShramik.id);
    login(shramikUser);
    setCurrentScreen('shramik_pending');
    showToast('Registration submitted! Verification pending admin review.', 'info');
    return true;
  };

  // Admin Approval Action â€” the ONLY place a Shramik ID is issued.
  // The server-side RPC (approve_shramik) flips verified=true and generates SS-XXXXXX.
  const approveShramik = async (id) => {
    let approved;
    try {
      approved = await approveShramikApi(id);
    } catch (error) {
      // In a configured deployment an approval is valid only after it has
      // reached the server. This prevents devices seeing different states.
      return showToast(`Approval could not be saved: ${error.message}`, 'error');
    }

    const shramikId = approved.shramik_id;
    setShramiks(prev => prev.map(worker => worker.id === id
      ? { ...worker, verified: true, shramikId }
      : worker));

    const worker = shramiks.find(w => w.id === id);
    if (worker) {
      updateAccount('shramik', worker.phone, { verified: true, shramikId });
      if (currentUser?.role === 'shramik' && currentUser.phone === worker.phone) {
        setCurrentUser(prev => prev ? { ...prev, verified: true, shramikId } : prev);
      }
    }
    showToast(
      `Shramik Approved! Assigned ID: ${shramikId}`,
      'success'
    );
  };

  // Admin Reject Action
  const rejectShramik = async (id) => {
    const worker = shramiks.find(s => s.id === id);
    if (isSupabaseConfigured) {
      try {
        await rejectShramikApi(id);
      } catch (error) {
        showToast(`Rejection could not be saved: ${error.message}`, 'error');
        return false;
      }
    }
    setShramiks(prev => prev.filter(s => s.id !== id));
    if (worker) removeAccount('shramik', worker.phone);
    showToast('Shramik registration rejected.', 'error');
    return true;
  };

  // Pending Shramik: re-check whether the admin has approved the application
  const refreshShramikStatus = async () => {
    if (currentUser?.role !== 'shramik' || !currentUser?.phone) {
      showToast('Sign in as a Shramik to check approval status.', 'error');
      return;
    }
    const phone = currentUser.phone;
    try {
      if (isSupabaseConfigured) {
        try {
          const match = await getShramikStatus(phone);
          const verified = Boolean(match.verified);
          const shramikId = match.shramikId || null;
          setShramiks(prev => prev.map(s => s.id === match.id || s.phone === phone ? { ...s, id: match.id, verified, shramikId } : s));
          updateAccount('shramik', phone, { id: match.id, verified, shramikId });
          setActiveShramikId(match.id);
          setCurrentUser(prev => prev ? { ...prev, id: match.id, verified, shramikId } : prev);
          showToast(verified ? `Approved! Your Shramik ID is ${shramikId}.` : 'Still under admin review.', verified ? 'success' : 'info');
          setCurrentScreen(verified ? 'shramik_dashboard' : 'shramik_pending');
          return;
        } catch (error) {
          console.warn('refreshShramikStatus: API unreachable, using local store:', error.message || error);
        }
      }
      const account = findAccount('shramik', phone);
      if (account?.verified && account?.shramikId) {
        setShramiks(prev => prev.map(s => s.id === (account.id || activeShramikId) ? { ...s, verified: true, shramikId: account.shramikId } : s));
        setCurrentUser(prev => prev ? { ...prev, verified: true, shramikId: account.shramikId } : prev);
        showToast(`Approved! Your Shramik ID is ${account.shramikId}.`, 'success');
        setCurrentScreen('shramik_dashboard');
        return;
      }
      showToast(
        account ? 'Still under admin review. Please check back later.' : 'No registration found for this phone number.',
        account ? 'info' : 'error'
      );
    } catch (error) {
      showToast(`Could not refresh status: ${error.message}`, 'error');
    }
  };

  // Poll/re-sync the pending-approval queue for the admin portal.
  // Source of truth is the server (unverified rows for this city); when the
  // API is unreachable it falls back to the persisted local account store so
  // the offline demo keeps working. Merges into the shared `shramiks` state so
  // the dashboard, sidebar badge, and approvals table all stay in sync.
  const syncPendingApprovals = useCallback(async (city) => {
    const cityInput = city || currentUser?.city;

    let remoteRows = [];
    let serverSynced = false;
    if (isSupabaseConfigured) {
      try {
        remoteRows = await getPendingShramiks();
        serverSynced = true;
      } catch (error) {
        console.warn('syncPendingApprovals: server sync failed:', error.message || error);
      }
    }

    // In live mode only the server's queue is authoritative. Local rows are
    // used exclusively by the intentionally offline demo, avoiding requests
    // from a previous device/session appearing in a real admin queue.
    const localRows = (!isSupabaseConfigured || !serverSynced ? loadAccounts() : [])
      .filter((a) => a.role === 'shramik' && !a.verified)
      .map((account) => ({
        id: account.id,
        name: account.name,
        skill: account.skill || account.primarySkill || 'General Repair',
        verified: false,
        shramikId: null,
        rating: account.rating || 0,
        jobsCount: 0,
        distance: account.distance || 'New nearby worker',
        hourlyRate: account.hourlyRate || 250,
        phone: account.phone,
        city: account.city,
        area: account.area || account.serviceArea || 'Local Area',
        experience: account.experience || '3 years',
        services: account.services || ['General Repair'],
        photo: account.photo,
        bio: account.bio || 'Skilled local technician dedicated to quality and safety.',
        pendingSince: 'Just now',
      }));

    const keyOf = (worker) => (worker.phone ? `p:${worker.phone}` : `i:${worker.id || ''}`);
    const merged = remoteRows.map((row) => ({
      id: row.id,
      name: row.name,
      skill: row.skill,
      verified: Boolean(row.verified),
      shramikId: row.shramik_id || null,
      rating: Number(row.rating) || 0,
      jobsCount: Number(row.jobs_count) || 0,
      distance: row.distance || 'New nearby worker',
      hourlyRate: Number(row.hourly_rate) || 250,
      phone: row.phone,
      city: row.city,
      area: row.area,
      experience: row.experience,
      services: row.services || [],
      photo: row.photo,
      bio: row.bio,
      pendingSince: 'Just now',
    }));
    for (const local of localRows) {
      if (!merged.some((w) => keyOf(w) === keyOf(local))) merged.push(local);
    }

    setShramiks((prev) => {
      // A successful server sync is a snapshot of this admin's pending city
      // queue. Remove stale pending rows first (for example, when another
      // same-city admin has just approved or rejected one), then merge the
      // returned snapshot. Keep verified workers and other-city data intact.
      const retained = serverSynced
        ? prev.filter((w) => w.verified || (cityInput && !sameCity(w.city, cityInput)))
        : prev;
      const next = new Map(retained.map((w) => [keyOf(w), w]));
      for (const w of merged) next.set(keyOf(w), w);
      return Array.from(next.values());
    });

    return merged
      .filter((w) => !cityInput || sameCity(w.city, cityInput))
      .sort((a, b) => (a.city || '').localeCompare(b.city || ''));
  }, [currentUser]);

  // When an admin opens the portal (dashboard/approvals), pull the latest
  // pending requests for their city once, so new signups appear without a reload.
  const autoSyncedCity = useRef(null);
  useEffect(() => {
    if (role !== 'admin' || !currentUser?.city) return;
    const cityKey = normalizeCity(currentUser.city);
    if (autoSyncedCity.current === cityKey) return;
    autoSyncedCity.current = cityKey;
    syncPendingApprovals(currentUser.city);
  }, [role, currentUser, syncPendingApprovals]);

  // Booking Flow Actions
  // Local/demo preview of the same fair policy used by the server. It is only
  // a preview: the API makes the final assignment atomically when booking.
  const selectWorkerForBooking = ({ service, date, time }) => {
    const city = String(currentUser?.city || '').split('|')[0].trim().toLowerCase();
    const busyIds = new Set(bookings
      .filter((booking) => booking.date === date && booking.time === time && ['Pending', 'Confirmed', 'In Progress'].includes(booking.status))
      .map((booking) => booking.shramikId));
    const candidates = shramiks
      .filter((worker) => worker.verified && (!city || String(worker.city || '').split('|')[0].trim().toLowerCase() === city))
      .filter((worker) => worker.skill === service || worker.services?.some((item) => item === service))
      .filter((worker) => !busyIds.has(worker.id))
      .sort((a, b) => String(a.lastAssignedAt || '').localeCompare(String(b.lastAssignedAt || '')) || String(a.id).localeCompare(String(b.id)));
    const selected = candidates[0];
    if (!selected) {
      showToast('No verified Shramik is free for this service and time slot.', 'error');
      return false;
    }
    setSelectedWorkerId(selected.id);
    return true;
  };

  const createBooking = async () => {
    const worker = shramiks.find(s => s.id === selectedWorkerId) || shramiks[0];
    if (!worker || !bookingDraft.service || !bookingDraft.date || !bookingDraft.time) {
      showToast('Choose a service, date and time before confirming the booking.', 'error');
      setCurrentScreen('slot');
      return false;
    }
    const newBookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;

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
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      try {
        const savedBooking = await createBookingApi({
          shramikId: worker.id,
          serviceName: newBooking.serviceName,
          date: newBooking.date,
          time: newBooking.time,
          customerName: newBooking.customerName,
          customerPhone: newBooking.customerPhone,
          customerAddress: newBooking.customerAddress,
          customerCity: currentUser?.city || '',
          platformFee: newBooking.platformFee,
        });
        if (!savedBooking?.id) throw new Error('The server returned an incomplete booking response.');
        newBooking.id = savedBooking.id;
        newBooking.serverBacked = true;
        const assigned = savedBooking.assigned_shramik;
        if (assigned?.id) {
          const assignedWorker = {
            ...assigned,
            shramikId: assigned.shramik_id,
            hourlyRate: Number(assigned.hourly_rate) || worker.hourlyRate,
            lastAssignedAt: assigned.last_assigned_at,
          };
          newBooking.shramikId = assignedWorker.id;
          newBooking.skill = assignedWorker.skill;
          newBooking.serviceFee = assignedWorker.hourlyRate * 2;
          newBooking.totalAmount = newBooking.serviceFee + newBooking.platformFee;
          setSelectedWorkerId(assignedWorker.id);
          setShramiks((current) => current.some((item) => item.id === assignedWorker.id)
            ? current.map((item) => item.id === assignedWorker.id ? { ...item, ...assignedWorker } : item)
            : [...current, assignedWorker]);
        }
      } catch (error) {
        // A live deployment must not pretend a booking was routed when the
        // server did not persist it. Offline mode remains available only when
        // VITE_API_URL is intentionally omitted.
        console.error('Booking was not saved on the server:', error.message || error);
        showToast(`Booking could not be sent: ${error.message || 'server error'}`, 'error');
        setCurrentScreen('booking_confirm');
        return false;
      }
    }

    setBookings(prev => [newBooking, ...prev]);
    setShramiks(prev => prev.map((item) => item.id === newBooking.shramikId
      ? { ...item, lastAssignedAt: new Date().toISOString() }
      : item));
    setActiveBookingId(newBooking.id);
    setCurrentScreen('track_booking');
    showToast('Booking request sent. The Shramik will review and accept it.', 'success');
    return true;
  };

  // The Shramik accepts the request. The customer starts work after arrival.
  const acceptBooking = async (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking || booking.status !== 'Pending') return false;
    if (!isSupabaseConfigured) {
      showToast('Live booking acceptance is unavailable. Configure VITE_API_URL and redeploy this frontend.', 'error');
      return false;
    }
    // On a live deployment a local-only (non-server) booking can never reach the
    // customer. Refuse loudly instead of showing a fake success.
    if (isSupabaseConfigured && !booking.serverBacked) {
      showToast('This request is not connected to the server. Refresh your bookings and try again.', 'error');
      return false;
    }
    try {
      await acceptBookingApi(bookingId);
    } catch (error) {
      showToast(error.message || 'Could not accept this request.', 'error');
      return false;
    }
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'Confirmed' } : b));
    await refreshBookings();
    showToast('Booking accepted. The customer can start work after you arrive.', 'success');
    return true;
  };

  const rejectBooking = async (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking || booking.status !== 'Pending') return false;
    if (isSupabaseConfigured && !booking.serverBacked) {
      showToast('This request is not connected to the server. Refresh your bookings and try again.', 'error');
      return false;
    }
    try {
      if (isSupabaseConfigured) await rejectBookingApi(bookingId);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'Cancelled' } : b));
      if (isSupabaseConfigured) await refreshBookings();
      showToast('Booking request declined.', 'info');
      return true;
    } catch (error) {
      showToast(error.message || 'Could not decline this request.', 'error');
      return false;
    }
  };

  // Customer / Shramik Cancels Booking — fully removes from list
  const cancelBooking = (bookingId) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
    saveAppliedData({ shramiks, bookings: bookings.filter(b => b.id !== bookingId) });
    showToast('Booking cancelled successfully.', 'info');
  };

  // The customer starts the job after the accepted Shramik arrives.
  const startWork = async (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking || booking.status !== 'Confirmed') return false;
    if (!booking.serverBacked) {
      showToast('This booking is not connected to the server. Refresh and try again.', 'error');
      return false;
    }
    try {
      await startBookingApi(bookingId);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'In Progress' } : b));
      showToast('Work started successfully.', 'success');
      return true;
    } catch (error) {
      showToast(error.message || 'Could not start this job.', 'error');
      return false;
    }
    // Always update local state — works offline and triggers cross-tab sync.
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'In Progress' } : b));
    showToast('Job started! The Shramik has been notified and can begin work.', 'success');
    return true;
  };

  // Customer Confirms Work Completion
  const confirmWorkDone = async (bookingId, finalServiceFee) => {
    const booking = bookings.find(b => b.id === bookingId);
    const serviceFee = Number(finalServiceFee || booking?.serviceFee);
    if (!Number.isInteger(serviceFee) || serviceFee <= 0) {
      showToast('Enter a valid final job amount.', 'error');
      return false;
    }
    if (booking?.serverBacked) {
      try {
        await completeBookingApi(bookingId, serviceFee);
      } catch (error) {
        showToast(error.message || 'Could not confirm work completion.', 'error');
        return false;
      }
    }
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'Completed', serviceFee, totalAmount: serviceFee + Number(b.platformFee || 0) } : b));
    showToast('Work completed. The customer can now choose cash or online payment.', 'success');
    return true;
  };

  // Customer Payment
  const processPayment = async (bookingId, paymentMethod) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking?.serverBacked) {
      try {
        await payBookingApi(bookingId, paymentMethod);
      } catch (error) {
        showToast(error.message || 'Could not process payment.', 'error');
        return false;
      }
    }
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'Paid', paymentMethod } : b));
    
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
    showToast(`â‚¹${booking?.totalAmount || 550} Paid Successfully! Thank you for using Shram Setu.`, 'success');
    return true;
  };

  // Quick Demo Step Launcher (Backbone Flow Preset)
  const jumpToDemoStep = (stepNumber) => {
    if (stepNumber === 1) { // Shramik Signup
      switchRole('shramik');
      setCurrentScreen('shramik_signup');
    } else if (stepNumber === 2) { // Shramik Pending
      switchRole('shramik');
      setActiveShramikId('shr-1');
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
    } else if (stepNumber === 6) { // Customer starts an accepted booking
      switchRole('customer');
      setActiveBookingId('BK-8891');
      setCurrentScreen('track_booking');
    } else if (stepNumber === 7) { // Shramik waits for customer to start work
      switchRole('shramik');
      setActiveShramikId('shr-1');
      setCurrentScreen('shramik_job');
    } else if (stepNumber === 8) { // Customer Work Completion & Payment
      switchRole('customer');
      setActiveBookingId('BK-8891');
      setCurrentScreen('track_booking');
    } else if (stepNumber === 9) { // Payment Screen
      switchRole('customer');
      setActiveBookingId('BK-8891');
      setCurrentScreen('payment');
    }
  };

  // Admin Add Booking
  const addAdminBooking = (bookingData) => {
    setBookings(prev => [bookingData, ...prev]);
  };

  // Admin Update Booking Status
  const updateBookingStatus = (bookingId, status) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
    showToast(`Booking ${bookingId} status updated to ${status}.`, 'info');
  };

  // Admin Delete Booking
  const deleteBooking = (bookingId) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
    showToast(`Booking ${bookingId} deleted.`, 'info');
  };

  // Admin Add Shramik
  const addAdminShramik = (shramikData) => {
    setShramiks(prev => [shramikData, ...prev]);
    upsertAccount({
      ...shramikData,
      role: 'shramik',
    });
  };

  // Admin Toggle Shramik Active/Inactive Status
  const toggleShramikStatus = (shramikId) => {
    setShramiks(prev => prev.map(s => {
      if (s.id === shramikId) {
        const currentlyActive = s.isActive !== false && s.status !== 'Inactive';
        const nextStatus = currentlyActive ? 'Inactive' : (s.verified ? 'Verified' : 'Pending');
        return {
          ...s,
          isActive: !currentlyActive,
          status: nextStatus
        };
      }
      return s;
    }));
  };

  // Admin Delete Shramik
  const deleteShramik = (shramikId) => {
    const worker = shramiks.find(s => s.id === shramikId);
    setShramiks(prev => prev.filter(s => s.id !== shramikId));
    if (worker?.phone) {
      removeAccount('shramik', worker.phone);
    }
  };

  return (
    <AppContext.Provider value={{
      role,
      switchRole,
      currentScreen,
      setCurrentScreen,
      shramiks,
      setShramiks,
      addAdminShramik,
      toggleShramikStatus,
      deleteShramik,
      bookings,
      refreshBookings,
      refreshBookingStatus,
      isRefreshingBookings,
      bookingSyncError,
      selectedWorkerId,
      setSelectedWorkerId,
      activeBookingId,
      setActiveBookingId,
      activeShramikId,
      setActiveShramikId,
      bookingDraft,
      setBookingDraft,
      selectWorkerForBooking,
      registerShramik,
      approveShramik,
      rejectShramik,
      refreshShramikStatus,
      syncPendingApprovals,
      createBooking,
      acceptBooking,
      rejectBooking,
      startWork,
      confirmWorkDone,
      processPayment,
      cancelBooking,
      addAdminBooking,
      updateBookingStatus,
      deleteBooking,
      jumpToDemoStep,
      toast,
      showToast,
      intendedLoginRole,
      setIntendedLoginRole,
      searchCategory,
      setSearchCategory,
      selectedJob,
      setSelectedJob,
      currentUser,
      isLoggedIn,
      login,
      logout,
      language,
      setLanguage,
      selectedLocation,
      setSelectedLocation,
      isSettingsOpen,
      setIsSettingsOpen,
      openSettings,
      closeSettings,
      toggleSettings,
      t,
      tSkill,
      tStatus,
      LANGUAGES
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
