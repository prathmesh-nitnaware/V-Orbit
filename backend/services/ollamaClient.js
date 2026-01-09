import axios from "axios";

const OLLAMA_URL = "http://127.0.0.1:11434/api/generate";

export async function callOllama(prompt) {
  try {
    const response = await axios.post(
      OLLAMA_URL,
      {
        model: "llama3",
        prompt,
        stream: false, // 🔥 IMPORTANT
        options: {
          temperature: 0.7,
        },
      },
      {
        timeout: 300000, // 5 minutes
      }
    );

    return response.data.response;
  } catch (error) {
    console.error("❌ Ollama Error");
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
    throw new Error("Failed to communicate with Ollama");
  }
}
