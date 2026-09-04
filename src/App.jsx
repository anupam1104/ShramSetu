import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { DemoToolbar } from './components/DemoToolbar';
import { Toast } from './components/Toast';

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

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminPendingApprovals } from './pages/admin/AdminPendingApprovals';

const MainContent = () => {
  const { currentScreen, role } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* SIH Presentation Demo Bar */}
      <DemoToolbar />

      {/* Main Navbar (Hidden on standalone admin screens if desired, or kept consistent) */}
      {role !== 'admin' && <Navbar />}

      {/* Screen Router */}
      <div className="flex-1">
        {currentScreen === 'landing' && <LandingPage />}
        {currentScreen === 'login' && <LoginPage />}

        {/* Customer Flow */}
        {currentScreen === 'search' && <CustomerSearch />}
        {currentScreen === 'profile' && <WorkerProfile />}
        {currentScreen === 'slot' && <SlotSelection />}
        {currentScreen === 'booking_confirm' && <BookingConfirmation />}
        {currentScreen === 'track_booking' && <TrackBooking />}
        {currentScreen === 'payment' && <PaymentPage />}

        {/* Shramik Flow */}
        {currentScreen === 'shramik_signup' && <ShramikSignup />}
        {currentScreen === 'shramik_pending' && <ShramikPending />}
        {currentScreen === 'shramik_dashboard' && <ShramikDashboard />}
        {currentScreen === 'shramik_job' && <ShramikJobScreen />}

        {/* Admin Flow */}
        {(currentScreen === 'admin_dashboard' || (role === 'admin' && currentScreen === 'landing')) && <AdminDashboard />}
        {currentScreen === 'admin_approvals' && <AdminPendingApprovals />}
      </div>

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
