import { Router } from 'express';
import { loginAdmin, registerAdmin, loginShramik, loginCustomer, registerCustomer } from '../controllers/auth.controller.js';
import { rateLimit } from '../middleware/rateLimit.js';

const router = Router();

router.post('/admin/login', rateLimit({ max: 8, windowMs: 15 * 60 * 1000 }), loginAdmin);
router.post('/admin/register', rateLimit({ max: 5, windowMs: 15 * 60 * 1000 }), registerAdmin);
router.post('/shramik/login', rateLimit({ max: 10, windowMs: 15 * 60 * 1000 }), loginShramik);
router.post('/customer/login', rateLimit({ max: 10, windowMs: 15 * 60 * 1000 }), loginCustomer);
router.post('/customer/register', rateLimit({ max: 5, windowMs: 15 * 60 * 1000 }), registerCustomer);

export default router;

