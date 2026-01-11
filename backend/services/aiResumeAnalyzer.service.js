import axios from "axios";

// Configuration
const OLLAMA_URL = "http://127.0.0.1:11434/api/generate";
const MODEL_NAME = "mistral"; // Change to "llama3" if you prefer

export const analyzeResumeWithOllama = async (resumeText, jdText) => {
  
  const prompt = `
    You are an expert Application Tracking System (ATS).
    Analyze the RESUME below against the JOB DESCRIPTION (JD).

    RESUME TEXT:
    ${resumeText}

    JOB DESCRIPTION:
    ${jdText}

    Return a JSON object with these exact keys:
    {
      "atsScore": (integer between 0-100),
      "jdMatchPercentage": (integer between 0-100),
      "missingSkills": ["skill1", "skill2"],
      "suggestions": ["advice1", "advice2"]
    }
    
    Do not include any explanation, only the JSON object.
  `;

  try {
    console.log(`🤖 Sending request to Ollama (${MODEL_NAME})...`);
    
    const response = await axios.post(OLLAMA_URL, {
      model: MODEL_NAME,
      prompt: prompt,
      stream: false,
      format: "json" // 🟢 Forces Ollama to output valid JSON
    });

    // Ollama returns the text in response.data.response
    const rawData = response.data.response;
    
    // Parse the JSON
    const parsedData = JSON.parse(rawData);
    return parsedData;

  } catch (error) {
    console.error("❌ Ollama Service Error:", error.message);
    
    // Fallback if Ollama is down or fails
    return {
      atsScore: 0,
      jdMatchPercentage: 0,
      missingSkills: ["Error connecting to local AI"],
      suggestions: ["Please ensure Ollama is running (ollama serve)"]
    };
  }
};