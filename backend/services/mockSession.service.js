import crypto from "crypto";

// Simple in-memory store. 
// In production, you would use a Database (MongoDB/PostgreSQL).
const sessions = new Map();

export const createInterviewSession = ({ role, difficulty, totalQuestions, jobDescription, resumeText }) => {
  const interviewId = crypto.randomUUID();
  
  const session = {
    interviewId,
    role,
    difficulty,
    totalQuestions: parseInt(totalQuestions) || 5,
    currentQuestion: 1,
    questions: [], // Stores history of questions asked
    answers: [],   // Stores user answers & AI feedback
    jobDescription,
    resumeText,
    createdAt: new Date()
  };

  sessions.set(interviewId, session);
  return session;
};

export const getInterviewSession = (interviewId) => {
  const session = sessions.get(interviewId);
  if (!session) throw new Error("Session not found");
  return session;
};

export const addQuestion = (interviewId, questionText) => {
  const session = getInterviewSession(interviewId);
  session.questions.push(questionText);
  return session;
};

export const addAnswer = (interviewId, answerText, feedbackText) => {
  const session = getInterviewSession(interviewId);
  session.answers.push({ 
    question: session.questions[session.questions.length - 1],
    answer: answerText, 
    feedback: feedbackText 
  });
  
  session.currentQuestion += 1;
  return session;
};

export const isInterviewComplete = (interviewId) => {
  const session = getInterviewSession(interviewId);
  // Complete if we have recorded answers for all planned questions
  return session.answers.length >= session.totalQuestions;
};