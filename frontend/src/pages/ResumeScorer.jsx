import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ResumeScorer() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // --- 1. SECURITY CHECK ---
  useEffect(() => {
    const isGuest = localStorage.getItem("userMode") === "guest";
    if (isGuest) {
      setUser({ displayName: "Guest", email: "guest@vorbit.com" });
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) setUser(currentUser);
      else navigate("/login");
    });
    return () => unsubscribe();
  }, [navigate]);

  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- Logic ---
  const handleAnalyze = async () => {
    if (!resumeFile || !jobDescription)
      return alert("Please upload resume and enter JD.");

    setLoading(true);
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);

    try {
      // Ensure backend route matches (api/resume/score)
      const res = await axios.post(
        "http://localhost:3000/api/resume/score",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("AI Analysis Failed. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  // --- Styles Injection ---
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      :root {
        --color-primary: #002147;
        --color-secondary: #708090;
        --color-bg: #F8FAFC;
        --color-accent: #D4AF37;
        --color-white: #FFFFFF;
      }

      body { background-color: var(--color-bg); color: #333; font-family: 'Segoe UI', 'Roboto', sans-serif; overflow-x: hidden; }

      /* Animations */
      @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      .animate-entrance { animation: slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }

      /* Sidebar (Consistent) */
      .sidebar-container { background: var(--color-primary); height: 100vh; width: 280px; position: fixed; top: 0; left: 0; display: flex; flex-direction: column; color: white; z-index: 1000; box-shadow: 4px 0 15px rgba(0, 33, 71, 0.15); }
      .sidebar-header { padding: 2.5rem 2rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
      .sidebar-title { color: var(--color-accent); font-weight: 700; letter-spacing: 1.5px; margin: 0; font-size: 1.6rem; text-transform: uppercase; }
      .nav-menu { padding: 1.5rem 1rem; flex-grow: 1; display: flex; flex-direction: column; gap: 0.8rem; }
      .nav-btn { background: transparent; color: #B0C4DE; border: none; padding: 0.9rem 1.2rem; text-align: left; border-radius: 6px; font-weight: 500; font-size: 1rem; transition: 0.3s; display: flex; align-items: center; }
      .nav-btn:hover { background: rgba(255, 255, 255, 0.05); color: white; transform: translateX(5px); }
      .nav-btn.active-btn { background: var(--color-accent); color: var(--color-primary); font-weight: 700; box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3); }
      .user-footer { padding: 1.5rem 2rem; background: rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.05); }

      /* Main Content */
      .main-content { margin-left: 280px; padding: 3.5rem 4.5rem; min-height: 100vh; }
      .hero-title { color: var(--color-primary); font-weight: 800; margin-bottom: 0.5rem; }
      .hero-sub { color: var(--color-secondary); font-size: 1.1rem; font-weight: 500; }

      /* Card Styles */
      .custom-card { border: none; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04); background: var(--color-white); position: relative; overflow: hidden; }
      .custom-card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: var(--color-primary); }

      .form-label { color: var(--color-primary); font-weight: 700; font-size: 0.85rem; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 0.5rem; }
      .form-control { border: 2px solid #E2E8F0; border-radius: 8px; padding: 1rem; font-size: 1rem; background-color: #F8FAFC; transition: all 0.2s; color: #333; }
      .form-control:focus { border-color: var(--color-primary); box-shadow: 0 0 0 4px rgba(0, 33, 71, 0.1); background-color: #fff; outline: none; }

      .btn-gold { background-color: var(--color-accent); color: var(--color-primary); font-weight: 800; border: none; padding: 1rem 2rem; border-radius: 8px; letter-spacing: 1px; text-transform: uppercase; width: 100%; transition: transform 0.2s, box-shadow 0.2s; margin-top: 1rem; }
      .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3); color: var(--color-primary); }
      .btn-gold:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

      /* RESULT SECTION */
      .score-circle { width: 120px; height: 120px; border-radius: 50%; border: 8px solid var(--color-accent); display: flex; align-items: center; justify-content: center; flex-direction: column; margin: 0 auto; box-shadow: 0 0 20px rgba(212, 175, 55, 0.2); }
      .score-text { font-size: 2.5rem; font-weight: 800; color: var(--color-primary); line-height: 1; }
      .score-label { font-size: 0.8rem; color: var(--color-secondary); text-transform: uppercase; font-weight: 700; }

      .skill-tag { background-color: #fee2e2; color: #991b1b; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600; margin-right: 0.5rem; margin-bottom: 0.5rem; display: inline-block; }
      
      @media (max-width: 992px) { .sidebar-container { display: none; } .main-content { margin-left: 0; padding: 1rem; } }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="container-fluid p-0">
      {/* Sidebar */}
      <div className="sidebar-container">
        <div className="sidebar-header">
          <h2 className="sidebar-title">V-Orbit</h2>
        </div>
        <div className="nav-menu">
          <button className="nav-btn" onClick={() => navigate("/dashboard")}>
            <span>Dashboard</span>
          </button>
          <button className="nav-btn" onClick={() => navigate("/insight")}>
            <span>Insight-VIT</span>
          </button>
          <button
            className="nav-btn"
            onClick={() => navigate("/mock-interview")}
          >
            <span>Mock-V</span>
          </button>
          <button className="nav-btn active-btn">
            <span>Resume Scorer</span>
          </button>
          <button className="nav-btn">
            <span>Lectures</span>
          </button>
        </div>
        <div className="user-footer">
          <div className="profile-info" onClick={() => navigate("/profile")}>
            <div
              className="rounded-circle bg-white d-flex justify-content-center align-items-center"
              style={{
                width: "32px",
                height: "32px",
                color: "#002147",
                fontWeight: "bold",
              }}
            >
              {user ? user.displayName?.charAt(0) : "S"}
            </div>
            <span className="small fw-bold text-white">
              {user ? user.displayName?.split(" ")[0] : "Student"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="mb-5 animate-entrance">
          <h1 className="display-4 hero-title">Resume Scorer</h1>
          <p className="hero-sub">Generate your AI Skill Hologram.</p>
        </div>

        <div className="row g-4">
          {/* LEFT: INPUT */}
          <div
            className="col-lg-5 animate-entrance"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="custom-card p-4 h-100">
              <h5 className="fw-bold mb-4" style={{ color: "#002147" }}>
                Upload Details
              </h5>

              <div className="mb-3">
                <label className="form-label">Job Description</label>
                <textarea
                  className="form-control"
                  rows="6"
                  placeholder="Paste JD here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Resume (PDF)</label>
                <input
                  type="file"
                  className="form-control"
                  accept=".pdf"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />
              </div>

              <button
                className="btn-gold"
                onClick={handleAnalyze}
                disabled={loading}
              >
                {loading ? "Generating Hologram..." : "Analyze Resume"}
              </button>
            </div>
          </div>

          {/* RIGHT: RESULTS (Hologram) */}
          <div
            className="col-lg-7 animate-entrance"
            style={{ animationDelay: "0.2s" }}
          >
            {result ? (
              <div className="custom-card p-4 h-100">
                <div className="row align-items-center h-100">
                  {/* Score & Summary */}
                  <div className="col-md-4 text-center border-end">
                    <div className="score-circle mb-3">
                      <span className="score-text">{result.score}</span>
                      <span className="score-label">Fit Score</span>
                    </div>
                    <p className="text-muted small px-2">"{result.summary}"</p>
                  </div>

                  {/* Radar Chart */}
                  <div className="col-md-8" style={{ height: "350px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="70%"
                        data={result.breakdown}
                      >
                        <PolarGrid />
                        <PolarAngleAxis
                          dataKey="subject"
                          tick={{
                            fill: "#002147",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar
                          name="Candidate"
                          dataKey="A"
                          stroke="#002147"
                          fill="#D4AF37"
                          fillOpacity={0.6}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <hr className="my-4" style={{ borderColor: "#eee" }} />

                <div>
                  <h6 className="fw-bold text-danger mb-3">
                    ⚠️ Missing Skills
                  </h6>
                  {result.missingSkills.length > 0 ? (
                    result.missingSkills.map((skill, i) => (
                      <span key={i} className="skill-tag">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-success fw-bold small">
                      No major skills missing! Great job.
                    </span>
                  )}
                </div>
              </div>
            ) : (
              // Empty State
              <div className="custom-card h-100 d-flex align-items-center justify-content-center text-center p-5">
                <div className="opacity-50">
                  <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>
                    📊
                  </div>
                  <h4 style={{ color: "#002147" }}>Awaiting Data</h4>
                  <p className="text-muted">
                    Upload your resume to see the
                    <br />
                    Skill Hologram visualization.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
