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
import mongoose from "mongoose"; // <--- 1. NEW: Mongoose

import careerRoutes from "./routes/career.route.js";
import insightRoutes from "./routes/insight.route.js";
import mockRoutes from "./routes/mock.route.js";
import authRoutes from "./routes/auth.route.js"; 
import resumeRoutes from "./routes/resume.route.js";

import { loadInsightDocuments } from "./services/insightLoader.service.js";

// ================================
// 🚀 APP INIT
// ================================
const app = express();

app.use(cors());
app.use(express.json());

// ================================
// 🔍 ENV VERIFICATION
// ================================
console.log("🔍 PORT =", process.env.PORT || 3000);
console.log("🔍 INSIGHT_BUCKET_NAME =", process.env.INSIGHT_BUCKET_NAME);
console.log("🔍 MONGODB_URI =", process.env.MONGODB_URI ? "Set" : "Not Set (Using Local)");

// ================================
// 🛢️ DATABASE CONNECTION (NEW)
// ================================
const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/v-orbit";

mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

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
  // Optional: process.exit(1) if you want strict failure
}

// ================================
// 🧠 ROUTES
// ================================
app.use("/api/auth", authRoutes); // <--- 3. NEW: Auth Endpoint
app.use("/api/career", careerRoutes);
app.use("/api/insight", insightRoutes);
app.use("/api/mock", mockRoutes);
app.use("/api/resume", resumeRoutes);

// ================================
// 🏠 HEALTH CHECK
// ================================
app.get("/", (req, res) => {
  res.send("🚀 V-Orbit Backend Running (Auth + Insight + Mock)");
});

// ================================
// 🔊 START SERVER
// ================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});