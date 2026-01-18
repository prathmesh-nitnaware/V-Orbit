import express from "express";
import { Storage } from "@google-cloud/storage"; 
import Groq from "groq-sdk";
import axios from "axios";
import { searchSyllabus } from "../services/rag.service.js";
import path from "path"; // Don't forget this import
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const storage = new Storage();

// --- 1. QA Endpoint ---
router.post("/ask", async (req, res) => {
  try {
    const { subject, question } = req.body;
    if (!question) return res.status(400).json({ error: "Question required" });

    const searchSubject = subject === "ALL" ? null : subject;
    const contextChunks = await searchSyllabus(question, searchSubject);
    
    const context = contextChunks.map(c => c.text).join("\n\n");
    const bestSource = contextChunks.length > 0 ? contextChunks[0].source : null;

    const prompt = `
      You are Insight-VIT. Subject: ${subject}.
      CONTEXT: ${context || "No context found."}
      QUESTION: ${question}
      INSTRUCTIONS: Answer concisely using context or general knowledge.
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
    });

    let video = null;
    // ... (YouTube logic remains same) ...

    res.json({ answer: completion.choices[0].message.content, source: bestSource, video });

  } catch (err) {
    console.error("Insight Error:", err);
    res.status(500).json({ error: "Failed" });
  }
});

// --- 2. PDF Serving Endpoint (SAFE VERSION) ---
router.get("/pdf/:filename", async (req, res) => {
  try {
    const { filename } = req.params;
    const bucketName = process.env.INSIGHT_BUCKET_NAME; // Get it inside the request
    
    if (!bucketName) return res.status(500).send("Bucket not configured");

    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filename);

    const [exists] = await file.exists();
    if (!exists) return res.status(404).send("File not found");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    
    file.createReadStream().pipe(res);

  } catch (error) {
    console.error("Cloud PDF Error:", error);
    res.status(500).send("Server Error");
  }
});

export default router;