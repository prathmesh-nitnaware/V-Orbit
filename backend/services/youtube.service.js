import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3/search";

export const fetchYouTubeVideo = async (query) => {
  if (!YOUTUBE_API_KEY) {
    console.warn("⚠️ No YOUTUBE_API_KEY found. Skipping video fetch.");
    return null;
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        part: "snippet",
        maxResults: 1,
        q: query + " tutorial engineering", // Add context keywords
        type: "video",
        key: YOUTUBE_API_KEY,
      },
    });

    if (response.data.items.length > 0) {
      const video = response.data.items[0];
      return {
        title: video.snippet.title,
        videoId: video.id.videoId,
        thumbnail: video.snippet.thumbnails.medium.url,
        url: `https://www.youtube.com/watch?v=${video.id.videoId}`
      };
    }
    return null;
  } catch (error) {
    console.error("❌ YouTube API Error:", error.message);
    return null;
  }
};