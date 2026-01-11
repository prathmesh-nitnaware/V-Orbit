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

const router = express.Router();

// --- 1. START SESSION ---
router.post("/start", async (req, res) => {
  try {
    const { role, difficulty, totalQuestions, jobDescription, resumeText } = req.body;

    // Create session in memory
    const session = createInterviewSession({
      role,
      difficulty,
      totalQuestions,
      jobDescription,
      resumeText,
    });

    // Generate Question #1
    const firstQuestion = await generateInterviewQuestion({
      role,
      difficulty,
      questionNumber: 1,
      totalQuestions,
      jobDescription,
      resumeText,
    });

    addQuestion(session.interviewId, firstQuestion);

    res.json({
      interviewId: session.interviewId,
      questionNumber: 1,
      question: firstQuestion,
    });
  } catch (error) {
    console.error("Start Interview Error:", error);
    res.status(500).json({ error: "Failed to start interview" });
  }
});

// --- 2. PROCESS ANSWER (Voice Transcript comes here) ---
router.post("/answer", async (req, res) => {
  try {
    const { interviewId, answer } = req.body;
    
    // Retrieve session
    const session = getInterviewSession(interviewId);
    if (!session) return res.status(404).json({ error: "Session not found" });

    const currentQuestion = session.questions[session.questions.length - 1];

    // AI Evaluation of the answer
    const feedback = await evaluateAnswer({
      role: session.role,
      difficulty: session.difficulty,
      question: currentQuestion,
      answer,
    });

    // Save answer & feedback
    addAnswer(interviewId, answer, feedback);

    // CHECK: Are we done?
    if (isInterviewComplete(interviewId)) {
      return res.json({
        isLast: true,
        feedback: session.answers.map(a => a.feedback).join("\n\n---\n\n"), // Compile all feedback
        message: "Interview Complete! Great effort.",
      });
    }

    // GENERATE NEXT QUESTION
    const nextQuestion = await generateInterviewQuestion({
      role: session.role,
      difficulty: session.difficulty,
      questionNumber: session.currentQuestion + 1,
      totalQuestions: session.totalQuestions,
      jobDescription: session.jobDescription,
      resumeText: session.resumeText,
      previousAnswer: answer // Pass previous context for better flow
    });

    addQuestion(interviewId, nextQuestion);

    res.json({
      isLast: false,
      feedback,
      question: nextQuestion,
      questionNumber: session.currentQuestion
    });

  } catch (error) {
    console.error("Answer Processing Error:", error);
    res.status(500).json({ error: "Failed to process answer" });
  }
});

export default router;