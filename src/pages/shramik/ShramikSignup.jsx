import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Phone, Lock, Wrench, MapPin, CheckCircle2, ChevronRight, ArrowLeft, ChevronDown, Camera } from 'lucide-react';
import { INDIA_LOCATIONS, INDIAN_STATES } from '../../data/indiaLocations';

const LC = 'block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1';

const LocationDropdown = ({ value, onChange, showLabel = true, t }) => {
  const [selectedState, setSelectedState] = useState(() => {
    if (!value) return '';
    const parts = value.split(' | ');
    return parts.length > 1 ? parts[1] : '';
  });
  const [selectedCity, setSelectedCity] = useState(() => {
    if (!value) return '';
    const parts = value.split(' | ');
    return parts.length > 1 ? parts[0] : value;
  });
  const [citySearch, setCitySearch] = useState('');
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);
  const cityRef = React.useRef(null);

  const cities = selectedState ? (INDIA_LOCATIONS[selectedState] || []) : [];

  React.useEffect(() => {
    if (!selectedState) { setFilteredCities([]); return; }
    if (citySearch.length >= 1) {
      const q = citySearch.toLowerCase();
      setFilteredCities(cities.filter(c => c.toLowerCase().includes(q)).slice(0, 10));
      setCityDropdownOpen(true);
    } else {
      setFilteredCities(cities.slice(0, 15));
      setCityDropdownOpen(true);
    }
  }, [citySearch, selectedState]);

  React.useEffect(() => {
    const handler = (e) => { if (cityRef.current && !cityRef.current.contains(e.target)) setCityDropdownOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectCity = (city) => {
    setSelectedCity(city); setCitySearch(''); setCityDropdownOpen(false);
    onChange(`${city} | ${selectedState}`);
  };

  const handleStateChange = (state) => {
    setSelectedState(state); setSelectedCity(''); setCitySearch(''); setFilteredCities([]); setCityDropdownOpen(false);
    onChange('');
  };

  const clearLocation = () => {
    setSelectedState(''); setSelectedCity(''); setCitySearch(''); setFilteredCities([]); setCityDropdownOpen(false);
    onChange('');
  };

  const stateIcon = <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />;
  const selectBase = "w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all appearance-none font-sans text-slate-700";

  return (
    <div className="space-y-2.5">
      {showLabel && <label className={LC}>{t ? t('auth.state', 'State') : 'State'}</label>}
      <div className="relative">
        {stateIcon}
        <select value={selectedState} onChange={(e) => handleStateChange(e.target.value)} className={selectBase}>
          <option value="">{t ? t('auth.selectState', 'Select State / UT...') : 'Select State / UT...'}</option>
          {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
      {selectedState && (
        <div>
          {showLabel && <label className={LC}>{t ? t('auth.cityDistrict', 'City / District / Village') : 'City / District / Village'}</label>}
          <div className="relative" ref={cityRef}>
            <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
            <input
              type="text"
              placeholder={selectedCity ? selectedCity : (t ? t('auth.searchInState', 'Search in {state}...', { state: selectedState }) : `Search in ${selectedState}...`)}
              value={selectedCity ? selectedCity : citySearch}
              onChange={(e) => { setSelectedCity(''); setCitySearch(e.target.value); onChange(''); }}
              onFocus={() => { setCityDropdownOpen(true); if (!citySearch) setFilteredCities(cities.slice(0, 15)); }}
              className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-sans placeholder:text-slate-400"
              autoComplete="off"
            />
            {selectedCity && (
              <button type="button" onClick={() => { setSelectedCity(''); setCitySearch(''); onChange(''); }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <span className="sr-only">Clear</span>&times;
              </button>
            )}
            {cityDropdownOpen && filteredCities.length > 0 && (
              <ul className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-52 overflow-y-auto">
                {filteredCities.map((city) => (
                  <li key={city} onMouseDown={() => selectCity(city)}
                    className="px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 cursor-pointer flex items-center gap-2 transition-colors">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    {city}
                  </li>
                ))}
              </ul>
            )}
            {cityDropdownOpen && filteredCities.length === 0 && citySearch.length >= 1 && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl px-4 py-3 text-sm text-slate-500">
                {t ? t('auth.noCityFound', 'No city found in {state}.', { state: selectedState }) : `No city found in ${selectedState}.`}
              </div>
            )}
          </div>
        </div>
      )}
      {selectedState && (
        <button type="button" onClick={clearLocation} className="text-[11px] text-slate-400 hover:text-red-500 transition-colors ml-1">
          {t ? t('common.clear', 'Clear selection') : 'Clear selection'}
        </button>
      )}
    </div>
  );
};

export const ShramikSignup = () => {
  const { registerShramik, t, tSkill } = useApp();
  const [step, setStep] = useState(1);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [primarySkill, setPrimarySkill] = useState('Electrician');
  const [experience, setExperience] = useState('5 years');
  const [expectedHourlyRate, setExpectedHourlyRate] = useState('250');
  const [city, setCity] = useState('Kolkata');
  const [serviceArea, setServiceArea] = useState('Salt Lake & Sector V');
  const [selectedServices, setSelectedServices] = useState(['Wiring', 'Repair']);
  const [photo, setPhoto] = useState('');

  const serviceOptionsMap = {
    Electrician: ['Wiring', 'Repair', 'Installation', 'Maintenance', 'Lighting'],
    Plumber: ['Pipe Fitting', 'Leakage Repair', 'Sanitary Installation', 'Water Tank Cleaning'],
    Carpenter: ['Furniture Assembly', 'Door Repair', 'Custom Woodwork', 'Lock Repair'],
    Painter: ['Furnished Full Home Painting', 'Unfurnished Full Home Painting', 'Texture Painting', 'False Ceiling', 'Waterproofing and Grouting', 'Wood Polish', 'Room Combos'],
    'AC Repair': ['AC Servicing', 'AC Installation', 'AC Repair', 'Gas Refilling'],
    Mason: ['Wall Construction', 'Plastering', 'Tile Fitting', 'Wall Waterproofing', 'Roof Repair']
  };

  const handleServiceToggle = (service) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter(s => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    registerShramik({
      fullName,
      phone,
      password,
      primarySkill,
      experience,
      expectedHourlyRate: Number(expectedHourlyRate) || 250,
      city,
      serviceArea,
      selectedServices,
      photo
    });
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-10 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-emerald-700 bg-emerald-100 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
            {t('shramik.registrationBadge', 'Shramik Registration')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
            {t('shramik.joinTitle', 'Join Shram Setu as a Skilled Professional')}
          </h2>
          <p className="text-slate-500 text-sm">
            {t('shramik.joinSubtitle', 'Get verified, connect with local customers, and earn fairly with zero middleman fees.')}
          </p>
        </div>

        {/* Multi-Step Progress Indicator */}
        <div className="flex items-center justify-between px-4 relative">
          <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-slate-200 -translate-y-1/2 -z-0"></div>
          <div 
            className="absolute top-1/2 left-10 h-0.5 bg-emerald-600 -translate-y-1/2 transition-all duration-300 -z-0"
            style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
          ></div>

          {[
            { num: 1, label: t('shramik.personalInfo', 'Personal Info') },
            { num: 2, label: t('shramik.profSkills', 'Professional Skills') },
            { num: 3, label: t('shramik.serviceLocation', 'Service Location') }
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center relative z-10 bg-white px-2">
              <div className={`w-10 h-10 rounded-full font-bold flex items-center justify-center text-sm transition-all ${
                step >= s.num
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20 ring-4 ring-emerald-50'
                  : 'bg-slate-100 text-slate-400 border border-slate-300'
              }`}>
                {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
              </div>
              <span className={`text-xs font-semibold mt-2 ${step >= s.num ? 'text-slate-900' : 'text-slate-400'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Step Forms */}
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          
          {/* STEP 1 — Personal Information */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t('auth.fullName', 'Full Name')}
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t('auth.phone', 'Phone Number')}
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t('auth.password', 'Password')}
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder={t('auth.choosePassword', 'Choose a password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm mt-6"
              >
                <span>{t('shramik.continueToSkills', 'Continue to Professional Info')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2 — Professional Information */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t('shramik.primarySkill', 'Primary Skill')}
                </label>
                <div className="relative">
                  <Wrench className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={primarySkill}
                    onChange={(e) => {
                      setPrimarySkill(e.target.value);
                      setSelectedServices(serviceOptionsMap[e.target.value]?.slice(0, 2) || []);
                    }}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none appearance-none font-semibold text-slate-800"
                  >
                    <option value="Electrician">{tSkill('Electrician')}</option>
                    <option value="Plumber">{tSkill('Plumber')}</option>
                    <option value="Carpenter">{tSkill('Carpenter')}</option>
                    <option value="Painter">{tSkill('Painter')}</option>
                    <option value="AC Repair">{tSkill('AC Repair')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t('shramik.yearsExp', 'Years of Experience')}
                </label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none font-semibold text-slate-800"
                >
                  <option value="1-2 years">1-2 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5-8 years">5-8 years</option>
                  <option value="8+ years">8+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t('shramik.expectedHourlyRate', 'Expected Hourly Rate')}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    min="50"
                    step="10"
                    required
                    placeholder="250"
                    value={expectedHourlyRate}
                    onChange={(e) => setExpectedHourlyRate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {t('shramik.specificServices', 'Select Specific Services Provided')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(serviceOptionsMap[primarySkill] || ['General Work']).map((service) => (
                    <label 
                      key={service}
                      className={`flex items-center space-x-3 p-3 rounded-xl border text-sm font-medium cursor-pointer transition-all ${
                        selectedServices.includes(service)
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service)}
                        onChange={() => handleServiceToggle(service)}
                        className="w-4 h-4 text-emerald-600 rounded-md focus:ring-emerald-500 accent-emerald-600"
                      />
                      <span>{tSkill(service)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center space-x-1 text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t('common.back', 'Back')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm"
                >
                  <span>{t('shramik.continueToLocation', 'Continue to Location')}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Location & Final Submission */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <LocationDropdown value={city} onChange={setCity} showLabel={true} t={t} />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t('shramik.serviceArea', 'Service Area / Locality')}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Salt Lake, Sector V, New Town"
                  value={serviceArea}
                  onChange={(e) => setServiceArea(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {t('shramik.verificationGuarantee', 'Verification Guarantee')}
                </p>
                <p>
                  {t('shramik.guaranteeDesc', 'Upon registration, your details will be queued for Admin Review. Once verified, you will receive an official Shramik ID (SS-XXXXXX) and access to local customer jobs.')}
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Profile Photo
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                    {photo ? <img src={photo} alt="Profile preview" className="w-full h-full object-cover" /> : <Camera className="w-6 h-6 text-slate-400" />}
                  </div>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50">
                    <Camera className="w-4 h-4" />
                    Take or choose photo
                    <input type="file" accept="image/*" capture="user" required onChange={handlePhotoChange} className="sr-only" />
                  </label>
                </div>
                <p className="text-[11px] text-slate-500">Use a clear photo of yourself. Maximum 2 MB.</p>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center space-x-1 text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t('common.back', 'Back')}</span>
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2 text-sm"
                >
                  <span>{t('shramik.createAccount', 'Create Shramik Account')}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </form>

      </div>
    </div>
  );
};
