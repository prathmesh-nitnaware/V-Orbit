// ================================
// 🔐 ENV LOADING (ESM SAFE)
// ================================
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ESM replacement for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicit .env load (IMPORTANT on Windows + ESM)
dotenv.config({
  path: path.join(__dirname, ".env"),
});

// ================================
// 📦 IMPORTS
// ================================
import express from "express";
import cors from "cors";

import careerRoutes from "./routes/career.route.js";
import insightRoutes from "./routes/insight.route.js";
import mockRoutes from "./routes/mock.route.js";

import { loadInsightDocuments } from "./services/insightLoader.service.js";

// ================================
// 🚀 APP INIT
// ================================
const app = express();

app.use(cors());
app.use(express.json());

// ================================
// 🔍 ENV VERIFICATION (KEEP FOR DEMO)
// ================================
console.log("🔍 PORT =", process.env.PORT || 3000);
console.log("🔍 INSIGHT_BUCKET_NAME =", process.env.INSIGHT_BUCKET_NAME);
console.log("🔍 RESUME_BUCKET_NAME  =", process.env.RESUME_BUCKET_NAME);
console.log("🔍 GOOGLE_CREDS loaded =", !!process.env.GOOGLE_APPLICATION_CREDENTIALS);

// ================================
// 📚 LOAD INSIGHT-VIT DOCS (ONCE)
// ================================
try {
  console.log("📚 Loading Insight-VIT documents...");
  await loadInsightDocuments();
  console.log("✅ Insight-VIT documents loaded successfully");
} catch (err) {
  console.error("❌ Insight-VIT startup failed");
  console.error(err.message);
  process.exit(1); // Hard fail is correct here
}

// ================================
// 🧠 ROUTES
// ================================
app.use("/api/career", careerRoutes);
app.use("/api/insight", insightRoutes);
app.use("/api/mock", mockRoutes);

// ================================
// 🏠 HEALTH CHECK
// ================================
app.get("/", (req, res) => {
  res.send("🚀 V-Orbit Backend Running (Insight-VIT + Mock-V)");
});

// ================================
// 🔊 START SERVER
// ================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
