import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// User Registration Controller
export const registerUser = async (req, res) => {
  const { username, email, password, isOwner, state, city } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    user = new User({
      username,
      email,
      password: hashedPassword,
      isOwner,
      state,
      city,
    });

    // Save user to the database
    await user.save();

    // Create a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// User Login Controller
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: { email: user.email, isOwner: user.isOwner, id: user._id },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }

  // Change user details controller
};

export const changeUserDetails = async (req, res) => {
  const { username, email, state, city } = req.body;

  try {
    // Find the user by their ID (retrieved from the token via the protect middleware)
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the fields with the new data, if provided
    user.username = username || user.username;
    user.email = email || user.email;
    user.state = state || user.state;
    user.city = city || user.city;

    // Save the updated user
    const updatedUser = await user.save();

    // Respond with the updated user details (excluding password)
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isOwner: updatedUser.isOwner,
      state: updatedUser.state,
      city: updatedUser.city,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};
