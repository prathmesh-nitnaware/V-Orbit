import { GoogleGenerativeAI } from "@google/generative-ai";
import { vectorStore } from "./insightLoader.service.js"; // Import the loaded memory
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

export const askInsightVIT = async ({ subject, question }) => {
  try {
    // 1. Embed the User's Question
    const qResult = await embeddingModel.embedContent(question);
    const qVector = qResult.embedding.values;

    // 2. Perform Semantic Search (Cosine Similarity)
    // Filter by subject if specified (and not ALL)
    let candidates = vectorStore;
    if (subject && subject !== "ALL") {
      candidates = vectorStore.filter(doc => doc.subject === subject || doc.subject === "ALL");
    }

    // Calculate distances
    const scoredDocs = candidates.map(doc => ({
      ...doc,
      score: cosineSimilarity(qVector, doc.vector)
    }));

    // Sort by relevance and take Top 3 chunks
    const topMatches = scoredDocs
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    if (topMatches.length === 0 || topMatches[0].score < 0.5) {
      return { 
        answer: "I couldn't find any relevant information in the official documents.",
        source: null 
      };
    }

    // 3. Construct the RAG Prompt
    const contextText = topMatches.map(m => m.text).join("\n\n");
    const sourceName = topMatches[0].source; // Most relevant source file

    const prompt = `
      You are an academic assistant for VIT students.
      Answer the question strictly based on the context provided below.
      
      CONTEXT (from Official Docs):
      ${contextText}

      QUESTION:
      ${question}

      If the answer is not in the context, say "I don't know based on the provided documents."
      Keep the answer concise and academic.
    `;

    // 4. Generate Answer with Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return {
      answer: response.text(),
      source: sourceName
    };

  } catch (err) {
    console.error("QA Service Error:", err);
    throw new Error("AI processing failed");
  }
};

/**
 * Math Helper: Cosine Similarity between two vectors
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