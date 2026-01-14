import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  userId: String,
  role: String,
  difficulty: String,
  totalQuestions: Number,
  currentQuestionIndex: { type: Number, default: 0 },
  resumeContext: { type: String, default: "" }, // <--- NEW: Stores the text from PDF
  history: [
    {
      question: String,
      userAnswer: String,
      feedback: String,
      score: Number
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export const Interview = mongoose.model("Interview", interviewSchema);