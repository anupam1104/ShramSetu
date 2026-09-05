// Language order hierarchy per Indian State / Region
export const STATE_LANGUAGE_HIERARCHY = {
  'West Bengal': ['bn', 'hi', 'en', 'sat', 'ur', 'or', 'ne'],
  'Maharashtra': ['mr', 'hi', 'en', 'gu', 'kok', 'ur'],
  'Karnataka': ['kn', 'en', 'hi', 'te', 'ta', 'ml', 'mr'],
  'Tamil Nadu': ['ta', 'en', 'te', 'kn', 'ml', 'hi'],
  'Gujarat': ['gu', 'hi', 'en', 'mr', 'sd'],
  'Telangana': ['te', 'ur', 'hi', 'en', 'ta', 'kn'],
  'Andhra Pradesh': ['te', 'hi', 'en', 'ta', 'kn', 'ur'],
  'Kerala': ['ml', 'en', 'ta', 'hi', 'kn'],
  'Punjab': ['pa', 'hi', 'en', 'ur', 'doi'],
  'Uttar Pradesh': ['hi', 'ur', 'en', 'mai'],
  'Bihar': ['hi', 'mai', 'ur', 'sat', 'en'],
  'Delhi': ['hi', 'en', 'pa', 'ur'],
  'Odisha': ['or', 'hi', 'bn', 'en', 'sat'],
  'Assam': ['as', 'bn', 'brx', 'hi', 'en'],
  'Jammu and Kashmir': ['ks', 'doi', 'ur', 'hi', 'en'],
  'Goa': ['kok', 'mr', 'en', 'hi', 'kn'],
  'Jharkhand': ['hi', 'sat', 'bn', 'or', 'ur'],
  'Rajasthan': ['hi', 'en', 'sd', 'pa', 'gu'],
  'Madhya Pradesh': ['hi', 'en', 'mr', 'gu'],
  'Haryana': ['hi', 'pa', 'en'],
  'Himachal Pradesh': ['hi', 'doi', 'en', 'pa'],
  'Uttarakhand': ['hi', 'ne', 'en', 'ur'],
  'Tripura': ['bn', 'hi', 'en'],
  'Manipur': ['mni', 'hi', 'en'],
  'Meghalaya': ['en', 'bn', 'hi', 'as'],
  'Nagaland': ['en', 'hi', 'as'],
  'Sikkim': ['ne', 'en', 'hi', 'bn'],
  'Puducherry': ['ta', 'te', 'ml', 'en', 'fr']
};

export const INDIAN_STATES_LIST = Object.keys(STATE_LANGUAGE_HIERARCHY);

export const getLanguagesForState = (stateName, allLanguages) => {
  const preferredCodes = STATE_LANGUAGE_HIERARCHY[stateName] || ['hi', 'en'];
  
  // Split languages into regional priority & remaining
  const priorityLangs = [];
  const remainingLangs = [];

  // Map by code
  const langMap = {};
  allLanguages.forEach(l => { langMap[l.code] = l; });

  preferredCodes.forEach(code => {
    if (langMap[code]) {
      priorityLangs.push(langMap[code]);
    }
  });

  allLanguages.forEach(l => {
    if (!preferredCodes.includes(l.code)) {
      remainingLangs.push(l);
    }
  });

  return { priorityLangs, remainingLangs };
};
