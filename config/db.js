import { connect } from "mongoose";
import dotenv from "dotenv"; // Import dotenv

dotenv.config();

const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1); // Exit with failure
  }
};

export default connectDB;
