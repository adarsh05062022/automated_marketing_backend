import express from 'express';
import { registerOrUpdateSocialAccount } from '../controllers/socialController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to register or update a social account
router.post('/register-update', protect, async (req, res) => {
    const { username, password } = req.body;
    const userId = req.user._id; // Get userId from authenticated user

    try {
        const result = await registerOrUpdateSocialAccount(username, password, userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
