import crypto from 'crypto';
import { supabaseRequest } from '../db/connection.js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const createBooking = async (req, res) => {
	const {
		shramikId,
		serviceName,
		date,
		time,
		customerName,
		customerPhone,
		customerAddress = '',
		serviceFee,
		platformFee = 50,
	} = req.body;

	if (!shramikId || !serviceName || !date || !time || !customerName || !customerPhone || !serviceFee) {
		return res.status(400).json({ error: 'shramikId, serviceName, date, time, customerName, customerPhone, and serviceFee are required.' });
	}

	if (!UUID_RE.test(String(shramikId))) {
		return res.status(400).json({ error: 'That worker is not saved on the server yet. Book a verified worker from the directory.' });
	}

	const [booking] = await supabaseRequest('bookings', {
		method: 'POST',
		headers: { Prefer: 'return=representation' },
		body: JSON.stringify({
			id: `BK-${crypto.randomUUID()}`,
			shramik_id: shramikId,
			service_name: serviceName,
			scheduled_date: date,
			scheduled_time: time,
			customer_name: customerName,
			customer_phone: customerPhone,
			customer_address: customerAddress,
			service_fee: serviceFee,
			platform_fee: platformFee,
			total_amount: Number(serviceFee) + Number(platformFee),
			start_code: String(Math.floor(1000 + Math.random() * 9000)),
			status: 'Confirmed',
		}),
	});

	return res.status(201).json(booking);
};

const bookingUpdate = async (id, updates, expectedStatus) => {
	const query = new URLSearchParams({ id: `eq.${id}`, status: `eq.${expectedStatus}` });
	const [booking] = await supabaseRequest(`bookings?${query.toString()}`, {
		method: 'PATCH',
		headers: { Prefer: 'return=representation' },
		body: JSON.stringify(updates),
	});
	return booking || null;
};

export const startBooking = async (req, res) => {
	const { code } = req.body || {};
	if (!/^\d{4}$/.test(String(code || ''))) {
		return res.status(400).json({ error: 'A 4-digit start code is required.' });
	}

	const query = new URLSearchParams({ id: `eq.${req.params.id}`, status: 'eq.Confirmed', start_code: `eq.${code}` });
	const [booking] = await supabaseRequest(`bookings?${query.toString()}`, {
		method: 'PATCH',
		headers: { Prefer: 'return=representation' },
		body: JSON.stringify({
		status: 'In Progress',
		started_at: new Date().toISOString(),
		}),
	});
	if (!booking) return res.status(401).json({ error: 'Invalid start code or booking is no longer available.' });
	return res.json(booking);
};

export const completeBooking = async (req, res) => {
	const [inProgressBooking] = await supabaseRequest(`bookings?id=eq.${encodeURIComponent(req.params.id)}&status=eq.In%20Progress&select=id,started_at`);
	if (!inProgressBooking) return res.status(409).json({ error: 'Booking is not currently in progress.' });
	const completedAt = new Date();
	const startedAt = new Date(inProgressBooking.started_at);
	const durationMinutes = Number.isNaN(startedAt.getTime())
		? null
		: Math.max(0, Math.round((completedAt.getTime() - startedAt.getTime()) / 60000));
	const booking = await bookingUpdate(req.params.id, {
		status: 'Completed',
		completed_at: completedAt.toISOString(),
		duration_minutes: durationMinutes,
	}, 'In Progress');
	if (!booking) return res.status(409).json({ error: 'Booking is not currently in progress.' });
	return res.json(booking);
};

export const payBooking = async (req, res) => {
	const booking = await bookingUpdate(req.params.id, { status: 'Paid' }, 'Completed');
	if (!booking) return res.status(409).json({ error: 'Booking must be customer-confirmed before payment.' });
	return res.json(booking);
};
