import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
<<<<<<< HEAD
import { loginAdmin } from '../lib/supabase';
=======
import { LanguageSelectDropdown } from '../components/LanguageSelectDropdown';
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
import {
  Shield, Phone, Lock, User, MapPin, Calendar,
  ArrowRight, Eye, EyeOff, CheckCircle2, UserPlus,
  LogIn, Briefcase, Hash, ChevronDown, Search, X
} from 'lucide-react';

import { INDIA_LOCATIONS, INDIAN_STATES } from '../data/indiaLocations';

/* ─── Major Indian cities (urban) used to decide if town/village details are needed ─── */
const MAJOR_CITIES = new Set([
<<<<<<< HEAD
  'Mumbai','Delhi','Bengaluru','Hyderabad','Ahmedabad','Chennai','Kolkata','Surat','Pune',
  'Jaipur','Lucknow','Kanpur','Nagpur','Indore','Thane','Bhopal','Visakhapatnam','Pimpri-Chinchwad',
  'Patna','Vadodara','Ghaziabad','Ludhiana','Coimbatore','Agra','Madurai','Nashik','Vijayawada',
  'Meerut','Faridabad','Rajkot','Varanasi','Srinagar','Aurangabad','Dhanbad','Amritsar','Navi Mumbai',
  'Prayagraj','Ranchi','Howrah','Jabalpur','Gwalior','Vijayawada','Jodhpur','Raipur','Kota',
  'Guwahati','Chandigarh','Solapur','Hubli','Mysuru','Tiruchirappalli','Bareilly','Aligarh','Tirunelveli',
  'Jamshedpur','Salem','Guntur','Bhubaneswar','Warangal','Cuttack','Kozhikode','Noida','Agra',
  'Thiruvananthapuram','Kochi','Mangaluru','Kolhapur','Kurnool','Nellore','Ajmer','Amravati',
  'Dehradun','Haridwar','Rishikesh','Siliguri','Durgapur','Asansol','Gaya','Muzaffarpur','Bhagalpur',
  'Kharagpur','Udaipur','Nainital','Darjeeling','Kullu','Manali','Shimla','Jammu','Prayagraj','Patiala',
  'Bathinda','Jalandhar','Amritsar','Panipat','Karnal','Hisar','Rohtak','Ambala','Gurugram','Faridabad',
  'Kolkata','Howrah','Belagavi','Gulbarga','Dharwad','Tirupati','Kakinada','Kadapa','Anantapur'
=======
  'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat', 'Pune',
  'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad',
  'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Coimbatore', 'Agra', 'Madurai', 'Nashik', 'Vijayawada',
  'Meerut', 'Faridabad', 'Rajkot', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai',
  'Prayagraj', 'Ranchi', 'Howrah', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur', 'Raipur', 'Kota',
  'Guwahati', 'Chandigarh', 'Solapur', 'Hubli', 'Mysuru', 'Tiruchirappalli', 'Bareilly', 'Aligarh', 'Tirunelveli',
  'Jamshedpur', 'Salem', 'Guntur', 'Bhubaneswar', 'Warangal', 'Cuttack', 'Kozhikode', 'Noida', 'Agra',
  'Thiruvananthapuram', 'Kochi', 'Mangaluru', 'Kolhapur', 'Kurnool', 'Nellore', 'Ajmer', 'Amravati',
  'Dehradun', 'Haridwar', 'Rishikesh', 'Siliguri', 'Durgapur', 'Asansol', 'Gaya', 'Muzaffarpur', 'Bhagalpur',
  'Kharagpur', 'Udaipur', 'Nainital', 'Darjeeling', 'Kullu', 'Manali', 'Shimla', 'Jammu', 'Prayagraj', 'Patiala',
  'Bathinda', 'Jalandhar', 'Amritsar', 'Panipat', 'Karnal', 'Hisar', 'Rohtak', 'Ambala', 'Gurugram', 'Faridabad',
  'Kolkata', 'Howrah', 'Belagavi', 'Gulbarga', 'Dharwad', 'Tirupati', 'Kakinada', 'Kadapa', 'Anantapur'
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
]);

const isUrbanCity = (name) => MAJOR_CITIES.has(name);

/* ─── Shared in-memory stores ─── */
const registeredCustomers = [];
<<<<<<< HEAD
const registeredShramiks  = [];
const registeredAdmins    = [];
=======
const registeredShramiks = [];
const registeredAdmins = [];
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4

