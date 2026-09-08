import { Router } from 'express';
import { loginCustomer, registerCustomer } from '../controllers/customersAuth.controller.js';
import { rateLimit } from '../middleware/rateLimit.js';

const router = Router();

router.post('/login', rateLimit({ max: 8, windowMs: 15 * 60 * 1000 }), loginCustomer);
router.post('/register', rateLimit({ max: 5, windowMs: 15 * 60 * 1000 }), registerCustomer);

export default router;
