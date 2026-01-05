import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ResumeScorer from "./pages/ResumeScorer";
import InsightVIT from "./pages/InsightVIT";

export default function App() {
  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resume-scorer" element={<ResumeScorer />} />
          <Route path="/insight" element={<InsightVIT />} />
        </Routes>
      </div>
    </>
  );
}
