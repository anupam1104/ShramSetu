import { Router } from 'express';
import { loginAdmin, registerAdmin } from '../controllers/auth.controller.js';
import { rateLimit } from '../middleware/rateLimit.js';

const router = Router();

router.post('/admin/login', rateLimit({ max: 8, windowMs: 15 * 60 * 1000 }), loginAdmin);
router.post('/admin/register', rateLimit({ max: 5, windowMs: 15 * 60 * 1000 }), registerAdmin);

export default router;
