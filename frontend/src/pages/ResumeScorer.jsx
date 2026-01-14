import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // <--- 1. Import Firebase
import { onAuthStateChanged } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ResumeScorer() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // User State

  // --- 2. SECURITY CHECK ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/login"); // Kick out if not logged in
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const [jdText, setJdText] = useState("");
  const [resume, setResume] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Logic ---
  const handleAnalyze = async () => {
    setError("");
    setResult(null);

    if (!resume) {
      setError("Please upload your resume PDF");
      return;
    }

    if (jdText.trim().length < 50) {
      setError("Please paste a valid Job Description (at least 2–3 lines)");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("jdText", jdText);

      const res = await axios.post(
        "http://localhost:3000/api/career/analyze",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setResult(res.data);
    } catch (err) {
      setError("AI analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Styles Injection ---
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      :root {
        --color-primary: #002147; /* Midnight Navy */
        --color-secondary: #708090; /* Slate Gray */
        --color-bg: #F8FAFC; /* Soft White */
        --color-accent: #D4AF37; /* Burnished Gold */
        --color-white: #FFFFFF;
      }

      body { background-color: var(--color-bg); color: #333; font-family: 'Segoe UI', 'Roboto', sans-serif; overflow-x: hidden; }

      /* --- ANIMATIONS --- */
      @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes growBar { from { width: 0; } to { width: 100%; } }

      .animate-entrance { animation: slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }

      /* --- SIDEBAR --- */
      .sidebar-container { background-color: var(--color-primary); height: 100vh; width: 280px; color: var(--color-white); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; z-index: 1000; box-shadow: 4px 0 15px rgba(0, 33, 71, 0.15); }
      .sidebar-header { padding: 2.5rem 2rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
      .sidebar-title { color: var(--color-accent); font-weight: 700; letter-spacing: 1.5px; margin: 0; font-size: 1.6rem; text-transform: uppercase; }
      
      .nav-menu { display: flex; flex-direction: column; padding: 1.5rem 1rem; gap: 0.8rem; flex-grow: 1; }
      .nav-btn { background-color: transparent; color: #B0C4DE; border: none; padding: 0.9rem 1.2rem; transition: all 0.3s ease; text-align: left; font-weight: 500; border-radius: 6px; font-size: 1rem; display: flex; align-items: center; }
      .nav-btn:hover { color: var(--color-white); background-color: rgba(255, 255, 255, 0.05); transform: translateX(5px); }
      .nav-btn.active-btn { background-color: var(--color-accent); color: var(--color-primary); font-weight: 700; box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3); }

      /* User Footer */
      .user-footer { padding: 1.5rem 2rem; background-color: rgba(0, 0, 0, 0.2); display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255, 255, 255, 0.05); }
      .profile-info { display: flex; align-items: center; gap: 12px; cursor: pointer; transition: opacity 0.2s; }
      .profile-info:hover { opacity: 0.8; }
      .settings-icon { color: var(--color-secondary); cursor: pointer; padding: 6px; border-radius: 50%; transition: 0.2s; border: 1px solid transparent; }
      .settings-icon:hover { color: var(--color-accent); border-color: var(--color-accent); }

      /* --- MAIN CONTENT --- */
      .main-content { margin-left: 280px; padding: 3.5rem 4.5rem; min-height: 100vh; }
      .hero-title { color: var(--color-primary); font-weight: 800; margin-bottom: 0.5rem; }
      .hero-sub { color: var(--color-secondary); font-size: 1.1rem; font-weight: 500; }

      /* --- CARD & FORM --- */
      .custom-card { border: none; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04); background: var(--color-white); position: relative; overflow: hidden; }
      .custom-card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: var(--color-primary); }

      .form-label { color: var(--color-primary); font-weight: 700; font-size: 0.85rem; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 0.5rem; }
      .form-control { border: 2px solid #E2E8F0; border-radius: 8px; padding: 1rem; font-size: 1rem; background-color: #F8FAFC; transition: all 0.2s; color: #333; }
      .form-control:focus { border-color: var(--color-primary); box-shadow: 0 0 0 4px rgba(0, 33, 71, 0.1); background-color: #fff; outline: none; }
      .form-control::placeholder { color: #94a3b8; }

      /* GOLD CTA BUTTON */
      .btn-gold { background-color: var(--color-accent); color: var(--color-primary); font-weight: 800; border: none; padding: 1rem 2rem; border-radius: 8px; letter-spacing: 1px; text-transform: uppercase; width: 100%; transition: transform 0.2s, box-shadow 0.2s; margin-top: 1rem; }
      .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3); color: var(--color-primary); }
      .btn-gold:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

      /* RESULT SECTION */
      .score-circle { width: 120px; height: 120px; border-radius: 50%; border: 8px solid var(--color-accent); display: flex; align-items: center; justify-content: center; flex-direction: column; margin: 0 auto; box-shadow: 0 0 20px rgba(212, 175, 55, 0.2); }
      .score-text { font-size: 2.5rem; font-weight: 800; color: var(--color-primary); line-height: 1; }
      .score-label { font-size: 0.8rem; color: var(--color-secondary); text-transform: uppercase; font-weight: 700; }

      .progress-container { height: 10px; background-color: #E2E8F0; border-radius: 5px; overflow: hidden; margin-top: 0.5rem; }
      .progress-fill { height: 100%; background-color: var(--color-primary); border-radius: 5px; animation: growBar 1s ease forwards; }

      .skill-tag { background-color: #FFE4E1; color: #8B0000; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600; margin-right: 0.5rem; margin-bottom: 0.5rem; display: inline-block; }
      .suggestion-item { background-color: #F0F4F8; border-left: 3px solid var(--color-accent); padding: 1rem; margin-bottom: 0.8rem; border-radius: 0 6px 6px 0; font-size: 0.95rem; }

      @media (max-width: 992px) {
        .sidebar-container { width: 80px; align-items: center; }
        .sidebar-header { padding: 1.5rem 0; text-align: center; }
        .sidebar-title { font-size: 0.6rem; }
        .nav-btn span, .profile-info span { display: none; }
        .nav-btn { justify-content: center; padding: 1rem 0; }
        .main-content { margin-left: 80px; padding: 2rem; }
        .user-footer { flex-direction: column; gap: 1rem; padding: 1rem 0; }
      }
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
          <button className="nav-btn" onClick={() => navigate("/lectures")}>
            <span>Lectures</span>
          </button>
        </div>

        <div className="user-footer">
          <div className="profile-info" onClick={() => navigate("/profile")}>
            <svg
              width="36"
              height="36"
              viewBox="0 0 16 16"
              fill="#F8FAFC"
              className="bi bi-person-circle"
            >
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              <path
                fillRule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
              />
            </svg>
            <span className="small fw-bold text-white">
              {user ? user.displayName?.split(" ")[0] : "Student"}
            </span>
          </div>
          <div className="settings-icon" title="Settings">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
              <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="mb-5 animate-entrance">
          <h1 className="display-4 hero-title">Resume Scorer</h1>
          <p className="hero-sub">
            Optimize your CV for the Applicant Tracking System (ATS).
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Input Card */}
            <div
              className="custom-card p-5 animate-entrance"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="mb-4">
                <label className="form-label">Job Description</label>
                <textarea
                  className="form-control"
                  rows="6"
                  placeholder="Paste the full Job Description (JD) here..."
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Upload Resume (PDF)</label>
                <input
                  type="file"
                  accept=".pdf"
                  className="form-control"
                  onChange={(e) => setResume(e.target.files[0])}
                />
              </div>

              {error && (
                <div
                  className="alert alert-danger"
                  style={{ borderRadius: "8px" }}
                >
                  {error}
                </div>
              )}

              <div className="text-end">
                <button
                  className="btn-gold"
                  onClick={handleAnalyze}
                  disabled={loading}
                >
                  {loading ? (
                    <span>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Processing Resume...
                    </span>
                  ) : (
                    "Analyze Resume"
                  )}
                </button>
              </div>
            </div>

            {/* RESULTS SECTION */}
            {result && (
              <div
                className="custom-card p-5 mt-4 animate-entrance"
                style={{ animationDelay: "0.2s" }}
              >
                <h4
                  style={{
                    color: "#002147",
                    fontWeight: "700",
                    marginBottom: "2rem",
                  }}
                >
                  Analysis Result
                </h4>

                <div className="row">
                  <div className="col-md-4 text-center mb-4 mb-md-0 border-end">
                    <div className="score-circle">
                      <span className="score-text">{result.atsScore}</span>
                      <span className="score-label">ATS Score</span>
                    </div>

                    <div className="mt-4 px-4">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="small fw-bold">JD Match</span>
                        <span className="small fw-bold">
                          {result.jdMatchPercentage}%
                        </span>
                      </div>
                      <div className="progress-container">
                        <div
                          className="progress-fill"
                          style={{ width: `${result.jdMatchPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-8 ps-md-5">
                    <div className="mb-4">
                      <h6 className="form-label text-danger">
                        Missing Keywords
                      </h6>
                      <div>
                        {result.missingSkills.map((skill, i) => (
                          <span key={i} className="skill-tag">
                            {skill}
                          </span>
                        ))}
                        {result.missingSkills.length === 0 && (
                          <span className="text-success small fw-bold">
                            No critical skills missing!
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h6 className="form-label" style={{ color: "#D4AF37" }}>
                        AI Recommendations
                      </h6>
                      <div className="mt-2">
                        {result.suggestions.map((s, i) => (
                          <div key={i} className="suggestion-item">
                            {s}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
