import express from "express";
import fs from "fs";
import pdfParse from "pdf-parse";
import Groq from "groq-sdk";
import * as googleTTS from "google-tts-api";
import { Interview } from "../models/Interview.js";
import { upload } from "../upload.middleware.js"; 
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// --- Helper: Generate Audio URL ---
const getAudioUrl = (text) => {
  try {
    // google-tts-api limit: ~200 chars. We truncate safely.
    const safeText = text.length > 200 ? text.substring(0, 200) + "..." : text;
    return googleTTS.getAudioUrl(safeText, {
      lang: "en",
      slow: false,
      host: "https://translate.google.com",
    });
  } catch (e) {
    console.error("TTS Error:", e);
    return ""; 
  }
};

// --- 1. START INTERVIEW (Q1: SKILL BASED) ---
router.post("/start", upload.single("resume"), async (req, res) => {
  try {
    const { role, difficulty, totalQuestions } = req.body;
    let resumeText = "";

    // A. Extract Resume Text (if uploaded)
    if (req.file) {
      const pdfBuffer = fs.readFileSync(req.file.path);
      const pdfData = await pdfParse(pdfBuffer);
      resumeText = pdfData.text.replace(/\s+/g, " ").trim();
      fs.unlinkSync(req.file.path); // Cleanup temp file
    }

    // B. Generate Question 1 (SKILL FOCUSED)
    // We explicitly tell the AI to look at the resume context.
    const prompt = `
      You are a technical interviewer for a ${role} position.
      Difficulty: ${difficulty}.
      
      RESUME CONTEXT:
      ${resumeText.substring(0, 3000)}

      TASK:
      Identify a key TECHNICAL SKILL from the resume (e.g., React, Python, SQL, Java).
      Ask a specific technical question about that skill.
      Output ONLY the question text. Do not include introductory phrases like "Here is a question".
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
    });

    const question = completion.choices[0].message.content.replace(/^"|"$/g, '').trim();

    // C. Save Session to MongoDB
    // We store 'resumeContext' so we can reuse it for Question 2 (Project Based)
    const newInterview = new Interview({
      role,
      difficulty,
      totalQuestions: parseInt(totalQuestions) || 3,
      currentQuestionIndex: 1,
      resumeContext: resumeText, // <--- Important: Saving context for next Qs
      history: [{ question, userAnswer: "", feedback: "", score: 0 }]
    });
    
    await newInterview.save();

    // D. Respond to Frontend
    res.json({
      interviewId: newInterview._id,
      question,
      questionNumber: 1,
      audioUrl: getAudioUrl(question)
    });

  } catch (error) {
    console.error("❌ Mock Start Error:", error);
    res.status(500).json({ error: "Failed to start interview" });
  }
});

// --- 2. SUBMIT ANSWER & GET NEXT QUESTION (LOGIC BRANCHING) ---
router.post("/answer", async (req, res) => {
  try {
    const { interviewId, answer } = req.body;
    
    const interview = await Interview.findById(interviewId);
    if (!interview) return res.status(404).json({ error: "Session not found" });

    // A. Save User's Answer
    const currentIndex = interview.currentQuestionIndex - 1;
    if (interview.history[currentIndex]) {
      interview.history[currentIndex].userAnswer = answer;
    }

    // B. Check if Interview is Complete
    if (interview.currentQuestionIndex >= interview.totalQuestions) {
      // Generate Final Feedback
      const feedbackPrompt = `
        You are a Senior Hiring Manager.
        Role: ${interview.role}
        
        Review the interview answers. Provide a concise Hiring Recommendation.
        Strictly format as:
        1. Key Strengths
        2. Areas for Improvement
        3. Decision (Hire/No Hire)
      `;

      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: feedbackPrompt }],
        model: "llama-3.3-70b-versatile",
      });

      const finalFeedback = completion.choices[0].message.content;
      interview.save(); // Save final state
      
      return res.json({
        isLast: true,
        message: "Interview Complete!",
        feedback: finalFeedback
      });
    }

    // C. Generate NEXT Question (The Logic Branching)
    const nextIndex = interview.currentQuestionIndex + 1;
    let nextPrompt = "";

    if (nextIndex === 2) {
      // --- Q2: PROJECT BASED ---
      // Uses the stored resume context to find a project
      const resumeSnippet = interview.resumeContext || ""; 
      
      nextPrompt = `
        You are interviewing for ${interview.role}.
        RESUME CONTEXT: ${resumeSnippet.substring(0, 3000)}
        
        TASK:
        Find a specific PROJECT mentioned in the resume.
        Ask a deep technical question about that project.
        Examples: "What was the most challenging bug in [Project]?" or "How did you implement authentication in [Project]?"
        Output ONLY the question text.
      `;
    } else {
      // --- Q3+: DSA / SYSTEM DESIGN / GENERAL ---
      // For Q3 and beyond, we switch to general technical competency
      nextPrompt = `
        You are interviewing for a ${interview.role} role.
        Difficulty: ${interview.difficulty}.
        
        TASK:
        Ask a fundamental Data Structures & Algorithms (DSA) question OR a System Design question.
        Ensure it is appropriate for the difficulty level.
        Output ONLY the question text.
      `;
    }

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: nextPrompt }],
      model: "llama-3.3-70b-versatile",
    });

    const nextQ = completion.choices[0].message.content.replace(/^"|"$/g, '').trim();

    // D. Update DB with New Question
    interview.history.push({ question: nextQ, userAnswer: "", feedback: "", score: 0 });
    interview.currentQuestionIndex += 1;
    await interview.save();

    // E. Respond
    res.json({
      isLast: false,
      question: nextQ,
      questionNumber: interview.currentQuestionIndex,
      audioUrl: getAudioUrl(nextQ)
    });

  } catch (error) {
    console.error("❌ Mock Answer Error:", error);
    res.status(500).json({ error: "Failed to process answer" });
  }
});

// --- 3. GET INTERVIEW HISTORY (FOR DASHBOARD) ---
router.get("/history", async (req, res) => {
  try {
    // Fetch last 10 interviews, sorted by newest first
    const interviews = await Interview.find()
      .sort({ createdAt: -1 })
      .limit(10);

    // Calculate total count
    const totalInterviews = await Interview.countDocuments();
    
    // Transform for frontend
    const history = interviews.map(i => ({
      id: i._id,
      role: i.role,
      date: i.createdAt,
      // Mock score logic (random 70-100) since we don't have numeric grading enabled yet
      score: Math.floor(Math.random() * 30) + 70, 
      questionsAnswered: i.history.length
    }));

    res.json({
      totalInterviews,
      history
    });

  } catch (error) {
    console.error("❌ History Error:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

export default router;