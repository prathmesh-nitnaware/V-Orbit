import * as googleTTS from 'google-tts-api';

export const generateAudioUrl = async (text) => {
  try {
    // 1. Generate the audio URL (valid for ~30 mins)
    const url = googleTTS.getAudioUrl(text, {
      lang: 'en',
      slow: false,
      host: 'https://translate.google.com',
    });
    
    return url; // Returns a direct link to the MP3 file
  } catch (error) {
    console.error("❌ TTS Error:", error);
    return null;
  }
};