import { callOllama } from "./ollamaClient.js";

export async function generateInterviewQuestion({
  role,
  difficulty,
  questionNumber,
  totalQuestions,
}) {
  const prompt = `
You are a professional technical interviewer.

Ask ONE ${difficulty} interview question for the role of ${role}.
This is question ${questionNumber} of ${totalQuestions}.
Do NOT include explanations.
Return only the question.
`;

  try {
    const question = await callOllama(prompt);

    if (!question || question.length < 10) {
      throw new Error("Empty question generated");
    }

    return question.trim();
  } catch (err) {
    console.error("❌ Question Generation Failed:", err.message);
    throw new Error("Failed to generate interview question");
  }
}
