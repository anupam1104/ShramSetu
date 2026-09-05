import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

export const SlotSelection = () => {
  const { shramiks, selectedWorkerId, setBookingDraft, setCurrentScreen } = useApp();
  const worker = shramiks.find(s => s.id === selectedWorkerId) || shramiks[0];

  const dates = [
    { day: 'Mon', date: '10', full: '10 September 2026' },
    { day: 'Tue', date: '11', full: '11 September 2026' },
    { day: 'Wed', date: '12', full: '12 September 2026' },
    { day: 'Thu', date: '13', full: '13 September 2026' },
    { day: 'Fri', date: '14', full: '14 September 2026' }
  ];

  const timeSlots = [
    { time: '09:00 AM', available: true },
    { time: '11:00 AM', available: true },
    { time: '01:00 PM', available: false }, // Booked slot example
    { time: '03:00 PM', available: true },
    { time: '05:00 PM', available: true },
    { time: '07:00 PM', available: true }
  ];

  const [selectedDate, setSelectedDate] = useState(dates[1].full);
  const [selectedTime, setSelectedTime] = useState('03:00 PM');
  const [selectedService, setSelectedService] = useState(worker.services[0] || 'Electrical Repair');

  const handleConfirmSlot = () => {
    setBookingDraft({
      date: selectedDate,
      time: selectedTime,
      service: selectedService
    });
    setCurrentScreen('booking_confirm');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto space-y-6">
      
      <button
        onClick={() => setCurrentScreen('profile')}
        className="text-slate-600 hover:text-slate-900 text-sm font-semibold flex items-center gap-1"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Profile
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6">
        
        <div className="space-y-1">
          <span className="text-emerald-700 bg-emerald-100 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
            Step 2 of 3 • Select Slot
          </span>
          <h1 className="text-2xl font-bold font-heading text-slate-900 pt-2">
            Schedule Appointment with {worker.name}
          </h1>
          <p className="text-xs text-slate-500">
            Choose your preferred date and available time slot.
          </p>
        </div>

        {/* Service Type Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Select Required Service
          </label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
          >
            {worker.services.map((srv, idx) => (
              <option key={idx} value={srv}>{srv}</option>
            ))}
          </select>
        </div>

        {/* Date Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
            <Calendar className="w-4 h-4 text-emerald-600" />
            Select Date
          </label>

          <div className="grid grid-cols-5 gap-2">
            {dates.map((d) => (
              <button
                key={d.date}
                type="button"
                onClick={() => setSelectedDate(d.full)}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                  selectedDate === d.full
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-4 ring-emerald-100'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span className="text-xs font-medium uppercase opacity-80">{d.day}</span>
                <span className="text-lg font-bold font-mono">{d.date}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Time Slots Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-4 h-4 text-emerald-600" />
            Available Time Slots
          </label>

          <div className="grid grid-cols-2 gap-3">
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                type="button"
                disabled={!slot.available}
                onClick={() => setSelectedTime(slot.time)}
                className={`py-3.5 px-4 rounded-xl border text-sm font-bold font-mono transition-all flex items-center justify-between ${
                  !slot.available
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                    : selectedTime === slot.time
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-2 ring-emerald-500 shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                }`}
              >
                <span>{slot.time}</span>
                {!slot.available ? (
                  <span className="text-[10px] font-sans text-red-500 font-semibold no-underline">Booked</span>
                ) : selectedTime === slot.time ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : null}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleConfirmSlot}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all text-sm flex items-center justify-center space-x-2 mt-4"
        >
          <span>Proceed to Summary</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
