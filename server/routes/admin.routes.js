import { Router } from 'express';
import { approveShramik, listPendingShramiks, rejectShramik } from '../controllers/admin.controller.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = Router();

router.get('/shramiks/pending', requireAdmin, listPendingShramiks);
router.post('/shramiks/:id/approve', requireAdmin, approveShramik);
router.delete('/shramiks/:id', requireAdmin, rejectShramik);

export default router;
