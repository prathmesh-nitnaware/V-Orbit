import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; 

export default function InsightVIT() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState("ALL");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);

  // --- API Logic ---
  const ask = async () => {
    if (!question) return;

    setLoading(true);
    setAnswer("");
    setSource("");

    try {
      const res = await axios.post(
        "http://localhost:3000/api/insight/ask",
        { subject, question }
      );

      setAnswer(res.data.answer);
      setSource(res.data.source || "");
    } catch {
      setAnswer("Failed to fetch answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openPDF = () => {
    if (!source) return;
    window.open(
      `http://localhost:3000/api/insight/pdf/${source}`,
      "_blank"
    );
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
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
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

      /* --- FORM STYLES --- */
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
        font-size: 0.9rem;
        letter-spacing: 0.5px;
        text-transform: uppercase;
      }

      .form-select, .form-control {
        border: 2px solid #E2E8F0;
        border-radius: 8px;
        padding: 0.8rem;
        font-size: 1rem;
        transition: border-color 0.2s;
        background-color: #F8FAFC;
      }

      .form-select:focus, .form-control:focus {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 4px rgba(0, 33, 71, 0.1);
        background-color: #fff;
      }

      /* GOLD CTA BUTTON */
      .btn-gold {
        background-color: var(--color-accent);
        color: var(--color-primary);
        font-weight: 800;
        border: none;
        padding: 0.8rem 2rem;
        border-radius: 8px;
        letter-spacing: 1px;
        text-transform: uppercase;
        transition: transform 0.2s, box-shadow 0.2s;
      }

      .btn-gold:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 15px rgba(212, 175, 55, 0.3);
        color: var(--color-primary); /* Keep text navy */
      }
      
      .btn-gold:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
      }

      /* ANSWER BOX */
      .answer-box {
        background-color: #F1F5F9; /* Very light slate bg */
        border-left: 4px solid var(--color-accent);
        padding: 1.5rem;
        border-radius: 0 8px 8px 0;
        margin-top: 1rem;
        animation: fadeIn 0.5s ease;
      }

      .btn-outline-navy {
        color: var(--color-primary);
        border: 2px solid var(--color-primary);
        font-weight: 600;
        padding: 0.5rem 1.2rem;
        border-radius: 6px;
        transition: all 0.2s;
      }

      .btn-outline-navy:hover {
        background-color: var(--color-primary);
        color: #fff;
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
          {/* Dashboard (Top) */}
          <button className="nav-btn" onClick={() => navigate("/dashboard")}>
            <span>Dashboard</span>
          </button>
          {/* Active State */}
          <button className="nav-btn active-btn">
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
          <h1 className="display-4 hero-title">Academic Oracle</h1>
          <p className="hero-sub">
            Query official VIT academic documents with confidence.
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-10">
            
            {/* Input Card */}
            <div className="custom-card p-5 animate-entrance" style={{animationDelay: '0.1s'}}>
              
              <div className="mb-4">
                <label className="form-label">Select Subject</label>
                <select
                  className="form-select"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  <option value="ALL">All Subjects</option>
                  <option value="DWM">Data Warehousing & Mining</option>
                  <option value="AI">Artificial Intelligence</option>
                  <option value="SE">Software Engineering</option>
                  <option value="DS">Data Structures</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label">Your Question</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="e.g., What is the syllabus for Module 2?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>

              <div className="text-end">
                <button
                  className="btn-gold"
                  onClick={ask}
                  disabled={loading}
                >
                  {loading ? (
                    <span>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Searching...
                    </span>
                  ) : "Ask Oracle"}
                </button>
              </div>

            </div>

            {/* Answer Result Section */}
            {answer && (
              <div className="custom-card p-5 mt-4 animate-entrance" style={{animationDelay: '0.2s'}}>
                <h5 style={{color: '#002147', fontWeight: '700'}}>Oracle's Response</h5>
                
                <div className="answer-box">
                  <p style={{marginBottom: 0, fontSize: '1.1rem', lineHeight: '1.6'}}>{answer}</p>
                </div>

                {source && (
                  <div className="mt-4 pt-3 border-top">
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="text-muted small">
                        Source Reference: <strong>{source}</strong>
                      </span>
                      <button
                        className="btn btn-outline-navy btn-sm"
                        onClick={openPDF}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-pdf me-2" viewBox="0 0 16 16">
                          <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
                          <path d="M4.603 14.087a.81.81 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.68 7.68 0 0 1 1.482-.645 19.697 19.697 0 0 0 1.062-2.227 7.269 7.269 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.188-.012.396-.047.614-.084.51-.27 1.134-.52 1.794a10.954 10.954 0 0 0 .98 1.686 5.753 5.753 0 0 1 1.334.05c.364.066.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.856.856 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.712 5.712 0 0 1-.911-.95 11.651 11.651 0 0 0-1.997.406 11.307 11.307 0 0 1-1.02 1.51c-.292.35-.609.656-.927.787a.793.793 0 0 1-.58.029zm1.379-1.901c-.166.076-.32.156-.459.238-.328.194-.541.383-.647.545-.094.145-.096.25-.04.361.01.022.02.036.026.044a.266.266 0 0 0 .035-.012c.137-.056.355-.235.635-.572a8.18 8.18 0 0 0 .45-.606zm1.64-1.33a12.71 12.71 0 0 1 1.01-.193 11.744 11.744 0 0 1-.51-.858 20.801 20.801 0 0 1-.5 1.05zm2.446.45c.15.163.296.3.435.41.24.19.407.253.498.256a.107.107 0 0 0 .07-.015.307.307 0 0 0 .094-.125.436.436 0 0 0 .059-.2.095.095 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a3.876 3.876 0 0 0-.612-.053zM8.06 11.1a.5.5 0 0 0 .179-.171l.086-.138a2.508 2.508 0 0 0 .225-.528c.034-.122.07-.268.11-.45.035-.165.078-.37.125-.627l.072-.4.028-.14c.032-.158.057-.3.076-.426s.03-.242.035-.355l.004-.08a6.99 6.99 0 0 1-.225.597 10.15 10.15 0 0 1-.303.66l-.105.195a.473.473 0 0 1-.255.205z"/>
                        </svg>
                        View Source PDF
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}