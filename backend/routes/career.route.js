import express from "express";
import multer from "multer";
import fs from "fs";
import pdfParse from "pdf-parse";
import { analyzeResumeWithAI } from "../services/aiResumeAnalyzer.service.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    const { jdText } = req.body;

    if (!req.file || !jdText) {
      return res.status(400).json({ error: "Resume and JD are required" });
    }

    const buffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(buffer);

    fs.unlinkSync(req.file.path);

    const aiResult = await analyzeResumeWithAI(
      pdfData.text.slice(0, 8000),
      jdText.slice(0, 8000)
    );

    res.json(aiResult);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "AI analysis failed. Please try again."
    });
  }
});

export default router;
