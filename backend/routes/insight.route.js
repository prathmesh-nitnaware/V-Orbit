import express from "express";
import path from "path";
import fs from "fs";

import { documentsStore } from "../services/insightLoader.service.js";
import { answerFromDocuments } from "../services/insightQA.service.js";

const router = express.Router();

/**
 * Ask Insight-VIT
 */
router.post("/ask", async (req, res) => {
  const { subject, question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Question is required" });
  }

  let docs = [
    ...documentsStore.syllabus,
    ...documentsStore.questionPapers,
    ...documentsStore.questionBank,
  ];

  if (subject && subject !== "ALL") {
    docs = docs.filter(doc =>
      doc.source.toLowerCase().includes(subject.toLowerCase())
    );
  }

  if (docs.length === 0) {
    return res.json({
      answer: "I could not find this in official VIT records.",
      source: "",
    });
  }

  const result = await answerFromDocuments(question, docs);
  res.json(result);
});

/**
 * PDF Preview endpoint
 */
router.get("/pdf/:filename", (req, res) => {
  const { filename } = req.params;

  const baseDir = path.resolve("insight-data");
  const folders = ["syllabus", "question-papers", "question-bank"];

  for (const folder of folders) {
    const filePath = path.join(baseDir, folder, filename);
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
  }

  res.status(404).json({ error: "PDF not found" });
});

export default router;
