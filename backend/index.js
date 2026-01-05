import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import careerRoutes from "./routes/career.route.js";
import insightRoutes from "./routes/insight.route.js";
import { loadDocuments } from "./services/insightLoader.service.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

await loadDocuments(); // 🔥 IMPORTANT

app.use("/api/career", careerRoutes);
app.use("/api/insight", insightRoutes);

app.get("/", (req, res) => {
  res.send("🚀 V-Orbit Backend Running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
