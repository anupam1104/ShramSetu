import { Router } from 'express';
import { createShramik, getShramikStatus, listShramiks } from '../controllers/shramiks.controller.js';

const router = Router();

router.get('/', listShramiks);
router.get('/status', getShramikStatus);
router.post('/', createShramik);

export default router;
