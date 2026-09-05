import { Router } from 'express';
import { approveShramik } from '../controllers/admin.controller.js';

const router = Router();

router.post('/shramiks/:id/approve', approveShramik);

export default router;