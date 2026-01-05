import fetch from "node-fetch";

const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

export const analyzeResumeWithAI = async (resumeText, jdText) => {
  const prompt = `
You are an ATS resume evaluator.

Analyze the RESUME against the JOB DESCRIPTION.

Return ONLY valid JSON in this exact format.
Do NOT add markdown, backticks, or explanations.

{
  "atsScore": number,
  "jdMatchPercentage": number,
  "missingSkills": string[],
  "suggestions": string[]
}

RESUME:
${resumeText}

JOB DESCRIPTION:
${jdText}
`;

  const response = await fetch(MISTRAL_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "mistral-large-latest",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2
    })
  });

  const data = await response.json();

  let content = data.choices[0].message.content;

  // 🔥 CRITICAL FIX: Strip markdown fences safely
  content = content
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(content);
  } catch (err) {
    console.error("AI RAW RESPONSE:", content);
    throw new Error("AI returned invalid JSON");
  }
};
