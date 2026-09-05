import { Router } from 'express';
import { loginAdmin } from '../controllers/auth.controller.js';

const router = Router();

router.post('/admin/login', loginAdmin);

export default router;