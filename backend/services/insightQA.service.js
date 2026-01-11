import { GoogleGenerativeAI } from "@google/generative-ai";
import { vectorStore } from "./insightLoader.service.js"; 
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🛠️ FIX: Using 'gemini-pro' because it is the most stable and widely available model.
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

export const askInsightVIT = async ({ subject, question }) => {
  try {
    // 1. SAFETY CHECK
    if (!vectorStore || vectorStore.length === 0) {
      console.warn("⚠️ Warning: Vector Store is empty.");
      return { 
        answer: "I am unable to answer right now because my knowledge base is empty. Please check the server logs.",
        source: "System" 
      };
    }

    console.log(`🤔 Oracle thinking about: "${question}"...`);

    // 2. Embed Question
    const qResult = await embeddingModel.embedContent(question);
    const qVector = qResult.embedding.values;

    // 3. Semantic Search
    let candidates = vectorStore;
    
    // Filter by subject if strictly selected (optional)
    if (subject && subject !== "ALL") {
      candidates = vectorStore.filter(doc => 
        doc.source.toLowerCase().includes(subject.toLowerCase().replace(/ /g, "_")) || 
        doc.subject === "ALL"
      );
      if (candidates.length === 0) candidates = vectorStore;
    }

    const scoredDocs = candidates.map(doc => ({
      ...doc,
      score: cosineSimilarity(qVector, doc.vector)
    }));

    // Get Top 5 chunks
    const topMatches = scoredDocs
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // Threshold check
    if (topMatches.length === 0 || topMatches[0].score < 0.35) {
      return { 
        answer: "I couldn't find any relevant information in the official documents for that specific question.",
        source: null 
      };
    }

    // 4. Construct Prompt
    const contextText = topMatches.map(m => m.text).join("\n\n---\n\n");
    const sourceName = topMatches[0].source;

    const prompt = `
      You are an expert academic assistant for VIT students.
      Use the following CONTEXT (extracted from official Syllabus/Question Banks) to answer the user's QUESTION.

      CONTEXT:
      ${contextText}

      QUESTION:
      ${question}

      GUIDELINES:
      - Answer strictly based on the context. 
      - If the context mentions specific modules, list them.
      - If the answer is not found in the context, say "I don't know based on the provided documents."
      - Keep it professional and concise.
    `;

    // 5. Generate Answer
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return {
      answer: response.text(),
      source: sourceName
    };

  } catch (err) {
    console.error("❌ QA Service Error Detail:", err.message);
    throw new Error("AI processing failed. Check server logs.");
  }
};

/**
 * Math Helper
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