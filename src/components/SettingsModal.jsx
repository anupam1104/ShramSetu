import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Globe, 
  Sun, 
  Moon, 
  Search, 
  Check, 
  Sliders, 
  Sparkles,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import { INDIAN_STATES_LIST, getLanguagesForState } from '../data/languageHierarchy';

export const SettingsModal = () => {
  const { 
    isSettingsOpen, 
    closeSettings, 
    language, 
    setLanguage, 
    selectedLocation,
    setSelectedLocation,
    theme, 
    setTheme, 
    t, 
    LANGUAGES,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  if (!isSettingsOpen) return null;

  const filteredLanguages = LANGUAGES.filter(lang => 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.native.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectLanguage = (code) => {
    setLanguage(code);
    const selected = LANGUAGES.find(l => l.code === code);
    if (showToast && selected) {
      showToast(`Language changed to ${selected.name} (${selected.native})`);
    }
  };

  const handleSelectTheme = (newTheme) => {
    setTheme(newTheme);
    if (showToast) {
      showToast(`Appearance changed to ${newTheme === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      {/* Modal Container */}
      <div 
        className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white leading-tight">
                {t('settingsTitle', 'App Preferences')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('settingsSubtitle', 'Customize your language and theme appearance')}
              </p>
            </div>
          </div>
          <button 
            onClick={closeSettings}
            className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content (Scrollable) */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          
          {/* SECTION 1: THEME SELECTION */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold font-heading text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  {t('themeSection', 'Appearance & Theme')}
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                {theme === 'dark' ? 'Dark Mode Active' : 'Light Mode Active'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {/* Light Mode Card */}
              <button
                onClick={() => handleSelectTheme('light')}
                className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col justify-between relative overflow-hidden group ${
                  theme === 'light'
                    ? 'border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20 text-slate-900 shadow-md ring-2 ring-emerald-600/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    theme === 'light' ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    <Sun className="w-5 h-5" />
                  </div>
                  {theme === 'light' && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {t('lightTheme', 'Light Mode')}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {t('lightThemeDesc', 'Clean bright interface')}
                  </p>
                </div>
              </button>

              {/* Dark Mode Card */}
              <button
                onClick={() => handleSelectTheme('dark')}
                className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col justify-between relative overflow-hidden group ${
                  theme === 'dark'
                    ? 'border-emerald-500 bg-slate-900 text-white shadow-md ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    theme === 'dark' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    <Moon className="w-5 h-5" />
                  </div>
                  {theme === 'dark' && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {t('darkTheme', 'Dark Mode')}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {t('darkThemeDesc', 'High-contrast dark layout')}
                  </p>
                </div>
              </button>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* SECTION 2: LOCATION & LANGUAGE SELECTION */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold font-heading text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  {t('languageSection', 'Select Language')}
                </h3>
              </div>
              <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-xl text-xs">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <select 
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                >
                  {INDIAN_STATES_LIST.map(st => (
                    <option key={st} value={st} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('searchLanguage', 'Search language...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            {/* Language Hierarchy Grid */}
            {(() => {
              const { priorityLangs, remainingLangs } = getLanguagesForState(selectedLocation, LANGUAGES);
              const filterL = list => list.filter(l => 
                l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                l.native.toLowerCase().includes(searchQuery.toLowerCase())
              );
              const topList = filterL(priorityLangs);
              const otherList = filterL(remainingLangs);

              return (
                <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                  {topList.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Regional Priority for {selectedLocation}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {topList.map(lang => (
                          <button
                            key={lang.code}
                            onClick={() => handleSelectLanguage(lang.code)}
                            className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                              language === lang.code
                                ? 'border-emerald-600 bg-emerald-600 text-white font-bold shadow-xs'
                                : 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/30 text-slate-900 dark:text-slate-100 hover:bg-emerald-100/60'
                            }`}
                          >
                            <div className="flex items-center space-x-2 truncate">
                              <span className="text-base">{lang.flag}</span>
                              <div className="truncate">
                                <p className="text-xs font-bold truncate">{lang.native}</p>
                                <p className={`text-[10px] truncate ${language === lang.code ? 'text-emerald-100' : 'text-slate-500'}`}>{lang.name}</p>
                              </div>
                            </div>
                            {language === lang.code && <Check className="w-4 h-4 text-white shrink-0 ml-1" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {otherList.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Other Indian Languages
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {otherList.map(lang => (
                          <button
                            key={lang.code}
                            onClick={() => handleSelectLanguage(lang.code)}
                            className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                              language === lang.code
                                ? 'border-emerald-600 bg-emerald-600 text-white font-bold shadow-xs'
                                : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center space-x-2 truncate">
                              <span className="text-base">{lang.flag}</span>
                              <div className="truncate">
                                <p className="text-xs font-bold truncate">{lang.native}</p>
                                <p className={`text-[10px] truncate ${language === lang.code ? 'text-emerald-100' : 'text-slate-500'}`}>{lang.name}</p>
                              </div>
                            </div>
                            {language === lang.code && <Check className="w-4 h-4 text-white shrink-0 ml-1" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {t('saved', 'Preferences updated automatically')}
          </p>
          <button
            onClick={closeSettings}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-sm transition-all"
          >
            {t('close', 'Done')}
          </button>
        </div>
      </div>
    </div>
  );
};
