const configuredApiUrl = (import.meta.env.VITE_API_URL || '').trim().replace(/\/$/, '');
// Accept either a server origin (https://api.example.com) or a complete API
// base (https://api.example.com/api). This avoids silently posting approvals
// to /admin/... when the deployment URL omitted the /api suffix.
const apiUrl = configuredApiUrl && /\/api$/i.test(configuredApiUrl)
  ? configuredApiUrl
  : configuredApiUrl
    ? `${configuredApiUrl}/api`
    : 'http://localhost:4000/api';
// Networking is enabled ONLY when VITE_API_URL is explicitly set in a .env
// file. Without it the app runs as a fully offline demo: no fetch is ever
// triggered and the "Server unreachable" notice never appears.
const isApiConfigured = Boolean(configuredApiUrl);
const TOKEN_KEY = 'shram_admin_token_v1';

const hasWindow = typeof window !== 'undefined';

export const setAdminToken = (token) => {
  if (!hasWindow) return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
};

export const getAdminToken = () => {
  if (!hasWindow) return '';
  return window.localStorage.getItem(TOKEN_KEY) || '';
};

export const clearAdminToken = () => setAdminToken('');

const parseError = async (response) => {
  const body = await response.text();
  try {
    const parsed = JSON.parse(body);
    if (parsed?.error) return parsed.error;
  } catch {
    // Use the raw body only when it is already a short string.
  }
  return body || `Request failed with status ${response.status}.`;
};

const request = async (path, options = {}) => {
  if (!isApiConfigured) {
    throw new Error('API is not configured. Set VITE_API_URL in a .env file to enable server sync.');
  }
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const token = getAdminToken();
  if (token && !headers.Authorization) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${apiUrl}/${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  if (response.status === 204) return null;
  return response.json();
};

const asRecord = (payload) => (Array.isArray(payload) ? payload[0] : payload) || null;

export const getShramiks = () => request('shramiks');

export const getShramikStatus = (phone) =>
  request(`shramiks/status?phone=${encodeURIComponent(phone)}`);

// The pending queue is scoped SERVER-SIDE to the signed-in admin's login city
// (from the bearer token), so no ?city= is sent from the client.
export const getPendingShramiks = () => request('admin/shramiks/pending');

export const registerAdmin = async (payload) => {
  const result = await request('auth/admin/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (result?.token) setAdminToken(result.token);
  return result;
};

export const createShramik = async (shramik) => asRecord(await request('shramiks', {
  method: 'POST',
  body: JSON.stringify(shramik),
}));

export const createBooking = (booking) => request('bookings', {
  method: 'POST',
  body: JSON.stringify(booking),
});

export const getShramikBookings = (shramikId) =>
  request(`bookings/shramik/${encodeURIComponent(shramikId)}`);

export const getCustomerBookings = (customerId) =>
  request(`bookings/customer/${encodeURIComponent(customerId)}`);

export const getBooking = (bookingId) =>
  request(`bookings/${encodeURIComponent(bookingId)}`);

export const startBooking = (bookingId) => request(`bookings/${encodeURIComponent(bookingId)}/start`, {
  method: 'POST',
});

export const acceptBooking = (bookingId) => request(`bookings/${encodeURIComponent(bookingId)}/accept`, {
  method: 'POST',
});

export const rejectBooking = (bookingId) => request(`bookings/${encodeURIComponent(bookingId)}/reject`, {
  method: 'POST',
});

export const completeBooking = (bookingId, serviceFee) => request(`bookings/${encodeURIComponent(bookingId)}/complete`, {
  method: 'POST',
  body: JSON.stringify({ serviceFee }),
});

export const payBooking = (bookingId, paymentMethod) => request(`bookings/${encodeURIComponent(bookingId)}/pay`, {
  method: 'POST',
  body: JSON.stringify({ paymentMethod }),
});

export const submitReview = (bookingId, rating, comment = '') => request(`bookings/${encodeURIComponent(bookingId)}/review`, {
  method: 'POST',
  body: JSON.stringify({ rating, comment }),
});

export const loginAdmin = async (credentials) => {
  const result = await request('auth/admin/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  if (result?.token) setAdminToken(result.token);
  return result;
};

export const loginShramik = (credentials) => request('auth/shramik/login', {
  method: 'POST',
  body: JSON.stringify(credentials),
});

export const loginCustomer = (credentials) => request('auth/customer/login', {
  method: 'POST',
  body: JSON.stringify(credentials),
});

export const registerCustomer = (payload) => request('auth/customer/register', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const getAllBookings = () => request('bookings/all');

export const getAllCustomers = () => request('admin/customers');

export const approveShramik = (id) => request(`admin/shramiks/${id}/approve`, {
  method: 'POST',
});

export const rejectShramik = (id) => request(`admin/shramiks/${id}`, {
  method: 'DELETE',
});

export { isApiConfigured as isSupabaseConfigured };

