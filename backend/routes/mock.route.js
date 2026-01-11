import express from "express";
import {
  createInterviewSession,
  getInterviewSession,
  addQuestion,
  addAnswer,
  isInterviewComplete,
} from "../services/mockSession.service.js";
import { generateInterviewQuestion } from "../services/questionGenerator.service.js";
import { evaluateAnswer } from "../services/answerEvaluator.service.js";
import { generateAudioUrl } from "../services/tts.service.js"; // <--- IMPORT THIS

const router = express.Router();

// --- 1. START SESSION ---
router.post("/start", async (req, res) => {
  try {
    const { role, difficulty, totalQuestions, jobDescription, resumeText } = req.body;

    const session = createInterviewSession({
      role,
      difficulty,
      totalQuestions,
      jobDescription,
      resumeText,
    });

    const firstQuestion = await generateInterviewQuestion({
      role,
      difficulty,
      questionNumber: 1,
      totalQuestions,
      jobDescription,
      resumeText,
    });

    addQuestion(session.interviewId, firstQuestion);

    // --- GENERATE AUDIO ---
    const audioUrl = await generateAudioUrl(firstQuestion);

    res.json({
      interviewId: session.interviewId,
      questionNumber: 1,
      question: firstQuestion,
      audioUrl: audioUrl, // <--- SEND AUDIO URL
    });
  } catch (error) {
    console.error("Start Interview Error:", error);
    res.status(500).json({ error: "Failed to start interview" });
  }
});

// --- 2. PROCESS ANSWER ---
router.post("/answer", async (req, res) => {
  try {
    const { interviewId, answer } = req.body;
    
    const session = getInterviewSession(interviewId);
    if (!session) return res.status(404).json({ error: "Session not found" });

    const currentQuestion = session.questions[session.questions.length - 1];

    const feedback = await evaluateAnswer({
      role: session.role,
      difficulty: session.difficulty,
      question: currentQuestion,
      answer,
    });

    addAnswer(interviewId, answer, feedback);

    if (isInterviewComplete(interviewId)) {
      return res.json({
        isLast: true,
        feedback: session.answers.map(a => a.feedback).join("\n\n---\n\n"),
        message: "Interview Complete! Great effort.",
      });
    }

    const nextQuestion = await generateInterviewQuestion({
      role: session.role,
      difficulty: session.difficulty,
      questionNumber: session.currentQuestion + 1,
      totalQuestions: session.totalQuestions,
      jobDescription: session.jobDescription,
      resumeText: session.resumeText,
      previousAnswer: answer 
    });

    addQuestion(interviewId, nextQuestion);

    // --- GENERATE AUDIO FOR NEXT QUESTION ---
    const audioUrl = await generateAudioUrl(nextQuestion);

    res.json({
      isLast: false,
      feedback,
      question: nextQuestion,
      questionNumber: session.currentQuestion,
      audioUrl: audioUrl // <--- SEND AUDIO URL
    });

  } catch (error) {
    console.error("Answer Processing Error:", error);
    res.status(500).json({ error: "Failed to process answer" });
  }
});

export default router;