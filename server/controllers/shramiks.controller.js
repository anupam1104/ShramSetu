import { supabaseRequest } from '../db/connection.js';

const locationKeyOf = (city) => String(city || '').split('|')[0].trim().toLocaleLowerCase('en-IN');

export const listShramiks = async (req, res) => {
	const rows = await supabaseRequest('shramiks?select=*&verified=eq.true&order=created_at.desc');
	res.json(rows);
};

export const getShramikStatus = async (req, res) => {
	const phone = String(req.query.phone || '').trim();
	if (!phone) return res.status(400).json({ error: 'phone is required.' });

	const rows = await supabaseRequest(`shramiks?select=id,verified,shramik_id,phone&phone=eq.${encodeURIComponent(phone)}`);
	const row = Array.isArray(rows) ? rows[0] : rows;
	if (!row) return res.status(404).json({ error: 'Registration not found.' });

	return res.json({
		id: row.id,
		verified: Boolean(row.verified),
		shramikId: row.shramik_id || null,
		phone: row.phone,
	});
};

export const createShramik = async (req, res) => {
	const { name, skill, phone, city, area, experience, services, photo, bio } = req.body;

	if (!name || !skill || !phone || !city || !area || !experience) {
		return res.status(400).json({ error: 'name, skill, phone, city, area, and experience are required.' });
	}
	const normalizedPhone = String(phone).trim();
	const existing = await supabaseRequest(`shramiks?select=id&phone=eq.${encodeURIComponent(normalizedPhone)}&limit=1`);
	if (Array.isArray(existing) && existing[0]) {
		return res.status(409).json({ error: 'A Shramik registration already exists for this phone number.' });
	}

	const [row] = await supabaseRequest('shramiks', {
		method: 'POST',
		headers: { Prefer: 'return=representation' },
		body: JSON.stringify({
			name,
			skill,
			phone: normalizedPhone,
			city,
			location_key: locationKeyOf(city),
			area,
			experience,
			services: services || [],
			photo,
			bio,
			verified: false,
		}),
	});

	return res.status(201).json(row);
};
