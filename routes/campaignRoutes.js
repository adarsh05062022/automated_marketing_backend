import express from 'express';
import { protect } from '../middleware/authMiddleware.js'; // Import auth middleware for protected routes
import {
  createCampaign,
  getCampaignsByOwnerId,
  getCampaignById,
  getCampaignsByAgentId,
  removeAgentFromCampaign,
} from '../controllers/campaignController.js';

const router = express.Router();

// Register route
router.get('/owner', protect, getCampaignsByOwnerId);
router.post('/create-campaign', protect, createCampaign);
router.get('/campaign/:id', protect, getCampaignById);
router.get('/agent',protect, getCampaignsByAgentId);
// DELETE route for an agent to remove themselves from a campaign
router.delete('/remove-agent/:campaignId', protect, removeAgentFromCampaign);

export default router;
