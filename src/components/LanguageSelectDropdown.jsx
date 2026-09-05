import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Globe, MapPin, ChevronDown, Check, Search, Sparkles } from 'lucide-react';
import { INDIAN_STATES_LIST, getLanguagesForState } from '../data/languageHierarchy';

export const LanguageSelectDropdown = ({ compact = false, showLocationPicker = true }) => {
  const { 
    language, 
    setLanguage, 
    selectedLocation, 
    setSelectedLocation, 
    LANGUAGES, 
    t, 
    showToast 
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [showLocMenu, setShowLocMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  const activeLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];
  const { priorityLangs, remainingLangs } = getLanguagesForState(selectedLocation, LANGUAGES);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setShowLocMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (code, name, native) => {
    setLanguage(code);
    setIsOpen(false);
    if (showToast) {
      showToast(`Language set to ${native} (${name})`);
    }
  };

  const handleSelectLocation = (stateName) => {
    setSelectedLocation(stateName);
    setShowLocMenu(false);
    // Automatically pick top regional language for that state if current language is not in top priority
    const { priorityLangs: topLangs } = getLanguagesForState(stateName, LANGUAGES);
    if (topLangs.length > 0 && !topLangs.some(l => l.code === language)) {
      setLanguage(topLangs[0].code);
    }
    if (showToast) {
      showToast(`Location set to ${stateName}`);
    }
  };

  // Filter languages
  const filterLangList = (list) => {
    if (!searchQuery) return list;
    return list.filter(l => 
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.native.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.region && l.region.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const filteredPriority = filterLangList(priorityLangs);
  const filteredRemaining = filterLangList(remainingLangs);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div className="flex items-center space-x-1.5">
        {/* Location Picker Pill (if enabled) */}
        {showLocationPicker && (
          <div className="relative">
            <button
              type="button"
              onClick={() => { setShowLocMenu(v => !v); setIsOpen(false); }}
              className="flex items-center space-x-1 px-2.5 py-1.5 bg-emerald-50/80  border border-emerald-200/90  text-emerald-800  rounded-xl text-xs font-semibold hover:bg-emerald-100/70 transition-colors shadow-2xs"
              title="Select Location for Language Hierarchy"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600 " />
              <span className="max-w-[90px] truncate">{selectedLocation}</span>
              <ChevronDown className="w-3 h-3 text-emerald-600 " />
            </button>

            {/* Location Selector Dropdown */}
            {showLocMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white  border border-slate-200  rounded-2xl shadow-xl z-50 p-2 max-h-64 overflow-y-auto custom-scrollbar animate-fade-in">
                <div className="px-2 py-1.5 text-[11px] font-bold font-heading text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-100  mb-1">
                  <span>Select State / Region</span>
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                {INDIAN_STATES_LIST.map((st) => (
                  <button
                    key={st}
                    onClick={() => handleSelectLocation(st)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                      selectedLocation === st
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'text-slate-700  hover:bg-slate-100 '
                    }`}
                  >
                    <span>{st}</span>
                    {selectedLocation === st && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Main Language Trigger Button */}
        <button
          type="button"
          onClick={() => { setIsOpen(v => !v); setShowLocMenu(false); }}
          className={`flex items-center space-x-1.5 px-3 py-1.5 bg-white/90  border border-slate-200  rounded-xl text-xs font-semibold text-slate-800  hover:bg-slate-50  transition-all shadow-2xs ${
            compact ? 'px-2 py-1' : ''
          }`}
          aria-label="Choose Language"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-600  shrink-0" />
          <span className="font-bold">{activeLang.native}</span>
          <span className="text-[10px] text-slate-500  hidden sm:inline">({activeLang.name})</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* Language Selection Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white  border border-slate-200  rounded-2xl shadow-2xl z-50 p-3 max-h-[80vh] overflow-y-auto custom-scrollbar animate-fade-in">
          
          {/* Header & Search */}
          <div className="mb-2.5 pb-2 border-b border-slate-100  space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-heading text-slate-900  flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-600" />
                {t('chooseLanguage', 'Choose Language')}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100  text-slate-600 ">
                Location: {selectedLocation}
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('searchLanguage', 'Search language...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50  border border-slate-200  rounded-xl text-xs text-slate-900  placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>

          {/* SECTION 1: Regional Priority Languages for Selected Location */}
          {filteredPriority.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center space-x-1 px-1 mb-1.5 text-[10px] font-bold text-emerald-700  uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>{t('regionalPriority', 'Regional Languages for')} {selectedLocation}</span>
              </div>
              <div className="space-y-1">
                {filteredPriority.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleSelectLanguage(lang.code, lang.name, lang.native)}
                      className={`w-full text-left p-2 rounded-xl transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                          : 'bg-emerald-50/50  text-slate-900  hover:bg-emerald-100/60  border border-emerald-100 '
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <span className="text-sm leading-none">{lang.flag}</span>
                        <div className="truncate">
                          <p className={`text-xs ${isSelected ? 'text-white' : 'text-slate-900 '} font-semibold truncate`}>
                            {lang.native}
                          </p>
                          <p className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-slate-500 '} truncate`}>
                            {lang.name} • {lang.region}
                          </p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-white shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 2: All Other Indian Languages */}
          {filteredRemaining.length > 0 && (
            <div>
              <div className="px-1 mb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {t('otherLanguages', 'Other Indian Languages')}
              </div>
              <div className="space-y-1">
                {filteredRemaining.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleSelectLanguage(lang.code, lang.name, lang.native)}
                      className={`w-full text-left p-2 rounded-xl transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                          : 'text-slate-700  hover:bg-slate-100 '
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <span className="text-sm leading-none">{lang.flag}</span>
                        <div className="truncate">
                          <p className={`text-xs ${isSelected ? 'text-white' : 'text-slate-900 '} font-semibold truncate`}>
                            {lang.native}
                          </p>
                          <p className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-slate-500 '} truncate`}>
                            {lang.name}
                          </p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-white shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {filteredPriority.length === 0 && filteredRemaining.length === 0 && (
            <div className="p-4 text-center text-xs text-slate-500">
              No matching language found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
