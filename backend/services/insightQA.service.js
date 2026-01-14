import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import { vectorStore } from "./insightLoader.service.js"; 
import { fetchYouTubeVideo } from "./youtube.service.js"; // <--- IMPORT THIS
import dotenv from "dotenv";

dotenv.config();

// --- CONFIGURATION ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const askInsightVIT = async ({ subject, question }) => {
  try {
    // --- STEP 1: SAFETY CHECKS ---
    if (!vectorStore || vectorStore.length === 0) {
      return { 
        answer: "I am ready, but my Knowledge Base is empty. Please check the server logs to ensure PDFs were loaded.",
        source: "System" 
      };
    }

    console.log(`🤔 Hybrid Oracle thinking: "${question}" for subject: "${subject}"...`);

    // --- STEP 2: SEARCH (Google Embeddings) ---
    const qResult = await embeddingModel.embedContent(question);
    const qVector = qResult.embedding.values;

    // Filter documents by Subject
    let candidates = vectorStore;
    
    if (subject && subject !== "ALL") {
      const subjectLower = subject.toLowerCase();
      let fileKeyword = subjectLower; 

      // Simple mapping logic
      if (subjectLower.includes("artificial")) fileKeyword = "ai";
      else if (subjectLower.includes("data ware")) fileKeyword = "dwm";
      else if (subjectLower.includes("distributed")) fileKeyword = "ds";
      else if (subjectLower.includes("software")) fileKeyword = "se";
      else if (subjectLower.includes("compiler")) fileKeyword = "spcd";

      candidates = vectorStore.filter(doc => 
        doc.source.toLowerCase().includes(fileKeyword) || 
        doc.subject === "ALL"
      );

      if (candidates.length === 0) {
        console.warn(`⚠️ Filter '${fileKeyword}' matched 0 files. Searching ALL documents.`);
        candidates = vectorStore;
      }
    }

    // --- STEP 3: RANKING ---
    const scoredDocs = candidates.map(doc => ({
      ...doc,
      score: cosineSimilarity(qVector, doc.vector)
    }));

    // Get Top 10 relevant chunks
    const topMatches = scoredDocs
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    if (topMatches.length === 0 || topMatches[0].score < 0.35) {
      return { 
        answer: "I couldn't find any relevant information in the provided documents for that specific question.",
        source: null 
      };
    }

    // --- STEP 4: ANSWER GENERATION (Groq / Llama 3) ---
    const contextText = topMatches.map(m => m.text).join("\n\n---\n\n");
    const sourceName = topMatches[0].source;

    const prompt = `
      You are an expert academic assistant for VIT students.
      Use the CONTEXT below (extracted from official university PDFs) to answer the QUESTION.

      CONTEXT:
      ${contextText}

      QUESTION:
      ${question}

      GUIDELINES:
      - Answer strictly based on the context provided.
      - Use Markdown (Bold for headers, Lists for points).
      - Be concise and accurate.
      - If the answer is not in the context, say "I don't know based on these documents."
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
    });

    const answerText = completion.choices[0]?.message?.content || "No answer generated.";

    // --- STEP 5: FETCH YOUTUBE VIDEO (New) ---
    let videoData = null;
    try {
      console.log("🎥 Fetching related video...");
      videoData = await fetchYouTubeVideo(question); 
    } catch (vidErr) {
      console.error("Video Fetch Failed:", vidErr.message);
    }

    return {
      answer: answerText,
      source: sourceName,
      video: videoData // <--- Return the video object
    };

  } catch (err) {
    console.error("❌ Hybrid QA Error:", err.message);
    throw new Error("AI processing failed.");
  }
};

/**
 * Helper: Cosine Similarity
 */
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}