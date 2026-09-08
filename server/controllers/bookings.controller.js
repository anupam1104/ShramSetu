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

	const [customer] = await supabaseRequest('customers?on_conflict=phone', {
		method: 'POST',
		headers: { Prefer: 'return=representation,resolution=merge-duplicates' },
		body: JSON.stringify({ name: customerName, phone: customerPhone, address: customerAddress }),
	});
	if (!customer?.id) return res.status(502).json({ error: 'Customer could not be saved.' });

	const [booking] = await supabaseRequest('bookings', {
		method: 'POST',
		headers: { Prefer: 'return=representation' },
		body: JSON.stringify({
			id: `BK-${crypto.randomUUID()}`,
			shramik_id: shramikId,
			customer_id: customer.id,
			service_name: serviceName,
			scheduled_date: date,
			scheduled_time: time,
			customer_name: customerName,
			customer_phone: customerPhone,
			customer_address: customerAddress,
			service_fee: serviceFee,
			platform_fee: platformFee,
			total_amount: Number(serviceFee) + Number(platformFee),
			status: 'Pending',
		}),
	});

	return res.status(201).json(booking);
};

// A start code is deliberately created only after the assigned Shramik accepts
// the customer's request. It is never available for an unaccepted request.
export const acceptBooking = async (req, res) => {
	const booking = await bookingUpdate(req.params.id, {
		status: 'Confirmed',
		start_code: String(Math.floor(1000 + Math.random() * 9000)),
	}, 'Pending');
	if (!booking) return res.status(409).json({ error: 'This booking request is no longer pending.' });
	return res.json(booking);
};

export const listAllBookings = async (req, res) => {
	const query = new URLSearchParams({
		select: '*,customers(id,name,phone,address),shramiks(id,name,skill,phone,city)',
		order: 'created_at.desc',
	});
	const rows = await supabaseRequest(`bookings?${query.toString()}`);
	return res.json(rows || []);
};

export const listShramikBookings = async (req, res) => {
	let targetId = req.params.shramikId;
	if (!UUID_RE.test(String(targetId))) {
		const rows = await supabaseRequest(`shramiks?select=id&or=(shramik_id.eq.${encodeURIComponent(targetId)},phone.eq.${encodeURIComponent(targetId)})&limit=1`);
		if (Array.isArray(rows) && rows[0]?.id) {
			targetId = rows[0].id;
		} else {
			return res.json([]);
		}
	}
	const query = new URLSearchParams({
		shramik_id: `eq.${targetId}`,
		select: '*,customers(id,name,phone,address),shramiks(id,name,skill,phone,city)',
		order: 'created_at.desc',
	});
	return res.json(await supabaseRequest(`bookings?${query.toString()}`));
};

export const listCustomerBookings = async (req, res) => {
	// Accept either a customer UUID (login) or any phone format (booking flow
	// stores "+91 XXXXX XXXXX" while signup stores raw digits), so the customer
	// reliably sees their own bookings — and the start code once the Shramik
	// has accepted and the status becomes Confirmed. Phone matching is used
	// because a customer can have two rows (signup row + booking row).
	const identifier = String(req.params.customerId || '').trim();
	const isUuid = UUID_RE.test(identifier);
	const conditions = new Set();
	let digits = isUuid ? '' : identifier.replace(/\D/g, '').slice(-10);

	if (isUuid) {
		conditions.add(`customer_id.eq.${identifier}`);
		const [customer] = await supabaseRequest(`customers?select=phone&id=eq.${identifier}&limit=1`);
		if (customer?.phone) digits = String(customer.phone).replace(/\D/g, '').slice(-10);
	}

	if (digits.length === 10) {
		conditions.add(`customer_phone.eq.${encodeURIComponent(digits)}`);
		conditions.add(`customer_phone.eq.${encodeURIComponent(`+91 ${digits}`)}`);
	}

	if (conditions.size === 0) return res.json([]);

	const query = new URLSearchParams({
		select: '*,customers(id,name,phone,address),shramiks(id,name,skill,phone,city)',
		order: 'created_at.desc',
	});
	query.set('or', `(${Array.from(conditions).join(',')})`);
	return res.json(await supabaseRequest(`bookings?${query.toString()}`));
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
	const finalServiceFee = Number(req.body?.serviceFee);
	if (!Number.isInteger(finalServiceFee) || finalServiceFee <= 0) {
		return res.status(400).json({ error: 'A valid final job amount is required.' });
	}
	const [currentBooking] = await supabaseRequest(`bookings?id=eq.${encodeURIComponent(req.params.id)}&select=platform_fee`);
	const platformFee = Number(currentBooking?.platform_fee || 0);
	const booking = await bookingUpdate(req.params.id, {
		status: 'Completed',
		completed_at: completedAt.toISOString(),
		duration_minutes: durationMinutes,
		service_fee: finalServiceFee,
		total_amount: finalServiceFee + platformFee,
	}, 'In Progress');
	if (!booking) return res.status(409).json({ error: 'Booking is not currently in progress.' });
	return res.json(booking);
};

export const payBooking = async (req, res) => {
	const paymentMethod = req.body?.paymentMethod;
	if (!['cash', 'online'].includes(paymentMethod)) {
		return res.status(400).json({ error: 'Choose cash or online payment.' });
	}
	const booking = await bookingUpdate(req.params.id, { status: 'Paid', payment_method: paymentMethod, paid_at: new Date().toISOString() }, 'Completed');
	if (!booking) return res.status(409).json({ error: 'Booking must be completed before payment.' });
	return res.json(booking);
};
