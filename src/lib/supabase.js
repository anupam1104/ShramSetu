const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/$/, '');
const isConfigured = Boolean(apiUrl);

const request = async (path, options = {}) => {
  if (!isConfigured) throw new Error('API is not configured.');

  const response = await fetch(`${apiUrl}/${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Supabase request failed with status ${response.status}.`);
  }

  if (response.status === 204) return null;
  return response.json();
};

export const getShramiks = () => request('shramiks?select=*&order=created_at.desc');

export const createShramik = (shramik) => request('shramiks', {
  method: 'POST',
  headers: { Prefer: 'return=representation' },
  body: JSON.stringify(shramik),
});

export const createBooking = (booking) => request('bookings', {
  method: 'POST',
  body: JSON.stringify(booking),
});

export const loginAdmin = (credentials) => request('auth/admin/login', {
  method: 'POST',
  body: JSON.stringify(credentials),
});

export const approveShramik = (id) => request(`admin/shramiks/${id}/approve`, {
  method: 'POST',
});

export { isConfigured as isSupabaseConfigured };