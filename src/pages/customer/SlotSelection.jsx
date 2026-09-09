import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

export const SlotSelection = () => {
  const { bookingDraft, setBookingDraft, setCurrentScreen, t, tSkill } = useApp();
  const dates = [
    { day: 'Mon', date: '10', full: '10 September 2026' }, { day: 'Tue', date: '11', full: '11 September 2026' },
    { day: 'Wed', date: '12', full: '12 September 2026' }, { day: 'Thu', date: '13', full: '13 September 2026' }, { day: 'Fri', date: '14', full: '14 September 2026' },
  ];
  const timeSlots = ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM', '07:00 PM'];
  const [selectedDate, setSelectedDate] = useState(bookingDraft.date || dates[1].full);
  const [selectedTime, setSelectedTime] = useState(bookingDraft.time || '03:00 PM');

  const continueToAssignment = () => {
    const draft = { service: bookingDraft.service, date: selectedDate, time: selectedTime };
    setBookingDraft(draft);
    setCurrentScreen('booking_confirm');
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto space-y-6">
      <button onClick={() => setCurrentScreen('search')} className="text-slate-600 hover:text-slate-900 text-sm font-semibold flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> {t('backToSearch', 'Back to services')}</button>
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="space-y-1"><span className="text-emerald-700 bg-emerald-100 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">Step 2 of 3 • Pick a slot</span><h1 className="text-2xl font-bold font-heading text-slate-900 pt-2">Schedule {tSkill(bookingDraft.service)}</h1><p className="text-xs text-slate-500">Choose a date and time, then review your selected Shramik.</p></div>
        <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm font-bold text-slate-800">Service: {tSkill(bookingDraft.service)}</div>
        <div className="space-y-2"><label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1"><Calendar className="w-4 h-4 text-emerald-600" /> {t('selectDate', 'Select Date')}</label><div className="grid grid-cols-5 gap-2">{dates.map((d) => <button key={d.date} onClick={() => setSelectedDate(d.full)} className={`p-3 rounded-2xl border text-center ${selectedDate === d.full ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700 border-slate-200'}`}><span className="text-xs block uppercase opacity-80">{d.day}</span><span className="text-lg font-bold font-mono">{d.date}</span></button>)}</div></div>
        <div className="space-y-2"><label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1"><Clock className="w-4 h-4 text-emerald-600" /> {t('availableTimeSlots', 'Available Time Slots')}</label><div className="grid grid-cols-2 gap-3">{timeSlots.map((time) => <button key={time} onClick={() => setSelectedTime(time)} className={`py-3.5 px-4 rounded-xl border text-sm font-bold font-mono flex items-center justify-between ${selectedTime === time ? 'bg-emerald-50 border-emerald-600 text-emerald-900' : 'bg-white text-slate-800 border-slate-200'}`}><span>{time}</span>{selectedTime === time && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}</button>)}</div></div>
        <button onClick={continueToAssignment} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all text-sm flex items-center justify-center space-x-2"><span>Continue to booking</span><ArrowRight className="w-4 h-4" /></button>
      </div>
    </div>
  );
};
