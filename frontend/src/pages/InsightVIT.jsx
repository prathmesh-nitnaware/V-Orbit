import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import config from "../utils/config"; // <--- ADDED THIS IMPORT
import "bootstrap/dist/css/bootstrap.min.css";

export default function InsightVIT() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I am Insight-VIT. Select a subject and ask me anything about your syllabus.",
    },
  ]);
  const [input, setInput] = useState("");

  // DEFAULT: Select a valid subject from your bucket
  const [subject, setSubject] = useState("AI");

  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // --- Security Check ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) setUser(currentUser);
      else {
        if (localStorage.getItem("userMode") === "guest")
          setUser({ displayName: "Guest User" });
        else navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // UPDATED: Use dynamic URL from config
      const res = await axios.post(`${config.API_BASE_URL}/api/insight/ask`, {
        subject,
        question: userMessage.text,
      });

      const botMessage = {
        sender: "bot",
        text: res.data.answer,
        source: res.data.source,
        video: res.data.video,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, I couldn't connect to the server. Is the backend running?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // --- Styles (Merged Dashboard Sidebar + Chat Layout) ---
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

      body { background-color: var(--color-bg); font-family: 'Segoe UI', sans-serif; overflow: hidden; }

      /* --- ANIMATIONS --- */
      @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      .animate-entrance { animation: slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }

      /* --- SIDEBAR (Copied from Dashboard) --- */
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

      /* --- MAIN CONTENT & CHAT --- */
      .main-content { margin-left: 280px; height: 100vh; display: flex; flex-direction: column; background: #F8FAFC; }
      
      .chat-header { padding: 1.5rem 2.5rem; background: white; border-bottom: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center; z-index: 10; box-shadow: 0 2px 10px rgba(0,0,0,0.03); }

      .chat-area { flex-grow: 1; padding: 2rem 4rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1.5rem; }
      
      .message { max-width: 80%; padding: 1.5rem; border-radius: 12px; position: relative; line-height: 1.6; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
      .message.user { align-self: flex-end; background: var(--color-primary); color: white; border-bottom-right-radius: 2px; }
      .message.bot { align-self: flex-start; background: white; border: 1px solid #E2E8F0; color: #333; border-bottom-left-radius: 2px; }
      
      .video-card { margin-top: 15px; background: white; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; max-width: 300px; cursor: pointer; transition: 0.2s; }
      .video-card:hover { transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
      .video-thumb { width: 100%; height: 160px; object-fit: cover; }
      .video-title { padding: 10px; font-weight: bold; font-size: 0.9rem; color: #002147; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

      .input-area { background: white; padding: 1.5rem 4rem; border-top: 1px solid #E2E8F0; display: flex; gap: 10px; box-shadow: 0 -4px 20px rgba(0,0,0,0.02); }
      .form-control { flex-grow: 1; padding: 1rem; border-radius: 8px; border: 2px solid #E2E8F0; transition: border 0.3s; }
      .form-control:focus { border-color: var(--color-primary); outline: none; box-shadow: none; }
      .btn-send { background: var(--color-accent); color: var(--color-primary); border: none; padding: 0 25px; border-radius: 8px; font-weight: bold; transition: transform 0.2s; }
      .btn-send:hover { transform: scale(1.05); }
      .btn-send:active { transform: scale(0.95); }

      @media (max-width: 992px) { .sidebar-container { display: none; } .main-content { margin-left: 0; } .chat-area, .input-area { padding: 1rem; } }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="container-fluid p-0">
      {/* Sidebar - EXACT COPY from Dashboard.jsx */}
      <div className="sidebar-container">
        <div className="sidebar-header">
          <h2 className="sidebar-title">V-Orbit</h2>
        </div>
        <div className="nav-menu">
          <button className="nav-btn" onClick={() => navigate("/dashboard")}>
            <span>Dashboard</span>
          </button>
          {/* Active State Here */}
          <button className="nav-btn active-btn">
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

      {/* Main Chat Content */}
      <div className="main-content">
        {/* Header - Animated Entrance */}
        <div
          className="chat-header animate-entrance"
          style={{ animationDelay: "0.1s" }}
        >
          <div>
            <h4 className="m-0 fw-bold" style={{ color: "#002147" }}>
              Insight-VIT
            </h4>
            <small className="text-muted">PDF Syllabus Assistant</small>
          </div>

          <select
            className="form-select w-auto fw-bold text-primary border-2"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{ cursor: "pointer" }}
          >
            <option value="AI">Artificial Intelligence (AI)</option>
            <option value="DS">Distributed Systems (DS)</option>
            <option value="DWM">Data Warehouse (DWM)</option>
            <option value="SE">Software Engineering (SE)</option>
            <option value="SPCD">System Processing (SPCD)</option>
            <option value="ALL">Global Search</option>
          </select>
        </div>

        {/* Chat Area - Animated Entrance */}
        <div
          className="chat-area animate-entrance"
          style={{ animationDelay: "0.2s" }}
        >
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              <div>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>

              {/* Source Link */}
              {msg.source && (
                <div className="mt-3 pt-2 border-top">
                  <small className="text-muted fw-bold">
                    📖 Source:{" "}
                    <a
                      // UPDATED: Use dynamic URL from config
                      href={`${config.API_BASE_URL}/api/insight/pdf/${msg.source}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#D4AF37" }}
                    >
                      {msg.source}
                    </a>
                  </small>
                </div>
              )}

              {/* YouTube Video */}
              {msg.video && (
                <div
                  className="video-card"
                  onClick={() => window.open(msg.video.url, "_blank")}
                >
                  <img
                    src={msg.video.thumbnail}
                    className="video-thumb"
                    alt="video"
                  />
                  <div className="video-title">▶ {msg.video.title}</div>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="message bot text-muted">
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Analyzing syllabus...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - Animated Entrance */}
        <div
          className="input-area animate-entrance"
          style={{ animationDelay: "0.3s" }}
        >
          <input
            className="form-control"
            placeholder={`Ask a question about ${subject}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
          />
          <button className="btn-send" onClick={handleSend} disabled={loading}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
