import { supabaseRequest } from '../db/connection.js';

const createBookingId = () => `BK-${Math.floor(1000 + Math.random() * 9000)}`;
const createStartCode = () => String(Math.floor(1000 + Math.random() * 9000));

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

	const [booking] = await supabaseRequest('bookings', {
		method: 'POST',
		headers: { Prefer: 'return=representation' },
		body: JSON.stringify({
			id: createBookingId(),
			shramik_id: shramikId,
			service_name: serviceName,
			scheduled_date: date,
			scheduled_time: time,
			customer_name: customerName,
			customer_phone: customerPhone,
			customer_address: customerAddress,
			service_fee: serviceFee,
			platform_fee: platformFee,
			total_amount: serviceFee + platformFee,
			start_code: createStartCode(),
			status: 'Confirmed',
		}),
	});

	return res.status(201).json(booking);
};
