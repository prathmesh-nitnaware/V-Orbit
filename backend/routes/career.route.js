import express from "express";
import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
import { upload } from "../middlewares/upload.middleware.js"; // Uses the multer config we made
import { extractTextFromImage } from "../services/ocr.service.js";
import { analyzeResumeWithOllama } from "../services/aiResumeAnalyzer.service.js";

const router = express.Router();

router.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    const { jdText } = req.body;

    // 1. Validation
    if (!req.file) {
      return res.status(400).json({ error: "No resume file uploaded." });
    }
    if (!jdText || jdText.trim().length < 10) {
      return res.status(400).json({ error: "Job Description is required." });
    }

    let resumeText = "";
    const filePath = req.file.path;
    const mimeType = req.file.mimetype;

    console.log(`📂 Processing file: ${req.file.originalname} (${mimeType})`);

    // 2. Extract Text based on File Type
    if (mimeType === "application/pdf") {
      const buffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(buffer);
      resumeText = pdfData.text;
    } 
    else if (mimeType.startsWith("image/")) {
      // Use the OCR service we created
      resumeText = await extractTextFromImage(filePath);
    } 
    else {
      fs.unlinkSync(filePath); // Cleanup invalid file
      return res.status(400).json({ error: "Unsupported file format. Use PDF or Image." });
    }

    // 3. Cleanup: Delete the temp file immediately after reading
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (cleanupErr) {
      console.warn("⚠️ Warning: Could not delete temp file:", cleanupErr.message);
    }

    // 4. Validate Extracted Text
    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(422).json({ 
        error: "Could not read text from resume. Is it empty or scanned poorly?" 
      });
    }

    console.log("🤖 Sending text to AI for analysis...");

    // 5. Send to Ollama for Analysis
    // Truncate text to ~6000 chars to avoid token limits on smaller local models
    const aiResult = await analyzeResumeWithOllama(
      resumeText.slice(0, 6000),
      jdText.slice(0, 3000)
    );

    // 6. Return JSON Result to Frontend
    res.json(aiResult);

  } catch (error) {
    console.error("❌ Career Route Error:", error);
    
    // Emergency cleanup
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ 
      error: "Resume analysis failed. Please try again." 
    });
  }
});

export default router;