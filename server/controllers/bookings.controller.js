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
