import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import campaignRoute from "./routes/campaignRoutes.js"
import socialRoute from "./routes/socialRoutes.js"
import metricsRoutes from "./routes/metricsRoutes.js"
import bodyParser from "body-parser";


import findAgents from "./utils/findAgents.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(bodyParser.json({ limit: '100mb' })); // Increase limit for JSON
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true })); // Increase limit for URL-encoded data


app.use(express.json()); 
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/campaigns", campaignRoute);
app.use("/api/social", socialRoute);
app.use("/api/metrics", metricsRoutes);


app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
