import { Routes, Route, Navigate } from "react-router-dom";

// Auth & Core Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register"; // New Registration Page
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";   // New Profile Page

// Feature Pages
import InsightVIT from "./pages/InsightVIT";
import ResumeScorer from "./pages/ResumeScorer";

// Mock Interview Pages
import MockInterview from "./pages/MockInterview";
import MockInterviewLive from "./pages/MockInterviewLive";
import MockInterviewResult from "./pages/MockInterviewResult";

export default function App() {
  return (
    <div className="app-container">
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- Protected Core Routes --- */}
        {/* These pages now have internal checks to redirect to /login if not authenticated */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* --- Feature Routes --- */}
        <Route path="/insight" element={<InsightVIT />} />
        <Route path="/resume-scorer" element={<ResumeScorer />} />

        {/* --- Mock Interview Flow --- */}
        <Route path="/mock" element={<Navigate to="/mock-interview" replace />} />
        <Route path="/mock-interview" element={<MockInterview />} />
        <Route path="/mock/live" element={<MockInterviewLive />} />
        <Route path="/mock/result" element={<MockInterviewResult />} />
        
        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}