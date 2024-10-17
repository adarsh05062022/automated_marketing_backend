import { Schema, model } from "mongoose";

const metricsSchema = new Schema({
  agentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  campaignId: { type: Schema.Types.ObjectId, ref: "Campaign", required: true },

  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  earnings: { type: Number, default: 0 },
},{timestamps:true});

const Metrics = model("Metrics", metricsSchema);
export default Metrics;
