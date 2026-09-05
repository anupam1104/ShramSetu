import { Router } from 'express';
import { createShramik, listShramiks } from '../controllers/shramiks.controller.js';

const router = Router();

router.get('/', listShramiks);
router.post('/', createShramik);

export default router;
