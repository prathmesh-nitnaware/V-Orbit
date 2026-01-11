import express from "express";
import fs from "fs";
import { upload } from "../middlewares/upload.middleware.js";
import { extractTextFromImage } from "../services/ocr.service.js";

const router = express.Router();

router.post("/resume", upload.single("file"), async (req, res) => {
  try {
    // 1. Safety Check
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // 2. Perform OCR
    const text = await extractTextFromImage(req.file.path);

    // 3. Cleanup: Delete the temp file (Critical!)
    try {
      fs.unlinkSync(req.file.path);
    } catch (cleanupErr) {
      console.warn("⚠️ Failed to delete temp file:", cleanupErr.message);
    }

    // 4. Send Response
    res.json({ extractedText: text });

  } catch (error) {
    console.error("❌ OCR Error:", error);
    res.status(500).json({ error: "OCR extraction failed" });
  }
});

export default router;