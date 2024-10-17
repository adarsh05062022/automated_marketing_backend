import { Router } from 'express';
import { updateMetrics,getMetrics } from '../controllers/metricesController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/:campaignId',protect, getMetrics);

// Update metrics after a social media post
router.post('/update-metrics/:campaignId',protect, updateMetrics);



export default router;
