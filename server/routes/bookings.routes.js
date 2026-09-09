import { Router } from 'express';
import { acceptBooking, completeBooking, createBooking, getBooking, listAllBookings, listCustomerBookings, listShramikBookings, payBooking, rejectBooking, startBooking } from '../controllers/bookings.controller.js';

const router = Router();

router.post('/', createBooking);
router.get('/', listAllBookings);
router.get('/all', listAllBookings);
router.get('/shramik/:shramikId', listShramikBookings);
router.get('/customer/:customerId', listCustomerBookings);
router.get('/:id', getBooking);
router.post('/:id/accept', acceptBooking);
router.post('/:id/reject', rejectBooking);
router.post('/:id/start', startBooking);
router.post('/:id/complete', completeBooking);
router.post('/:id/pay', payBooking);

export default router;

