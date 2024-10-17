import Campaign from "../models/Campaign.js";
import Social from "../models/Social.js";
import { decryptPassword } from "../utils/encryption.js";
import {
  postToInsta,
} from "../utils/postToInstagram.js";

export const automaticallyPost = async (req, res) => {
  const { campaignId } = req.params;
  const agentId = req.user._id;

  try {
    // Fetch the campaign
    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    // Check if the agent has accepted the campaign

    const agent = campaign.agents.find(
      (agent) => agent.userId.toString() === agentId.toString()
    );

    if (!agent) {
      return res
        .status(400)
        .json({ message: "Agent not found in the campaign" });
    }

    if (agent.accepted) {
      return res
        .status(400)
        .json({ message: "You have already accepted this campaign" });
    }

    // Fetch social media credentials
    const socialAccount = await Social.findOne({
      userId: agentId,
      platform: campaign.platform,
    });

    if (!socialAccount) {
      return res
        .status(404)
        .json({ message: "No social account found for the platform" });
    }

    // Decrypt the password
    const decryptedPassword = decryptPassword(
      socialAccount.password,
      socialAccount.iv
    );

    // Post to Instagram (you can pass campaign details like image, description, etc.)
    const postId = await postToInsta(
      socialAccount.username,
      decryptedPassword,
      campaign.image,
      campaign.description
    );

    if (postId) {
      // Update the campaign to set 'accepted' to true for the agent
      agent.accepted = true;
      agent.affiliatedLink = postId;

      // Save the updated campaign document
      await campaign.save();

      return res
        .status(200)
        .json({ message: "Posted to Instagram successfully" });
    } else {
      return res.status(500).json({ message: "Failed to post on Instagram" });
    }
  } catch (error) {
    console.error("Error in automaticallyPost:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};


