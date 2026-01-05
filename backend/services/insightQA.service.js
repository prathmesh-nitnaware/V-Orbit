import fetch from "node-fetch";

/**
 * Sends question + document context to Mistral AI
 * Answers strictly from provided documents
 */
export async function answerFromDocuments(question, documents) {
  // Limit context size for safety
  const context = documents
    .slice(0, 3)
    .map(
      (doc, idx) =>
        `SOURCE ${idx + 1}: ${doc.source}\n${doc.text}`
    )
    .join("\n\n");

  const response = await fetch(
    "https://api.mistral.ai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral-medium",
        temperature: 0,
        messages: [
          {
            role: "system",
            content:
              "You are Insight-VIT, an academic oracle. Answer ONLY from the given sources. If not found, say you cannot find it in official VIT records.",
          },
          {
            role: "user",
            content: `Context:\n${context}\n\nQuestion:\n${question}`,
          },
        ],
      }),
    }
  );

  const data = await response.json();

  // Safety fallback
  if (!data.choices || !data.choices.length) {
    return {
      answer:
        "I could not find this information in the official VIT records.",
      source: "",
    };
  }

  return {
    answer: data.choices[0].message.content.trim(),
    source: documents[0]?.source || "",
  };
}
