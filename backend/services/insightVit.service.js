import docs from "../data/vit_docs.json" assert { type: "json" };
import { callMistral } from "../config/mistral.config.js";

export const answerAcademicQuery = async (query) => {
  const lowerQuery = query.toLowerCase();

  // 🔎 Simple retrieval (deterministic & safe)
  const relevantDocs = docs.filter(doc =>
    lowerQuery.split(" ").some(word => doc.text.toLowerCase().includes(word))
  );

  if (relevantDocs.length === 0) {
    return {
      answer: "I could not find this information in the official VIT records.",
      source: null
    };
  }

  const context = relevantDocs
    .map(d => `Source: ${d.source}\n${d.text}`)
    .join("\n\n");

  const prompt = `
Answer the question using ONLY the context below.
If the answer is not explicitly present, say:
"I could not find this in the official VIT records."

Context:
${context}

Question:
${query}

Return a concise answer.
`;

  const response = await callMistral(prompt);

  return {
    answer: response,
    source: relevantDocs.map(d => d.source)
  };
};
