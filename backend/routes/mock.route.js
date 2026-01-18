import express from "express";
import fs from "fs";
import pdfParse from "pdf-parse";
import Groq from "groq-sdk";
import * as googleTTS from "google-tts-api";
import Sentiment from "sentiment"; // <--- NEW IMPORT
import { Interview } from "../models/Interview.js";
import { upload } from "../upload.middleware.js"; 
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const sentiment = new Sentiment(); // <--- Initialize Sentiment

// --- Helper: Generate Audio URL ---
const getAudioUrl = (text) => {
  try {
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

    // A. Extract Resume Text
    if (req.file) {
      const pdfBuffer = fs.readFileSync(req.file.path);
      const pdfData = await pdfParse(pdfBuffer);
      resumeText = pdfData.text.replace(/\s+/g, " ").trim();
      fs.unlinkSync(req.file.path); // Cleanup
    }

    // B. Generate Question 1
    const prompt = `
      You are a technical interviewer for a ${role} position.
      Difficulty: ${difficulty}.
      
      RESUME CONTEXT:
      ${resumeText.substring(0, 3000)}

      TASK:
      Identify a key TECHNICAL SKILL from the resume (e.g., React, Python, SQL).
      Ask a specific technical question about that skill.
      Output ONLY the question text.
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
    });

    const question = completion.choices[0].message.content.replace(/^"|"$/g, '').trim();

    // C. Save Session
    const newInterview = new Interview({
      role,
      difficulty,
      totalQuestions: parseInt(totalQuestions) || 3,
      currentQuestionIndex: 1,
      resumeContext: resumeText,
      history: [{ question, userAnswer: "", feedback: "", score: 0 }]
    });
    
    await newInterview.save();

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

// --- 2. SUBMIT ANSWER & NEXT QUESTION (WITH NLP ANALYSIS) ---
router.post("/answer", async (req, res) => {
  try {
    const { interviewId, answer } = req.body;
    const interview = await Interview.findById(interviewId);
    
    if (!interview) return res.status(404).json({ error: "Session not found" });

    // --- NLP ANALYSIS LOGIC ---
    // 1. Detect Filler Words (um, uh, like, etc.)
    const fillers = (answer.match(/\b(um|uh|like|basically|actually|literally)\b/gi) || []).length;
    
    // 2. Analyze Sentiment (Score: -5 to +5)
    const sentimentResult = sentiment.analyze(answer);
    const sentimentScore = sentimentResult.score;

    // 3. Calculate Confidence Level
    // Simple Heuristic: High sentiment & low fillers = High Confidence
    let confidence = "Neutral";
    if (sentimentScore > 1 && fillers < 2) confidence = "High";
    else if (sentimentScore < 0 || fillers > 3) confidence = "Low";

    // 4. Update the current history entry
    const currentIndex = interview.currentQuestionIndex - 1;
    if (interview.history[currentIndex]) {
      interview.history[currentIndex].userAnswer = answer;
      interview.history[currentIndex].fillerCount = fillers;
      interview.history[currentIndex].sentimentScore = sentimentScore;
      interview.history[currentIndex].confidence = confidence;
    }

    // --- END INTERVIEW CHECK ---
    if (interview.currentQuestionIndex >= interview.totalQuestions) {
      
      // Create a summary stats for the AI Prompt
      const totalFillers = interview.history.reduce((acc, curr) => acc + (curr.fillerCount || 0), 0);
      const avgSentiment = interview.history.reduce((acc, curr) => acc + (curr.sentimentScore || 0), 0) / interview.totalQuestions;

      const feedbackPrompt = `
        You are a Hiring Manager.
        Role: ${interview.role}
        
        Candidate Speech Analysis:
        - Total Filler Words Used: ${totalFillers}
        - Average Sentiment Score: ${avgSentiment.toFixed(1)} (Positive > 0, Negative < 0)
        
        Review the interview answers below. Provide a Hiring Recommendation.
        Strictly format as:
        1. Technical Analysis
        2. Communication Style (Reference the fillers/sentiment)
        3. Final Decision (Hire/No Hire)
      `;

      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: feedbackPrompt }],
        model: "llama-3.3-70b-versatile",
      });

      const finalFeedback = completion.choices[0].message.content;
      interview.save(); // Save final state
      
      return res.json({ isLast: true, feedback: finalFeedback, message: "Interview Complete!" });
    }

    // --- GENERATE NEXT QUESTION ---
    const nextIndex = interview.currentQuestionIndex + 1;
    let nextPrompt = "";

    if (nextIndex === 2) {
      // Q2: Project Based
      const resumeSnippet = interview.resumeContext || ""; 
      nextPrompt = `
        You are interviewing for ${interview.role}.
        RESUME: ${resumeSnippet.substring(0, 3000)}
        
        TASK:
        Find a PROJECT mentioned in the resume.
        Ask a specific question about that project (e.g., "Tell me about the challenges you faced in [Project Name]").
        Output ONLY the question.
      `;
    } else {
      // Q3+: DSA / General
      nextPrompt = `
        You are interviewing for ${interview.role}.
        TASK:
        Ask a Data Structures & Algorithms (DSA) or System Design question appropriate for ${interview.difficulty} level.
        Output ONLY the question.
      `;
    }

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: nextPrompt }],
      model: "llama-3.3-70b-versatile",
    });

    const nextQ = completion.choices[0].message.content.replace(/^"|"$/g, '').trim();

    // Push new question slot
    interview.history.push({ question: nextQ, userAnswer: "", feedback: "", score: 0 });
    interview.currentQuestionIndex += 1;
    await interview.save();

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

// --- 3. GET INTERVIEW HISTORY (WITH NLP STATS) ---
router.get("/history", async (req, res) => {
  try {
    const interviews = await Interview.find()
      .sort({ createdAt: -1 })
      .limit(10);

    const totalInterviews = await Interview.countDocuments();
    
    const history = interviews.map(i => {
      // Calculate Average Metrics from History
      const totalQs = i.history.length || 1;
      const avgSentiment = i.history.reduce((acc, curr) => acc + (curr.sentimentScore || 0), 0) / totalQs;
      const totalFillers = i.history.reduce((acc, curr) => acc + (curr.fillerCount || 0), 0);

      // AI Scoring Algorithm (0-100)
      // Base: 70
      // + Sentiment * 5 (Max +25)
      // - Fillers * 2 (Max -20)
      let calculatedScore = 70 + (avgSentiment * 5) - (totalFillers * 2);
      
      // Clamp Score between 0 and 100
      calculatedScore = Math.min(Math.max(calculatedScore, 10), 100);

      return {
        id: i._id,
        role: i.role,
        date: i.createdAt,
        score: Math.round(calculatedScore), 
        sentiment: avgSentiment.toFixed(1), // Send sentiment for the graph
        fillers: totalFillers
      };
    });

    res.json({ totalInterviews, history });

  } catch (error) {
    console.error("❌ History Error:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

export default router;