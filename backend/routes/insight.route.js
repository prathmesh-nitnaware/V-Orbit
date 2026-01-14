import express from "express";
import path from "path";
import fs from "fs";
import { askInsightVIT } from "../services/insightQA.service.js";

const router = express.Router();

// --- 1. QA Endpoint (The Chatbot) ---
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

// --- 2. PDF Serving Endpoint (The "View Source" Button) ---
router.get("/pdf/:filename", (req, res) => {
  try {
    const { filename } = req.params;
    
    // Security: Ensure we only look for simple filenames, no ".." hacking
    const safeFilename = path.basename(filename);
    
    // Assume PDFs are stored in the "documents" folder in your backend root
    const filePath = path.join(process.cwd(), "documents", safeFilename);

    if (fs.existsSync(filePath)) {
      res.setHeader("Content-Type", "application/pdf");
      // "inline" means it opens in the browser instead of downloading
      res.setHeader("Content-Disposition", `inline; filename="${safeFilename}"`);
      
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } else {
      console.warn(`⚠️ PDF Not Found: ${filePath}`);
      res.status(404).send("File not found");
    }
  } catch (error) {
    console.error("❌ PDF Server Error:", error);
    res.status(500).send("Error fetching PDF");
  }
});

export default router;