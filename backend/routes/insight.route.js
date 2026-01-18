import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Storage } from "@google-cloud/storage";
import Groq from "groq-sdk";
import axios from "axios";
import path from "path";
// CRITICAL: Import the store that actually has the data
import { vectorStore } from "../services/insightLoader.service.js"; 
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
const storage = new Storage();

// --- Helper: Cosine Similarity ---
function cosineSimilarity(vecA, vecB) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// --- 1. ASK Endpoint (Connected to Full Brain) ---
router.post("/ask", async (req, res) => {
  try {
    const { subject, question } = req.body;
    
    // 1. Check if Vector Store is ready
    if (!vectorStore || vectorStore.length === 0) {
      return res.json({ 
        answer: "The Knowledge Base is currently initializing. Please wait 10 seconds and try again.", 
        source: "System" 
      });
    }

    // 2. Embed the Question
    const result = await model.embedContent(question);
    const qVector = result.embedding.values;

    // 3. Filter Vectors by Subject (AI, DS, etc.)
    // Note: insightLoader saves filenames as source.
    // If Subject="AI", we want docs where source includes "AI".
    let relevantDocs = vectorStore;
    if (subject && subject !== "ALL") {
      relevantDocs = vectorStore.filter(doc => 
        doc.source.toLowerCase().includes(subject.toLowerCase())
      );
      
      // Fallback: If filter is too strict, search everything
      if (relevantDocs.length === 0) relevantDocs = vectorStore;
    }

    // 4. Perform Search (Cosine Similarity)
    const scoredDocs = relevantDocs.map(doc => ({
      ...doc,
      score: cosineSimilarity(qVector, doc.vector) // insightLoader uses .vector
    }));

    // Get Top 3 matches
    const topDocs = scoredDocs.sort((a, b) => b.score - a.score).slice(0, 3);
    const context = topDocs.map(d => d.text).join("\n\n---\n\n");
    const bestSource = topDocs.length > 0 ? topDocs[0].source : null;

    // 5. Generate Answer (Hybrid Logic)
    const prompt = `
      You are Insight-VIT, a strict academic tutor.
      Subject: ${subject}
      
      CONTEXT FROM PDF:
      ${context || "No context found."}

      QUESTION:
      ${question}

      INSTRUCTIONS:
      - Answer ONLY using the provided CONTEXT if possible.
      - If the context contains the answer, cite the specific module or section.
      - If the context is empty or irrelevant, you MAY use your general knowledge, but state: "This wasn't found in the syllabus document, but generally..."
      - Use Markdown.
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
    });

    const answer = completion.choices[0].message.content;

    // 6. Fetch YouTube Video
    let video = null;
    try {
      const ytRes = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
        params: {
          part: "snippet",
          q: `${subject} ${question} tutorial`,
          key: process.env.YOUTUBE_API_KEY,
          maxResults: 1,
          type: "video"
        }
      });
      if (ytRes.data.items.length > 0) {
        const item = ytRes.data.items[0];
        video = {
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.medium.url,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`
        };
      }
    } catch (e) { /* Ignore YT error */ }

    res.json({ answer, source: bestSource, video });

  } catch (err) {
    console.error("Insight Error:", err);
    res.status(500).json({ error: "AI Processing Failed" });
  }
});

// --- 2. PDF Serving (View Source) ---
router.get("/pdf/:filename", async (req, res) => {
  try {
    const { filename } = req.params;
    const bucketName = process.env.INSIGHT_BUCKET_NAME;
    
    if (!bucketName) return res.status(500).send("Bucket Not Configured");

    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filename);
    const [exists] = await file.exists();

    if (!exists) return res.status(404).send("File not found");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    file.createReadStream().pipe(res);

  } catch (error) {
    console.error("PDF Serve Error:", error);
    res.status(500).send("Server Error");
  }
});

export default router;