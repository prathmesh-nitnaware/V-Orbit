import Tesseract from "tesseract.js";

export const extractTextFromImage = async (filePath) => {
  try {
    console.log("🔍 Starting OCR on:", filePath);
    
    const { data: { text } } = await Tesseract.recognize(
      filePath,
      'eng', // Language
      { 
        logger: m => console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`) 
      }
    );

    return text.trim();
  } catch (error) {
    console.error("❌ Tesseract Service Error:", error);
    throw new Error("Failed to extract text from image");
  }
};