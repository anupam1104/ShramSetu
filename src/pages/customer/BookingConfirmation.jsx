import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Calendar, CheckCircle2, Clock, IndianRupee, ShieldCheck, Star, UserRound, ArrowLeft } from 'lucide-react';

export const BookingConfirmation = () => {
  const { shramiks, selectedWorkerId, bookingDraft, createBooking, setCurrentScreen, t, tSkill } = useApp();
  const worker = shramiks.find((item) => item.id === selectedWorkerId);

  if (!worker) {
    return <div className="min-h-screen py-10 px-4 flex justify-center"><div className="max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center space-y-3"><p className="font-bold text-slate-900">No free Shramik found for this slot.</p><button onClick={() => setCurrentScreen('slot')} className="bg-emerald-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl">Choose another slot</button></div></div>;
  }

  const workerLabel = worker.shramikId ? `Verified Shramik • ${worker.shramikId}` : 'Verified Shramik';
  const estimatedFee = worker.hourlyRate * 2;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6">
        <button onClick={() => setCurrentScreen('slot')} className="text-slate-600 hover:text-slate-900 text-sm font-semibold flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Edit slot</button>
        <div className="text-center space-y-1"><span className="text-emerald-700 bg-emerald-100 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">Step 3 of 3 • Your selection</span><h1 className="text-2xl font-bold font-heading text-slate-900 pt-2">Your selected Shramik</h1><p className="text-xs text-slate-500">Review your selection and confirm the booking.</p></div>

        {/* No name, photo, phone, or address is exposed before acceptance. */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200"><div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center"><UserRound className="w-6 h-6" /></div><div><h3 className="font-bold text-slate-900 text-base">{workerLabel}</h3><p className="text-xs text-emerald-700 font-semibold">{tSkill(worker.skill)}</p></div></div>
          <div className="grid grid-cols-3 gap-3 text-center"><div className="rounded-xl bg-white border border-slate-200 p-3"><Star className="w-4 h-4 text-amber-500 fill-amber-400 mx-auto mb-1" /><p className="text-xs font-bold">{worker.rating || 'New'}</p><p className="text-[10px] text-slate-500">Rating</p></div><div className="rounded-xl bg-white border border-slate-200 p-3"><Award className="w-4 h-4 text-emerald-600 mx-auto mb-1" /><p className="text-xs font-bold">{worker.experience || '—'}</p><p className="text-[10px] text-slate-500">Experience</p></div><div className="rounded-xl bg-white border border-slate-200 p-3"><IndianRupee className="w-4 h-4 text-emerald-600 mx-auto mb-1" /><p className="text-xs font-bold">₹{worker.hourlyRate}/hr</p><p className="text-[10px] text-slate-500">Rate</p></div></div>
          <div className="space-y-3 text-sm text-slate-700"><div className="flex justify-between"><span className="text-slate-500">Service</span><span className="font-bold">{tSkill(bookingDraft.service)}</span></div><div className="flex justify-between"><span className="text-slate-500 flex items-center gap-1"><Calendar className="w-4 h-4 text-emerald-600" /> Date</span><span className="font-semibold font-mono">{bookingDraft.date}</span></div><div className="flex justify-between"><span className="text-slate-500 flex items-center gap-1"><Clock className="w-4 h-4 text-emerald-600" /> Time</span><span className="font-semibold font-mono">{bookingDraft.time}</span></div><div className="flex justify-between pt-3 border-t border-slate-200"><span className="text-slate-500">Estimated service fee</span><span className="text-lg font-bold font-mono text-emerald-800">₹{estimatedFee}</span></div></div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-900 flex items-start gap-2"><ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" /><p>The Shramik’s name and photo stay private until they accept this booking request.</p></div>
        <button onClick={createBooking} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all text-sm flex items-center justify-center gap-2"><CheckCircle2 className="w-5 h-5" /><span>{t('confirmBooking', 'Confirm Booking')}</span></button>
      </div>
    </div>
  );
};
