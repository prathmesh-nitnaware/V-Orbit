import crypto from "crypto";

const sessions = new Map();

/**
 * CREATE INTERVIEW SESSION
 */
export function createInterviewSession({
  role,
  difficulty,
  totalQuestions,
  jobDescription,
  resumeText,
}) {
  const interviewId = crypto.randomUUID();

  const session = {
    interviewId,
    role,
    difficulty,
    totalQuestions: Number(totalQuestions),
    jobDescription,
    resumeText,
    questions: [],
    answers: [],
    feedback: [],
    currentQuestion: 0, // ✅ starts at 0
  };

  sessions.set(interviewId, session);
  return session;
}

/**
 * GET SESSION
 */
export function getInterviewSession(interviewId) {
  return sessions.get(interviewId);
}

/**
 * ADD QUESTION
 */
export function addQuestion(interviewId, question) {
  const session = sessions.get(interviewId);
  session.questions.push(question);
  session.currentQuestion += 1; // ✅ CRITICAL FIX
}

/**
 * ADD ANSWER + FEEDBACK
 */
export function addAnswer(interviewId, answer, feedback) {
  const session = sessions.get(interviewId);
  session.answers.push(answer);
  session.feedback.push(feedback);
}

/**
 * CHECK COMPLETION
 */
export function isInterviewComplete(interviewId) {
  const session = sessions.get(interviewId);
  return session.answers.length >= session.totalQuestions;
}
