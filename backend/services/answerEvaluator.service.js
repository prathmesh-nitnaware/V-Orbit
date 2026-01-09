import { callOllama } from "./ollamaClient.js";

export async function evaluateAnswer({
  role,
  difficulty,
  question,
  answer,
}) {
  const prompt = `
You are an interview evaluator.

Role: ${role}
Difficulty: ${difficulty}

Question:
${question}

Candidate Answer:
${answer}

Give:
1. Short feedback (2–3 lines)
2. Score out of 10

Format:
Feedback:
Score:
`;

  try {
    const feedback = await callOllama(prompt);
    return feedback.trim();
  } catch (err) {
    console.error("❌ Answer Evaluation Failed");
    throw new Error("Failed to evaluate answer");
  }
}
