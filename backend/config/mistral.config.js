import fetch from "node-fetch";

export const callMistral = async (prompt) => {
  const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`
    },
    body: JSON.stringify({
      model: "mistral-small",
      messages: [
        { role: "system", content: "You are a technical interviewer." },
        { role: "user", content: prompt }
      ],
      temperature: 0.4
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
};
