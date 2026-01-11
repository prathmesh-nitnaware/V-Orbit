import crypto from "crypto";

// In-memory store for active interviews
// Structure: { interviewId: { role, difficulty, questions: [], answers: [], ... } }
const sessions = new Map();

export const createInterviewSession = ({ role, difficulty, totalQuestions, jobDescription, resumeText }) => {
  const interviewId = crypto.randomUUID();
  
  const session = {
    interviewId,
    role,
    difficulty,
    totalQuestions: parseInt(totalQuestions) || 3,
    currentQuestion: 1,
    questions: [], // Array of question strings
    answers: [],   // Array of { answer, feedback } objects
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
  session.answers.push({ answer: answerText, feedback: feedbackText });
  
  // Advance question counter
  session.currentQuestion += 1;
  return session;
};

export const isInterviewComplete = (interviewId) => {
  const session = getInterviewSession(interviewId);
  // If we have collected as many answers as total questions, we are done.
  return session.answers.length >= session.totalQuestions;
};