import { supabaseRequest } from '../db/connection.js';

const localityOf = (city) => String(city || '').split('|')[0].trim().toLocaleLowerCase('en-IN');

export const approveShramik = async (req, res) => {
  // The admin's queue is scoped to their login city (see listPendingShramiks),
  // so approvals must respect the same boundary: an admin can only approve a
  // shramik whose city matches their own.
  const adminCity = localityOf(req.admin?.city || '');
  if (adminCity) {
    const [candidate] = await supabaseRequest(`shramiks?select=id,city&id=eq.${req.params.id}`);
    if (!candidate) return res.status(404).json({ error: 'Pending Shramik not found.' });
    if (localityOf(candidate.city) !== adminCity) {
      return res.status(403).json({ error: 'This Shramik is outside your city queue.' });
    }
  }

  const rows = await supabaseRequest('rpc/approve_shramik', {
    method: 'POST',
    body: JSON.stringify({ shramik_uuid: req.params.id }),
  });
  const approved = Array.isArray(rows) ? rows[0] : rows;

  if (!approved) return res.status(404).json({ error: 'Pending Shramik not found.' });
  return res.json(approved);
};

export const listPendingShramiks = async (req, res) => {
  // Source of truth is the signed-in admin's login location (from the token),
  // NOT a client-supplied ?city= param. Every admin whose city matches the
  // shramik's city sees the same pending queue.
  const city = localityOf(req.admin?.city || '');
  let path = 'shramiks?select=*&verified=eq.false&order=city.asc,created_at.desc';
  // Exact matching after normalizing on write prevents a Kolkata admin from
  // seeing Kolkata North / Kolkata Rural by accident.
  if (city) path += `&location_key=eq.${encodeURIComponent(city)}`;
  const rows = await supabaseRequest(path);
  res.json(rows);
};

export const rejectShramik = async (req, res) => {
  const adminCity = localityOf(req.admin?.city || '');
  const [candidate] = await supabaseRequest(`shramiks?select=id,city,verified&id=eq.${req.params.id}`);
  if (!candidate || candidate.verified) return res.status(404).json({ error: 'Pending Shramik not found.' });
  if (!adminCity || localityOf(candidate.city) !== adminCity) {
    return res.status(403).json({ error: 'This Shramik is outside your city queue.' });
  }

  const rows = await supabaseRequest(`shramiks?id=eq.${req.params.id}&verified=eq.false`, {
    method: 'DELETE',
    headers: { Prefer: 'return=representation' },
  });
  const rejected = Array.isArray(rows) ? rows[0] : rows;
  if (!rejected) return res.status(409).json({ error: 'This registration has already been processed.' });
  return res.json({ id: rejected.id });
};

export const listCustomers = async (req, res) => {
  const rows = await supabaseRequest('customers?select=*&order=created_at.desc');
  res.json(rows || []);
};

