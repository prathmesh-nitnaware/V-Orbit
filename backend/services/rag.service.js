import { Storage } from "@google-cloud/storage";
import pdfParse from "pdf-parse";
import { GoogleGenerativeAI } from "@google/generative-ai";
import similarity from "compute-cosine-similarity";
import dotenv from "dotenv";

dotenv.config();

// Initialize AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

// Initialize Storage (Lazy Load)
const storage = new Storage();
const getBucket = () => {
  const bucketName = process.env.INSIGHT_BUCKET_NAME;
  if (!bucketName) throw new Error("❌ INSIGHT_BUCKET_NAME is missing in .env");
  return storage.bucket(bucketName);
};

// In-memory Vector Store
let vectorStore = [];

// 1. Load and Embed Documents
export const loadDocuments = async () => {
  try {
    const bucket = getBucket(); // <--- Initialize here safely
    console.log(`☁️ Connecting to GCS Bucket: ${bucket.name}...`);
    
    const [files] = await bucket.getFiles();
    const pdfFiles = files.filter(f => f.name.endsWith('.pdf'));

    if (pdfFiles.length === 0) {
      console.log("⚠️ No PDFs found in the bucket.");
      return;
    }

    console.log(`📚 Found ${pdfFiles.length} PDFs. Indexing...`);
    vectorStore = []; 

    for (const file of pdfFiles) {
      const [buffer] = await file.download();
      const data = await pdfParse(buffer);
      const text = data.text;
      const chunks = text.match(/[\s\S]{1,500}/g) || [];

      for (const chunk of chunks) {
        const result = await model.embedContent(chunk);
        vectorStore.push({
          text: chunk,
          embedding: result.embedding.values,
          source: file.name
        });
      }
      console.log(`   Processed: ${file.name}`);
    }
    console.log(`✅ Indexed ${vectorStore.length} chunks.`);
    
  } catch (error) {
    console.error("❌ Error loading docs:", error.message);
  }
};

// 2. Search Logic
export const searchSyllabus = async (query, subject) => {
  if (vectorStore.length === 0) return [];

  const result = await model.embedContent(query);
  const queryEmbedding = result.embedding.values;

  const relevantStore = subject 
    ? vectorStore.filter(doc => doc.source.toLowerCase().includes(subject.toLowerCase()))
    : vectorStore;

  if (relevantStore.length === 0) return [];

  const results = relevantStore.map(doc => ({
    ...doc,
    similarity: similarity(queryEmbedding, doc.embedding)
  }));

  return results.sort((a, b) => b.similarity - a.similarity).slice(0, 3);
};