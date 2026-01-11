import axios from "axios";

const OLLAMA_URL = "http://127.0.0.1:11434/api/generate";
const MODEL_NAME = "mistral";

export const evaluateAnswer = async ({ role, difficulty, question, answer }) => {
  
  const prompt = `
    You are evaluating a candidate's spoken answer in a live interview.
    
    Role: ${role}
    Question: "${question}"
    Candidate's Answer (Transcribed from Voice): "${answer}"

    Task:
    Provide brief, constructive feedback (2-3 sentences).
    - Did they answer the core of the question?
    - Was the communication clear?
    - Any technical corrections?

    Output strictly plain text feedback. Do not use Markdown or JSON.
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
    return "Feedback unavailable due to AI service connection.";
  }
};