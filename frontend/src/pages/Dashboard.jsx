import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import config from "../utils/config"; // <--- IMPORT CONFIG HERE
import "bootstrap/dist/css/bootstrap.min.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Real Data State
  const [liveStats, setLiveStats] = useState({
    totalInterviews: 0,
    history: [],
    graphData: [60, 60, 60, 60, 60], // Default baseline
    loading: true,
  });

  // --- 1. SECURITY & DATA ---
  useEffect(() => {
    const isGuest = localStorage.getItem("userMode") === "guest";
    if (isGuest) {
      setUser({
        displayName: "Guest User",
        email: "guest@vorbit.com",
        photoURL: null,
      });
      // Mock data for guest to see features
      setLiveStats({
        totalInterviews: 5,
        history: [
          {
            role: "React Dev",
            date: new Date().toISOString(),
            score: 85,
            sentiment: 2.5,
            fillers: 1,
          },
          {
            role: "System Design",
            date: new Date().toISOString(),
            score: 62,
            sentiment: -1.0,
            fillers: 8,
          },
        ],
        graphData: [60, 65, 62, 78, 85],
        loading: false,
      });
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchHistory();
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchHistory = async () => {
    try {
      // UPDATED: Use dynamic URL from config
      const res = await axios.get(`${config.API_BASE_URL}/api/mock/history`);

      // Prepare Graph Data: Extract scores and reverse them (Oldest -> Newest)
      // If no history, default to flat line
      const scores =
        res.data.history.length > 0
          ? res.data.history.map((h) => h.score).reverse()
          : [60, 60, 60, 60, 60];

      setLiveStats({
        totalInterviews: res.data.totalInterviews,
        history: res.data.history,
        graphData: scores,
        loading: false,
      });
    } catch (err) {
      console.error("Dashboard Fetch Error", err);
      setLiveStats((prev) => ({ ...prev, loading: false }));
    }
  };

  // --- STYLES (Restored exact UI) ---
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

      body { background-color: var(--color-bg); font-family: 'Segoe UI', sans-serif; overflow-x: hidden; }

      /* Animations */
      @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes pulseRed { 0% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7); } 70% { box-shadow: 0 0 0 6px rgba(220, 53, 69, 0); } 100% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); } }
      @keyframes scan { 0% { left: -10%; } 100% { left: 110%; } }
      @keyframes dash { to { stroke-dashoffset: 0; } }

      .animate-entrance { animation: slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }

      /* --- SIDEBAR --- */
      .sidebar-container { background: var(--color-primary); height: 100vh; width: 280px; position: fixed; top: 0; left: 0; display: flex; flex-direction: column; color: white; z-index: 1000; box-shadow: 4px 0 15px rgba(0, 33, 71, 0.15); }
      .sidebar-header { padding: 2.5rem 2rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
      .sidebar-title { color: var(--color-accent); font-weight: 700; letter-spacing: 1.5px; font-size: 1.6rem; text-transform: uppercase; margin: 0; }
      
      .nav-menu { padding: 1.5rem 1rem; flex-grow: 1; display: flex; flex-direction: column; gap: 0.8rem; }
      
      .nav-btn { background: transparent; color: #B0C4DE; border: none; padding: 0.9rem 1.2rem; text-align: left; border-radius: 6px; font-weight: 500; font-size: 1rem; transition: 0.3s; display: flex; align-items: center; }
      .nav-btn:hover { background: rgba(255, 255, 255, 0.05); color: white; transform: translateX(5px); }
      .nav-btn.active-btn { background: var(--color-accent); color: var(--color-primary); font-weight: 700; box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3); }
      
      .user-footer { padding: 1.5rem 2rem; background: rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.05); }
      .profile-info { display: flex; align-items: center; gap: 12px; cursor: pointer; transition: 0.2s; }
      .profile-info:hover { opacity: 0.8; }
      .settings-icon { color: var(--color-secondary); cursor: pointer; padding: 6px; border-radius: 50%; transition: 0.2s; border: 1px solid transparent; }
      .settings-icon:hover { color: var(--color-accent); border-color: var(--color-accent); }

      /* Main Content */
      .main-content { margin-left: 280px; padding: 3.5rem 4.5rem; min-height: 100vh; }
      .hero-title { color: var(--color-primary); font-weight: 800; margin-bottom: 0.5rem; }
      .hero-sub { color: #708090; font-size: 1.1rem; font-weight: 500; }

      /* Cards */
      .custom-card { border: none; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); background: white; height: 100%; position: relative; overflow: hidden; transition: 0.3s; }
      .custom-card:hover { transform: translateY(-5px); box-shadow: 0 12px 40px rgba(0, 33, 71, 0.10); }
      .custom-card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: var(--color-primary); z-index: 2; }
      .card-header-custom { color: var(--color-primary); font-weight: 700; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 1px; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; }

      /* LIVE GRAPH STYLES */
      .graph-container { position: relative; overflow: hidden; border-radius: 8px; }
      .scan-line { position: absolute; top: 0; bottom: 0; width: 2px; background: linear-gradient(to bottom, rgba(212, 175, 55, 0), rgba(212, 175, 55, 1), rgba(212, 175, 55, 0)); box-shadow: 0 0 10px rgba(212, 175, 55, 0.5); animation: scan 3s linear infinite; z-index: 1; pointer-events: none; }
      .live-dot { width: 10px; height: 10px; background-color: #28a745; border-radius: 50%; display: inline-block; margin-right: 8px; box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.7); animation: pulseRed 2s infinite; }
      .graph-path { stroke-dasharray: 1000; stroke-dashoffset: 1000; animation: dash 2.5s ease-out forwards; }
      
      /* Recent Activity List */
      .activity-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f0f0f0; transition: background 0.2s; }
      .activity-item:hover { background: #fafafa; padding-left: 5px; padding-right: 5px; border-radius: 4px; }
      .activity-role { font-weight: 600; color: #002147; font-size: 0.95rem; }
      .activity-date { font-size: 0.8rem; color: #708090; }
      .activity-score { font-weight: 700; color: #D4AF37; font-size: 0.9rem; }
      
      @media (max-width: 992px) { .sidebar-container { display: none; } .main-content { margin-left: 0; padding: 2rem; } }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="container-fluid p-0">
      {/* Sidebar - EXACT COPY of MockInterview.jsx */}
      <div className="sidebar-container">
        <div className="sidebar-header">
          <h2 className="sidebar-title">V-Orbit</h2>
        </div>
        <div className="nav-menu">
          {/* Active State Here */}
          <button className="nav-btn active-btn">
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
          <button
            className="nav-btn"
            onClick={() => navigate("/resume-scorer")}
          >
            <span>Resume Scorer</span>
          </button>
          <button className="nav-btn">
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
        {/* Header */}
        <div
          className="mb-5 animate-entrance"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="d-flex align-items-center mb-2">
            <span className="live-dot"></span>
            <span
              className="text-uppercase fw-bold"
              style={{
                fontSize: "0.75rem",
                letterSpacing: "1px",
                color: "#28a745",
              }}
            >
              System Online
            </span>
          </div>
          <h1 className="display-4 hero-title">Dashboard</h1>
          <p className="hero-sub">
            Live performance metrics & interview analysis.
          </p>
        </div>

        <div className="row g-4">
          {/* 1. LIVE GRAPH (Confidence Trend - NLP DATA) */}
          <div
            className="col-12 col-xl-6 animate-entrance"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="card custom-card p-4">
              <div className="card-body d-flex flex-column h-100">
                <h5 className="card-header-custom">
                  Confidence Trend
                  <span className="badge bg-light text-dark border">
                    NLP Analysis
                  </span>
                </h5>

                <div className="graph-container flex-grow-1 d-flex align-items-center">
                  {/* THE SCANNER LINE */}
                  <div className="scan-line"></div>

                  <svg
                    viewBox="0 0 300 150"
                    className="w-100"
                    style={{ overflow: "visible" }}
                  >
                    <defs>
                      <linearGradient
                        id="liveGradient"
                        x1="0"
                        x2="0"
                        y1="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#002147"
                          stopOpacity="0.4"
                        />
                        <stop
                          offset="100%"
                          stopColor="#002147"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>

                    {/* The Area Fill */}
                    <path
                      d={
                        `M0 150 ` +
                        liveStats.graphData
                          .map(
                            (s, i) =>
                              `L${i * (300 / (liveStats.graphData.length - 1))} ${150 - s}`,
                          )
                          .join(" ") +
                        ` L300 150 Z`
                      }
                      fill="url(#liveGradient)"
                      style={{ transition: "all 0.5s ease" }}
                    />

                    {/* The Line */}
                    <path
                      d={
                        `M0 ${150 - liveStats.graphData[0]} ` +
                        liveStats.graphData
                          .map(
                            (s, i) =>
                              `L${i * (300 / (liveStats.graphData.length - 1))} ${150 - s}`,
                          )
                          .join(" ")
                      }
                      fill="none"
                      stroke="#002147"
                      strokeWidth="3"
                      className="graph-path"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* The Points */}
                    {liveStats.graphData.map((s, i) => (
                      <circle
                        key={i}
                        cx={i * (300 / (liveStats.graphData.length - 1))}
                        cy={150 - s}
                        r={i === liveStats.graphData.length - 1 ? 6 : 4}
                        fill={
                          i === liveStats.graphData.length - 1
                            ? "#D4AF37"
                            : "white"
                        }
                        stroke="#002147"
                        strokeWidth="2"
                        className={
                          i === liveStats.graphData.length - 1
                            ? "live-dot-pulse"
                            : ""
                        }
                        style={{
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                        }}
                      />
                    ))}
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* 2. RECENT ACTIVITY (Real NLP Data) */}
          <div
            className="col-12 col-xl-6 animate-entrance"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="card custom-card p-4">
              <div className="card-body d-flex flex-column h-100">
                <h5 className="card-header-custom">
                  Recent Activity
                  <span style={{ fontSize: "0.7em", color: "#708090" }}>
                    Synced
                  </span>
                </h5>
                <div
                  className="flex-grow-1"
                  style={{
                    overflowY: "auto",
                    maxHeight: "200px",
                    paddingRight: "5px",
                  }}
                >
                  {liveStats.loading ? (
                    <div className="text-center py-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      ></div>
                      <div className="small text-muted mt-2">
                        Syncing history...
                      </div>
                    </div>
                  ) : liveStats.history.length === 0 ? (
                    <div className="text-center text-muted py-5">
                      No interviews recorded yet.
                    </div>
                  ) : (
                    liveStats.history.map((item, index) => (
                      <div key={index} className="activity-item">
                        <div className="d-flex align-items-center gap-3">
                          {/* Sentiment Icon */}
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              width: "40px",
                              height: "40px",
                              background:
                                item.sentiment && item.sentiment > 0
                                  ? "#d4edda"
                                  : "#f8d7da",
                              color:
                                item.sentiment && item.sentiment > 0
                                  ? "#155724"
                                  : "#721c24",
                              fontWeight: "bold",
                              fontSize: "1.2rem",
                            }}
                          >
                            {item.sentiment && item.sentiment > 0 ? "😊" : "😐"}
                          </div>
                          <div>
                            <div className="activity-role">{item.role}</div>
                            <div className="activity-date">
                              {new Date(item.date).toLocaleDateString()}
                              {/* Display Fillers if available */}
                              {item.fillers !== undefined && (
                                <span className="ms-2 badge bg-light text-dark border">
                                  {item.fillers} Fillers
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-end">
                          <div
                            className="activity-score"
                            style={{
                              color: item.score >= 80 ? "#28a745" : "#D4AF37",
                            }}
                          >
                            {item.score}%
                          </div>
                          <div
                            style={{
                              fontSize: "0.7rem",
                              textTransform: "uppercase",
                              fontWeight: "bold",
                              opacity: 0.6,
                            }}
                          >
                            Confidence
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="mt-5 text-center small animate-entrance"
          style={{ color: "#708090", animationDelay: "0.6s" }}
        >
          V-Orbit · The Gold Standard for VIT Students
        </div>
      </div>
    </div>
  );
}