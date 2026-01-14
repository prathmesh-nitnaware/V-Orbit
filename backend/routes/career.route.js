import express from "express";
import fs from "fs";
import pdfParse from "pdf-parse";
import Groq from "groq-sdk"; 
import { upload } from "../upload.middleware.js"; 
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    // 1. Validation
    if (!req.file || !req.body.jdText) {
      return res.status(400).json({ message: "Resume PDF and Job Description are required." });
    }

    // 2. Extract Text from PDF
    const pdfBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(pdfBuffer);
    const resumeText = pdfData.text;

    // 3. Construct Prompt
    const prompt = `
      You are an expert ATS (Applicant Tracking System).
      Compare the RESUME below against the JOB DESCRIPTION (JD).

      JOB DESCRIPTION:
      ${req.body.jdText}

      RESUME TEXT:
      ${resumeText.substring(0, 15000)}

      Analyze strictly and output ONLY JSON. No intro text.
      JSON Format:
      {
        "atsScore": number (0-100),
        "jdMatchPercentage": number (0-100),
        "missingSkills": ["skill1", "skill2"],
        "suggestions": ["advice1", "advice2"]
      }
    `;

    // 4. AI Analysis (Groq / Llama 3)
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const jsonResponse = JSON.parse(completion.choices[0].message.content);

    // 5. Cleanup & Send
    fs.unlinkSync(req.file.path);
    res.json(jsonResponse);

  } catch (error) {
    console.error("❌ Resume Analysis Error:", error.message);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: "AI Analysis Failed", error: error.message });
  }
});

export default router;