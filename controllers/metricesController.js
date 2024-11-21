import Campaign from "../models/Campaign.js";
import Social from "../models/Social.js";
import { decryptPassword } from "../utils/encryption.js";
import { getInstagramPostInsights } from "../utils/postToInstagram.js";
import Metrics from "../models/Metrics.js";

export const getMetrics = async (req, res) => {
  const agentId = req.user._id; // Assuming authentication is done and user ID is available in req.user
  const { campaignId } = req.params;

  try {
    // Find the metrics for the given agentId and campaignId
    const metrics = await Metrics.findOne({ agentId, campaignId });

    if (!metrics) {
      return res
        .status(404)
        .json({ error: "Metrics not found for this agent and campaign" });
    }

    // Return the metrics
    res.status(200).json(metrics);
  } catch (error) {
    console.error("Error fetching metrics:", error);
    res.status(500).json({ error: "Error fetching metrics" });
  }
};

export const updateMetrics = async (req, res) => {
  const agentId = req.user._id;
  const { campaignId } = req.params;

  try {
    // Step 1: Get the campaign and fetch the affiliated link (postId)
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    // Find the agent's affiliate link (postId) from the campaign
    const agentData = campaign.agents.find(
      (agent) => agent.userId.toString() === agentId.toString()
    );
    if (!agentData || !agentData.affiliatedLink) {
      return res
        .status(404)
        .json({ error: "Affiliate link not found for this agent" });
    }
    const postId = agentData.affiliatedLink; // This is the Instagram post ID

    // Step 2: Fetch the agent's social media account credentials
    const socialAccount = await Social.findOne({ userId: agentId });
    if (!socialAccount) {
      return res.status(404).json({ error: "Social account not found" });
    }

    const decryptedPassword = decryptPassword(
      socialAccount.password,
      socialAccount.iv
    );

    // Step 3: Fetch engagement data from Instagram using the postId
    const insights = await getInstagramPostInsights(
      postId,
      socialAccount.username,
      decryptedPassword
    );
    if (!insights) {
      return res
        .status(500)
        .json({ error: "Error fetching Instagram insights" });
    }

    console.log(insights);

    // Step 4: Update the metrics in the database
    let metrics = await Metrics.findOne({ agentId, campaignId });
    if (!metrics) {
      metrics = new Metrics({ agentId, campaignId });
    }

    // Update the likes, comments, and earnings based on fetched data
    metrics.likes = Number(insights.data.media.like_count) || 0; // Default to 0 if NaN
    metrics.comments = Number(insights.data.media.comment_count) || 0; // Default to 0 if NaN

    // Step 5: Calculate payment based on engagement (for example, $0.10 per like and $0.05 per comment)
    const earningsPerLike = 0.035; // Example rate
    const earningsPerComment = 0.05; // Example rate
    metrics.earnings =
      metrics.likes * earningsPerLike + metrics.comments * earningsPerComment;

    // Save the updated metrics
    await metrics.save();

    console.log(metrics);

    res.status(200).json(metrics);
  } catch (error) {
    console.error("Error updating metrics:", error);
    res.status(500).json({ error: "Error updating metrics" });
  }
};
