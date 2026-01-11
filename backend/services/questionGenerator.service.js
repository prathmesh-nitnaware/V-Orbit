import axios from "axios";

// Ollama Configuration
const OLLAMA_URL = "http://127.0.0.1:11434/api/generate";
const MODEL_NAME = "mistral"; // Or "llama3"

export const generateInterviewQuestion = async ({ 
  role, 
  difficulty, 
  questionNumber, 
  totalQuestions, 
  jobDescription, 
  resumeText,
  previousAnswer
}) => {

  const contextPrompt = `
    You are a professional Technical Interviewer conducting a live video interview.
    
    Candidate Role: ${role}
    Difficulty: ${difficulty}
    Question: ${questionNumber} of ${totalQuestions}
    
    Job Context: ${jobDescription ? jobDescription.slice(0, 300) : "General Software Engineering"}
    Resume Snippet: ${resumeText ? resumeText.slice(0, 300) : "N/A"}
    ${previousAnswer ? `Candidate's Previous Answer: "${previousAnswer}"` : ""}

    Your Goal:
    Ask ONE clear, concise technical or behavioral question relevant to the role.
    If there was a previous answer, acknowledge it briefly before moving on.
    Do NOT write "Here is the question" or "Question:". Just output the question text.
  `;

  try {
    const response = await axios.post(OLLAMA_URL, {
      model: MODEL_NAME,
      prompt: contextPrompt,
      stream: false
    });

    let question = response.data.response.trim();
    // Cleanup simple formatting issues
    question = question.replace(/^"|"$/g, ''); 
    return question;

  } catch (error) {
    console.error("❌ Ollama Question Gen Error:", error.message);
    return `Can you describe a challenging project you worked on as a ${role}?`; // Fallback
  }
};