/* ─────────────────────────────────────────
   State + City/District/Village Dropdown
───────────────────────────────────────── */
const LocationDropdown = ({ value, onChange, showLabel = true }) => {
<<<<<<< HEAD
=======
  const { t } = useApp();
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
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
  const cityRef = useRef(null);

  const cities = selectedState ? (INDIA_LOCATIONS[selectedState] || []) : [];

  useEffect(() => {
    if (!selectedState) {
      setFilteredCities([]);
      return;
    }
    if (citySearch.length >= 1) {
      const q = citySearch.toLowerCase();
      setFilteredCities(cities.filter(c => c.toLowerCase().includes(q)).slice(0, 10));
      setCityDropdownOpen(true);
    } else {
      setFilteredCities(cities.slice(0, 15));
      setCityDropdownOpen(true);
    }
  }, [citySearch, selectedState]);

  useEffect(() => {
    const handler = (e) => {
      if (cityRef.current && !cityRef.current.contains(e.target)) setCityDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectCity = (city) => {
    setSelectedCity(city);
    setCitySearch('');
    setCityDropdownOpen(false);
    onChange(`${city} | ${selectedState}`);
  };

  const handleStateChange = (state) => {
    setSelectedState(state);
    setSelectedCity('');
    setCitySearch('');
    setFilteredCities([]);
    setCityDropdownOpen(false);
    onChange('');
  };

  const clearLocation = () => {
    setSelectedState('');
    setSelectedCity('');
    setCitySearch('');
    setFilteredCities([]);
    setCityDropdownOpen(false);
    onChange('');
  };

  const stateIcon = <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />;
  const selectBase = "w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all appearance-none font-sans text-slate-700";

  return (
    <div className="space-y-2.5">
      {/* State Dropdown */}
<<<<<<< HEAD
      {showLabel && <label className={LC}>State</label>}
=======
      {showLabel && <label className={LC}>{t('auth.state', 'State')}</label>}
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
      <div className="relative">
        {stateIcon}
        <select value={selectedState} onChange={(e) => handleStateChange(e.target.value)}
          className={selectBase}>
<<<<<<< HEAD
          <option value="">Select State / UT...</option>
=======
          <option value="">{t('auth.selectState', 'Select State / UT...')}</option>
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
          {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* City / District / Village Dropdown */}
      {selectedState && (
        <div>
<<<<<<< HEAD
          {showLabel && <label className={LC}>City / District / Village</label>}
=======
          {showLabel && <label className={LC}>{t('auth.cityDistrict', 'City / District / Village')}</label>}
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
          <div className="relative" ref={cityRef}>
            <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
            <input
              type="text"
<<<<<<< HEAD
              placeholder={selectedCity ? selectedCity : `Search in ${selectedState}...`}
=======
              placeholder={selectedCity ? selectedCity : t('auth.searchInState', 'Search in {state}...', { state: selectedState })}
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
              value={selectedCity ? selectedCity : citySearch}
              onChange={(e) => {
                setSelectedCity('');
                setCitySearch(e.target.value);
                onChange('');
              }}
              onFocus={() => { setCityDropdownOpen(true); if (!citySearch) setFilteredCities(cities.slice(0, 15)); }}
              className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-sans placeholder:text-slate-400"
              autoComplete="off"
            />
            {selectedCity && (
              <button type="button" onClick={() => { setSelectedCity(''); setCitySearch(''); onChange(''); }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
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
<<<<<<< HEAD
                No city found in {selectedState}.
=======
                {t('auth.noCityFound', 'No city found in {state}.', { state: selectedState })}
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
              </div>
            )}
          </div>
        </div>
      )}

      {/* Clear all */}
      {selectedState && (
        <button type="button" onClick={clearLocation} className="text-[11px] text-slate-400 hover:text-red-500 transition-colors ml-1">
<<<<<<< HEAD
          Clear selection
=======
          {t('common.clear', 'Clear selection')}
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
        </button>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   Detect location buttons + GPS / manual
───────────────────────────────────────── */
const useDetectLocation = () => {
  const [detecting, setDetecting] = useState(false);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [error, setError] = useState('');

  const detect = () => {
    if (!('geolocation' in navigator)) { setError('Geolocation not supported by this browser.'); return; }
    setDetecting(true); setError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLat(pos.coords.latitude.toFixed(4)); setLng(pos.coords.longitude.toFixed(4)); setDetecting(false); },
      (err) => { setError('Unable to get location. Please allow location access or enter manually.'); setDetecting(false); },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  return { detecting, lat, lng, error, detect };
};

/* ─────────────────────────────────────────
   Address details section (customer only)
   Non-mandatory free-text inputs, shown
   conditionally based on selected location.
   - City (urban): street + house + flat only
   - District/Village (interior): also village + town
───────────────────────────────────────── */
const AddressDetails = ({
  locationType, onHouse, onFlat, onStreet, onVillage, onTown,
  houseValue, flatValue, streetValue, villageValue, townValue
}) => {
<<<<<<< HEAD
=======
  const { t } = useApp();
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
  const { detecting, lat, lng, error, detect } = useDetectLocation();

  const isInterior = locationType === 'interior';

  const FT = 'w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-sans placeholder:text-slate-400';

  return (
    <div className="space-y-3 border-t border-slate-100 pt-4 mt-1">
      <div className="flex items-center justify-between">
<<<<<<< HEAD
        <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Exact Address Details</p>
=======
        <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t('auth.exactAddressDetails', 'Exact Address Details')}</p>
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
        <button
          type="button"
          onClick={detect}
          disabled={detecting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border border-emerald-300 text-emerald-700 hover:bg-emerald-50 transition-all disabled:opacity-50"
        >
          <MapPin className="w-3.5 h-3.5" />
<<<<<<< HEAD
          {detecting ? 'Detecting...' : 'Detect Location'}
=======
          {detecting ? t('auth.detecting', 'Detecting...') : t('auth.detectLocation', 'Detect Location')}
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
        </button>
      </div>

      {lat && lng && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-[11px] text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
<<<<<<< HEAD
          Detected: {lat}, {lng}
=======
          {t('auth.detected', 'Detected:')} {lat}, {lng}
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
        </div>
      )}
      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-[11px] text-amber-800">
          {error}
        </div>
      )}

      {/* House Number + Flat Number */}
      <div className="grid grid-cols-2 gap-3">
        <div>
<<<<<<< HEAD
          <label className={LC}>House Number <span className="text-slate-300 normal-case font-normal">(optional)</span></label>
          <input type="text" placeholder="e.g. 42" value={houseValue}
            onChange={e=>onHouse(e.target.value)} className={FT}/>
        </div>
        <div>
          <label className={LC}>Flat / Apartment No. <span className="text-slate-300 normal-case font-normal">(optional)</span></label>
          <input type="text" placeholder="e.g. 3B / Block C" value={flatValue}
            onChange={e=>onFlat(e.target.value)} className={FT}/>
=======
          <label className={LC}>{t('auth.houseNumber', 'House Number')} <span className="text-slate-300 normal-case font-normal">{t('auth.optional', '(optional)')}</span></label>
          <input type="text" placeholder="e.g. 42" value={houseValue}
            onChange={e => onHouse(e.target.value)} className={FT} />
        </div>
        <div>
          <label className={LC}>{t('auth.flatNumber', 'Flat / Apartment No.')} <span className="text-slate-300 normal-case font-normal">{t('auth.optional', '(optional)')}</span></label>
          <input type="text" placeholder="e.g. 3B / Block C" value={flatValue}
            onChange={e => onFlat(e.target.value)} className={FT} />
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
        </div>
      </div>

      {/* Street Name — free text */}
      <div>
<<<<<<< HEAD
        <label className={LC}>Street Name / Landmark <span className="text-slate-300 normal-case font-normal">(optional)</span></label>
        <input type="text" placeholder="e.g. Park Street, near City Mall" value={streetValue}
          onChange={e=>onStreet(e.target.value)} className={FT}/>
=======
        <label className={LC}>{t('auth.streetName', 'Street Name / Landmark')} <span className="text-slate-300 normal-case font-normal">{t('auth.optional', '(optional)')}</span></label>
        <input type="text" placeholder="e.g. Park Street, near City Mall" value={streetValue}
          onChange={e => onStreet(e.target.value)} className={FT} />
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
      </div>

      {/* For interior locations (district / village) ask for village + town */}
      {isInterior && (
        <div className="grid grid-cols-2 gap-3">
          <div>
<<<<<<< HEAD
            <label className={LC}>Village Name <span className="text-slate-300 normal-case font-normal">(optional)</span></label>
            <input type="text" placeholder="e.g. Kuppam" value={villageValue}
              onChange={e=>onVillage(e.target.value)} className={FT}/>
          </div>
          <div>
            <label className={LC}>Town Name <span className="text-slate-300 normal-case font-normal">(optional)</span></label>
            <input type="text" placeholder="e.g. Kuppam Town" value={townValue}
              onChange={e=>onTown(e.target.value)} className={FT}/>
=======
            <label className={LC}>{t('auth.villageName', 'Village Name')} <span className="text-slate-300 normal-case font-normal">{t('auth.optional', '(optional)')}</span></label>
            <input type="text" placeholder="e.g. Kuppam" value={villageValue}
              onChange={e => onVillage(e.target.value)} className={FT} />
          </div>
          <div>
            <label className={LC}>{t('auth.townName', 'Town Name')} <span className="text-slate-300 normal-case font-normal">{t('auth.optional', '(optional)')}</span></label>
            <input type="text" placeholder="e.g. Kuppam Town" value={townValue}
              onChange={e => onTown(e.target.value)} className={FT} />
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
          </div>
        </div>
      )}

      {/* Live address preview */}
      {(houseValue || flatValue || streetValue || villageValue || townValue) && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-600 leading-relaxed">
<<<<<<< HEAD
          <span className="font-bold text-slate-800 mb-0.5 block">Address Preview:</span>
=======
          <span className="font-bold text-slate-800 mb-0.5 block">{t('auth.addressPreview', 'Address Preview:')}</span>
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
          {[flatValue, houseValue, streetValue, villageValue, townValue].filter(Boolean).join(', ')}
        </div>
      )}
    </div>
  );
};

/* ─── Shared input/label styles ─── */
const IC = 'w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-mono placeholder:font-sans placeholder:text-slate-400';
const LC = 'block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5';

const onlyDigits = (val) => /^\d*$/.test(val);

/* ── Password strength helper ── */
<<<<<<< HEAD
const useStrength = (pw) => {
  const s = pw.length >= 8 ? 3 : pw.length >= 6 ? 2 : pw.length >= 4 ? 1 : 0;
  const colors = ['bg-slate-200','bg-red-400','bg-amber-400','bg-emerald-500'];
  const labels = ['','Weak','Fair','Strong'];
=======
const useStrength = (pw, t) => {
  const s = pw.length >= 8 ? 3 : pw.length >= 6 ? 2 : pw.length >= 4 ? 1 : 0;
  const colors = ['bg-slate-200', 'bg-red-400', 'bg-amber-400', 'bg-emerald-500'];
  const labels = ['', t ? t('auth.weak', 'Weak') : 'Weak', t ? t('auth.fair', 'Fair') : 'Fair', t ? t('auth.strong', 'Strong') : 'Strong'];
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
  return { strength: s, color: colors[s], label: labels[s] };
};

/* ══════════════════════════════════════════════════════════════
   PasswordField helper
══════════════════════════════════════════════════════════════ */
const PasswordField = ({ label, value, onChange, placeholder, show, onToggle, numeric = false, showStrength = false, confirmValue }) => {
<<<<<<< HEAD
  const { strength, color, label: sLabel } = useStrength(value);
=======
  const { t } = useApp();
  const { strength, color, label: sLabel } = useStrength(value, t);
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
  const matchOk = confirmValue !== undefined ? (confirmValue.length > 0 && confirmValue === value) : null;
  const matchBad = confirmValue !== undefined ? (confirmValue.length > 0 && confirmValue !== value) : null;

  return (
    <div>
      <label className={LC}>{label}</label>
      <div className="relative">
        <Hash className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type={show ? 'text' : 'password'}
          inputMode={numeric ? 'numeric' : 'text'}
          placeholder={placeholder}
          value={value}
          onChange={(e) => numeric ? onlyDigits(e.target.value) && onChange(e.target.value) : onChange(e.target.value)}
          className={`${IC} pr-12 ${matchBad ? 'border-red-400 ring-1 ring-red-200' : matchOk ? 'border-emerald-400 ring-1 ring-emerald-300' : ''}`}
        />
        <button type="button" onClick={onToggle} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {showStrength && value.length > 0 && (
        <div className="flex items-center gap-2 mt-2">
          <div className="flex gap-1 flex-1">
<<<<<<< HEAD
            {[1,2,3].map(lvl => (
              <div key={lvl} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${strength >= lvl ? color : 'bg-slate-200'}`} />
            ))}
          </div>
          <span className={`text-xs font-semibold ${strength===3?'text-emerald-600':strength===2?'text-amber-500':'text-red-500'}`}>{sLabel}</span>
        </div>
      )}
      {matchBad && <p className="text-xs text-red-500 mt-1 ml-1">Passwords do not match</p>}
      {matchOk  && <p className="text-xs text-emerald-600 mt-1 ml-1 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5"/>Passwords match</p>}
=======
            {[1, 2, 3].map(lvl => (
              <div key={lvl} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${strength >= lvl ? color : 'bg-slate-200'}`} />
            ))}
          </div>
          <span className={`text-xs font-semibold ${strength === 3 ? 'text-emerald-600' : strength === 2 ? 'text-amber-500' : 'text-red-500'}`}>{sLabel}</span>
        </div>
      )}
      {matchBad && <p className="text-xs text-red-500 mt-1 ml-1">{t('auth.passwordsDoNotMatch', 'Passwords do not match')}</p>}
      {matchOk && <p className="text-xs text-emerald-600 mt-1 ml-1 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />{t('auth.passwordsMatch', 'Passwords match')}</p>}
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   MAIN LoginPage
══════════════════════════════════════════════════════════════ */
export const LoginPage = () => {
<<<<<<< HEAD
  const { switchRole, setCurrentScreen, showToast, setActiveShramikId, intendedLoginRole, login, shramiks, activeShramikId } = useApp();

  const [activeRoleTab, setActiveRoleTab] = useState(intendedLoginRole || 'customer');
  const [authMode, setAuthMode]           = useState('signin'); // 'signin' | 'signup'
=======
  const { switchRole, setCurrentScreen, showToast, setActiveShramikId, intendedLoginRole, login, shramiks, activeShramikId, openSettings, t, tSkill } = useApp();

  const [activeRoleTab, setActiveRoleTab] = useState(intendedLoginRole || 'customer');
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4

  useEffect(() => { setAuthMode('signin'); }, [activeRoleTab]);

  /* ─── Customer Sign-In ─── */
<<<<<<< HEAD
  const [csiPhone, setCsiPhone]   = useState('');
  const [csiPw,    setCsiPw]      = useState('');
  const [showCsiPw, setShowCsiPw] = useState(false);

  /* ─── Customer Sign-Up ─── */
  const [csuName,    setCsuName]    = useState('');
  const [csuAge,     setCsuAge]     = useState('');
  const [csuCity,    setCsuCity]    = useState('');
  const [csuHouse,   setCsuHouse]   = useState('');
  const [csuFlat,    setCsuFlat]    = useState('');
  const [csuStreet,  setCsuStreet]  = useState('');
  const [csuVillage, setCsuVillage] = useState('');
  const [csuTown,    setCsuTown]    = useState('');
  const [csuPhone,   setCsuPhone]   = useState('');
  const [csuPw,      setCsuPw]      = useState('');
  const [csuCpw,     setCsuCpw]     = useState('');
  const [showCsuPw,  setShowCsuPw]  = useState(false);
  const [showCsuCpw, setShowCsuCpw] = useState(false);

  /* ─── Shramik Sign-In ─── */
  const [ssiPhone,  setSsiPhone]  = useState('');
  const [ssiPw,     setSsiPw]     = useState('');
  const [showSsiPw, setShowSsiPw] = useState(false);

  /* ─── Shramik Sign-Up ─── */
  const [ssuName,    setSsuName]    = useState('');
  const [ssuAge,     setSsuAge]     = useState('');
  const [ssuCity,    setSsuCity]    = useState('');
  const [ssuPhone,   setSsuPhone]   = useState('');
  const [ssuSkill,   setSsuSkill]   = useState('');
  const [ssuPw,      setSsuPw]      = useState('');
  const [ssuCpw,     setSsuCpw]     = useState('');
  const [showSsuPw,  setShowSsuPw]  = useState(false);
  const [showSsuCpw, setShowSsuCpw] = useState(false);

  /* ─── Admin Sign-In ─── */
  const [asiPhone,  setAsiPhone]  = useState('');
  const [asiPw,     setAsiPw]     = useState('');
  const [showAsiPw, setShowAsiPw] = useState(false);

  /* ─── Admin Sign-Up ─── */
  const [asuName,    setAsuName]    = useState('');
  const [asuCity,    setAsuCity]    = useState('');
  const [asuPhone,   setAsuPhone]   = useState('');
  const [asuEmpId,   setAsuEmpId]   = useState('');
  const [asuPw,      setAsuPw]      = useState('');
  const [asuCpw,     setAsuCpw]     = useState('');
  const [showAsuPw,  setShowAsuPw]  = useState(false);
=======
  const [csiPhone, setCsiPhone] = useState('');
  const [csiPw, setCsiPw] = useState('');
  const [showCsiPw, setShowCsiPw] = useState(false);

  /* ─── Customer Sign-Up ─── */
  const [csuName, setCsuName] = useState('');
  const [csuAge, setCsuAge] = useState('');
  const [csuCity, setCsuCity] = useState('');
  const [csuHouse, setCsuHouse] = useState('');
  const [csuFlat, setCsuFlat] = useState('');
  const [csuStreet, setCsuStreet] = useState('');
  const [csuVillage, setCsuVillage] = useState('');
  const [csuTown, setCsuTown] = useState('');
  const [csuPhone, setCsuPhone] = useState('');
  const [csuPw, setCsuPw] = useState('');
  const [csuCpw, setCsuCpw] = useState('');
  const [showCsuPw, setShowCsuPw] = useState(false);
  const [showCsuCpw, setShowCsuCpw] = useState(false);

  /* ─── Shramik Sign-In ─── */
  const [ssiPhone, setSsiPhone] = useState('');
  const [ssiPw, setSsiPw] = useState('');
  const [showSsiPw, setShowSsiPw] = useState(false);

  /* ─── Shramik Sign-Up ─── */
  const [ssuName, setSsuName] = useState('');
  const [ssuAge, setSsuAge] = useState('');
  const [ssuCity, setSsuCity] = useState('');
  const [ssuPhone, setSsuPhone] = useState('');
  const [ssuSkill, setSsuSkill] = useState('');
  const [ssuPw, setSsuPw] = useState('');
  const [ssuCpw, setSsuCpw] = useState('');
  const [showSsuPw, setShowSsuPw] = useState(false);
  const [showSsuCpw, setShowSsuCpw] = useState(false);

  /* ─── Admin Sign-In ─── */
  const [asiPhone, setAsiPhone] = useState('');
  const [asiPw, setAsiPw] = useState('');
  const [showAsiPw, setShowAsiPw] = useState(false);

  /* ─── Admin Sign-Up ─── */
  const [asuName, setAsuName] = useState('');
  const [asuCity, setAsuCity] = useState('');
  const [asuPhone, setAsuPhone] = useState('');
  const [asuEmpId, setAsuEmpId] = useState('');
  const [asuPw, setAsuPw] = useState('');
  const [asuCpw, setAsuCpw] = useState('');
  const [showAsuPw, setShowAsuPw] = useState(false);
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
  const [showAsuCpw, setShowAsuCpw] = useState(false);

  /* ══════════ HANDLERS ══════════ */

  /* Customer Sign In */
  const handleCSignIn = (e) => {
    e.preventDefault();
<<<<<<< HEAD
    if (!csiPhone || csiPhone.length !== 10) return showToast('Enter a valid 10-digit phone number.', 'error');
    if (!csiPw) return showToast('Please enter your password.', 'error');
    const found = registeredCustomers.find(c => c.phone === csiPhone && c.password === csiPw);
    if (!found) return showToast('No account found. Please sign up first, or check your credentials.', 'error');
    login(found);
    showToast(`Welcome back, ${found.name}!`, 'success');
=======
    if (!csiPhone || csiPhone.length !== 10) return showToast(t('auth.validPhoneErr', 'Enter a valid 10-digit phone number.'), 'error');
    if (!csiPw) return showToast(t('auth.enterPasswordErr', 'Please enter your password.'), 'error');
    const found = registeredCustomers.find(c => c.phone === csiPhone && c.password === csiPw);
    if (!found) return showToast(t('auth.noAccountErr', 'No account found. Please sign up first, or check your credentials.'), 'error');
    login(found);
    showToast(t('auth.welcomeBackToast', 'Welcome back, {name}!', { name: found.name }), 'success');
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
    setCurrentScreen('search');
  };

  /* Customer Sign Up */
  const handleCSignUp = (e) => {
    e.preventDefault();
<<<<<<< HEAD
    if (!csuName.trim())                                  return showToast('Please enter your full name.', 'error');
    if (!csuAge || parseInt(csuAge)<18 || parseInt(csuAge)>100) return showToast('Enter a valid age (18–100).', 'error');
    if (!csuCity)                                         return showToast('Please select your city.', 'error');
    if (!csuPhone || csuPhone.length!==10)                return showToast('Enter a valid 10-digit phone number.', 'error');
    if (!csuPw || csuPw.length<4 || !onlyDigits(csuPw))  return showToast('Password must be at least 4 digits (numbers only).', 'error');
    if (csuPw !== csuCpw)                                 return showToast('Passwords do not match.', 'error');
    if (registeredCustomers.find(c=>c.phone===csuPhone))  return showToast('Phone already registered. Please sign in.', 'error');
    const fullAddress = [csuFlat, csuHouse, csuStreet, csuVillage, csuTown, csuCity].filter(Boolean).join(', ');
    const user = {
      name:csuName.trim(), age:csuAge, city:csuCity, phone:csuPhone,
      password:csuPw, role:'customer',
=======
    if (!csuName.trim()) return showToast(t('auth.enterNameErr', 'Please enter your full name.'), 'error');
    if (!csuAge || parseInt(csuAge) < 18 || parseInt(csuAge) > 100) return showToast(t('auth.validAgeErr', 'Enter a valid age (18–100).'), 'error');
    if (!csuCity) return showToast(t('auth.selectCityErr', 'Please select your city.'), 'error');
    if (!csuPhone || csuPhone.length !== 10) return showToast(t('auth.validPhoneErr', 'Enter a valid 10-digit phone number.'), 'error');
    if (!csuPw || csuPw.length < 4 || !onlyDigits(csuPw)) return showToast(t('auth.validPasswordErr', 'Password must be at least 4 digits (numbers only).'), 'error');
    if (csuPw !== csuCpw) return showToast(t('auth.passwordsDoNotMatch', 'Passwords do not match.'), 'error');
    if (registeredCustomers.find(c => c.phone === csuPhone)) return showToast(t('auth.phoneRegisteredErr', 'Phone already registered. Please sign in.'), 'error');
    const fullAddress = [csuFlat, csuHouse, csuStreet, csuVillage, csuTown, csuCity].filter(Boolean).join(', ');
    const user = {
      name: csuName.trim(), age: csuAge, city: csuCity, phone: csuPhone,
      password: csuPw, role: 'customer',
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
      address: fullAddress,
      addressDetails: { house: csuHouse, flat: csuFlat, street: csuStreet, village: csuVillage, town: csuTown }
    };
    registeredCustomers.push(user);
    login(user);
<<<<<<< HEAD
    showToast(`Account created! Welcome, ${user.name}!`, 'success');
=======
    showToast(t('auth.accountCreatedToast', 'Account created! Welcome, {name}!', { name: user.name }), 'success');
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
    setCurrentScreen('search');
  };

  /* Shramik Sign In */
  const handleSSignIn = (e) => {
    e.preventDefault();
<<<<<<< HEAD
    if (!ssiPhone || ssiPhone.length!==10) return showToast('Enter a valid 10-digit phone number.', 'error');
    if (!ssiPw)                            return showToast('Please enter your password.', 'error');
    const found = registeredShramiks.find(s=>s.phone===ssiPhone && s.password===ssiPw);
    if (!found) return showToast('No Shramik account found. Please sign up first.', 'error');
    login(found);
    showToast(`Welcome back, ${found.name}!`, 'success');
=======
    if (!ssiPhone || ssiPhone.length !== 10) return showToast(t('auth.validPhoneErr', 'Enter a valid 10-digit phone number.'), 'error');
    if (!ssiPw) return showToast(t('auth.enterPasswordErr', 'Please enter your password.'), 'error');
    const found = registeredShramiks.find(s => s.phone === ssiPhone && s.password === ssiPw);
    if (!found) return showToast(t('auth.noShramikAccountErr', 'No Shramik account found. Please sign up first.'), 'error');
    login(found);
    showToast(t('auth.welcomeBackToast', 'Welcome back, {name}!', { name: found.name }), 'success');
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
    setCurrentScreen('shramik_pending');
  };

  /* Shramik Sign Up */
  const handleSSignUp = (e) => {
    e.preventDefault();
<<<<<<< HEAD
    if (!ssuName.trim())                                  return showToast('Please enter your full name.', 'error');
    if (!ssuAge || parseInt(ssuAge)<18 || parseInt(ssuAge)>70) return showToast('Enter a valid age (18–70).', 'error');
    if (!ssuCity)                                         return showToast('Please select your city.', 'error');
    if (!ssuPhone || ssuPhone.length!==10)                return showToast('Enter a valid 10-digit phone number.', 'error');
    if (!ssuSkill)                                        return showToast('Please select your primary skill.', 'error');
    if (!ssuPw || ssuPw.length<4 || !onlyDigits(ssuPw))  return showToast('Password must be at least 4 digits (numbers only).', 'error');
    if (ssuPw !== ssuCpw)                                 return showToast('Passwords do not match.', 'error');
    if (registeredShramiks.find(s=>s.phone===ssuPhone))   return showToast('Phone already registered. Please sign in.', 'error');
    const shramikUser = { name:ssuName.trim(), age:ssuAge, city:ssuCity, phone:ssuPhone, skill:ssuSkill, password:ssuPw, role:'shramik', verified:false, shramikId:null };
    registeredShramiks.push(shramikUser);
    login(shramikUser);
    showToast(`Welcome, ${shramikUser.name}! Your registration is under review.`, 'info');
=======
    if (!ssuName.trim()) return showToast(t('auth.enterNameErr', 'Please enter your full name.'), 'error');
    if (!ssuAge || parseInt(ssuAge) < 18 || parseInt(ssuAge) > 70) return showToast(t('auth.validShramikAgeErr', 'Enter a valid age (18–70).'), 'error');
    if (!ssuCity) return showToast(t('auth.selectCityErr', 'Please select your city.'), 'error');
    if (!ssuPhone || ssuPhone.length !== 10) return showToast(t('auth.validPhoneErr', 'Enter a valid 10-digit phone number.'), 'error');
    if (!ssuSkill) return showToast(t('auth.selectSkillErr', 'Please select your primary skill.'), 'error');
    if (!ssuPw || ssuPw.length < 4 || !onlyDigits(ssuPw)) return showToast(t('auth.validPasswordErr', 'Password must be at least 4 digits (numbers only).'), 'error');
    if (ssuPw !== ssuCpw) return showToast(t('auth.passwordsDoNotMatch', 'Passwords do not match.'), 'error');
    if (registeredShramiks.find(s => s.phone === ssuPhone)) return showToast(t('auth.phoneRegisteredErr', 'Phone already registered. Please sign in.'), 'error');
    const shramikUser = { name: ssuName.trim(), age: ssuAge, city: ssuCity, phone: ssuPhone, skill: ssuSkill, password: ssuPw, role: 'shramik', verified: false, shramikId: null };
    registeredShramiks.push(shramikUser);
    login(shramikUser);
    showToast(t('auth.shramikReviewToast', 'Welcome, {name}! Your registration is under review.', { name: shramikUser.name }), 'info');
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
    setCurrentScreen('shramik_pending');
  };

  /* Admin Sign In */
<<<<<<< HEAD
  const handleASignIn = async (e) => {
    e.preventDefault();
    if (!asiPhone) return showToast('Please enter your phone/ID.', 'error');
    if (!asiPw)    return showToast('Please enter your password.', 'error');
    try {
      const found = await loginAdmin({ identifier: asiPhone, password: asiPw });
      login(found);
      showToast(`Welcome back, ${found.name}!`, 'success');
      setCurrentScreen('admin_dashboard');
    } catch (error) {
      showToast(error.message || 'Invalid admin credentials.', 'error');
    }
=======
  const handleASignIn = (e) => {
    e.preventDefault();
    if (!asiPhone) return showToast(t('auth.enterAdminIdErr', 'Please enter your phone/ID.'), 'error');
    if (!asiPw) return showToast(t('auth.enterPasswordErr', 'Please enter your password.'), 'error');
    const found = registeredAdmins.find(a => a.phone === asiPhone && a.password === asiPw);
    if (!found) return showToast(t('auth.noAdminAccountErr', 'No admin account found. Please register first.'), 'error');
    login(found);
    showToast(t('auth.welcomeBackToast', 'Welcome back, {name}!', { name: found.name }), 'success');
    setCurrentScreen('admin_dashboard');
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
  };

  /* Admin Sign Up */
  const handleASignUp = (e) => {
    e.preventDefault();
<<<<<<< HEAD
    if (!asuName.trim())                                  return showToast('Please enter your full name.', 'error');
    if (!asuCity)                                         return showToast('Please select your city.', 'error');
    if (!asuPhone || asuPhone.length!==10)                return showToast('Enter a valid 10-digit phone number.', 'error');
    if (!asuEmpId.trim())                                 return showToast('Please enter your Employee/Admin ID.', 'error');
    if (!asuPw || asuPw.length<4 || !onlyDigits(asuPw))  return showToast('Password must be at least 4 digits (numbers only).', 'error');
    if (asuPw !== asuCpw)                                 return showToast('Passwords do not match.', 'error');
    if (registeredAdmins.find(a=>a.phone===asuPhone))     return showToast('Phone already registered. Please sign in.', 'error');
    const adminUser = { name:asuName.trim(), city:asuCity, phone:asuPhone, empId:asuEmpId.trim(), password:asuPw, role:'admin' };
    registeredAdmins.push(adminUser);
    login(adminUser);
    showToast(`Admin account created! Welcome, ${adminUser.name}.`, 'success');
    setCurrentScreen('admin_dashboard');
  };

  const SKILLS = ['Electrician','Plumber','Carpenter','Painter','Mason','AC Repair','Welder','Mechanic','Tailor','Cook'];
=======
    if (!asuName.trim()) return showToast(t('auth.enterNameErr', 'Please enter your full name.'), 'error');
    if (!asuCity) return showToast(t('auth.selectCityErr', 'Please select your city.'), 'error');
    if (!asuPhone || asuPhone.length !== 10) return showToast(t('auth.validPhoneErr', 'Enter a valid 10-digit phone number.'), 'error');
    if (!asuEmpId.trim()) return showToast(t('auth.enterEmpIdErr', 'Please enter your Employee/Admin ID.'), 'error');
    if (!asuPw || asuPw.length < 4 || !onlyDigits(asuPw)) return showToast(t('auth.validPasswordErr', 'Password must be at least 4 digits (numbers only).'), 'error');
    if (asuPw !== asuCpw) return showToast(t('auth.passwordsDoNotMatch', 'Passwords do not match.'), 'error');
    if (registeredAdmins.find(a => a.phone === asuPhone)) return showToast(t('auth.phoneRegisteredErr', 'Phone already registered. Please sign in.'), 'error');
    const adminUser = { name: asuName.trim(), city: asuCity, phone: asuPhone, empId: asuEmpId.trim(), password: asuPw, role: 'admin' };
    registeredAdmins.push(adminUser);
    login(adminUser);
    showToast(t('auth.adminAccountCreatedToast', 'Admin account created! Welcome, {name}.', { name: adminUser.name }), 'success');
    setCurrentScreen('admin_dashboard');
  };

  const SKILLS = ['Electrician', 'Plumber', 'Carpenter', 'Painter', 'Mason', 'AC Repair', 'Welder', 'Mechanic', 'Tailor', 'Cook'];
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4

  const csuCityName = csuCity.includes(' | ') ? csuCity.split(' | ')[0].trim() : '';
  const csuState = csuCity.includes(' | ') ? csuCity.split(' | ')[1] : '';

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-emerald-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Back */}
      <div className="w-full max-w-5xl mb-4 flex justify-start">
        <button onClick={()=>{ switchRole('landing'); setCurrentScreen('landing'); }} className="text-slate-600 hover:text-slate-900 text-sm font-semibold flex items-center gap-1.5 transition-colors">
          ← Back to Home
        </button>
=======
    <div className="min-h-screen flex flex-col items-center justify-start sm:justify-center px-4 pt-5 sm:p-6 lg:p-8 pb-14">
      {/* Mobile-first header with centered Language option bar */}
      <div className="w-full max-w-5xl mb-4 md:mb-5 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center">
        <button onClick={() => { switchRole('landing'); setCurrentScreen('landing'); }} className="justify-self-start text-slate-600 hover:text-slate-900 text-sm font-semibold flex items-center gap-1.5 transition-colors">
          {t('auth.backToHome', '← Back to Home')}
        </button>
        {/* Language option bar - centered on the page */}
        <div className="mt-3 md:mt-0 flex justify-center">
          <LanguageSelectDropdown />
        </div>
        {/* Symmetry spacer (desktop only) */}
        <div className="hidden md:block" />
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
      </div>

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-5">

        {/* ── LEFT PANEL (desktop only — hidden on mobile for a clean single-column form) ── */}
        <div className="md:col-span-2 bg-gradient-to-br from-emerald-800 via-emerald-700 to-slate-900 text-white p-8 sm:p-10 hidden md:flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#86efac_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Shield className="w-6 h-6 text-emerald-300" />
              </div>
              <span className="font-bold text-xl font-heading tracking-wide">SHRAM SETU</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading pt-4 text-emerald-100 leading-snug">
<<<<<<< HEAD
              Connecting Skilled Hands with Local Demand.
            </h2>
            <p className="text-sm text-emerald-100/80 leading-relaxed font-light">
              A trusted platform for verified skilled workers and customers.
            </p>
            <ul className="space-y-3 pt-2">
              {['Verified local skilled workers','Transparent pricing and booking','Secure 4-digit job start code','Pay only after work is done'].map(f=>(
                <li key={f} className="flex items-center gap-2 text-xs text-emerald-100/90">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0"/>{f}
=======
              {t('auth.heroTitle', 'Connecting Skilled Hands with Local Demand.')}
            </h2>
            <p className="text-sm text-emerald-100/80 leading-relaxed font-light">
              {t('auth.heroSubtitle', 'A trusted platform for verified skilled workers and customers.')}
            </p>
            <ul className="space-y-3 pt-2">
              {[
                t('auth.feature1', 'Verified local skilled workers'),
                t('auth.feature2', 'Transparent pricing and booking'),
                t('auth.feature3', 'Secure 4-digit job start code'),
                t('auth.feature4', 'Pay only after work is done')
              ].map(f => (
                <li key={f} className="flex items-center gap-2 text-xs text-emerald-100/90">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />{f}
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
                </li>
              ))}
            </ul>
          </div>

          {/* Role pills */}
          <div className="relative z-10 pt-6 border-t border-white/10 mt-6">
<<<<<<< HEAD
            <p className="text-xs text-emerald-300/70 mb-2 uppercase tracking-wider font-semibold">Login as</p>
            <div className="flex flex-wrap gap-2">
              {[{label:'Customer',value:'customer',icon:User},{label:'Shramik',value:'shramik',icon:Briefcase},{label:'Admin',value:'admin',icon:Shield}].map(({label,value,icon:Icon})=>(
                <button key={value} onClick={()=>setActiveRoleTab(value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${activeRoleTab===value?'bg-white text-emerald-800 border-white shadow-md':'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'}`}
                >
                  <Icon className="w-3.5 h-3.5"/>{label}
=======
            <p className="text-xs text-emerald-300/70 mb-2 uppercase tracking-wider font-semibold">
              {t('auth.loginAs', 'Login as')}
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: t('auth.customer', 'Customer'), value: 'customer', icon: User },
                { label: t('auth.shramik', 'Shramik'), value: 'shramik', icon: Briefcase },
                { label: t('auth.admin', 'Admin'), value: 'admin', icon: Shield }
              ].map(({ label, value, icon: Icon }) => (
                <button key={value} onClick={() => setActiveRoleTab(value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${activeRoleTab === value ? 'bg-white text-emerald-800 border-white shadow-md' : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'}`}
                >
                  <Icon className="w-3.5 h-3.5" />{label}
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
<<<<<<< HEAD
        <div className="md:col-span-3 p-6 sm:p-10 flex flex-col justify-start max-h-screen overflow-y-auto">
=======
        <div className="md:col-span-3 p-5 sm:p-10 flex flex-col justify-start md:max-h-screen md:overflow-y-auto">

          {/* Top Bar with Back Button (desktop only - mobile has it in the page header) */}
          <div className="hidden md:block mb-4 pb-3 border-b border-slate-100">
            <button
              type="button"
              onClick={() => setCurrentScreen('landing')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
            >
              {t('auth.backToHome', '← Back to Home')}
            </button>
          </div>
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4

          {/* Compact brand header (mobile only) */}
          <div className="md:hidden space-y-4 mb-5 pb-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-green-500 flex items-center justify-center text-white shadow-sm">
                  <Shield className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-base font-bold font-heading text-slate-900 tracking-tight leading-tight">
                    SHRAM SETU
                  </span>
<<<<<<< HEAD
                  <p className="text-[11px] text-slate-500 font-body leading-tight">Trusted Skilled Services</p>
=======
                  <p className="text-[11px] text-slate-500 font-body leading-tight">
                    {t('landing.trustedNetwork', 'India’s Unified Platform')}
                  </p>
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
                </div>
              </div>
              {activeRoleTab !== 'customer' && (
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  {activeRoleTab} Portal
                </span>
              )}
            </div>

            {/* Role switcher (mobile) */}
            <div className="flex gap-1.5">
<<<<<<< HEAD
              {[{label:'Customer',value:'customer',icon:User},{label:'Shramik',value:'shramik',icon:Briefcase},{label:'Admin',value:'admin',icon:Shield}].map(({label,value,icon:Icon})=>(
                <button key={value} onClick={()=>setActiveRoleTab(value)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${activeRoleTab===value?'bg-emerald-600 text-white border-emerald-600 shadow-sm':'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                >
                  <Icon className="w-4 h-4"/>{label}
=======
              {[
                { label: t('auth.customer', 'Customer'), value: 'customer', icon: User },
                { label: t('auth.shramik', 'Shramik'), value: 'shramik', icon: Briefcase },
                { label: t('auth.admin', 'Admin'), value: 'admin', icon: Shield }
              ].map(({ label, value, icon: Icon }) => (
                <button key={value} onClick={() => setActiveRoleTab(value)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${activeRoleTab === value ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                >
                  <Icon className="w-4 h-4" />{label}
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
                </button>
              ))}
            </div>
          </div>

          {/* ══════════ CUSTOMER ══════════ */}
<<<<<<< HEAD
          {activeRoleTab==='customer' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-2xl font-bold font-heading text-slate-900">{authMode==='signin'?'Welcome back 👋':'Create Account 🚀'}</h3>
                <p className="text-sm text-slate-500 mt-1">{authMode==='signin'?'Sign in with your registered credentials.':'Fill in the details below to create your account.'}</p>
=======
          {activeRoleTab === 'customer' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-2xl font-bold font-heading text-slate-900">
                  {authMode === 'signin' ? t('auth.welcomeBack', 'Welcome back 👋') : t('auth.createAccount', 'Create Account 🚀')}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {authMode === 'signin' ? t('auth.signInDesc', 'Sign in with your registered credentials.') : t('auth.signUpDesc', 'Fill in the details below to create your account.')}
                </p>
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
              </div>

              {/* Toggle */}
              <div className="bg-slate-100 p-1 rounded-xl flex text-sm font-semibold">
<<<<<<< HEAD
                {[{mode:'signin',icon:LogIn,label:'Sign In'},{mode:'signup',icon:UserPlus,label:'Sign Up'}].map(({mode,icon:Icon,label})=>(
                  <button key={mode} onClick={()=>setAuthMode(mode)}
                    className={`flex-1 py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${authMode===mode?'bg-white text-emerald-700 shadow-sm border border-slate-200':'text-slate-500 hover:text-slate-700'}`}>
                    <Icon className="w-4 h-4"/>{label}
=======
                {[
                  { mode: 'signin', icon: LogIn, label: t('auth.signIn', 'Sign In') },
                  { mode: 'signup', icon: UserPlus, label: t('auth.signUp', 'Sign Up') }
                ].map(({ mode, icon: Icon, label }) => (
                  <button key={mode} onClick={() => setAuthMode(mode)}
                    className={`flex-1 py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${authMode === mode ? 'bg-white text-emerald-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                    <Icon className="w-4 h-4" />{label}
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
                  </button>
                ))}
              </div>

              {/* Customer Sign In */}
<<<<<<< HEAD
              {authMode==='signin' && (
                <form onSubmit={handleCSignIn} className="space-y-4">
                  <div>
                    <label className={LC}>Phone Number</label>
                    <div className="relative">
                      <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
                      <input type="tel" maxLength={10} placeholder="10-digit mobile number" value={csiPhone}
                        onChange={e=>onlyDigits(e.target.value)&&setCsiPhone(e.target.value)} className={IC}/>
                    </div>
                  </div>
                  <PasswordField label="Numeric Password" value={csiPw} onChange={setCsiPw}
                    placeholder="Enter your numeric password" show={showCsiPw} onToggle={()=>setShowCsiPw(v=>!v)} numeric />
                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
                    Sign In <ArrowRight className="w-4 h-4"/>
                  </button>
                  <p className="text-center text-xs text-slate-500">
                    New here?{' '}<button type="button" onClick={()=>setAuthMode('signup')} className="text-emerald-700 font-bold hover:underline">Create an account</button>
=======
              {authMode === 'signin' && (
                <form onSubmit={handleCSignIn} className="space-y-4">
                  <div>
                    <label className={LC}>{t('auth.phone', 'Phone Number')}</label>
                    <div className="relative">
                      <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input type="tel" maxLength={10} placeholder={t('auth.phonePlaceholder', '10-digit mobile number')} value={csiPhone}
                        onChange={e => onlyDigits(e.target.value) && setCsiPhone(e.target.value)} className={IC} />
                    </div>
                  </div>
                  <PasswordField label={t('auth.numericPassword', 'Numeric Password')} value={csiPw} onChange={setCsiPw}
                    placeholder={t('auth.enterNumericPassword', 'Enter your numeric password')} show={showCsiPw} onToggle={() => setShowCsiPw(v => !v)} numeric />
                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
                    {t('auth.signIn', 'Sign In')} <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-center text-xs text-slate-500">
                    {t('auth.newHere', 'New here?')}{' '}<button type="button" onClick={() => setAuthMode('signup')} className="text-emerald-700 font-bold hover:underline">{t('auth.createAnAccount', 'Create an account')}</button>
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
                  </p>
                </form>
              )}

              {/* Customer Sign Up */}
<<<<<<< HEAD
              {authMode==='signup' && (
                <form onSubmit={handleCSignUp} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className={LC}>Full Name</label>
                    <div className="relative">
                      <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
                      <input type="text" placeholder="e.g. Amit Sharma" value={csuName} onChange={e=>setCsuName(e.target.value)}
                        className={IC+' font-sans'}/>
=======
              {authMode === 'signup' && (
                <form onSubmit={handleCSignUp} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className={LC}>{t('auth.fullName', 'Full Name')}</label>
                    <div className="relative">
                      <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input type="text" placeholder="e.g. Amit Sharma" value={csuName} onChange={e => setCsuName(e.target.value)}
                        className={IC + ' font-sans'} />
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
                    </div>
                  </div>
                  {/* Age + City */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
<<<<<<< HEAD
                      <label className={LC}>Age</label>
                      <div className="relative">
                        <Calendar className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
                        <input type="text" inputMode="numeric" maxLength={3} placeholder="e.g. 28" value={csuAge}
                          onChange={e=>onlyDigits(e.target.value)&&setCsuAge(e.target.value)} className={IC}/>
                      </div>
                    </div>
                    <div>
                      <LocationDropdown value={csuCity} onChange={setCsuCity} showLabel={false}/>
=======
                      <label className={LC}>{t('auth.age', 'Age')}</label>
                      <div className="relative">
                        <Calendar className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input type="text" inputMode="numeric" maxLength={3} placeholder="e.g. 28" value={csuAge}
                          onChange={e => onlyDigits(e.target.value) && setCsuAge(e.target.value)} className={IC} />
                      </div>
                    </div>
                    <div>
                      <LocationDropdown value={csuCity} onChange={setCsuCity} showLabel={false} />
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
                    </div>
                  </div>
                  {/* Phone */}
                  <div>
<<<<<<< HEAD
                    <label className={LC}>Phone Number</label>
                    <div className="relative">
                      <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
                      <input type="tel" maxLength={10} placeholder="10-digit mobile number" value={csuPhone}
                        onChange={e=>onlyDigits(e.target.value)&&setCsuPhone(e.target.value)} className={IC}/>
                    </div>
                    {csuPhone.length>0&&csuPhone.length<10&&<p className="text-xs text-amber-600 mt-1 ml-1">{10-csuPhone.length} more digit{10-csuPhone.length!==1?'s':''} needed</p>}
=======
                    <label className={LC}>{t('auth.phone', 'Phone Number')}</label>
                    <div className="relative">
                      <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input type="tel" maxLength={10} placeholder={t('auth.phonePlaceholder', '10-digit mobile number')} value={csuPhone}
                        onChange={e => onlyDigits(e.target.value) && setCsuPhone(e.target.value)} className={IC} />
                    </div>
                    {csuPhone.length > 0 && csuPhone.length < 10 && <p className="text-xs text-amber-600 mt-1 ml-1">{10 - csuPhone.length} {t('auth.digitsNeeded', 'more digits needed')}</p>}
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
                  </div>

                  {/* Exact Address Details (customer only) */}
                  {csuState && (
                    <AddressDetails
                      locationType={isUrbanCity(csuCityName) ? 'city' : 'interior'}
                      houseValue={csuHouse} onHouse={setCsuHouse}
<<<<<<< HEAD
                      flatValue={csuFlat}   onFlat={setCsuFlat}
                      streetValue={csuStreet} onStreet={setCsuStreet}
                      villageValue={csuVillage} onVillage={setCsuVillage}
                      townValue={csuTown}   onTown={setCsuTown}
                    />
                  )}
                  {/* Create Password */}
                  <PasswordField label="Create Numeric Password" value={csuPw} onChange={setCsuPw}
                    placeholder="Numbers only (min. 4 digits)" show={showCsuPw} onToggle={()=>setShowCsuPw(v=>!v)} numeric showStrength/>
                  {/* Confirm Password */}
                  <PasswordField label="Confirm Password" value={csuCpw} onChange={setCsuCpw}
                    placeholder="Re-enter your password" show={showCsuCpw} onToggle={()=>setShowCsuCpw(v=>!v)} numeric confirmValue={csuPw}/>

                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
                    <UserPlus className="w-4 h-4"/> Create Account & Continue
                  </button>
                  <p className="text-center text-xs text-slate-500">
                    Already have an account?{' '}<button type="button" onClick={()=>setAuthMode('signin')} className="text-emerald-700 font-bold hover:underline">Sign In</button>
=======
                      flatValue={csuFlat} onFlat={setCsuFlat}
                      streetValue={csuStreet} onStreet={setCsuStreet}
                      villageValue={csuVillage} onVillage={setCsuVillage}
                      townValue={csuTown} onTown={setCsuTown}
                    />
                  )}
                  {/* Create Password */}
                  <PasswordField label={t('auth.createNumericPassword', 'Create Numeric Password')} value={csuPw} onChange={setCsuPw}
                    placeholder={t('auth.numbersOnlyMin4', 'Numbers only (min. 4 digits)')} show={showCsuPw} onToggle={() => setShowCsuPw(v => !v)} numeric showStrength />
                  {/* Confirm Password */}
                  <PasswordField label={t('auth.confirmPassword', 'Confirm Password')} value={csuCpw} onChange={setCsuCpw}
                    placeholder={t('auth.reenterPassword', 'Re-enter your password')} show={showCsuCpw} onToggle={() => setShowCsuCpw(v => !v)} numeric confirmValue={csuPw} />

                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
                    <UserPlus className="w-4 h-4" /> {t('auth.createAccountAndContinue', 'Create Account & Continue')}
                  </button>
                  <p className="text-center text-xs text-slate-500">
                    {t('auth.alreadyHaveAccount', 'Already have an account?')}{' '}<button type="button" onClick={() => setAuthMode('signin')} className="text-emerald-700 font-bold hover:underline">{t('auth.signIn', 'Sign In')}</button>
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
                  </p>
                </form>
              )}
            </div>
          )}

          {/* ══════════ SHRAMIK ══════════ */}
<<<<<<< HEAD
          {activeRoleTab==='shramik' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-2xl font-bold font-heading text-slate-900">{authMode==='signin'?'Shramik Login 🛠️':'Shramik Registration 🛠️'}</h3>
                <p className="text-sm text-slate-500 mt-1">{authMode==='signin'?'Sign in to manage your jobs.':'Register to start accepting jobs near you.'}</p>
=======
          {activeRoleTab === 'shramik' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-2xl font-bold font-heading text-slate-900">
                  {authMode === 'signin' ? t('auth.shramikSignIn', 'Shramik Sign In 🔨') : t('auth.partnerRegistration', 'Partner Registration 📝')}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {authMode === 'signin' ? t('auth.shramikSignInDesc', 'Sign in to manage your jobs.') : t('auth.partnerRegistrationDesc', 'Register to start accepting jobs near you.')}
                </p>
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
              </div>

              {/* Toggle */}
              <div className="bg-slate-100 p-1 rounded-xl flex text-sm font-semibold">
<<<<<<< HEAD
                {[{mode:'signin',icon:LogIn,label:'Sign In'},{mode:'signup',icon:UserPlus,label:'Register'}].map(({mode,icon:Icon,label})=>(
                  <button key={mode} onClick={()=>setAuthMode(mode)}
                    className={`flex-1 py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${authMode===mode?'bg-white text-emerald-700 shadow-sm border border-slate-200':'text-slate-500 hover:text-slate-700'}`}>
                    <Icon className="w-4 h-4"/>{label}
=======
                {[
                  { mode: 'signin', icon: LogIn, label: t('auth.signIn', 'Sign In') },
                  { mode: 'signup', icon: UserPlus, label: t('auth.register', 'Register') }
                ].map(({ mode, icon: Icon, label }) => (
                  <button key={mode} onClick={() => setAuthMode(mode)}
                    className={`flex-1 py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${authMode === mode ? 'bg-white text-emerald-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                    <Icon className="w-4 h-4" />{label}
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
                  </button>
                ))}
              </div>

              {/* Shramik Sign In */}
<<<<<<< HEAD
              {authMode==='signin' && (
                <form onSubmit={handleSSignIn} className="space-y-4">
                  <div>
                    <label className={LC}>Registered Phone Number</label>
                    <div className="relative">
                      <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
                      <input type="tel" maxLength={10} placeholder="10-digit mobile number" value={ssiPhone}
                        onChange={e=>onlyDigits(e.target.value)&&setSsiPhone(e.target.value)} className={IC}/>
                    </div>
                  </div>
                  <PasswordField label="Numeric Password" value={ssiPw} onChange={setSsiPw}
                    placeholder="Enter your numeric password" show={showSsiPw} onToggle={()=>setShowSsiPw(v=>!v)} numeric/>
                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
                    Sign In as Shramik <ArrowRight className="w-4 h-4"/>
                  </button>
                  <p className="text-center text-xs text-slate-500">
                    New Shramik?{' '}<button type="button" onClick={()=>setAuthMode('signup')} className="text-emerald-700 font-bold hover:underline">Register Here</button>
=======
              {authMode === 'signin' && (
                <form onSubmit={handleSSignIn} className="space-y-4">
                  <div>
                    <label className={LC}>{t('auth.registeredPhone', 'Registered Phone Number')}</label>
                    <div className="relative">
                      <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input type="tel" maxLength={10} placeholder={t('auth.phonePlaceholder', '10-digit mobile number')} value={ssiPhone}
                        onChange={e => onlyDigits(e.target.value) && setSsiPhone(e.target.value)} className={IC} />
                    </div>
                  </div>
                  <PasswordField label={t('auth.numericPassword', 'Numeric Password')} value={ssiPw} onChange={setSsiPw}
                    placeholder={t('auth.enterNumericPassword', 'Enter your numeric password')} show={showSsiPw} onToggle={() => setShowSsiPw(v => !v)} numeric />
                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
                    {t('auth.signInAsShramik', 'Sign In as Shramik')} <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-center text-xs text-slate-500">
                    {t('auth.newShramik', 'New Shramik?')}{' '}<button type="button" onClick={() => setAuthMode('signup')} className="text-emerald-700 font-bold hover:underline">{t('auth.registerHere', 'Register Here')}</button>
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
                  </p>
                </form>
              )}

              {/* Shramik Sign Up */}
<<<<<<< HEAD
              {authMode==='signup' && (
                <form onSubmit={handleSSignUp} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className={LC}>Full Name</label>
                    <div className="relative">
                      <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
                      <input type="text" placeholder="e.g. Ramesh Kumar" value={ssuName} onChange={e=>setSsuName(e.target.value)} className={IC+' font-sans'}/>
=======
              {authMode === 'signup' && (
                <form onSubmit={handleSSignUp} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className={LC}>{t('auth.fullName', 'Full Name')}</label>
                    <div className="relative">
                      <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input type="text" placeholder="e.g. Ramesh Kumar" value={ssuName} onChange={e => setSsuName(e.target.value)} className={IC + ' font-sans'} />
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
                    </div>
                  </div>
                  {/* Age + City */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
<<<<<<< HEAD
                      <label className={LC}>Age</label>
                      <div className="relative">
                        <Calendar className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
                        <input type="text" inputMode="numeric" maxLength={2} placeholder="e.g. 30" value={ssuAge}
                          onChange={e=>onlyDigits(e.target.value)&&setSsuAge(e.target.value)} className={IC}/>
                      </div>
                    </div>
                    <div>
                      <LocationDropdown value={ssuCity} onChange={setSsuCity} showLabel={false}/>
=======
                      <label className={LC}>{t('auth.age', 'Age')}</label>
                      <div className="relative">
                        <Calendar className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input type="text" inputMode="numeric" maxLength={2} placeholder="e.g. 30" value={ssuAge}
                          onChange={e => onlyDigits(e.target.value) && setSsuAge(e.target.value)} className={IC} />
                      </div>
                    </div>
                    <div>
                      <LocationDropdown value={ssuCity} onChange={setSsuCity} showLabel={false} />
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
                    </div>
                  </div>
                  {/* Phone */}
                  <div>
<<<<<<< HEAD
                    <label className={LC}>Phone Number</label>
                    <div className="relative">
                      <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
                      <input type="tel" maxLength={10} placeholder="10-digit mobile number" value={ssuPhone}
                        onChange={e=>onlyDigits(e.target.value)&&setSsuPhone(e.target.value)} className={IC}/>
                    </div>
                    {ssuPhone.length>0&&ssuPhone.length<10&&<p className="text-xs text-amber-600 mt-1 ml-1">{10-ssuPhone.length} more digit{10-ssuPhone.length!==1?'s':''} needed</p>}
                  </div>
                  {/* Primary Skill */}
                  <div>
                    <label className={LC}>Primary Skill</label>
                    <div className="relative">
                      <Briefcase className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none"/>
                      <select value={ssuSkill} onChange={e=>setSsuSkill(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all appearance-none font-sans text-slate-700">
                        <option value="">Select your skill…</option>
                        {SKILLS.map(s=><option key={s} value={s}>{s}</option>)}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"/>
                    </div>
                  </div>
                  {/* Passwords */}
                  <PasswordField label="Create Numeric Password" value={ssuPw} onChange={setSsuPw}
                    placeholder="Numbers only (min. 4 digits)" show={showSsuPw} onToggle={()=>setShowSsuPw(v=>!v)} numeric showStrength/>
                  <PasswordField label="Confirm Password" value={ssuCpw} onChange={setSsuCpw}
                    placeholder="Re-enter your password" show={showSsuCpw} onToggle={()=>setShowSsuCpw(v=>!v)} numeric confirmValue={ssuPw}/>

                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
                    <UserPlus className="w-4 h-4"/> Register as Shramik
                  </button>
                  <p className="text-center text-xs text-slate-500">
                    Already registered?{' '}<button type="button" onClick={()=>setAuthMode('signin')} className="text-emerald-700 font-bold hover:underline">Sign In</button>
=======
                    <label className={LC}>{t('auth.phone', 'Phone Number')}</label>
                    <div className="relative">
                      <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input type="tel" maxLength={10} placeholder={t('auth.phonePlaceholder', '10-digit mobile number')} value={ssuPhone}
                        onChange={e => onlyDigits(e.target.value) && setSsuPhone(e.target.value)} className={IC} />
                    </div>
                    {ssuPhone.length > 0 && ssuPhone.length < 10 && <p className="text-xs text-amber-600 mt-1 ml-1">{10 - ssuPhone.length} {t('auth.digitsNeeded', 'more digits needed')}</p>}
                  </div>
                  {/* Primary Skill */}
                  <div>
                    <label className={LC}>{t('shramik.primarySkill', 'Primary Skill')}</label>
                    <div className="relative">
                      <Briefcase className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
                      <select value={ssuSkill} onChange={e => setSsuSkill(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all appearance-none font-sans text-slate-700">
                        <option value="">{t('shramik.selectSkill', 'Select your skill…')}</option>
                        {SKILLS.map(s => <option key={s} value={s}>{tSkill(s)}</option>)}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  {/* Passwords */}
                  <PasswordField label={t('auth.createNumericPassword', 'Create Numeric Password')} value={ssuPw} onChange={setSsuPw}
                    placeholder={t('auth.numbersOnlyMin4', 'Numbers only (min. 4 digits)')} show={showSsuPw} onToggle={() => setShowSsuPw(v => !v)} numeric showStrength />
                  <PasswordField label={t('auth.confirmPassword', 'Confirm Password')} value={ssuCpw} onChange={setSsuCpw}
                    placeholder={t('auth.reenterPassword', 'Re-enter your password')} show={showSsuCpw} onToggle={() => setShowSsuCpw(v => !v)} numeric confirmValue={ssuPw} />

                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
                    <UserPlus className="w-4 h-4" /> {t('auth.registerAsShramik', 'Register as Shramik')}
                  </button>
                  <p className="text-center text-xs text-slate-500">
                    {t('auth.alreadyRegistered', 'Already registered?')}{' '}<button type="button" onClick={() => setAuthMode('signin')} className="text-emerald-700 font-bold hover:underline">{t('auth.signIn', 'Sign In')}</button>
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
                  </p>
                </form>
              )}
            </div>
          )}

          {/* ══════════ ADMIN ══════════ */}
<<<<<<< HEAD
          {activeRoleTab==='admin' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-2xl font-bold font-heading text-slate-900">{authMode==='signin'?'Admin Login 🛡️':'Admin Registration 🛡️'}</h3>
                <p className="text-sm text-slate-500 mt-1">{authMode==='signin'?'Sign in to manage the platform.':'Register your official admin account.'}</p>
=======
          {activeRoleTab === 'admin' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-2xl font-bold font-heading text-slate-900">
                  {authMode === 'signin' ? t('auth.adminLogin', 'Admin Login 🛡️') : t('auth.adminRegistration', 'Admin Registration 🛡️')}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {authMode === 'signin' ? t('auth.adminLoginDesc', 'Sign in to manage the platform.') : t('auth.adminRegDesc', 'Register your official admin account.')}
                </p>
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
              </div>

              {/* Toggle */}
              <div className="bg-slate-100 p-1 rounded-xl flex text-sm font-semibold">
<<<<<<< HEAD
                {[{mode:'signin',icon:LogIn,label:'Sign In'},{mode:'signup',icon:UserPlus,label:'Register'}].map(({mode,icon:Icon,label})=>(
                  <button key={mode} onClick={()=>setAuthMode(mode)}
                    className={`flex-1 py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${authMode===mode?'bg-white text-slate-800 shadow-sm border border-slate-200':'text-slate-500 hover:text-slate-700'}`}>
                    <Icon className="w-4 h-4"/>{label}
=======
                {[
                  { mode: 'signin', icon: LogIn, label: t('auth.signIn', 'Sign In') },
                  { mode: 'signup', icon: UserPlus, label: t('auth.register', 'Register') }
                ].map(({ mode, icon: Icon, label }) => (
                  <button key={mode} onClick={() => setAuthMode(mode)}
                    className={`flex-1 py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${authMode === mode ? 'bg-white text-slate-800 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                    <Icon className="w-4 h-4" />{label}
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
                  </button>
                ))}
              </div>

              {/* Admin Sign In */}
<<<<<<< HEAD
              {authMode==='signin' && (
                <form onSubmit={handleASignIn} className="space-y-4">
                  <div>
                    <label className={LC}>Admin Phone / ID</label>
                    <div className="relative">
                      <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
                      <input type="tel" placeholder="Registered phone number" value={asiPhone}
                        onChange={e=>setAsiPhone(e.target.value)} className={IC}/>
                    </div>
                  </div>
                  <PasswordField label="Numeric Password" value={asiPw} onChange={setAsiPw}
                    placeholder="Enter your numeric password" show={showAsiPw} onToggle={()=>setShowAsiPw(v=>!v)} numeric/>
                  <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4"/> Sign In as Administrator
                  </button>
                  <p className="text-center text-xs text-slate-500">
                    New admin?{' '}<button type="button" onClick={()=>setAuthMode('signup')} className="text-slate-700 font-bold hover:underline">Register Here</button>
=======
              {authMode === 'signin' && (
                <form onSubmit={handleASignIn} className="space-y-4">
                  <div>
                    <label className={LC}>{t('auth.adminPhoneId', 'Admin Phone / ID')}</label>
                    <div className="relative">
                      <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input type="tel" placeholder={t('auth.registeredPhone', 'Registered phone number')} value={asiPhone}
                        onChange={e => setAsiPhone(e.target.value)} className={IC} />
                    </div>
                  </div>
                  <PasswordField label={t('auth.numericPassword', 'Numeric Password')} value={asiPw} onChange={setAsiPw}
                    placeholder={t('auth.enterNumericPassword', 'Enter your numeric password')} show={showAsiPw} onToggle={() => setShowAsiPw(v => !v)} numeric />
                  <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4" /> {t('auth.signInAsAdmin', 'Sign In as Administrator')}
                  </button>
                  <p className="text-center text-xs text-slate-500">
                    {t('auth.newAdmin', 'New admin?')}{' '}<button type="button" onClick={() => setAuthMode('signup')} className="text-slate-700 font-bold hover:underline">{t('auth.registerHere', 'Register Here')}</button>
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
                  </p>
                </form>
              )}

              {/* Admin Sign Up */}
<<<<<<< HEAD
              {authMode==='signup' && (
                <form onSubmit={handleASignUp} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className={LC}>Full Name</label>
                    <div className="relative">
                      <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
                      <input type="text" placeholder="e.g. Priya Mehta" value={asuName} onChange={e=>setAsuName(e.target.value)} className={IC+' font-sans'}/>
=======
              {authMode === 'signup' && (
                <form onSubmit={handleASignUp} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className={LC}>{t('auth.fullName', 'Full Name')}</label>
                    <div className="relative">
                      <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input type="text" placeholder="e.g. Priya Mehta" value={asuName} onChange={e => setAsuName(e.target.value)} className={IC + ' font-sans'} />
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
                    </div>
                  </div>
                  {/* City */}
                  <div>
<<<<<<< HEAD
                    <LocationDropdown value={asuCity} onChange={setAsuCity} showLabel={false}/>
                  </div>
                  {/* Phone */}
                  <div>
                    <label className={LC}>Phone Number</label>
                    <div className="relative">
                      <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
                      <input type="tel" maxLength={10} placeholder="10-digit mobile number" value={asuPhone}
                        onChange={e=>onlyDigits(e.target.value)&&setAsuPhone(e.target.value)} className={IC}/>
                    </div>
                    {asuPhone.length>0&&asuPhone.length<10&&<p className="text-xs text-amber-600 mt-1 ml-1">{10-asuPhone.length} more digit{10-asuPhone.length!==1?'s':''} needed</p>}
                  </div>
                  {/* Employee ID */}
                  <div>
                    <label className={LC}>Employee / Admin ID</label>
                    <div className="relative">
                      <Shield className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
                      <input type="text" placeholder="e.g. GOV-ADM-2024" value={asuEmpId} onChange={e=>setAsuEmpId(e.target.value)} className={IC+' font-sans'}/>
                    </div>
                  </div>
                  {/* Passwords */}
                  <PasswordField label="Create Numeric Password" value={asuPw} onChange={setAsuPw}
                    placeholder="Numbers only (min. 4 digits)" show={showAsuPw} onToggle={()=>setShowAsuPw(v=>!v)} numeric showStrength/>
                  <PasswordField label="Confirm Password" value={asuCpw} onChange={setAsuCpw}
                    placeholder="Re-enter your password" show={showAsuCpw} onToggle={()=>setShowAsuCpw(v=>!v)} numeric confirmValue={asuPw}/>

                  <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
                    <UserPlus className="w-4 h-4"/> Register Admin Account
                  </button>
                  <p className="text-center text-xs text-slate-500">
                    Already registered?{' '}<button type="button" onClick={()=>setAuthMode('signin')} className="text-slate-700 font-bold hover:underline">Sign In</button>
=======
                    <LocationDropdown value={asuCity} onChange={setAsuCity} showLabel={false} />
                  </div>
                  {/* Phone */}
                  <div>
                    <label className={LC}>{t('auth.phone', 'Phone Number')}</label>
                    <div className="relative">
                      <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input type="tel" maxLength={10} placeholder={t('auth.phonePlaceholder', '10-digit mobile number')} value={asuPhone}
                        onChange={e => onlyDigits(e.target.value) && setAsuPhone(e.target.value)} className={IC} />
                    </div>
                    {asuPhone.length > 0 && asuPhone.length < 10 && <p className="text-xs text-amber-600 mt-1 ml-1">{10 - asuPhone.length} {t('auth.digitsNeeded', 'more digits needed')}</p>}
                  </div>
                  {/* Employee ID */}
                  <div>
                    <label className={LC}>{t('auth.empId', 'Employee / Admin ID')}</label>
                    <div className="relative">
                      <Shield className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input type="text" placeholder="e.g. GOV-ADM-2024" value={asuEmpId} onChange={e => setAsuEmpId(e.target.value)} className={IC + ' font-sans'} />
                    </div>
                  </div>
                  {/* Passwords */}
                  <PasswordField label={t('auth.createNumericPassword', 'Create Numeric Password')} value={asuPw} onChange={setAsuPw}
                    placeholder={t('auth.numbersOnlyMin4', 'Numbers only (min. 4 digits)')} show={showAsuPw} onToggle={() => setShowAsuPw(v => !v)} numeric showStrength />
                  <PasswordField label={t('auth.confirmPassword', 'Confirm Password')} value={asuCpw} onChange={setAsuCpw}
                    placeholder={t('auth.reenterPassword', 'Re-enter your password')} show={showAsuCpw} onToggle={() => setShowAsuCpw(v => !v)} numeric confirmValue={asuPw} />

                  <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
                    <UserPlus className="w-4 h-4" /> {t('auth.registerAdminAccount', 'Register Admin Account')}
                  </button>
                  <p className="text-center text-xs text-slate-500">
                    {t('auth.alreadyRegistered', 'Already registered?')}{' '}<button type="button" onClick={() => setAuthMode('signin')} className="text-slate-700 font-bold hover:underline">{t('auth.signIn', 'Sign In')}</button>
>>>>>>> 89bdcd22088655f7e32b72f515388fa9027033d4
                  </p>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
