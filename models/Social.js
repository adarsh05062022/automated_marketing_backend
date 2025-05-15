import { Schema, model } from "mongoose";

// Socials Schema
const SocialsSchema = new Schema({
  platform: {
    type: String,
    required: true,
    default: "instagram",
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  iv: {
    // Add iv field to store initialization vector
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure the combination of userId and platform is unique
SocialsSchema.index({ userId: 1, platform: 1 }, { unique: true });

const Social = model("Social", SocialsSchema);

export default Social;
