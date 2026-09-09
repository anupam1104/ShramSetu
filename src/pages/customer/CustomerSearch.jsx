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
  UserCheck,
  Plug,
  Fan,
  Lightbulb,
  Cable,
  Bell,
  Tv,
  Sparkles,
  Gauge,
  Droplets,
  Droplet,
  Waves,
  ShowerHead,
  Thermometer,
  UtensilsCrossed,
  Armchair,
  DoorOpen,
  Box,
  Bed,
  TreePine,
  Archive,
  Wind,
  Cog,
  Layers,
  LayoutGrid,
  CloudRain,
  Umbrella,
  Building2,
  SquareStack,
  PaintBucket,
  House,
  Brush,
  Utensils,
  WashingMachine,
  HeartHandshake,
  Baby
} from 'lucide-react';

const SERVICE_JOBS = {
  'Electrician': {
    color: 'bg-amber-500/10 text-amber-600',
    jobs: [
      { name: 'Switch and Socket Repair', icon: Plug, keywords: ['switch', 'socket', 'outlet'] },
      { name: 'Fan Repair', icon: Fan, keywords: ['fan', 'ceiling fan', 'exhaust'] },
      { name: 'Light', icon: Lightbulb, keywords: ['light', 'lamp', 'led', 'lighting'] },
      { name: 'Wiring', icon: Cable, keywords: ['wiring', 'rewiring', 'cable'] },
      { name: 'Doorbell and Security', icon: Bell, keywords: ['doorbell', 'security', 'cctv', 'camera', 'alarm'] },
      { name: 'TV and Speaker', icon: Tv, keywords: ['tv', 'television', 'speaker', 'audio', 'mounting'] },
      { name: 'Festive Lights', icon: Sparkles, keywords: ['festive', 'decorative', 'diwali', 'lights'] },
      { name: 'MCB Fuse and Inverter', icon: Gauge, keywords: ['mcb', 'fuse', 'inverter', 'breaker', 'panel'] },
    ],
  },
  'Plumber': {
    color: 'bg-blue-500/10 text-blue-600',
    jobs: [
      { name: 'Leakage Detection', icon: Droplets, keywords: ['leak', 'leakage', 'detection'] },
    { name: 'Pipe Installation', icon: Wrench, keywords: ['pipe', 'installation', 'pipeline'] },
    { name: 'Tap Fitting', icon: Droplet, keywords: ['tap', 'faucet', 'fitting'] },
      { name: 'Bathroom Fitting', icon: ShowerHead, keywords: ['bathroom', 'sanitary', 'fitting'] },
      { name: 'Water Tank Cleaning', icon: Waves, keywords: ['water tank', 'tank cleaning', 'tank'] },
      { name: 'Kitchen Plumbing', icon: UtensilsCrossed, keywords: ['kitchen', 'sink', 'plumbing'] },
      { name: 'Geyser Installation', icon: Thermometer, keywords: ['geyser', 'water heater', 'heater'] },
    ],
  },
  'Carpenter': {
    color: 'bg-orange-500/10 text-orange-600',
    jobs: [
      { name: 'Furniture Assembly', icon: Armchair, keywords: ['furniture', 'assembly', 'table', 'chair', 'sofa'] },
      { name: 'Door and Window Repair', icon: DoorOpen, keywords: ['door', 'window', 'hinge', 'frame', 'repair'] },
      { name: 'Cabinet Fitting', icon: Box, keywords: ['cabinet', 'wardrobe', 'shelf', 'cupboard', 'fitting'] },
      { name: 'Bed Assembly', icon: Bed, keywords: ['bed', 'bunk bed', 'cot', 'bed frame', 'assembly'] },
      { name: 'Custom Woodwork', icon: TreePine, keywords: ['woodwork', 'carpentry', 'custom', 'wood', 'craft'] },
      { name: 'Wardrobe Installation', icon: Archive, keywords: ['wardrobe', 'almirah', 'closet', 'installation'] },
    ],
  },
  'AC Repair': {
    color: 'bg-teal-500/10 text-teal-600',
    jobs: [
      { name: 'AC Servicing', icon: Fan, keywords: ['ac', 'servicing', 'maintenance', 'cleaning', 'filter'] },
      { name: 'AC Installation', icon: Plug, keywords: ['ac', 'installation', 'mounting', 'split ac', 'window ac'] },
      { name: 'AC Repair', icon: Cog, keywords: ['ac', 'repair', 'cooling', 'not working', 'compressor'] },
      { name: 'Gas Refilling', icon: Wind, keywords: ['gas', 'refilling', 'refill', 'coolant', 'gas charging'] },
    ],
  },
  'Mason': {
    color: 'bg-emerald-500/10 text-emerald-600',
    jobs: [
      { name: 'Wall Construction', icon: Building2, keywords: ['wall', 'construction', 'brick', 'building'] },
      { name: 'Plastering', icon: Layers, keywords: ['plastering', 'plaster', 'smoothing', 'finish'] },
      { name: 'Tile Fitting', icon: LayoutGrid, keywords: ['tile', 'fitting', 'flooring', 'wall tile'] },
      { name: 'Wall Waterproofing', icon: CloudRain, keywords: ['waterproofing', 'waterproof', 'damp', 'seepage'] },
      { name: 'Roof Repair', icon: Umbrella, keywords: ['roof', 'repair', 'leak', 'terrace', 'ceiling'] },
    ],
  },
  'Painter': {
    color: 'bg-purple-500/10 text-purple-600',
    jobs: [
      { name: 'Furnished Full Home Painting', icon: Armchair, keywords: ['furnished', 'home', 'painting', 'interior', 'full'] },
      { name: 'Unfurnished Full Home Painting', icon: Building2, keywords: ['unfurnished', 'home', 'painting', 'empty', 'full'] },
      { name: 'Texture Painting', icon: Layers, keywords: ['texture', 'painting', 'design', 'pattern'] },
      { name: 'False Ceiling', icon: SquareStack, keywords: ['false ceiling', 'ceiling', 'gypsum', 'installation'] },
      { name: 'Waterproofing and Grouting', icon: Droplets, keywords: ['waterproofing', 'grouting', 'waterproof', 'sealant'] },
      { name: 'Wood Polish', icon: PaintBucket, keywords: ['wood', 'polish', 'varnish', 'lamination', 'finish'] },
      { name: 'Room Combos', icon: Archive, keywords: ['room', 'combo', 'combo', 'painting', 'package'] },
    ],
  },
  'Househelp': {
    color: 'bg-rose-500/10 text-rose-600',
    jobs: [
      { name: 'House Cleaning', icon: Brush, keywords: ['cleaning', 'housekeeping', 'dusting', 'mopping', 'home'] },
      { name: 'Dish Washing', icon: Utensils, keywords: ['dish', 'dishes', 'kitchen', 'washing', 'cleaning'] },
      { name: 'Laundry and Ironing', icon: WashingMachine, keywords: ['laundry', 'washing', 'ironing', 'clothes', 'iron'] },
      { name: 'Elderly Care', icon: HeartHandshake, keywords: ['elderly', 'senior', 'care', 'assistance', 'help'] },
      { name: 'Full-time Nanny', icon: Baby, keywords: ['nanny', 'babysitter', 'child', 'kids', 'daycare'] },
    ],
  },
};

