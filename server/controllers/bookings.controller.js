import crypto from 'crypto';
import { supabaseRequest } from '../db/connection.js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const createBooking = async (req, res) => {
	const {
		serviceName: rawServiceName,
		service,
		skill,
		date: rawDate,
		bookingDate,
		time: rawTime,
		bookingTime,
		customerName: rawCustomerName,
		name,
		customerPhone: rawCustomerPhone,
		phone,
		customerAddress = '',
		customerCity = '',
		platformFee = 50,
	} = req.body;
	const serviceName = String(rawServiceName || service || skill || '').trim();
	const date = String(rawDate || bookingDate || '').trim();
	const time = String(rawTime || bookingTime || '').trim();
	const customerName = String(rawCustomerName || name || '').trim();
	const customerPhone = String(rawCustomerPhone || phone || '').trim();

	if (!serviceName || !date || !time || !customerName || !customerPhone) {
		return res.status(400).json({ error: 'serviceName, date, time, customerName, and customerPhone are required.' });
	}

	const [customer] = await supabaseRequest('customers?on_conflict=phone', {
		method: 'POST',
		headers: { Prefer: 'return=representation,resolution=merge-duplicates' },
		body: JSON.stringify({ name: customerName, phone: customerPhone, address: customerAddress }),
	});
	if (!customer?.id) return res.status(502).json({ error: 'Customer could not be saved.' });

	// Assignment is deliberately server-owned. A browser can never select or
	// forge a shramik ID: it only supplies the requested service and slot.
	const [workers, slotBookings] = await Promise.all([
		supabaseRequest('shramiks?select=id,skill,services,verified,location_key,rating,hourly_rate,experience,shramik_id&verified=eq.true'),
		supabaseRequest(`bookings?${new URLSearchParams({
			select: 'shramik_id', scheduled_date: `eq.${date}`, scheduled_time: `eq.${time}`,
			status: 'in.(Pending,Confirmed,In Progress)',
		}).toString()}`),
	]);

	const normalizedService = String(serviceName).trim().toLowerCase();
	const cityKey = String(customerCity).split('|')[0].trim().toLowerCase();
	const busyIds = new Set((slotBookings || []).map((booking) => booking.shramik_id));
	const candidates = (workers || [])
		.filter((worker) => !cityKey || worker.location_key === cityKey)
		.filter((worker) => worker.skill?.trim().toLowerCase() === normalizedService
			|| (worker.services || []).some((service) => String(service).trim().toLowerCase() === normalizedService))
		.filter((worker) => !busyIds.has(worker.id))
		// Stable ordering keeps assignment deterministic across retries.
		.sort((a, b) => String(a.id).localeCompare(String(b.id)));

	if (candidates.length === 0) {
		return res.status(409).json({ error: 'No verified shramik is free for this service and time slot.' });
	}

	// A competing booking can reserve the first candidate between the read and
	// insert. Try the next fairly ranked worker on a slot-conflict response.
	for (const shramik of candidates) {
		try {
			const assignedServiceFee = Number(shramik.hourly_rate) * 2;
			const [booking] = await supabaseRequest('bookings', {
				method: 'POST',
				headers: { Prefer: 'return=representation' },
				body: JSON.stringify({
					id: `BK-${crypto.randomUUID()}`,
					shramik_id: shramik.id,
					customer_id: customer.id,
					service_name: serviceName,
					scheduled_date: date,
					scheduled_time: time,
					customer_name: customerName,
					customer_phone: customerPhone,
					customer_address: customerAddress,
					service_fee: assignedServiceFee,
					platform_fee: platformFee,
					total_amount: assignedServiceFee + Number(platformFee),
					status: 'Pending',
				}),
			});
			return res.status(201).json({ ...booking, assigned_shramik: shramik });
		} catch (error) {
			if (error.status !== 409) throw error;
		}
	}

	return res.status(409).json({ error: 'That time slot was just taken. Please choose another time.' });
};

// A customer can start work only after the assigned Shramik accepts the request.
export const acceptBooking = async (req, res) => {
	const booking = await bookingUpdate(req.params.id, {
		status: 'Confirmed',
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

export const getBooking = async (req, res) => {
	const query = new URLSearchParams({
		id: `eq.${req.params.id}`,
		select: '*,customers(id,name,phone,address),shramiks(id,name,skill,phone,city)',
		limit: '1',
	});
	const [booking] = await supabaseRequest(`bookings?${query.toString()}`);
	if (!booking) return res.status(404).json({ error: 'Booking not found.' });
	return res.json(booking);
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

const phoneDigitsOf = (value) => String(value || '').replace(/\D/g, '').slice(-10);

export const listCustomerBookings = async (req, res) => {
	// Accept either a customer UUID (login) or any phone format, and resolve
	// bookings even when the booking's customer_phone format does not exactly
	// match (e.g. "1234567890" vs "+91 1234567890" vs "+911234567890").
	const identifier = String(req.params.customerId || '').trim();
	const isUuid = UUID_RE.test(identifier);
	const conditions = new Set();

	if (isUuid) conditions.add(`customer_id.eq.${identifier}`);
	const digits = isUuid ? '' : phoneDigitsOf(identifier);

	// Every common way this phone could be stored, so the customers table can
	// be matched regardless of +91/space formatting.
	const variants = new Set();
	if (digits.length === 10) {
		variants.add(digits);
		variants.add(`+91${digits}`);
		variants.add(`+91 ${digits}`);
		variants.add(`91${digits}`);
	}
	if (isUuid) {
		const [customer] = await supabaseRequest(`customers?select=id,phone&id=eq.${identifier}&limit=1`);
		if (customer?.phone) {
			variants.add(String(customer.phone));
			const customerDigits = phoneDigitsOf(customer.phone);
			if (customerDigits.length === 10) {
				variants.add(customerDigits);
				variants.add(`+91${customerDigits}`);
				variants.add(`+91 ${customerDigits}`);
			}
		}
	}

	// The booking always carries a customer_id (set by createBooking), so find
	// every customers row for this phone and match those FKs directly.
	if (variants.size > 0) {
		const phoneQuery = new URLSearchParams({
			select: 'id',
			or: `(${Array.from(variants).filter(Boolean).map((phone) => `phone.eq.${encodeURIComponent(phone)}`).join(',')})`,
		});
		const matched = await supabaseRequest(`customers?${phoneQuery.toString()}`);
		const ids = (Array.isArray(matched) ? matched : []).map((customer) => customer.id).filter(Boolean);
		if (ids.length > 0) conditions.add(`customer_id.in.(${ids.join(',')})`);
	}

	// Suffix match on customer_phone covers bookings whose FK is null or whose
	// stored phone simply tacks a country code on the same 10 digits.
	if (digits.length === 10) conditions.add(`customer_phone.like.*${digits}`);

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
	const query = new URLSearchParams({ id: `eq.${req.params.id}`, status: 'eq.Confirmed' });
	const [booking] = await supabaseRequest(`bookings?${query.toString()}`, {
		method: 'PATCH',
		headers: { Prefer: 'return=representation' },
		body: JSON.stringify({
		status: 'In Progress',
		started_at: new Date().toISOString(),
		}),
	});
	if (!booking) return res.status(409).json({ error: 'Booking must be accepted before work can start.' });
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
