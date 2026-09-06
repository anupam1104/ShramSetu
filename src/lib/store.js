// Tiny localStorage-backed persistence for the Shram Setu demo app.
// Keeps the auth session + live demo data across page refreshes,
// and provides a durable store for demo accounts (customer/shramik/admin).
//
// NOTE: passwords are stored in plain text in localStorage ONLY for this
// demo/tooling flow. A production build must move authentication to
// Supabase Auth (or equivalent) with server-side password hashing.

const SESSION_KEY = 'shram_auth_v1';
const ACCOUNTS_KEY = 'shram_accounts_v1';
const DATA_KEY = 'shram_data_v1';

export const STORAGE_KEYS = {
  session: SESSION_KEY,
  accounts: ACCOUNTS_KEY,
  data: DATA_KEY,
};

const hasWindow = typeof window !== 'undefined';

const parseJSON = (value, fallback) => {
  if (value == null || value === '') return fallback;
  try { return JSON.parse(value); } catch { return fallback; }
};

export const loadJSON = (key, fallback) => {
  if (!hasWindow) return fallback;
  return parseJSON(window.localStorage.getItem(key), fallback);
};

export const saveJSON = (key, value) => {
  if (!hasWindow) return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const removeKey = (key) => {
  if (!hasWindow) return;
  window.localStorage.removeItem(key);
};

// Normalize city labels for matching. City inputs are stored as
// "City | State" (see LoginPage CitySelect), so compare only the locality part.
export const normalizeCity = (city) =>
  String(city || '').split('|')[0].trim().toLowerCase();

export const sameCity = (a, b) => normalizeCity(a) === normalizeCity(b);

/* ------------------------- Account store ------------------------- */

const identify = (account, identifier) =>
  account.phone === identifier || (account.empId && account.empId === identifier);

export const loadAccounts = () => loadJSON(ACCOUNTS_KEY, []);

export const saveAccounts = (accounts) => saveJSON(ACCOUNTS_KEY, accounts);

export const findAccount = (role, identifier) =>
  loadAccounts().find((a) => a.role === role && identify(a, identifier)) || null;

export const upsertAccount = (account) => {
  const accounts = loadAccounts();
  const index = accounts.findIndex((a) => a.role === account.role && identify(a, account.phone || account.empId));
  let saved;
  if (index >= 0) {
    saved = { ...accounts[index], ...account };
    accounts[index] = saved;
  } else {
    saved = { ...account };
    accounts.push(saved);
  }
  saveAccounts(accounts);
  return saved;
};

export const updateAccount = (role, identifier, patch) => {
  const accounts = loadAccounts();
  let changed = false;
  let updated = null;
  const next = accounts.map((a) => {
    if (a.role === role && identify(a, identifier)) {
      changed = true;
      updated = { ...a, ...patch };
      return updated;
    }
    return a;
  });
  if (changed) saveAccounts(next);
  return updated;
};

export const removeAccount = (role, identifier) => {
  const accounts = loadAccounts();
  const next = accounts.filter((a) => !(a.role === role && identify(a, identifier)));
  if (next.length !== accounts.length) saveAccounts(next);
};

/* ------------------------- Session store ------------------------- */

export const loadSession = () => loadJSON(SESSION_KEY, null);
export const saveSession = (session) => saveJSON(SESSION_KEY, session);
export const clearSession = () => removeKey(SESSION_KEY);

/* --------------------- Applied demo data store -------------------- */

export const loadAppliedData = () => loadJSON(DATA_KEY, null);
export const saveAppliedData = (data) => saveJSON(DATA_KEY, data);

/* ------------------------- Demo admin seed ------------------------- */

// Pre-seeded demo administrator for the offline/tooling flow. Production
// admins are created server-side with bcrypt-hashed passwords in Supabase.
export const SEED_ADMIN = {
  role: 'admin',
  name: 'Head Admin',
  phone: '9100000000',
  empId: 'GOV-ADM-2024',
  password: '1234',
  city: 'Kolkata',
};

export const ensureSeedAccounts = () => {
  if (loadAccounts().some((a) => a.role === 'admin')) return;
  saveAccounts([SEED_ADMIN]);
};