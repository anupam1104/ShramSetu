import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  MapPin, 
  Star, 
  CheckCircle2, 
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  Wrench,
  Hammer,
  Paintbrush,
  Truck,
  UserCheck
} from 'lucide-react';

export const CustomerSearch = () => {
  const { shramiks, setSelectedWorkerId, setCurrentScreen, searchCategory, setSearchCategory, t, tSkill } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  // A service category currently being browsed. When null, we show the
  // full services list. 'All' is treated as "no specific service".
  const selectedService = searchCategory && searchCategory !== 'All' ? searchCategory : null;
  const setSelectedService = setSearchCategory;

  const SERVICES = [
    { rawSkill: 'Electrician', icon: Zap, desc: t('serviceElectricianDesc', 'Wiring, fittings, repairs & appliances'), color: 'bg-amber-500/10 text-amber-600' },
    { rawSkill: 'Plumber', icon: Wrench, desc: t('servicePlumberDesc', 'Leaks, pipes, taps & sanitary work'), color: 'bg-blue-500/10 text-blue-600' },
    { rawSkill: 'Carpenter', icon: Hammer, desc: t('serviceCarpenterDesc', 'Furniture, doors & custom woodwork'), color: 'bg-orange-500/10 text-orange-600' },
    { rawSkill: 'Painter', icon: Paintbrush, desc: t('servicePainterDesc', 'Wall & texture painting, putty work'), color: 'bg-purple-500/10 text-purple-600' },
    { rawSkill: 'Mason', icon: Truck, desc: t('serviceMasonDesc', 'Construction, plastering & flooring'), color: 'bg-emerald-500/10 text-emerald-600' },
    { rawSkill: 'AC Repair', icon: ShieldCheck, desc: t('serviceAcRepairDesc', 'AC servicing, installation & repair'), color: 'bg-teal-500/10 text-teal-600' },
  ];

  const workersForService = (rawSkill) =>
    shramiks.filter(w => w.skill === rawSkill || (Array.isArray(w.services) && w.services.some(s => s.toLowerCase().includes(rawSkill.toLowerCase()))));

  const serviceCount = (rawSkill) => workersForService(rawSkill).length;

  const filteredWorkers = (selectedService ? workersForService(selectedService) : shramiks)
    .filter(worker => {
      const matchesSearch = worker.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            worker.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (Array.isArray(worker.services) && worker.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesSearch;
    });

  // Anonymized display label for a shramik — never reveal the real name.
  const workerLabel = (worker) =>
    worker.verified && worker.shramikId
      ? `${t('verifiedShramikLabel', 'Verified Shramik')} • ${worker.shramikId}`
      : t('newShramikLabel', 'New Shramik');

  const handleViewProfile = (workerId) => {
    setSelectedWorkerId(workerId);
    setCurrentScreen('profile');
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6 pb-20">

      {/* Search Header */}
      <div className="space-y-4">
        {selectedService && (
          <button
            onClick={() => setSelectedService('All')}
            className="text-slate-600 hover:text-slate-900 text-sm font-semibold flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> {t('backToServices', 'Back to All Services')}
          </button>
        )}

        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
          {selectedService
            ? t('workersFor', { service: tSkill(selectedService) })
            : t('findServiceTitle', 'Choose a Service')}
        </h1>
        <p className="text-sm text-slate-500">
          {selectedService
            ? t('workersForDesc', 'Our verified experts for this service. Names are kept private until you book.')
            : t('findServiceSub', 'Browse services offered on Shram Setu. Pick one to see available experts.')}
        </p>
      </div>

      {!selectedService ? (
        /* ===== SERVICES LIST (default view) ===== */
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 pt-2">
          {SERVICES.map((service) => {
            const count = serviceCount(service.rawSkill);
            return (
              <button
                key={service.rawSkill}
                onClick={() => setSelectedService(service.rawSkill)}
                className="bg-white rounded-2xl md:rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all p-4 md:p-6 space-y-3 text-left flex flex-col"
              >
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl ${service.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <service.icon className="w-6 h-6 md:w-7 md:h-7 stroke-[2.2]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-base md:text-xl">{tSkill(service.rawSkill)}</h3>
                  <p className="text-[11px] md:text-xs text-slate-500 mt-1 leading-snug">{service.desc}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] md:text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
                    <UserCheck className="w-3.5 h-3.5" />
                    {count} {t('workersCount', 'Workers')}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <>
          {/* Prominent Search Bar within a service */}
          <div className="relative">
            <Search className="w-6 h-6 text-emerald-600 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('searchPh', 'Search by skill (Electrician, Plumber, Repair...)')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-13 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl text-base shadow-sm focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition-all font-medium placeholder:text-slate-400"
            />
          </div>

          {/* Anonymized Worker Cards Grid */}
          <div className="grid grid-cols-2 gap-3 md:gap-6 md:grid-cols-2 lg:grid-cols-3 pt-2">
            {filteredWorkers.map((worker) => (
              <div
                key={worker.id}
                className="bg-white rounded-2xl md:rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all p-3 md:p-6 space-y-3 md:space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-2 md:space-y-3">

                  {/* Header: Photo + Anonymous Label + Verified Badge */}
                  <div className="flex items-start space-x-2.5 md:space-x-4">
                    <div className="relative">
                      <img
                        src={worker.photo}
                        alt={workerLabel(worker)}
                        className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl object-cover border-2 border-slate-200 group-hover:border-emerald-500 transition-colors"
                      />
                      {worker.verified && (
                        <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full border-2 border-white">
                          <CheckCircle2 className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 text-sm md:text-lg truncate group-hover:text-emerald-700 transition-colors">
                        {workerLabel(worker)}
                      </h3>

                      {worker.verified ? (
                        <span className="inline-flex items-center gap-0.5 md:gap-1 bg-emerald-100 text-emerald-800 text-[10px] md:text-[11px] font-bold px-1.5 md:px-2 py-0.5 rounded-full border border-emerald-300">
                          <CheckCircle2 className="w-2.5 md:w-3 h-2.5 md:h-3 text-emerald-600" /> {t('verified', 'Verified')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 md:gap-1 bg-amber-100 text-amber-800 text-[10px] md:text-[11px] font-bold px-1.5 md:px-2 py-0.5 rounded-full border border-amber-300">
                          ● {t('statusPending', 'Pending')}
                        </span>
                      )}

                      <p className="text-[11px] md:text-xs font-semibold text-slate-500 mt-0.5 md:mt-1 truncate">{tSkill(worker.skill)}</p>
                    </div>
                  </div>

                  {/* Stats: Rating, Jobs, Distance */}
                  <div className="flex items-center justify-between text-[11px] md:text-xs text-slate-600 bg-slate-50 p-2 md:p-3 rounded-lg md:rounded-xl border border-slate-100">
                    <div className="flex items-center text-amber-600 font-bold">
                      <Star className="w-3.5 md:w-4 h-3.5 md:h-4 fill-amber-400 text-amber-400 mr-0.5 md:mr-1" />
                      {worker.rating > 0 ? worker.rating : t('ratingNew', 'New')}
                      <span className="hidden md:inline text-slate-400 font-normal ml-1">({worker.jobsCount} {t('jobsCount', 'jobs')})</span>
                    </div>

                    <div className="flex items-center text-slate-500 font-medium">
                      <MapPin className="w-3 md:w-3.5 h-3 md:h-3.5 mr-0.5 text-slate-400" />
                      {worker.distance}
                    </div>
                  </div>

                  {/* Rate */}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium text-[11px] md:text-sm">{t('rate', 'Rate')}</span>
                    <span className="text-sm md:text-lg font-bold font-mono text-slate-900">
                      ₹{worker.hourlyRate}<span className="text-[10px] md:text-xs font-normal text-slate-500">{t('perHr', '/hr')}</span>
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => handleViewProfile(worker.id)}
                  className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-bold py-2 md:py-3 rounded-lg md:rounded-xl shadow-xs transition-all text-[11px] md:text-xs flex items-center justify-center space-x-1 group-hover:shadow-emerald-600/20"
                >
                  <span className="md:hidden">{t('viewBtn', 'View')}</span>
                  <span className="hidden md:inline">{t('viewProfile', 'View Profile')}</span>
                  <ChevronRight className="w-3.5 md:w-4 h-3.5 md:h-4" />
                </button>

              </div>
            ))}
          </div>

          {filteredWorkers.length === 0 && (
            <div className="text-center py-16 space-y-3">
              <ShieldCheck className="w-12 h-12 mx-auto text-slate-300" />
              <p className="font-bold text-slate-700">{t('noWorkersFound', 'No experts found for this service yet.')}</p>
              <p className="text-xs text-slate-500">{t('noWorkersDesc', 'Experts will appear here once registered and approved.')}</p>
            </div>
          )}
        </>
      )}

    </div>
  );
};
