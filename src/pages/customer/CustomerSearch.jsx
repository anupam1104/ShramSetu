import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, ChevronRight, Hammer, Paintbrush, ShieldCheck, Star, Truck, UserCheck, Wrench, Zap } from 'lucide-react';

export const CustomerSearch = () => {
  const { shramiks, searchCategory, setSearchCategory, setSelectedWorkerId, setBookingDraft, setCurrentScreen, currentUser, t, tSkill } = useApp();

  const cityKey = String(currentUser?.city || '').split('|')[0].trim().toLowerCase();

  const services = [
    { rawSkill: 'Electrician', icon: Zap, desc: t('serviceElectricianDesc', 'Wiring, fittings, repairs & appliances'), color: 'bg-amber-500/10 text-amber-600' },
    { rawSkill: 'Plumber', icon: Wrench, desc: t('servicePlumberDesc', 'Leaks, pipes, taps & sanitary work'), color: 'bg-blue-500/10 text-blue-600' },
    { rawSkill: 'Carpenter', icon: Hammer, desc: t('serviceCarpenterDesc', 'Furniture, doors & custom woodwork'), color: 'bg-orange-500/10 text-orange-600' },
    { rawSkill: 'Painter', icon: Paintbrush, desc: t('servicePainterDesc', 'Wall & texture painting, putty work'), color: 'bg-purple-500/10 text-purple-600' },
    { rawSkill: 'Mason', icon: Truck, desc: t('serviceMasonDesc', 'Construction, plastering & flooring'), color: 'bg-emerald-500/10 text-emerald-600' },
    { rawSkill: 'AC Repair', icon: ShieldCheck, desc: t('serviceAcRepairDesc', 'AC servicing, installation & repair'), color: 'bg-teal-500/10 text-teal-600' },
  ];

  const workerCount = (service) => shramiks.filter((worker) =>
    worker.verified && (!cityKey || String(worker.city || '').split('|')[0].trim().toLowerCase() === cityKey) && (worker.skill === service || worker.services?.some((item) => item === service))
  ).length;

  const chooseService = (service) => {
    setSearchCategory(service);
    setBookingDraft((draft) => ({ ...draft, service }));
  };

  const selectWorker = (worker) => {
    setSelectedWorkerId(worker.id);
    setCurrentScreen('profile');
  };

  const filteredWorkers = shramiks.filter((worker) =>
    worker.verified && (!cityKey || String(worker.city || '').split('|')[0].trim().toLowerCase() === cityKey) && (worker.skill === searchCategory || worker.services?.some((item) => item === searchCategory))
  );

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6 pb-20">
      {searchCategory && searchCategory !== 'All' ? (
        <>
          <button onClick={() => setSearchCategory('All')} className="text-slate-600 hover:text-slate-900 text-sm font-semibold flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> {t('backToSearch', 'Back to services')}</button>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">{tSkill(searchCategory)} {t('workers', 'Workers')}</h1>
            <p className="text-sm text-slate-500">{t('chooseWorker', 'Choose a verified Shramik for the job.')}</p>
          </div>
          {filteredWorkers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
              <p className="font-bold text-slate-900">{t('noWorkersFound', 'No verified workers found')}</p>
              <p className="text-xs text-slate-500">{t('noWorkersDesc', 'Workers for this service will appear once approved by an admin.')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredWorkers.map((worker) => (
                <button key={worker.id} onClick={() => selectWorker(worker)} className="bg-white rounded-2xl md:rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all p-4 md:p-5 text-left flex items-center gap-4">
                  <img src={worker.photo} alt={worker.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shrink-0" />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm md:text-base truncate">{worker.shramikId ? `${t('verifiedShramikLabel', 'Verified Shramik')} • ${worker.shramikId}` : t('newShramikLabel', 'New Shramik')}</h3>
                    </div>
                    <p className="text-xs font-semibold text-emerald-700">{tSkill(worker.skill)}</p>
                    <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500">
                      <span className="flex items-center gap-0.5"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {worker.rating > 0 ? worker.rating : t('ratingNew', 'New')}</span>
                      <span>{worker.experience}</span>
                      <span className="text-emerald-800 font-bold">₹{worker.hourlyRate}/hr</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 shrink-0" />
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">{t('findServiceTitle', 'Choose a Service')}</h1>
            <p className="text-sm text-slate-500">{t('chooseServiceDesc', 'Choose a service to see available Shramiks.')}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 pt-2">
            {services.map((service) => {
              const count = workerCount(service.rawSkill);
              return <button key={service.rawSkill} onClick={() => chooseService(service.rawSkill)} className="bg-white rounded-2xl md:rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all p-4 md:p-6 space-y-3 text-left flex flex-col">
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl ${service.color} flex items-center justify-center`}><service.icon className="w-6 h-6 md:w-7 md:h-7 stroke-[2.2]" /></div>
                <div className="flex-1"><h3 className="font-bold text-slate-900 text-base md:text-xl">{tSkill(service.rawSkill)}</h3><p className="text-[11px] md:text-xs text-slate-500 mt-1 leading-snug">{service.desc}</p></div>
                <div className="flex items-center justify-between"><span className="inline-flex items-center gap-1 text-[11px] md:text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full"><UserCheck className="w-3.5 h-3.5" /> {count} verified</span><ChevronRight className="w-4 h-4 text-slate-400" /></div>
              </button>;
            })}
          </div>
        </>
      )}
    </div>
  );
};
