import { Storage } from "@google-cloud/storage";
import pdfParse from "pdf-parse";

export const documentsStore = {
  syllabus: [],
  questionPapers: [],
  questionBank: [],
};

export async function loadInsightDocuments() {
  const bucketName = process.env.INSIGHT_BUCKET_NAME;

  console.log("📦 Using Insight Bucket:", bucketName);

  if (!bucketName) {
    throw new Error("❌ INSIGHT_BUCKET_NAME is missing in environment");
  }

  const storage = new Storage({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  });

  const bucket = storage.bucket(bucketName);

  console.log("📚 Loading Insight-VIT documents from GCS...");

  const [files] = await bucket.getFiles();

  for (const file of files) {
    if (!file.name.endsWith(".pdf")) continue;

    const [buffer] = await file.download();
    const parsed = await pdfParse(buffer);

    const text = parsed.text || "";
    const name = file.name.toLowerCase();

    if (name.includes("syllabus")) {
      documentsStore.syllabus.push({ text, source: file.name });
    } else if (name.includes("question-paper")) {
      documentsStore.questionPapers.push({ text, source: file.name });
    } else {
      documentsStore.questionBank.push({ text, source: file.name });
    }
  }

  console.log("✅ Insight-VIT documents loaded:", {
    syllabus: documentsStore.syllabus.length,
    questionPapers: documentsStore.questionPapers.length,
    questionBank: documentsStore.questionBank.length,
  });
}
