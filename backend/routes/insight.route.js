import express from "express";
import { askInsightVIT } from "../services/insightQA.service.js";

const router = express.Router();

router.post("/ask", async (req, res) => {
  try {
    const { subject, question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const result = await askInsightVIT({ subject, question });
    res.json(result);
  } catch (err) {
    console.error("❌ Insight-VIT error:", err);
    res.status(500).json({ error: "Insight-VIT failed" });
  }
});

export default router;
