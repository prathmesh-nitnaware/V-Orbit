import fs from "fs";
import path from "path";
import pdf from "pdf-parse";

const BASE_DIR = path.resolve(process.cwd(), "insight-data");

export const documentsStore = {
  syllabus: [],
  questionPapers: [],
  questionBank: [],
};

async function loadFromFolder(relativePath, bucket) {
  const folderPath = path.join(BASE_DIR, relativePath);

  console.log(`🔍 Scanning: ${folderPath}`);

  if (!fs.existsSync(folderPath)) {
    console.warn(`⚠️ Folder not found: ${folderPath}`);
    return;
  }

  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    if (!file.toLowerCase().endsWith(".pdf")) continue;

    const fullPath = path.join(folderPath, file);
    const buffer = fs.readFileSync(fullPath);
    const parsed = await pdf(buffer);

    documentsStore[bucket].push({
      source: file,
      text: parsed.text.replace(/\s+/g, " ").trim(),
    });

    console.log(`✅ Loaded: ${file}`);
  }
}

export async function loadDocuments() {
  console.log("📚 Loading Insight-VIT documents...");

  await loadFromFolder("syllabus", "syllabus");
  await loadFromFolder("question-papers", "questionPapers");
  await loadFromFolder("question-bank", "questionBank");

  console.log("✅ Insight-VIT documents loaded:", {
    syllabus: documentsStore.syllabus.length,
    questionPapers: documentsStore.questionPapers.length,
    questionBank: documentsStore.questionBank.length,
  });
}
