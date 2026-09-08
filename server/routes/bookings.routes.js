import { Router } from 'express';
import { completeBooking, createBooking, payBooking, startBooking } from '../controllers/bookings.controller.js';

const router = Router();

router.post('/', createBooking);
router.post('/:id/start', startBooking);
router.post('/:id/complete', completeBooking);
router.post('/:id/pay', payBooking);

export default router;
