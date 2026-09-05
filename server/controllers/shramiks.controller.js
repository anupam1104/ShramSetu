import { supabaseRequest } from '../db/connection.js';

export const listShramiks = async (req, res) => {
	const rows = await supabaseRequest('shramiks?select=*&order=created_at.desc');
	res.json(rows);
};

export const createShramik = async (req, res) => {
	const { name, skill, phone, city, area, experience, services, photo, bio } = req.body;

	if (!name || !skill || !phone || !city || !area || !experience) {
		return res.status(400).json({ error: 'name, skill, phone, city, area, and experience are required.' });
	}

	const [row] = await supabaseRequest('shramiks', {
		method: 'POST',
		headers: { Prefer: 'return=representation' },
		body: JSON.stringify({ name, skill, phone, city, area, experience, services: services || [], photo, bio }),
	});

	return res.status(201).json(row);
};
