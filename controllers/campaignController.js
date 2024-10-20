import User from "../models/User.js";
import Metrics from "../models/Metrics.js";
import Campaign from "../models/Campaign.js";
import findAgents from "../utils/findAgents.js";
import calculatePayout from "../utils/paymentUtils.js";


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
    // Find the campaigns owned by the user
    const campaigns = await Campaign.find({ owner: userId }).populate({
      path: "agents.userId",
      model: "User",
      select: "username",
    });

    if (!campaigns || campaigns.length === 0) {
      return res.status(404).json({
        message: "No campaigns found for this user.",
      });
    }

    // Fetch metrics for each campaign and agent
    const campaignsWithMetrics = await Promise.all(
      campaigns.map(async (campaign) => {
        const updatedAgents = await Promise.all(
          campaign.agents.map(async (agent) => {
            // Fetch metrics for the current campaign and agent
            const metrics = await Metrics.findOne({
              agentId: agent.userId,
              campaignId: campaign._id,
            }).select('likes comments earnings'); // Select specific fields from Metrics

            return {
              ...agent.toObject(),
              metrics: metrics || { likes: 0, comments: 0, earnings: 0 },  // Default values if no metrics found
            };
          })
        );

        return {
          ...campaign.toObject(),
          agents: updatedAgents,
        };
      })
    );

    // Respond with the campaigns and populated metrics
    res.status(200).json({
      message: "Campaigns retrieved successfully!",
      campaigns: campaignsWithMetrics,
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

    // Map over campaigns and append the isAccepted status for the specific agent
    const campaignsWithStatus = await Promise.all(
      campaigns.map(async (campaign) => {
        const agentData = campaign.agents.find(
          (agent) => agent.userId.toString() === agentId.toString()
        );
        
        // Create the campaign object with isAccepted field
        let campaignData = {
          ...campaign._doc, // Spread the campaign data
          isAccepted: agentData ? agentData.accepted : false, // Add isAccepted field based on agent's status
        };

        // If the campaign is accepted, fetch the metrics for that campaign and agent
        if (campaignData.isAccepted) {
          const metrics = await Metrics.findOne({
            agentId,
            campaignId: campaign._id,
          });
          
          // Attach the metrics info if found
          campaignData.metrics = metrics || null; // Attach the metrics data if found, or null if not
        }

        return campaignData; // Return the campaign data with status and possibly metrics
      })
    );

    res.status(200).json({
      message: "Campaigns retrieved successfully!",
      campaigns: campaignsWithStatus,
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






