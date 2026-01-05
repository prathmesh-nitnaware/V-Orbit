import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";

/**
 * Central in-memory store
 */
export const DOCUMENT_STORE = {
  syllabus: [],
  questionPapers: [],
  questionBank: [],
};

async function loadFolder(folderName, targetArray) {
  const folderPath = path.resolve("data", folderName);

  if (!fs.existsSync(folderPath)) {
    console.warn(`⚠️ Folder not found: ${folderPath}`);
    return;
  }

  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    if (!file.toLowerCase().endsWith(".pdf")) continue;

    const fullPath = path.join(folderPath, file);
    const buffer = fs.readFileSync(fullPath);
    const parsed = await pdfParse(buffer);

    targetArray.push({
      source: file,
      text: parsed.text.replace(/\s+/g, " ").trim(),
    });
  }
}

/**
 * Load ALL Insight-VIT documents ONCE
 */
export async function loadAllDocuments() {
  console.log("📚 Loading Insight-VIT documents...");

  DOCUMENT_STORE.syllabus = [];
  DOCUMENT_STORE.questionPapers = [];
  DOCUMENT_STORE.questionBank = [];

  await loadFolder("syllabus", DOCUMENT_STORE.syllabus);
  await loadFolder("question-papers", DOCUMENT_STORE.questionPapers);
  await loadFolder("question-bank", DOCUMENT_STORE.questionBank);

  console.log("✅ Insight-VIT documents loaded:");
  console.log({
    syllabus: DOCUMENT_STORE.syllabus.length,
    questionPapers: DOCUMENT_STORE.questionPapers.length,
    questionBank: DOCUMENT_STORE.questionBank.length,
  });
}