export const CustomerSearch = () => {
  const {
    shramiks,
    setSelectedWorkerId,
    setCurrentScreen,
    searchCategory,
    setSearchCategory,
    selectedJob,
    setSelectedJob,
    t,
    tSkill
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  const selectedService = searchCategory && searchCategory !== 'All' ? searchCategory : null;
  const setSelectedService = setSearchCategory;
  const serviceJobsEntry = selectedService ? SERVICE_JOBS[selectedService] : null;
  const jobsForService = serviceJobsEntry ? serviceJobsEntry.jobs : [];
  const jobIconsColor = serviceJobsEntry ? serviceJobsEntry.color : 'bg-slate-500/10 text-slate-600';

  const SERVICES = [
    { rawSkill: 'Electrician', icon: Zap, desc: t('serviceElectricianDesc', 'Wiring, fittings, repairs & appliances'), color: 'bg-amber-500/10 text-amber-600' },
    { rawSkill: 'Plumber', icon: Wrench, desc: t('servicePlumberDesc', 'Leaks, pipes, taps & sanitary work'), color: 'bg-blue-500/10 text-blue-600' },
    { rawSkill: 'Carpenter', icon: Hammer, desc: t('serviceCarpenterDesc', 'Furniture, doors & custom woodwork'), color: 'bg-orange-500/10 text-orange-600' },
    { rawSkill: 'Painter', icon: Paintbrush, desc: t('servicePainterDesc', 'Wall & texture painting, putty work'), color: 'bg-purple-500/10 text-purple-600' },
    { rawSkill: 'Mason', icon: Truck, desc: t('serviceMasonDesc', 'Construction, plastering & flooring'), color: 'bg-emerald-500/10 text-emerald-600' },
    { rawSkill: 'AC Repair', icon: ShieldCheck, desc: t('serviceAcRepairDesc', 'AC servicing, installation & repair'), color: 'bg-teal-500/10 text-teal-600' },
    { rawSkill: 'Househelp', icon: House, desc: t('serviceHousehelpDesc', 'Cleaning, laundry, dish washing & daily care'), color: 'bg-rose-500/10 text-rose-600' },
  ];

  const workersForService = (rawSkill) =>
    shramiks.filter(w => w.skill === rawSkill || (Array.isArray(w.services) && w.services.some(s => s.toLowerCase().includes(rawSkill.toLowerCase()))));

  const workersForJob = (serviceSkill, job) => {
    const serviceWorkers = workersForService(serviceSkill);
    if (!job || !job.keywords) return serviceWorkers;
    return serviceWorkers.filter(worker => {
      if (!Array.isArray(worker.services) || worker.services.length === 0) return true;
      return worker.services.some(s => {
        const lower = s.toLowerCase();
        return job.keywords.some(kw => lower.includes(kw));
      });
    });
  };

  const serviceCount = (rawSkill) => workersForService(rawSkill).length;

  const currentJobObj = selectedJob && jobsForService.length > 0
    ? jobsForService.find(j => j.name === selectedJob)
    : null;

  const filteredWorkers = (selectedService
    ? (currentJobObj ? workersForJob(selectedService, currentJobObj) : workersForService(selectedService))
    : shramiks
  ).filter(worker => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return worker.skill.toLowerCase().includes(q) ||
      worker.area.toLowerCase().includes(q) ||
      (Array.isArray(worker.services) && worker.services.some(s => s.toLowerCase().includes(q)));
  });

  const workerLabel = (worker) =>
    worker.verified && worker.shramikId
      ? `${t('verifiedShramikLabel', 'Verified Shramik')} • ${worker.shramikId}`
      : t('newShramikLabel', 'New Shramik');

  const handleViewProfile = (workerId) => {
    setSelectedWorkerId(workerId);
    setCurrentScreen('profile');
  };

  const handleBackToServices = () => {
    setSelectedService('All');
    setSelectedJob(null);
    setSearchQuery('');
  };

  const handleBackToJobs = () => {
    setSelectedJob(null);
    setSearchQuery('');
  };

  // ─── Step 1: Services List ───
  const renderServicesList = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 pt-2">
      {SERVICES.map((service) => {
        const count = serviceCount(service.rawSkill);
        return (
          <button
            key={service.rawSkill}
            onClick={() => {
              setSelectedService(service.rawSkill);
              setSelectedJob(null);
              setSearchQuery('');
            }}
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
  );

  // ─── Step 2: Choose Job ───
  const renderChooseJob = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 md:gap-4 pt-2">
      {jobsForService.map((job) => (
        <button
          key={job.name}
          onClick={() => {
            setSelectedJob(job.name);
            setSearchQuery('');
          }}
          className="bg-white rounded-xl md:rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 active:scale-[0.98] transition-all py-3.5 px-3.5 md:py-5 md:px-4 text-left flex items-center gap-3 md:gap-4 w-full"
        >
          <div className={`w-10 h-10 md:w-11 md:h-11 shrink-0 rounded-lg md:rounded-xl ${jobIconsColor} flex items-center justify-center`}>
            <job.icon className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="font-bold text-slate-900 text-sm md:text-base leading-snug min-w-0 flex-1">{job.name}</span>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        </button>
      ))}
    </div>
  );

  // ─── Step 3: Find Workers ───
  const renderFindWorkers = () => (
    <>
      <div className="relative">
        <Search className="w-6 h-6 text-emerald-600 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder={t('searchPh', 'Search by skill, area or service...')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-13 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl text-base shadow-sm focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition-all font-medium placeholder:text-slate-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-6 md:grid-cols-2 lg:grid-cols-3 pt-2">
        {filteredWorkers.map((worker) => (
          <div
            key={worker.id}
            className="bg-white rounded-2xl md:rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all p-3 md:p-6 space-y-3 md:space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-2 md:space-y-3">
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

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium text-[11px] md:text-sm">{t('rate', 'Rate')}</span>
                <span className="text-sm md:text-lg font-bold font-mono text-slate-900">
                  ₹{worker.hourlyRate}
                </span>
              </div>
            </div>

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
  );

  // Determine current step
  const hasJobs = jobsForService.length > 0;
  const showChooseJob = selectedService && hasJobs && !selectedJob;
  const showWorkers = selectedService && (!hasJobs || selectedJob);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6 pb-20">

      {/* Header with contextual back button + title */}
      <div className="space-y-4">
        {showChooseJob && (
          <button
            onClick={handleBackToServices}
            className="text-slate-600 hover:text-slate-900 text-sm font-semibold flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> {t('backToServices', 'Back to All Services')}
          </button>
        )}

        {showWorkers && hasJobs && (
          <button
            onClick={handleBackToJobs}
            className="text-slate-600 hover:text-slate-900 text-sm font-semibold flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> {t('backToJobs', 'Back to Jobs')}
          </button>
        )}

        {showWorkers && !hasJobs && selectedService && (
          <button
            onClick={handleBackToServices}
            className="text-slate-600 hover:text-slate-900 text-sm font-semibold flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> {t('backToServices', 'Back to All Services')}
          </button>
        )}

        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
          {!selectedService
            ? t('findServiceTitle', 'Choose a Service')
            : showChooseJob
              ? t('chooseJobTitle', 'Choose Job')
              : t('workersFor', { service: tSkill(selectedService) })
          }
        </h1>
        <p className="text-sm text-slate-500">
          {!selectedService
            ? t('findServiceSub', 'Browse services offered on Shram Setu. Pick one to see available experts.')
            : showChooseJob
              ? t('chooseJobSub', 'Select the specific job you need help with.')
              : t('workersForDesc', 'Our verified experts for this service. Names are kept private until you book.')
          }
        </p>
      </div>

      {/* Step content */}
      {!selectedService && renderServicesList()}
      {showChooseJob && renderChooseJob()}
      {showWorkers && renderFindWorkers()}

    </div>
  );
};
