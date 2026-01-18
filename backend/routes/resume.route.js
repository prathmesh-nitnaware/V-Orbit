import express from "express";
import fs from "fs";
import pdfParse from "pdf-parse";
import Groq from "groq-sdk";
import { upload } from "../upload.middleware.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// --- ANALYZE RESUME VS JD ---
router.post("/score", upload.single("resume"), async (req, res) => {
  try {
    const { jobDescription } = req.body;
    let resumeText = "";

    // 1. Extract Text from PDF
    if (req.file) {
      const pdfBuffer = fs.readFileSync(req.file.path);
      const pdfData = await pdfParse(pdfBuffer);
      resumeText = pdfData.text.replace(/\s+/g, " ").trim();
      fs.unlinkSync(req.file.path); // Cleanup
    } else {
      return res.status(400).json({ error: "No resume uploaded" });
    }

    // 2. AI Analysis Prompt
    const prompt = `
      You are an ATS (Applicant Tracking System) Expert.
      
      RESUME:
      ${resumeText.substring(0, 3000)}
      
      JOB DESCRIPTION:
      ${jobDescription.substring(0, 1000)}
      
      TASK:
      Analyze the match. Return a JSON object ONLY. No markdown, no intro.
      Structure:
      {
        "score": number (0-100),
        "breakdown": [
          { "subject": "Coding", "A": number (0-100) },
          { "subject": "System Design", "A": number (0-100) },
          { "subject": "Experience", "A": number (0-100) },
          { "subject": "Communication", "A": number (0-100) },
          { "subject": "Education", "A": number (0-100) }
        ],
        "missingSkills": ["skill1", "skill2", "skill3"],
        "summary": "One sentence summary of the fit."
      }
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
    });

    // 3. Parse AI Response
    const jsonString = completion.choices[0].message.content.replace(/```json|```/g, "").trim();
    const analysis = JSON.parse(jsonString);

    res.json(analysis);

  } catch (error) {
    console.error("Resume Scorer Error:", error);
    res.status(500).json({ error: "Analysis Failed" });
  }
});

export default router;