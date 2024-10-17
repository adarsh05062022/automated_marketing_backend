import mongoose from "mongoose";
const Schema = mongoose.Schema;

const campaignSchema = new Schema({
  campaignName: { type: String, required: true },
  budget: { type: Number, required: true },
  platform: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  image: { type: String, required: true },  // Store the Base64 image string
  agents: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      affiliatedLink: { type: String },
      accepted:{type:Boolean,default:false}
    }
  ],  // List of agents with their affiliate links
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }  // Campaign owner (userId)
});

const Campaign = mongoose.model('Campaign', campaignSchema);
export default Campaign;
