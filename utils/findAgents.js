import User from '../models/User.js'; // Import the User model

// Function to fetch agents based on user location
const findAgents = async (userId) => {
  try {
    // Step 1: Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const { state, city } = user;
    // Step 2: Find agents in the same state and city
    const agents = await User.find({
      state, // Match state
      city,  // Match city
      isOwner: false  // Only fetch users who are not owners (agents)
    });
    if (!agents || agents.length === 0) {
      return [];  // Return an empty array if no agents found
    }
    // Step 3: Create an array of userIds and affiliate links for the agents
    const agentArray = agents.map(agent => ({
      userId: agent._id,
    }));
    return agentArray;
  } catch (error) {
    throw error;  // Rethrow the error for further handling if needed
  }
};


export default findAgents;