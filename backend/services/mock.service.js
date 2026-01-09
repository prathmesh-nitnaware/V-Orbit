/**
 * In-memory interview sessions
 * (Replace with DB later if needed)
 */
const sessions = {};

/**
 * Start Interview (FAST RESPONSE)
 */
export async function startInterview({
  role,
  difficulty,
  totalQuestions,
  jd,
  resume,
}) {
  const interviewId = Date.now().toString();

  sessions[interviewId] = {
    role,
    difficulty,
    totalQuestions,
    current: 1,
    history: [],
  };

  return {
    interviewId,
    question: generateQuestion(role, difficulty, 1),
  };
}

/**
 * Submit Answer
 */
export async function submitAnswer({ interviewId, answer }) {
  const session = sessions[interviewId];

  if (!session) {
    throw new Error("Invalid interview session");
  }

  session.history.push(answer);
  session.current++;

  if (session.current > session.totalQuestions) {
    return {
      isLast: true,
      feedback: "Interview completed successfully!",
      summary: {
        role: session.role,
        difficulty: session.difficulty,
        answered: session.history.length,
      },
    };
  }

  return {
    isLast: false,
    feedback: "Good attempt. Here is the next question.",
    question: generateQuestion(
      session.role,
      session.difficulty,
      session.current
    ),
  };
}

/**
 * Deterministic Question Generator (No AI Delay)
 */
function generateQuestion(role, difficulty, index) {
  const bank = {
    Easy: [
      `What is ${role}?`,
      `Explain basic concepts of ${role}.`,
      `Why do you want this role?`,
    ],
    Moderate: [
      `Explain a real-world problem solved using ${role}.`,
      `How do you optimize performance in ${role}?`,
      `Explain a challenge you faced.`,
    ],
    Hard: [
      `Design a scalable system for ${role}.`,
      `Explain trade-offs in architecture decisions.`,
      `Handle failure scenarios in production systems.`,
    ],
  };

  const questions = bank[difficulty] || bank.Easy;
  return questions[(index - 1) % questions.length];
}
