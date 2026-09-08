import { Router } from 'express';
import { acceptBooking, completeBooking, createBooking, listShramikBookings, payBooking, startBooking } from '../controllers/bookings.controller.js';

const router = Router();

router.post('/', createBooking);
router.get('/shramik/:shramikId', listShramikBookings);
router.post('/:id/accept', acceptBooking);
router.post('/:id/start', startBooking);
router.post('/:id/complete', completeBooking);
router.post('/:id/pay', payBooking);

export default router;
