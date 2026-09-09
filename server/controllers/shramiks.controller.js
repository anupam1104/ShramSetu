import { supabaseRequest } from '../db/connection.js';

const locationKeyOf = (city) => String(city || '').split('|')[0].trim().toLocaleLowerCase('en-IN');

export const listShramiks = async (req, res) => {
	const publicFields = [
		'id', 'name', 'skill', 'verified', 'shramik_id', 'rating', 'jobs_count',
		'distance', 'hourly_rate', 'phone', 'city', 'area', 'experience',
		'services', 'photo', 'bio', 'created_at', 'location_key',
	].join(',');
	const rows = await supabaseRequest(`shramiks?select=${publicFields}&verified=eq.true&order=created_at.desc`);
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
	const { name, skill, phone, city, area, experience, services, photo, bio, password, hourly_rate, expectedHourlyRate } = req.body;

	if (!name || !skill || !phone || !city || !area || !experience) {
		return res.status(400).json({ error: 'name, skill, phone, city, area, and experience are required.' });
	}
	const parsedHourlyRate = Number(hourly_rate ?? expectedHourlyRate ?? 250);
	if (!Number.isFinite(parsedHourlyRate) || parsedHourlyRate < 0) {
		return res.status(400).json({ error: 'Expected hourly rate must be a valid non-negative number.' });
	}
	const normalizedPhone = String(phone).trim();
	const existing = await supabaseRequest(`shramiks?select=id&phone=eq.${encodeURIComponent(normalizedPhone)}&limit=1`);
	if (Array.isArray(existing) && existing[0]) {
		return res.status(409).json({ error: 'A Shramik registration already exists for this phone number.' });
	}

	if (password) {
		const rows = await supabaseRequest('rpc/register_shramik', {
			method: 'POST',
			body: JSON.stringify({
				s_name: name,
				s_skill: skill,
				s_phone: normalizedPhone,
				s_city: city,
				s_area: area,
				s_experience: experience,
				s_services: services || [],
				s_photo: photo || '',
				s_bio: bio || '',
				s_password: String(password),
				s_hourly_rate: parsedHourlyRate,
			}),
		});
		const row = Array.isArray(rows) ? rows[0] : rows;
		return res.status(201).json(row);
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
			hourly_rate: parsedHourlyRate,
			verified: false,
		}),
	});

	return res.status(201).json(row);
};
