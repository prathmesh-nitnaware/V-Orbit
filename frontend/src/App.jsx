import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ResumeScorer from "./pages/ResumeScorer";
import InsightVIT from "./pages/InsightVIT";

import MockInterview from "./pages/MockInterview";
import MockInterviewLive from "./pages/MockInterviewLive";
import MockInterviewResult from "./pages/MockInterviewResult";

export default function App() {
  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Core */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resume-scorer" element={<ResumeScorer />} />
          <Route path="/insight" element={<InsightVIT />} />

          {/* Mock Interview */}
          <Route path="/mock" element={<Navigate to="/mock-interview" />} />
          <Route path="/mock-interview" element={<MockInterview />} />
          <Route path="/mock/live" element={<MockInterviewLive />} />
          <Route path="/mock/result" element={<MockInterviewResult />} />
        </Routes>
      </div>
    </>
  );
}
