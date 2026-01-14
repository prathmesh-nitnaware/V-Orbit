import { GoogleGenerativeAI } from "@google/generative-ai";
import { Storage } from "@google-cloud/storage";
import pdfParse from "pdf-parse";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Initialize Environment
dotenv.config();

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

// In-memory Vector Store (The Brain)
export let vectorStore = [];

/**
 * HELPER: Delay function to prevent hitting Google API Rate Limits
 * Wait 'ms' milliseconds between requests
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * MAIN FUNCTION: Load Documents into Memory
 */
export const loadInsightDocuments = async () => {
  vectorStore = []; // Reset memory on startup
  console.log("🔄 Starting Insight-VIT Document Ingestion...");

  // --- STRATEGY 1: LOAD FROM LOCAL FOLDER (Priority) ---
  // Looks for a 'documents' folder at the project root: V-Orbit/backend/documents
  const localDocsPath = path.join(__dirname, "../../documents"); 
  
  if (fs.existsSync(localDocsPath)) {
    const files = fs.readdirSync(localDocsPath).filter(f => f.toLowerCase().endsWith(".pdf"));
    
    if (files.length > 0) {
      console.log(`📂 Found ${files.length} local PDFs in 'backend/documents'. Processing locally...`);
      
      for (const file of files) {
        console.log(`🔹 Reading local file: ${file}`);
        const buffer = fs.readFileSync(path.join(localDocsPath, file));
        await processPdfBuffer(buffer, file);
        await delay(1000); // 1-second pause to be safe
      }
      
      console.log(`✅ Knowledge Base Ready: ${vectorStore.length} text chunks loaded.`);
      return; // Exit here if local files were found
    }
  }

  // --- STRATEGY 2: GOOGLE CLOUD STORAGE (Fallback) ---
  if (process.env.INSIGHT_BUCKET_NAME) {
    try {
      console.log(`☁️ No local files found. Connecting to GCS Bucket: ${process.env.INSIGHT_BUCKET_NAME}...`);
      
      const storage = new Storage(); // Uses GOOGLE_APPLICATION_CREDENTIALS automatically
      const bucket = storage.bucket(process.env.INSIGHT_BUCKET_NAME);
      const [files] = await bucket.getFiles();

      const pdfFiles = files.filter(f => f.name.toLowerCase().endsWith(".pdf"));
      console.log(`☁️ Found ${pdfFiles.length} PDFs in cloud bucket.`);

      if (pdfFiles.length === 0) {
        console.warn("⚠️ No PDFs found in the bucket.");
        return;
      }

      for (const file of pdfFiles) {
        console.log(`⬇️ Downloading cloud file: ${file.name}...`);
        const [buffer] = await file.download();
        await processPdfBuffer(buffer, file.name);
        
        // Vital delay for Rate Limiting
        await delay(1500); 
      }
      
      console.log(`✅ Knowledge Base Ready: ${vectorStore.length} text chunks loaded.`);

    } catch (err) {
      console.error("❌ Google Cloud Storage Error:", err.message);
      console.log("💡 Tip: Ensure 'service-account.json' is valid and INSIGHT_BUCKET_NAME is correct.");
    }
  } else {
    console.warn("⚠️ No Local 'documents' folder AND no INSIGHT_BUCKET_NAME defined. Database is empty.");
  }
};

/**
 * HELPER: Process PDF Buffer -> Text -> Embeddings
 */
async function processPdfBuffer(buffer, filename) {
  try {
    // 1. Extract Raw Text
    const pdfData = await pdfParse(buffer);
    const text = pdfData.text;

    if (!text || text.trim().length < 50) {
      console.warn(`⚠️ Skipped ${filename} (Text too short or empty)`);
      return;
    }

    // 2. Chunking (Split large text into pieces of ~500 chars)
    // Regex splits by approx 500 characters, respecting spaces where possible
    // INCREASED CHUNK SIZE TO 1200 (Better for Tables/Syllabus)
    const chunks = text.match(/[\s\S]{1,1200}/g) || [];
    console.log(`📄 Parsed ${filename}: ${chunks.length} chunks generated.`);

    // 3. Generate Embeddings for each chunk
    for (const chunk of chunks) {
      // Clean up whitespace
      const cleanChunk = chunk.replace(/\n/g, " ").trim();
      
      if (cleanChunk.length < 50) continue; // Skip noise

      try {
        const result = await embeddingModel.embedContent(cleanChunk);
        const vector = result.embedding.values;

        // 4. Store in Memory
        vectorStore.push({
          text: cleanChunk,
          vector: vector,
          source: filename,
          // Simple tagging logic based on filename
          subject: filename.includes("Syllabus") ? "Syllabus" : 
                   filename.includes("QB") ? "Question Bank" : 
                   "General Resource"
        });
      } catch (apiErr) {
        console.warn(`⚠️ API Error on chunk in ${filename}: ${apiErr.message}`);
        // If we hit a quota limit, wait longer and retry once
        if (apiErr.message.includes("429")) {
            console.log("⏳ Rate limit hit. Waiting 5 seconds...");
            await delay(5000);
        }
      }
    }
  } catch (parseErr) {
    console.error(`❌ PDF Parse Error for ${filename}:`, parseErr.message);
  }
}