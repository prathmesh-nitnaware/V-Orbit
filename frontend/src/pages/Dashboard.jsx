import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; 

export default function Dashboard() {
  const navigate = useNavigate();

  // Mock Data for Charts
  const [historyData] = useState({
    resumeScores: [60, 65, 70, 68, 75, 82, 85],
    mockInterviews: [4, 5, 3, 6, 7], 
    academic: [85, 15] 
  });

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

      /* --- ANIMATIONS DEFINITIONS --- */
      @keyframes slideInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes growBar {
        from { transform: scaleY(0); }
        to { transform: scaleY(1); }
      }

      @keyframes drawLine {
        from { stroke-dashoffset: 1000; }
        to { stroke-dashoffset: 0; }
      }

      @keyframes fillDonut {
        from { stroke-dasharray: 0, 100; }
        to { stroke-dasharray: ${historyData.academic[0]}, 100; }
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

      .animate-entrance {
        animation: slideInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        opacity: 0; /* Start hidden */
      }

      .hero-title { color: var(--color-primary); font-weight: 800; margin-bottom: 0.5rem; }
      .hero-sub { color: var(--color-secondary); font-size: 1.1rem; font-weight: 500; }

      /* Cards */
      .custom-card {
        border: none;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        background: var(--color-white);
        height: 100%;
        position: relative;
        overflow: hidden;
      }
      
      .custom-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 40px rgba(0, 33, 71, 0.15);
      }

      .custom-card::before {
        content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: var(--color-primary);
      }

      .card-header-custom {
        color: var(--color-primary); font-weight: 700; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 1px; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;
      }

      /* --- CHART ANIMATIONS --- */
      .line-path-anim {
        stroke-dasharray: 1000;
        stroke-dashoffset: 1000;
        animation: drawLine 2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        animation-delay: 0.5s;
      }

      .bar-anim {
        transform-origin: bottom;
        transform: scaleY(0);
        animation: growBar 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }

      .donut-anim {
        animation: fillDonut 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        animation-delay: 0.8s;
        stroke-dasharray: 0, 100;
      }

      .dot-anim {
        opacity: 0;
        animation: fadeIn 0.5s ease forwards;
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
  }, [historyData]);

  return (
    <div className="container-fluid p-0">
      
      {/* --- SIDEBAR --- */}
      <div className="sidebar-container">
        <div className="sidebar-header">
          <h2 className="sidebar-title">V-Orbit</h2>
        </div>
        
        <div className="nav-menu">
          <button className="nav-btn active-btn">
            <span>Dashboard</span>
          </button>
          <button className="nav-btn" onClick={() => navigate("/insight")}>
            <span>Insight-VIT</span>
          </button>
          <button className="nav-btn" onClick={() => navigate("/mock-interview")}>
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
          {/* --- CLICKABLE PROFILE --- */}
          <div className="profile-info" onClick={() => navigate('/profile')}>
            <svg width="36" height="36" viewBox="0 0 16 16" fill="#F8FAFC" className="bi bi-person-circle">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
            </svg>
            <span className="small fw-bold text-white">Prathmesh</span>
          </div>
          
          <div className="settings-icon" title="Settings">
             <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="main-content">
        
        {/* Header Section */}
        <div className="mb-5 animate-entrance" style={{animationDelay: '0.1s'}}>
          <h1 className="display-4 hero-title">Dashboard</h1>
          <p className="hero-sub">
            Welcome back, Prathmesh. Your performance overview.
          </p>
        </div>

        {/* Charts Row */}
        <div className="row g-4">
          
          {/* Card 1: Resume Score */}
          <div className="col-12 col-xl-4 animate-entrance" style={{animationDelay: '0.2s'}}>
            <div className="card custom-card p-4">
              <div className="card-body d-flex flex-column h-100">
                <h5 className="card-header-custom">
                  Resume History 
                  <span style={{fontSize:'0.7em', color:'#708090'}}>Last 7 Scans</span>
                </h5>
                <div className="flex-grow-1 d-flex align-items-center">
                  <svg viewBox="0 0 250 150" className="w-100">
                    <defs>
                      <linearGradient id="gradientStroke" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#002147" stopOpacity="0.1"/>
                        <stop offset="100%" stopColor="#002147" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <path 
                      d={`M0 150 ` + historyData.resumeScores.map((score, index) => 
                        `L${index * (250 / (historyData.resumeScores.length - 1))} ${150 - (score * 1.5)}`
                      ).join(" ") + ` L250 150 Z`}
                      fill="url(#gradientStroke)"
                      className="dot-anim" 
                      style={{animationDelay: '1s'}}
                    />
                    <polyline
                      fill="none"
                      stroke="#002147" 
                      strokeWidth="3"
                      className="line-path-anim" 
                      points={historyData.resumeScores.map((score, index) => 
                        `${index * (250 / (historyData.resumeScores.length - 1))},${150 - (score * 1.5)}`
                      ).join(" ")}
                    />
                    {historyData.resumeScores.map((score, index) => (
                      <circle 
                        key={index}
                        cx={index * (250 / (historyData.resumeScores.length - 1))} 
                        cy={150 - (score * 1.5)} 
                        r="5" 
                        fill="#D4AF37"
                        stroke="#fff"
                        strokeWidth="2" 
                        className="dot-anim"
                        style={{animationDelay: `${1 + (index * 0.1)}s`}}
                      />
                    ))}
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Mock Interview */}
          <div className="col-12 col-xl-4 animate-entrance" style={{animationDelay: '0.3s'}}>
            <div className="card custom-card p-4">
              <div className="card-body d-flex flex-column h-100">
                <h5 className="card-header-custom">
                  Mock Stats
                  <span style={{fontSize:'0.7em', color:'#708090'}}>Avg: 7.2</span>
                </h5>
                <div className="flex-grow-1 d-flex align-items-end justify-content-center">
                  <svg viewBox="0 0 250 150" className="w-100">
                    {historyData.mockInterviews.map((rating, index) => (
                      <g key={index}>
                        <rect
                          x={index * 50 + 15}
                          y={150 - (rating * 15)}
                          width="30"
                          height={rating * 15}
                          fill="#002147" 
                          className="bar-anim"
                          style={{animationDelay: `${0.4 + (index * 0.1)}s`}}
                          rx="4"
                        />
                        <text 
                          x={index * 50 + 30} 
                          y={145 - (rating * 15) - 5} 
                          fontSize="12" 
                          textAnchor="middle" 
                          fill="#708090"
                          className="dot-anim"
                          style={{animationDelay: `${1 + (index * 0.1)}s`}}
                        >
                          {rating}
                        </text>
                      </g>
                    ))}
                    <line x1="0" y1="150" x2="250" y2="150" stroke="#708090" strokeWidth="1" opacity="0.3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Completion */}
          <div className="col-12 col-xl-4 animate-entrance" style={{animationDelay: '0.4s'}}>
            <div className="card custom-card p-4">
              <div className="card-body d-flex flex-column h-100">
                <h5 className="card-header-custom">
                  Course Progress
                  <span style={{fontSize:'0.7em', color:'#D4AF37'}}>Great Job!</span>
                </h5>
                <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                  <div style={{ position: 'relative', width: '160px', height: '160px' }}>
                    <svg width="100%" height="100%" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#E2E8F0"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                        fill="none"
                        stroke="#D4AF37" 
                        strokeWidth="3"
                        strokeDasharray="0, 100" 
                        strokeLinecap="round"
                        className="donut-anim"
                      />
                    </svg>
                    <div className="position-absolute top-50 start-50 translate-middle text-center animate-entrance" style={{animationDelay: '1.2s'}}>
                      <span className="display-5 fw-bold" style={{ color: '#002147' }}>{historyData.academic[0]}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-5 text-center small animate-entrance" style={{color: '#708090', animationDelay: '0.6s'}}>
           V-Orbit · The Gold Standard for Engineers
        </div>

      </div>
    </div>
  );
}