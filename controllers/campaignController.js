import User from "../models/User.js";
import Campaign from "../models/Campaign.js";
import findAgents from "../utils/findAgents.js";

export const createCampaign = async (req, res) => {
  const {
    campaignName,
    budget,
    platform,
    description,
    startDate,
    endDate,
    image,
  } = req.body;
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }
    const agentsList = await findAgents(userId);

    const newCampaign = new Campaign({
      campaignName,
      budget,
      platform,
      description,
      startDate,
      endDate,
      image,
      agents: agentsList,
      owner: userId,
    });

    const savedCampaign = await newCampaign.save();

    res.status(201).json({
      message: "Campaign created successfully!",
      campaign: savedCampaign,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to create campaign",
      error: err.message,
    });
  }
};

export const getCampaignsByOwnerId = async (req, res) => {
  const userId = req.user._id;

  try {
    const campaigns = await Campaign.find({ owner: userId }).populate({
      path: "agents.userId",
      model: "User",
      select: "username",
      strictPopulate: false,
    });

    if (!campaigns || campaigns.length === 0) {
      return res.status(404).json({
        message: "No campaigns found for this user.",
      });
    }

    res.status(200).json({
      message: "Campaigns retrieved successfully!",
      campaigns,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to retrieve campaigns",
      error: err.message,
    });
  }
};

export const getCampaignById = async (req, res) => {
  const { id } = req.params;

  try {
    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found",
      });
    }

    res.status(200).json({
      message: "Campaign retrieved successfully!",
      campaign,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to retrieve campaign",
      error: err.message,
    });
  }
};

export const getCampaignsByAgentId = async (req, res) => {
  const agentId = req.user._id;

  try {
    const campaigns = await Campaign.find({
      agents: { $elemMatch: { userId: agentId } },
    }).populate("owner", "username email");

    if (!campaigns || campaigns.length === 0) {
      return res.status(404).json({
        message: "No campaigns found for this agent.",
      });
    }

    res.status(200).json({
      message: "Campaigns retrieved successfully!",
      campaigns,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to retrieve campaigns",
      error: err.message,
    });
  }
};

export const removeAgentFromCampaign = async (req, res) => {
  const { campaignId } = req.params;

  const agentId = req.user._id;

  try {
    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found",
      });
    }
   

    const agentIndex = campaign.agents.findIndex(
      (agent) => agent.userId.toString() === agentId.toString()
    );

    if (agentIndex === -1) {
      return res.status(404).json({
        message: "Agent not found in this campaign",
      });
    }

    campaign.agents.splice(agentIndex, 1);
    await campaign.save();

    res.status(200).json({
      message: "Agent removed from the campaign successfully!",
      campaign,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to remove agent from the campaign",
      error: err.message,
    });
  }
};
