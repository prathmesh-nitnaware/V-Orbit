import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  userId: String,
  role: String,
  difficulty: String,
  totalQuestions: Number,
  currentQuestionIndex: { type: Number, default: 0 },
  resumeContext: { type: String, default: "" },
  history: [
    {
      question: String,
      userAnswer: String,
      feedback: String,
      score: Number,
      // --- NEW ANALYTICS FIELDS ---
      sentimentScore: { type: Number, default: 0 }, // From 'sentiment' library
      fillerCount: { type: Number, default: 0 },    // Count of 'um', 'uh'
      confidence: { type: String, default: "Neutral" } // "High", "Medium", "Low"
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export const Interview = mongoose.model("Interview", interviewSchema);