import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  MapPin, 
  Star, 
  CheckCircle2, 
  Filter, 
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Zap,
  Wrench,
  Hammer,
  Paintbrush
} from 'lucide-react';

export const CustomerSearch = () => {
  const { shramiks, setSelectedWorkerId, setCurrentScreen } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Electrician', 'Plumber', 'Carpenter', 'Painter'];

  const filteredWorkers = shramiks.filter(worker => {
    // Filter by search query
    const matchesSearch = worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          worker.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          worker.area.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategory === 'All' || worker.skill === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleViewProfile = (workerId) => {
    setSelectedWorkerId(workerId);
    setCurrentScreen('profile');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6 pb-20">
      
      {/* Search Header */}
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900">
          Find Local Verified Professionals
        </h1>

        {/* Prominent Search Bar */}
        <div className="relative">
          <Search className="w-6 h-6 text-emerald-600 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by skill (Electrician, Plumber, Repair...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-13 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl text-base shadow-sm focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition-all font-medium placeholder:text-slate-400"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Worker Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {filteredWorkers.map((worker) => (
          <div
            key={worker.id}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all p-6 space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              
              {/* Header: Photo + Name + Verified Badge */}
              <div className="flex items-start space-x-4">
                <div className="relative">
                  <img
                    src={worker.photo}
                    alt={worker.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 group-hover:border-emerald-500 transition-colors"
                  />
                  {worker.verified && (
                    <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full border-2 border-white">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-lg truncate group-hover:text-emerald-700 transition-colors">
                      {worker.name}
                    </h3>
                  </div>

                  {worker.verified ? (
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
                      ● Pending Review
                    </span>
                  )}

                  <p className="text-xs font-semibold text-slate-500 mt-1">{worker.skill}</p>
                </div>
              </div>

              {/* Stats: Rating, Jobs, Distance */}
              <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center text-amber-600 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                  {worker.rating > 0 ? worker.rating : 'New'}
                  <span className="text-slate-400 font-normal ml-1">({worker.jobsCount} jobs)</span>
                </div>

                <div className="flex items-center text-slate-500 font-medium">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {worker.distance}
                </div>
              </div>

              {/* Rate */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Hourly Rate:</span>
                <span className="text-lg font-bold font-mono text-slate-900">
                  ₹{worker.hourlyRate}<span className="text-xs font-normal text-slate-500">/hr</span>
                </span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => handleViewProfile(worker.id)}
              className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl shadow-xs transition-all text-xs flex items-center justify-center space-x-1.5 group-hover:shadow-emerald-600/20"
            >
              <span>View Profile</span>
              <ChevronRight className="w-4 h-4" />
            </button>

          </div>
        ))}
      </div>

    </div>
  );
};
