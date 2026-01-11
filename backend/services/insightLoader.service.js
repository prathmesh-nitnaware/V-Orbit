import { GoogleGenerativeAI } from "@google/generative-ai";
import { Storage } from "@google-cloud/storage";
import pdfParse from "pdf-parse";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini for Embeddings
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

// In-memory Vector Store (Simple Array for Prototype)
export let vectorStore = [];

/**
 * LOADS DOCUMENTS INTO MEMORY
 * 1. Tries to load from local 'documents' folder first (Dev mode).
 * 2. If empty, tries Google Cloud Storage (Production mode).
 */
export const loadInsightDocuments = async () => {
  vectorStore = []; // Reset store
  console.log("🔄 Starting Document Ingestion...");

  // 1. Try Local Folder
  const localDocsPath = path.resolve("documents");
  if (fs.existsSync(localDocsPath)) {
    const files = fs.readdirSync(localDocsPath).filter(f => f.endsWith(".pdf"));
    if (files.length > 0) {
      console.log(`📂 Found ${files.length} local PDFs. Processing...`);
      for (const file of files) {
        const buffer = fs.readFileSync(path.join(localDocsPath, file));
        await processPdfBuffer(buffer, file);
      }
      return;
    }
  }

  // 2. Try Google Cloud Storage (if enabled)
  if (process.env.INSIGHT_BUCKET_NAME) {
    try {
      console.log("☁️ Connecting to Google Cloud Storage...");
      const storage = new Storage();
      const bucket = storage.bucket(process.env.INSIGHT_BUCKET_NAME);
      const [files] = await bucket.getFiles();

      console.log(`☁️ Found ${files.length} files in bucket.`);
      
      for (const file of files) {
        if (file.name.endsWith(".pdf")) {
          const [buffer] = await file.download();
          await processPdfBuffer(buffer, file.name);
        }
      }
    } catch (err) {
      console.warn("⚠️ GCS Load Failed (Check credentials). Skipping...");
    }
  }

  console.log(`✅ Knowledge Base Ready: ${vectorStore.length} text chunks loaded.`);
};

/**
 * HELPER: Process a PDF Buffer -> Text -> Chunks -> Embeddings
 */
async function processPdfBuffer(buffer, filename) {
  try {
    // A. Extract Text
    const pdfData = await pdfParse(buffer);
    const text = pdfData.text;

    // B. Chunk Text (Split into manageable pieces for AI)
    // Simple splitting by roughly 500 characters
    const chunks = text.match(/[\s\S]{1,500}/g) || [];

    console.log(`📄 Processing ${filename}: ${chunks.length} chunks`);

    // C. Generate Embeddings for each chunk
    // Note: In production, batch these requests. Here we do serial for simplicity.
    for (const chunk of chunks) {
      if (chunk.trim().length < 50) continue; // Skip empty/short noise

      const result = await embeddingModel.embedContent(chunk);
      const vector = result.embedding.values;

      // D. Store in Memory
      vectorStore.push({
        text: chunk,
        vector: vector,
        source: filename,
        // Simple heuristic: Subject is often in the filename (e.g., "DWM_Syllabus.pdf")
        subject: filename.includes("DWM") ? "DWM" : 
                 filename.includes("AI") ? "AI" : "ALL"
      });
    }
  } catch (err) {
    console.error(`❌ Error processing ${filename}:`, err.message);
  }
}