import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; 

export default function MockInterview() {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [totalQuestions, setTotalQuestions] = useState(3);
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);

  const startInterview = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:3000/api/mock/start",
        {
          role,
          difficulty,
          totalQuestions,
          jobDescription,
          resumeText,
        }
      );

      navigate("/mock/live", {
        state: {
          interviewId: res.data.interviewId,
          question: res.data.question,
          questionNumber: res.data.questionNumber,
          totalQuestions,
        },
      });
    } catch (err) {
      alert("Failed to start interview. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

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

      body {
        background-color: var(--color-bg);
        color: #333;
        font-family: 'Segoe UI', 'Roboto', sans-serif;
        overflow-x: hidden;
      }

      /* --- ANIMATIONS --- */
      @keyframes slideInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .animate-entrance {
        animation: slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        opacity: 0;
      }

      /* --- SIDEBAR --- */
      .sidebar-container {
        background-color: var(--color-primary);
        height: 100vh;
        width: 280px;
        color: var(--color-white);
        display: flex;
        flex-direction: column;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        box-shadow: 4px 0 15px rgba(0, 33, 71, 0.15);
      }

      .sidebar-header {
        padding: 2.5rem 2rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }

      .sidebar-title {
        color: var(--color-accent);
        font-weight: 700;
        letter-spacing: 1.5px;
        margin: 0;
        font-size: 1.6rem;
        text-transform: uppercase;
      }

      .nav-menu {
        display: flex;
        flex-direction: column;
        padding: 1.5rem 1rem;
        gap: 0.8rem;
        flex-grow: 1;
      }

      .nav-btn {
        background-color: transparent;
        color: #B0C4DE;
        border: none;
        padding: 0.9rem 1.2rem;
        transition: all 0.3s ease;
        text-align: left;
        font-weight: 500;
        border-radius: 6px;
        font-size: 1rem;
        display: flex;
        align-items: center;
      }

      .nav-btn:hover {
        color: var(--color-white);
        background-color: rgba(255, 255, 255, 0.05);
        transform: translateX(5px);
      }

      .nav-btn.active-btn {
        background-color: var(--color-accent);
        color: var(--color-primary);
        font-weight: 700;
        box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
      }

      /* User Footer */
      .user-footer {
        padding: 1.5rem 2rem;
        background-color: rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
      }
      
      .profile-info { 
        display: flex; 
        align-items: center; 
        gap: 12px; 
        cursor: pointer;
        transition: opacity 0.2s;
      }
      .profile-info:hover {
        opacity: 0.8;
      }

      .settings-icon {
        color: var(--color-secondary);
        cursor: pointer; padding: 6px; border-radius: 50%; transition: 0.2s; border: 1px solid transparent;
      }
      .settings-icon:hover { color: var(--color-accent); border-color: var(--color-accent); }

      /* --- MAIN CONTENT --- */
      .main-content {
        margin-left: 280px;
        padding: 3.5rem 4.5rem;
        min-height: 100vh;
      }

      .hero-title { color: var(--color-primary); font-weight: 800; margin-bottom: 0.5rem; }
      .hero-sub { color: var(--color-secondary); font-size: 1.1rem; font-weight: 500; }

      /* --- FORM & CARD STYLES --- */
      .custom-card {
        border: none;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        background: var(--color-white);
        position: relative;
        overflow: hidden;
      }

      .custom-card::before {
        content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: var(--color-primary);
      }

      .form-label {
        color: var(--color-primary);
        font-weight: 700;
        font-size: 0.85rem;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        margin-bottom: 0.5rem;
      }

      .form-control, .form-select {
        border: 2px solid #E2E8F0;
        border-radius: 8px;
        padding: 0.8rem;
        font-size: 1rem;
        transition: border-color 0.2s, box-shadow 0.2s;
        background-color: #F8FAFC;
        color: #333;
      }

      .form-control:focus, .form-select:focus {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 4px rgba(0, 33, 71, 0.1);
        background-color: #fff;
        outline: none;
      }
      
      .form-control::placeholder {
        color: #94a3b8;
      }

      /* GOLD CTA BUTTON */
      .btn-gold {
        background-color: var(--color-accent);
        color: var(--color-primary);
        font-weight: 800;
        border: none;
        padding: 1rem 2rem;
        border-radius: 8px;
        letter-spacing: 1px;
        text-transform: uppercase;
        width: 100%;
        transition: transform 0.2s, box-shadow 0.2s;
        margin-top: 1rem;
      }

      .btn-gold:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
        color: var(--color-primary);
      }
      
      .btn-gold:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
      }

      /* Mobile Responsive */
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
      
      {/* --- SIDEBAR --- */}
      <div className="sidebar-container">
        <div className="sidebar-header">
          <h2 className="sidebar-title">V-Orbit</h2>
        </div>
        
        <div className="nav-menu">
          {/* UPDATED MENU */}
          <button className="nav-btn" onClick={() => navigate("/dashboard")}>
            <span>Dashboard</span>
          </button>
          <button className="nav-btn" onClick={() => navigate("/insight")}>
            <span>Insight-VIT</span>
          </button>
          {/* Active State */}
          <button className="nav-btn active-btn">
            <span>Mock-V</span>
          </button>
          <button className="nav-btn" onClick={() => navigate("/resume-scorer")}>
            <span>Resume Scorer</span>
          </button>
          <button className="nav-btn">
            <span>Lectures</span>
          </button>
        </div>
        
        <div className="user-footer">
          {/* CLICKABLE PROFILE */}
          <div className="profile-info" onClick={() => navigate('/profile')}>
            <svg width="36" height="36" viewBox="0 0 16 16" fill="#F8FAFC" className="bi bi-person-circle">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
            </svg>
            <span className="small fw-bold text-white">Prathmesh</span>
          </div>
          <div className="settings-icon" title="Settings">
             <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="main-content">
        
        {/* Header Section */}
        <div className="mb-5 animate-entrance">
          <h1 className="display-4 hero-title">Mock Interview Setup</h1>
          <p className="hero-sub">
            Configure your AI-powered interview session.
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-7">
            
            {/* Configuration Card */}
            <div className="custom-card p-5 animate-entrance" style={{animationDelay: '0.1s'}}>
              
              {/* Role Input */}
              <div className="mb-4">
                <label className="form-label">Target Role</label>
                <input
                  className="form-control"
                  placeholder="e.g. Full Stack Developer, Data Scientist"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>

              {/* Difficulty & Count Row */}
              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <label className="form-label">Difficulty Level</label>
                  <select
                    className="form-select"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option>Easy</option>
                    <option>Moderate</option>
                    <option>Hard</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Question Count</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="form-control"
                    value={totalQuestions}
                    onChange={(e) => setTotalQuestions(e.target.value)}
                  />
                </div>
              </div>

              {/* Job Description */}
              <div className="mb-4">
                <label className="form-label">Job Description <span className="text-muted fw-normal text-lowercase small">(optional)</span></label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Paste the JD here to tailor the questions..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              {/* Resume Text */}
              <div className="mb-4">
                <label className="form-label">Resume Context <span className="text-muted fw-normal text-lowercase small">(optional)</span></label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Paste your resume text here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
              </div>

              {/* Start Button */}
              <button
                className="btn-gold"
                disabled={loading || !role}
                onClick={startInterview}
              >
                {loading ? (
                  <span>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Initializing AI...
                  </span>
                ) : "Begin Interview Simulation"}
              </button>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}