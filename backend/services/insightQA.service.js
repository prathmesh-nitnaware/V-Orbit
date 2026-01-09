import { GoogleGenerativeAI } from "@google/generative-ai";
import { documentsStore } from "./insightLoader.service.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function askInsightVIT({ subject = "ALL", question }) {
  let sources = [];

  if (subject === "ALL") {
    sources = [
      ...documentsStore.syllabus,
      ...documentsStore.questionPapers,
      ...documentsStore.questionBank,
    ];
  } else {
    sources = documentsStore[subject] || [];
  }

  if (!sources.length) {
    return {
      answer: "No official documents found for this subject.",
      source: null,
    };
  }

  const context = sources
    .map(
      (doc) =>
        `SOURCE: ${doc.source}\nCONTENT:\n${doc.text.slice(0, 3000)}`
    )
    .join("\n\n");

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are Insight-VIT, an academic oracle.
Answer ONLY using the provided sources.
If the answer is not present, say:
"I could not find this in official VIT records."

${context}

QUESTION:
${question}

Return:
- Clear answer
- Source file name
`;

  const result = await model.generateContent(prompt);
  const response = await result.response.text();

  return {
    answer: response,
    source: "Official VIT Documents (GCS)",
  };
}
