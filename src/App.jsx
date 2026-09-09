import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Toast } from './components/Toast';
import { SettingsModal } from './components/SettingsModal';

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
import { ShramikEarnings } from './pages/shramik/ShramikEarnings';
import { ShramikCutRatio } from './pages/shramik/ShramikCutRatio';
import { ShramikPaymentHistory } from './pages/shramik/ShramikPaymentHistory';
import { ShramikGrievance } from './pages/shramik/ShramikGrievance';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminPendingApprovals } from './pages/admin/AdminPendingApprovals';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminBookings } from './pages/admin/AdminBookings';

const MainContent = () => {
  const { currentScreen, role, isLoggedIn, activeShramikId, shramiks, currentUser } = useApp();

  // Smooth scroll to top whenever screen changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentScreen]);

  const isCustomerServiceScreen = ['search', 'profile', 'slot', 'booking_confirm', 'track_booking', 'payment'].includes(currentScreen);
  const isShramikPrivateScreen = ['shramik_dashboard', 'shramik_job', 'shramik_earnings', 'shramik_cut_ratio', 'shramik_payment_history', 'shramik_grievance'].includes(currentScreen);
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
      // Dashboard and job screens stay LOCKED until an admin
      // approves the profile and issues the Shramik ID.
      const activeShramik = shramiks.find(s => s.id === activeShramikId)
        || (currentUser?.id ? shramiks.find(s => s.id === currentUser.id) : null);
      const isVerified = activeShramik ? activeShramik.verified : Boolean(currentUser?.verified && currentUser?.shramikId);

      if (!isVerified) {
        if (currentScreen === 'shramik_signup') return <ShramikSignup />;
        return <ShramikPending />;
      }

      if (currentScreen === 'shramik_job') return <ShramikJobScreen />;
      if (currentScreen === 'shramik_earnings') return <ShramikEarnings />;
      if (currentScreen === 'shramik_cut_ratio') return <ShramikCutRatio />;
      if (currentScreen === 'shramik_payment_history') return <ShramikPaymentHistory />;
      if (currentScreen === 'shramik_grievance') return <ShramikGrievance />;
      if (currentScreen === 'shramik_pending') return <ShramikPending />;
      if (currentScreen === 'shramik_signup') return <ShramikSignup />;
      return <ShramikDashboard />;
    }

    // STRICT ADMIN PORTAL
    if (role === 'admin') {
      if (currentScreen === 'admin_approvals') return <AdminPendingApprovals />;
      if (currentScreen === 'admin_settings') return <AdminSettings />;
      if (currentScreen === 'admin_bookings') return <AdminBookings />;
      return <AdminDashboard />;
    }

    return <LandingPage />;
  };

  return (
    <div className="min-h-screen text-slate-900  flex flex-col font-sans transition-colors duration-300">
      {/* Main Navbar (Sticky at top, hidden for admin which has dedicated sidebar console) */}
      {role !== 'admin' && <Navbar />}

      {/* Screen Router with Smooth Animated Transition */}
      <div key={`${role}-${currentScreen}`} className="flex-1 animate-page-enter">
        {renderScreen()}
      </div>

      {/* Settings Preferences Modal */}
      <SettingsModal />

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
