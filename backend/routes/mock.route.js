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

/**
 * START INTERVIEW
 */
router.post("/start", async (req, res) => {
  try {
    const { role, difficulty, totalQuestions, jobDescription, resumeText } =
      req.body;

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

    res.json({
      interviewId: session.interviewId,
      questionNumber: 1,
      question: firstQuestion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to start interview" });
  }
});

/**
 * SUBMIT ANSWER
 */
router.post("/answer", async (req, res) => {
  try {
    const { interviewId, answer } = req.body;
    const session = getInterviewSession(interviewId);

    const question =
      session.questions[session.questions.length - 1];

    const feedback = await evaluateAnswer({
      role: session.role,
      difficulty: session.difficulty,
      question,
      answer,
    });

    addAnswer(interviewId, answer, feedback);

    if (isInterviewComplete(interviewId)) {
      return res.json({
        isLast: true,
        feedback,
      });
    }

    const nextQuestion = await generateInterviewQuestion({
      role: session.role,
      difficulty: session.difficulty,
      questionNumber: session.currentQuestion + 1,
      totalQuestions: session.totalQuestions,
      jobDescription: session.jobDescription,
      resumeText: session.resumeText,
    });

    addQuestion(interviewId, nextQuestion);

    res.json({
      isLast: false,
      feedback,
      question: nextQuestion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process answer" });
  }
});

export default router;
