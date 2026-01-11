import axios from "axios";

const OLLAMA_URL = "http://127.0.0.1:11434/api/generate";
const MODEL_NAME = "mistral"; // Or "llama3"

export const generateInterviewQuestion = async ({ 
  role, 
  difficulty, 
  questionNumber, 
  totalQuestions, 
  jobDescription, 
  resumeText 
}) => {

  const prompt = `
    You are a professional Technical Interviewer. 
    Generate Question #${questionNumber} of ${totalQuestions} for a candidate applying for the role of ${role}.
    Difficulty Level: ${difficulty}.

    Context (Job Description): ${jobDescription ? jobDescription.slice(0, 300) + "..." : "General Role"}
    Context (Candidate Resume): ${resumeText ? resumeText.slice(0, 300) + "..." : "Not provided"}

    Guidelines:
    - If this is question 1, ask a relevant introductory or conceptual question.
    - If it's a later question, dig deeper into technical problem solving.
    - Keep the question clear, concise, and professional.
    - OUTPUT ONLY THE QUESTION TEXT. No "Here is the question" or extra commentary.
  `;

  try {
    const response = await axios.post(OLLAMA_URL, {
      model: MODEL_NAME,
      prompt: prompt,
      stream: false
    });

    return response.data.response.trim();
  } catch (error) {
    console.error("❌ Ollama Gen Question Error:", error.message);
    return `Could you explain a key concept related to ${role}?`; // Fallback
  }
};