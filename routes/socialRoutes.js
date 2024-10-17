import express from "express";
import {
  GetSocial,
  registerOrUpdateSocialAccount,
} from "../controllers/socialController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/get-social", protect, async (req, res) => {
  const userId = req.user._id;

  try {
    const socialAccount = await GetSocial(userId);
    res.status(200).json(socialAccount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to register or update a social account
router.post("/register-update", protect, async (req, res) => {
  const { username, password } = req.body;
  const userId = req.user._id; // Get userId from authenticated user

  try {
    const result = await registerOrUpdateSocialAccount(
      username,
      password,
      userId
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
