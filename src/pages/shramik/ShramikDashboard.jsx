import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Phone
} from 'lucide-react';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

export const ShramikDashboard = () => {
  const { shramiks, activeShramikId, bookings, setCurrentScreen, setActiveBookingId, currentUser } = useApp();
  
  const [greeting, setGreeting] = useState(getGreeting());

  // Live update the greeting as the time of day changes
  useEffect(() => {
    const now = new Date();
    const msToNextMinute = (60 - now.getSeconds()) * 1000;
    const timer = setTimeout(() => setGreeting(getGreeting()), msToNextMinute);
    return () => clearTimeout(timer);
  }, [greeting]);

  const currentShramik = shramiks.find(s => s.id === activeShramikId) || shramiks[0];
  const activeBooking = bookings.find(b => (b.shramikId === currentShramik.id || b.id === 'BK-8891') && !['Cancelled','Completed','Paid'].includes(b.status)) || null;

  // Prefer the actual logged-in Shramik identity for display
  const displayName = currentUser?.name || currentShramik.name;
  const displaySkill = currentUser?.skill || currentShramik.skill;
  const displayId = currentUser?.shramikId || currentShramik.shramikId || 'SS-10101';
  const displayCity = currentUser?.city || currentShramik.city;

  const handleOpenJob = (bookingId) => {
    setActiveBookingId(bookingId);
    setCurrentScreen('shramik_job');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 pb-20">
      
      {/* Top Greeting Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {displayId}
            </span>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              ✓ Verified
            </span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            {greeting}, {displayName.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-emerald-100/80">
            Primary Skill: <strong>{displaySkill}</strong> • {displayCity}
          </p>
        </div>
      </div>

      {/* Today's Jobs Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            Today's Jobs
          </h2>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            1 Active Schedule
          </span>
        </div>

        {/* Active Job Card */}
        {activeBooking ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md hover:shadow-lg transition-all space-y-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-sm font-mono shadow-inner">
                  3:00 PM
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{activeBooking.serviceName}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Customer: <strong>{activeBooking.customerName}</strong>
                  </p>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                activeBooking.status === 'In Progress' ? 'badge-in-progress' :
                activeBooking.status === 'Completed' ? 'badge-completed' :
                activeBooking.status === 'Paid' ? 'badge-paid' : 'badge-confirmed'
              }`}>
                ● {activeBooking.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
              <div className="flex items-start space-x-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">Service Address</p>
                  <p className="text-slate-600 mt-0.5">{activeBooking.customerAddress}</p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-emerald-950 font-medium">
                <div>
                  <p className="text-[10px] text-emerald-800 uppercase font-bold">Estimated Payout</p>
                  <p className="text-lg font-bold font-mono text-emerald-900">₹{activeBooking.serviceFee}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500">Distance</p>
                  <p className="text-xs font-bold text-slate-800">{activeBooking.distance || '2.1 km'}</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleOpenJob(activeBooking.id)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm"
              >
                <span>View Job & Enter Start Code</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center shadow-sm">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">No bookings done yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Once a customer books your service, the job details will appear here.
            </p>
            <span className="inline-flex items-center gap-1.5 mt-4 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-200">
              <Clock className="w-3.5 h-3.5" />
              Waiting for incoming bookings
            </span>
          </div>
        )}

      </div>

    </div>
  );
};
