import { visionClient } from "../config/google.config.js";

export const extractTextFromImage = async (filePath) => {
  const [result] = await visionClient.textDetection(filePath);
  const detections = result.textAnnotations;

  if (!detections || detections.length === 0) {
    return "";
  }

  return detections[0].description;
};
