import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Toast } from './components/Toast';
<<<<<<< HEAD
=======
import { SettingsModal } from './components/SettingsModal';
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';

import { CustomerSearch } from './pages/customer/CustomerSearch';
import { WorkerProfile } from './pages/customer/WorkerProfile';
import { SlotSelection } from './pages/customer/SlotSelection';
import { BookingConfirmation } from './pages/customer/BookingConfirmation';
import { TrackBooking } from './pages/customer/TrackBooking';
import { PaymentPage } from './pages/customer/PaymentPage';

import { ShramikSignup } from './pages/shramik/ShramikSignup';
import { ShramikPending } from './pages/shramik/ShramikPending';
import { ShramikDashboard } from './pages/shramik/ShramikDashboard';
import { ShramikJobScreen } from './pages/shramik/ShramikJobScreen';
<<<<<<< HEAD

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminPendingApprovals } from './pages/admin/AdminPendingApprovals';
=======
import { ShramikEarnings } from './pages/shramik/ShramikEarnings';
import { ShramikCutRatio } from './pages/shramik/ShramikCutRatio';
import { ShramikPaymentHistory } from './pages/shramik/ShramikPaymentHistory';
import { ShramikGrievance } from './pages/shramik/ShramikGrievance';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminPendingApprovals } from './pages/admin/AdminPendingApprovals';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminBookings } from './pages/admin/AdminBookings';
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4

const MainContent = () => {
  const { currentScreen, role, isLoggedIn } = useApp();

  // Smooth scroll to top whenever screen changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentScreen]);

  const isCustomerServiceScreen = ['search', 'profile', 'slot', 'booking_confirm', 'track_booking', 'payment'].includes(currentScreen);
<<<<<<< HEAD
  const isShramikPrivateScreen = ['shramik_dashboard', 'shramik_job'].includes(currentScreen);
=======
  const isShramikPrivateScreen = ['shramik_dashboard', 'shramik_job', 'shramik_earnings', 'shramik_cut_ratio', 'shramik_payment_history', 'shramik_grievance'].includes(currentScreen);
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
  const isAdminPrivateScreen = currentScreen.startsWith('admin_');

  const requiresLogin = !isLoggedIn && (isCustomerServiceScreen || isShramikPrivateScreen || isAdminPrivateScreen);

  // Screen selection strictly isolated by active role
  const renderScreen = () => {
    if (requiresLogin) {
      return <LoginPage />;
    }

    if (!isLoggedIn) {
      if (currentScreen === 'login') return <LoginPage />;
      return <LandingPage />;
    }

    // STRICT CUSTOMER PORTAL
    if (role === 'customer') {
      if (currentScreen === 'profile') return <WorkerProfile />;
      if (currentScreen === 'slot') return <SlotSelection />;
      if (currentScreen === 'booking_confirm') return <BookingConfirmation />;
      if (currentScreen === 'track_booking') return <TrackBooking />;
      if (currentScreen === 'payment') return <PaymentPage />;
      return <CustomerSearch />;
    }

    // STRICT SHRAMIK PORTAL
    if (role === 'shramik') {
      if (currentScreen === 'shramik_job') return <ShramikJobScreen />;
<<<<<<< HEAD
=======
      if (currentScreen === 'shramik_earnings') return <ShramikEarnings />;
      if (currentScreen === 'shramik_cut_ratio') return <ShramikCutRatio />;
      if (currentScreen === 'shramik_payment_history') return <ShramikPaymentHistory />;
      if (currentScreen === 'shramik_grievance') return <ShramikGrievance />;
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
      if (currentScreen === 'shramik_pending') return <ShramikPending />;
      if (currentScreen === 'shramik_signup') return <ShramikSignup />;
      return <ShramikDashboard />;
    }

    // STRICT ADMIN PORTAL
    if (role === 'admin') {
      if (currentScreen === 'admin_approvals') return <AdminPendingApprovals />;
<<<<<<< HEAD
=======
      if (currentScreen === 'admin_settings') return <AdminSettings />;
      if (currentScreen === 'admin_bookings') return <AdminBookings />;
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
      return <AdminDashboard />;
    }

    return <LandingPage />;
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
=======
    <div className="min-h-screen text-slate-900  flex flex-col font-sans transition-colors duration-300">
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
      {/* Main Navbar (Sticky at top, hidden for admin which has dedicated sidebar console) */}
      {role !== 'admin' && <Navbar />}

      {/* Screen Router with Smooth Animated Transition */}
      <div key={`${role}-${currentScreen}`} className="flex-1 animate-page-enter">
        {renderScreen()}
      </div>

<<<<<<< HEAD
=======
      {/* Settings Preferences Modal */}
      <SettingsModal />

>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
      {/* Floating Notifications */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
