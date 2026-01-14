import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";

export default function InsightVIT() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I am Insight-VIT. Select a subject and ask me anything about your syllabus or question papers.",
    },
  ]);
  const [input, setInput] = useState("");
  const [subject, setSubject] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // --- Security Check ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) setUser(currentUser);
      else {
        if (localStorage.getItem("userMode") === "guest") {
          setUser({ displayName: "Guest" });
        } else {
          navigate("/login");
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Auto-scroll to bottom
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
      const res = await axios.post("http://localhost:3000/api/insight/ask", {
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
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // --- Consistent Styles ---
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
      
      /* Sidebar (Consistent with Dashboard) */
      .sidebar-container { background-color: var(--color-primary); height: 100vh; width: 280px; position: fixed; top: 0; left: 0; display: flex; flex-direction: column; color: white; z-index: 1000; box-shadow: 4px 0 15px rgba(0, 33, 71, 0.15); }
      .sidebar-header { padding: 2.5rem 2rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
      .sidebar-title { color: var(--color-accent); font-weight: 700; letter-spacing: 1.5px; font-size: 1.6rem; text-transform: uppercase; margin: 0; }
      .nav-menu { padding: 1.5rem 1rem; flex-grow: 1; display: flex; flex-direction: column; gap: 0.8rem; }
      .nav-btn { background: transparent; color: #B0C4DE; border: none; padding: 0.9rem 1.2rem; text-align: left; border-radius: 6px; font-weight: 500; font-size: 1rem; transition: 0.3s; display: flex; align-items: center; }
      .nav-btn:hover { background: rgba(255, 255, 255, 0.05); color: white; transform: translateX(5px); }
      .nav-btn.active-btn { background: var(--color-accent); color: var(--color-primary); font-weight: 700; box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3); }
      
      /* User Footer */
      .user-footer { padding: 1.5rem 2rem; background: rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.05); }
      .profile-info { display: flex; align-items: center; gap: 12px; cursor: pointer; transition: 0.2s; }
      .profile-info:hover { opacity: 0.8; }
      .settings-icon { color: var(--color-secondary); cursor: pointer; padding: 6px; border-radius: 50%; transition: 0.2s; }
      .settings-icon:hover { color: var(--color-accent); }

      /* Main Content */
      .main-content { margin-left: 280px; height: 100vh; display: flex; flex-direction: column; }
      
      /* Chat Area */
      .chat-area { flex-grow: 1; padding: 2rem 4.5rem; overflow-y: auto; background-color: #F8FAFC; display: flex; flex-direction: column; gap: 1.5rem; }
      
      .message { max-width: 75%; padding: 1.5rem; border-radius: 12px; position: relative; animation: fadeIn 0.3s ease; line-height: 1.6; }
      .message.user { align-self: flex-end; background-color: var(--color-primary); color: white; border-bottom-right-radius: 2px; box-shadow: 0 4px 15px rgba(0, 33, 71, 0.15); }
      .message.bot { align-self: flex-start; background-color: white; border: 1px solid #E2E8F0; color: #333; border-bottom-left-radius: 2px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
      
      /* Input Area */
      .input-area { background: white; padding: 1.5rem 4.5rem; border-top: 1px solid #E2E8F0; display: flex; gap: 1rem; align-items: center; }
      .form-control { border-radius: 12px; padding: 1rem 1.5rem; border: 2px solid #E2E8F0; font-size: 1rem; }
      .form-control:focus { border-color: var(--color-primary); box-shadow: 0 0 0 4px rgba(0, 33, 71, 0.1); }
      
      .btn-send { background-color: var(--color-accent); color: var(--color-primary); border: none; width: 55px; height: 55px; border-radius: 12px; display: flex; align-items: center; justify-content: center; transition: 0.2s; box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3); }
      .btn-send:hover { transform: translateY(-2px); }

      /* Video Card Style */
      .video-card { margin-top: 1.5rem; background: #f8f9fa; border-radius: 12px; padding: 12px; border: 1px solid #e9ecef; max-width: 320px; transition: 0.2s; }
      .video-card:hover { background: #e9ecef; transform: translateY(-2px); }
      .video-thumb { width: 100%; border-radius: 8px; margin-bottom: 10px; }
      .video-title { font-size: 0.95rem; font-weight: 600; color: #002147; line-height: 1.3; margin-bottom: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      .video-label { font-size: 0.75rem; color: #D4AF37; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; display: block; }

      @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      @media (max-width: 992px) { 
        .sidebar-container { width: 80px; align-items: center; } 
        .sidebar-header { padding: 1.5rem 0; text-align: center; } 
        .sidebar-title { font-size: 0.6rem; }
        .nav-btn span, .profile-info span { display: none; }
        .nav-btn { justify-content: center; padding: 1rem 0; }
        .main-content { margin-left: 80px; }
        .chat-area, .input-area { padding-left: 2rem; padding-right: 2rem; }
        .user-footer { flex-direction: column; gap: 1rem; }
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
          {/* Active State */}
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

      {/* Main Chat Interface */}
      <div className="main-content">
        {/* Top Bar */}
        <div
          className="d-flex justify-content-between align-items-center p-4 bg-white shadow-sm"
          style={{ zIndex: 10 }}
        >
          <h4 className="m-0 fw-bold" style={{ color: "#002147" }}>
            Insight-VIT Chat
          </h4>
          <select
            className="form-select w-auto border-2"
            style={{ borderColor: "#E2E8F0", fontWeight: "500" }}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="ALL">All Subjects</option>
            <option value="Artificial Intelligence">
              Artificial Intelligence
            </option>
            <option value="Data Warehousing">Data Warehousing</option>
            <option value="Distributed Systems">Distributed Systems</option>
          </select>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {/* Text Content */}
              <div>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>

              {/* Source Badge */}
              {msg.source && (
                <div
                  className="mt-3 pt-3 border-top"
                  style={{ borderColor: "rgba(0,0,0,0.1)" }}
                >
                  <small className="text-muted fw-bold d-flex align-items-center gap-1">
                    <svg
                      width="14"
                      height="14"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z" />
                    </svg>
                    Source: {msg.source}
                  </small>
                </div>
              )}

              {/* YOUTUBE VIDEO CARD (NEW) */}
              {msg.sender === "bot" && msg.video && (
                <div className="video-card">
                  <span className="video-label">📺 Recommended Watch</span>
                  <a
                    href={msg.video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                  >
                    <img
                      src={msg.video.thumbnail}
                      alt="Video Thumbnail"
                      className="video-thumb"
                    />
                    <p className="video-title">{msg.video.title}</p>
                  </a>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="message bot">
              <span className="spinner-border spinner-border-sm text-primary me-2"></span>
              Thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="input-area">
          <input
            type="text"
            className="form-control"
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
          />
          <button className="btn-send" onClick={handleSend} disabled={loading}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
