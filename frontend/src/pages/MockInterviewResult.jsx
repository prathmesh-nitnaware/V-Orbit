import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // <--- 1. Import Firebase
import { onAuthStateChanged } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";

export default function MockInterviewResult() {
  const location = useLocation();
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

      @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      .animate-entrance { animation: slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }

      /* Sidebar */
      .sidebar-container { background-color: var(--color-primary); height: 100vh; width: 280px; color: var(--color-white); position: fixed; top: 0; left: 0; display: flex; flex-direction: column; z-index: 1000; box-shadow: 4px 0 15px rgba(0, 33, 71, 0.15); }
      .sidebar-header { padding: 2.5rem 2rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
      .sidebar-title { color: var(--color-accent); font-weight: 700; letter-spacing: 1.5px; margin: 0; font-size: 1.6rem; text-transform: uppercase; }
      
      .nav-menu { display: flex; flex-direction: column; padding: 1.5rem 1rem; gap: 0.8rem; flex-grow: 1; }
      .nav-btn { background-color: transparent; color: #B0C4DE; border: none; padding: 0.9rem 1.2rem; transition: 0.3s; text-align: left; font-weight: 500; border-radius: 6px; font-size: 1rem; display: flex; align-items: center; }
      .nav-btn:hover { color: var(--color-white); background-color: rgba(255, 255, 255, 0.05); transform: translateX(5px); }
      .nav-btn.active-btn { background-color: var(--color-accent); color: var(--color-primary); font-weight: 700; box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3); }

      .user-footer { padding: 1.5rem 2rem; background-color: rgba(0, 0, 0, 0.2); display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255, 255, 255, 0.05); }
      .profile-info { display: flex; align-items: center; gap: 12px; cursor: pointer; transition: opacity 0.2s; }
      .profile-info:hover { opacity: 0.8; }
      .settings-icon { color: var(--color-secondary); cursor: pointer; padding: 6px; border-radius: 50%; transition: 0.2s; border: 1px solid transparent; }
      .settings-icon:hover { color: var(--color-accent); border-color: var(--color-accent); }

      /* Main Content */
      .main-content { margin-left: 280px; padding: 3.5rem 4.5rem; min-height: 100vh; }
      .hero-title { color: var(--color-primary); font-weight: 800; margin-bottom: 0.5rem; }
      .hero-sub { color: var(--color-secondary); font-size: 1.1rem; font-weight: 500; }

      /* Result Card */
      .custom-card { border: none; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04); background: var(--color-white); position: relative; overflow: hidden; }
      .custom-card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: var(--color-primary); }

      .success-banner { background-color: #F0FFF4; border: 1px solid #C6F6D5; color: #276749; padding: 1rem; border-radius: 8px; margin-bottom: 2rem; display: flex; align-items: center; font-weight: 600; }
      .feedback-box { background-color: #F8FAFC; border-left: 4px solid var(--color-accent); padding: 2rem; border-radius: 0 8px 8px 0; font-size: 1rem; line-height: 1.7; color: #334155; white-space: pre-wrap; }

      .btn-gold { background-color: var(--color-accent); color: var(--color-primary); font-weight: 800; border: none; padding: 1rem 2rem; border-radius: 8px; letter-spacing: 1px; text-transform: uppercase; transition: transform 0.2s, box-shadow 0.2s; display: inline-block; text-decoration: none; }
      .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3); color: var(--color-primary); }

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

  // --- No Data Check ---
  if (!location.state) {
    return (
      <div className="container-fluid p-0">
        <div className="sidebar-container">
          <div className="sidebar-header">
            <h2 className="sidebar-title">V-Orbit</h2>
          </div>
          <div className="nav-menu">
            <button className="nav-btn" onClick={() => navigate("/dashboard")}>
              <span>Dashboard</span>
            </button>
            <button className="nav-btn active-btn">
              <span>Mock-V</span>
            </button>
          </div>
        </div>
        <div className="main-content d-flex align-items-center justify-content-center">
          <div className="text-center animate-entrance">
            <h4 style={{ color: "#002147", marginBottom: "1.5rem" }}>
              No Interview Data Found
            </h4>
            <button className="btn-gold" onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { feedback, message } = location.state;

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
          <button className="nav-btn active-btn">
            <span>Mock-V Result</span>
          </button>
          <button
            className="nav-btn"
            onClick={() => navigate("/resume-scorer")}
          >
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
              <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="mb-5 animate-entrance">
          <h1 className="display-4 hero-title">Interview Analysis</h1>
          <p className="hero-sub">
            Review your performance feedback from the AI interviewer.
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div
              className="custom-card p-5 animate-entrance"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="success-banner">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-check-circle-fill me-2"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                </svg>
                {message || "Interview Completed Successfully"}
              </div>

              <h5
                style={{
                  color: "#002147",
                  fontWeight: "700",
                  marginBottom: "1.5rem",
                }}
              >
                Comprehensive Feedback
              </h5>

              <div className="feedback-box">{feedback}</div>

              <div className="mt-5 text-end">
                <button
                  className="btn-gold"
                  onClick={() => navigate("/dashboard")}
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
