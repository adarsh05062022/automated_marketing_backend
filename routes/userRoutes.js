import express from 'express';
import { registerUser, loginUser, changeUserDetails } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js'; // Import auth middleware for protected routes

const router = express.Router();

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Change user details route (protected)
router.put('/changeDetails', protect, changeUserDetails);

export default router;
