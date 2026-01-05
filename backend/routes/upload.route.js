import express from "express";
import { upload } from "../middlewares/upload.middleware.js";
import { extractTextFromImage } from "../services/ocr.service.js";

const router = express.Router();

router.post("/resume", upload.single("file"), async (req, res) => {
  try {
    const text = await extractTextFromImage(req.file.path);
    res.json({ extractedText: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OCR failed" });
  }
});

export default router;
