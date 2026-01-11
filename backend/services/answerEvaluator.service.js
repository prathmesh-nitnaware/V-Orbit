import axios from "axios";

const OLLAMA_URL = "http://127.0.0.1:11434/api/generate";
const MODEL_NAME = "mistral";

export const evaluateAnswer = async ({ role, difficulty, question, answer }) => {
  
  const prompt = `
    You are evaluating a candidate's answer in a mock interview.
    Role: ${role}
    Difficulty: ${difficulty}

    Question: "${question}"
    Candidate Answer: "${answer}"

    Task:
    Provide brief, constructive feedback (max 3 sentences).
    1. Is the answer correct?
    2. What was good?
    3. What could be improved?

    Output strictly plain text feedback.
  `;

  try {
    const response = await axios.post(OLLAMA_URL, {
      model: MODEL_NAME,
      prompt: prompt,
      stream: false
    });

    return response.data.response.trim();
  } catch (error) {
    console.error("❌ Ollama Evaluation Error:", error.message);
    return "Feedback unavailable due to AI service connection error.";
  }
};