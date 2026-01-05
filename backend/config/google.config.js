import vision from "@google-cloud/vision";
import { Storage } from "@google-cloud/storage";

// Vision client
export const visionClient = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

// Storage client
export const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
