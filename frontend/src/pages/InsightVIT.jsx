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
      text: "Hello! I am Insight-VIT. Select a subject and ask me anything about your syllabus or concepts.",
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
      const res = await axios.post("http://localhost:3000/api/insight/ask", {
        subject,
        question: userMessage.text,
      });

      const botMessage = {
        sender: "bot",
        text: res.data.answer,
        source: res.data.source, // Filename from backend
        video: res.data.video, // YouTube object
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, I encountered an error connecting to the Knowledge Base. Please ensure the backend is running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // --- Styles ---
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      :root { --color-primary: #002147; --color-secondary: #708090; --color-bg: #F8FAFC; --color-accent: #D4AF37; --color-white: #FFFFFF; }
      body { background-color: var(--color-bg); font-family: 'Segoe UI', sans-serif; overflow: hidden; }
      
      /* Sidebar */
      .sidebar-container { background-color: var(--color-primary); height: 100vh; width: 280px; position: fixed; top: 0; left: 0; display: flex; flex-direction: column; color: white; z-index: 1000; box-shadow: 4px 0 15px rgba(0, 33, 71, 0.15); }
      .sidebar-header { padding: 2.5rem 2rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
      .sidebar-title { color: var(--color-accent); font-weight: 700; letter-spacing: 1.5px; font-size: 1.6rem; text-transform: uppercase; margin: 0; }
      .nav-menu { padding: 1.5rem 1rem; flex-grow: 1; display: flex; flex-direction: column; gap: 0.8rem; }
      .nav-btn { background: transparent; color: #B0C4DE; border: none; padding: 0.9rem 1.2rem; text-align: left; border-radius: 6px; font-weight: 500; font-size: 1rem; transition: 0.3s; display: flex; align-items: center; }
      .nav-btn:hover { background: rgba(255, 255, 255, 0.05); color: white; transform: translateX(5px); }
      .nav-btn.active-btn { background: var(--color-accent); color: var(--color-primary); font-weight: 700; box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3); }
      .user-footer { padding: 1.5rem 2rem; background: rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.05); }
      
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
      
      /* Video Card */
      .video-card { margin-top: 1.5rem; background: #fff; border-radius: 12px; padding: 0; border: 1px solid #e9ecef; max-width: 320px; transition: 0.2s; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
      .video-card:hover { transform: translateY(-3px); box-shadow: 0 8px 15px rgba(0,0,0,0.1); }
      .video-thumb { width: 100%; height: 160px; object-fit: cover; }
      .video-content { padding: 12px; }
      .video-title { font-size: 0.95rem; font-weight: 700; color: #002147; line-height: 1.3; margin-bottom: 5px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      .video-label { font-size: 0.7rem; color: #D4AF37; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 5px; }

      @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      @media (max-width: 992px) { 
        .sidebar-container { width: 80px; align-items: center; } 
        .sidebar-header { padding: 1.5rem 0; text-align: center; } 
        .sidebar-title { font-size: 0.6rem; }
        .nav-btn span { display: none; }
        .main-content { margin-left: 80px; }
        .chat-area, .input-area { padding-left: 1.5rem; padding-right: 1.5rem; }
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
          <div className="d-flex align-items-center gap-2">
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "#fff",
                color: "#002147",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}
            >
              {user ? user.displayName?.charAt(0) : "S"}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="main-content">
        {/* Top Bar with Subject Select */}
        <div
          className="d-flex justify-content-between align-items-center p-4 bg-white shadow-sm"
          style={{ zIndex: 10 }}
        >
          <h4 className="m-0 fw-bold" style={{ color: "#002147" }}>
            Insight-VIT Chat
          </h4>
          <select
            className="form-select w-auto border-2"
            style={{
              borderColor: "#002147",
              fontWeight: "600",
              color: "#002147",
            }}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="ALL">Global Search (All Docs)</option>
            <option value="Artificial Intelligence">
              Artificial Intelligence
            </option>
            <option value="Web Development">Web Development</option>
            <option value="Cloud Computing">Cloud Computing</option>
            <option value="Data Structures">Data Structures</option>
          </select>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {/* Markdown Response */}
              <div>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>

              {/* Source PDF Link */}
              {msg.source && (
                <div
                  className="mt-3 pt-3 border-top"
                  style={{ borderColor: "rgba(0,0,0,0.1)" }}
                >
                  <small className="text-muted fw-bold d-flex align-items-center gap-2">
                    <svg
                      width="14"
                      height="14"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z" />
                    </svg>
                    Source:{" "}
                    <a
                      href={`http://localhost:3000/api/insight/pdf/${msg.source}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#D4AF37" }}
                    >
                      {msg.source}
                    </a>
                  </small>
                </div>
              )}

              {/* YouTube Recommendation */}
              {msg.sender === "bot" && msg.video && (
                <div className="video-card">
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
                    <div className="video-content">
                      <span className="video-label">📺 Recommended Watch</span>
                      <p className="video-title">{msg.video.title}</p>
                    </div>
                  </a>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="message bot">
              <span className="spinner-border spinner-border-sm text-primary me-2"></span>
              {subject === "ALL"
                ? "Searching all documents..."
                : `Consulting ${subject} syllabus...`}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="input-area">
          <input
            type="text"
            className="form-control"
            placeholder={`Ask about ${subject === "ALL" ? "anything" : subject}...`}
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
