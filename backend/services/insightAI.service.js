import fetch from "node-fetch";
import { DOCUMENT_STORE } from "./documentLoader.service.js";

const MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions";

function getDocsByCategory(category) {
  if (category === "A") {
    return [
      ...DOCUMENT_STORE.syllabus,
      ...DOCUMENT_STORE.questionPapers,
      ...DOCUMENT_STORE.questionBank,
    ];
  }
  if (category === "B") return DOCUMENT_STORE.syllabus;
  if (category === "C") return DOCUMENT_STORE.questionPapers;
  if (category === "D") return DOCUMENT_STORE.questionBank;
  return [];
}

export async function askInsightAI(category, question) {
  const docs = getDocsByCategory(category);

  if (!docs.length) {
    return {
      answer: "No documents found for this category.",
      source: "",
    };
  }

  const keyword = question.toLowerCase().split(" ")[0];
  const relevant = docs.filter((d) =>
    d.text.toLowerCase().includes(keyword)
  ).slice(0, 2);

  if (!relevant.length) {
    return {
      answer:
        "I couldn't find this information in the official VIT documents.",
      source: "",
    };
  }

  const context = relevant.map((r) => r.text).join("\n");

  const response = await fetch(MISTRAL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mistral-medium",
      messages: [
        {
          role: "system",
          content:
            "You are Insight-VIT. Answer strictly from the given context only.",
        },
        {
          role: "user",
          content: `Context:\n${context}\n\nQuestion:\n${question}`,
        },
      ],
      temperature: 0,
    }),
  });

  const data = await response.json();

  return {
    answer: data.choices[0].message.content.trim(),
    source: relevant[0].source,
  };
}
