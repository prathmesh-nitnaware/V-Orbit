import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase"; // <--- 1. Import Firebase
import { onAuthStateChanged } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";

export default function MockInterviewLive() {
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef(null);
  const audioRef = useRef(new Audio());

  const interviewId = location.state?.interviewId;
  const firstQuestion = location.state?.question;

  // --- State ---
  const [user, setUser] = useState(null); // User state
  const [question, setQuestion] = useState(firstQuestion || "");
  const [audioUrl, setAudioUrl] = useState(location.state?.audioUrl || "");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(
    location.state?.questionNumber || 1
  );
  const [isListening, setIsListening] = useState(false);

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

  // --- 3. Camera Setup ---
  useEffect(() => {
    if (!interviewId || !question) {
      navigate("/dashboard");
      return;
    }

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera denied:", err);
        alert("Please enable your camera to continue.");
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [interviewId, question, navigate]);

  // --- 4. Audio Playback ---
  useEffect(() => {
    if (audioUrl) {
      audioRef.current.src = audioUrl;
      audioRef.current
        .play()
        .catch((err) => console.error("Audio play error:", err));
    }
  }, [audioUrl]);

  // --- 5. Speech Recognition ---
  const toggleListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Browser not supported. Please use Google Chrome.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setAnswer(transcript);
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  // --- 6. Submit Answer ---
  const submitAnswer = async () => {
    if (!answer.trim()) return;

    audioRef.current.pause();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/api/mock/answer", {
        interviewId,
        answer,
      });

      if (res.data.isLast) {
        navigate("/mock/result", {
          state: {
            interviewId,
            feedback: res.data.feedback,
            message: res.data.message,
          },
        });
        return;
      }

      setQuestion(res.data.question);
      setQuestionNumber((prev) => prev + 1);
      setAudioUrl(res.data.audioUrl);
      setAnswer("");
    } catch (err) {
      console.error("Submission error:", err);
      alert("Failed to submit answer. Please try again.");
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

      body { background-color: var(--color-bg); font-family: 'Segoe UI', sans-serif; overflow-x: hidden; }

      @keyframes pulse-gold {
        0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4); }
        70% { box-shadow: 0 0 0 10px rgba(212, 175, 55, 0); }
        100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
      }

      @keyframes pulse-red {
        0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; }
      }

      @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      .animate-entrance { animation: slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }

      /* Layout */
      .sidebar-container { background-color: var(--color-primary); height: 100vh; width: 280px; color: var(--color-white); position: fixed; top: 0; left: 0; display: flex; flex-direction: column; z-index: 1000; box-shadow: 4px 0 15px rgba(0,33,71,0.15); }
      .sidebar-header { padding: 2.5rem 2rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
      .sidebar-title { color: var(--color-accent); font-weight: 700; letter-spacing: 1.5px; margin: 0; font-size: 1.6rem; text-transform: uppercase; }
      
      .nav-menu { display: flex; flex-direction: column; padding: 1.5rem 1rem; gap: 0.8rem; flex-grow: 1; }
      .nav-btn { background: transparent; color: #B0C4DE; border: none; padding: 0.9rem 1.2rem; transition: 0.3s; text-align: left; font-weight: 500; border-radius: 6px; font-size: 1rem; display: flex; align-items: center; }
      .nav-btn:hover { color: white; background: rgba(255,255,255,0.05); transform: translateX(5px); }
      .nav-btn.active-btn { background: var(--color-accent); color: var(--color-primary); font-weight: 700; box-shadow: 0 4px 12px rgba(212,175,55,0.3); }

      .user-footer { padding: 1.5rem 2rem; background: rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.05); }
      .profile-info { display: flex; align-items: center; gap: 12px; cursor: pointer; transition: opacity 0.2s; }
      .profile-info:hover { opacity: 0.8; }

      .main-content { margin-left: 280px; padding: 3rem 4rem; min-height: 100vh; }

      /* Interview Interface */
      .interview-container { display: grid; grid-template-columns: 2fr 1.5fr; gap: 2rem; height: 75vh; }

      /* Camera Card */
      .camera-card {
        background: black; border-radius: 16px; overflow: hidden; position: relative;
        box-shadow: 0 10px 30px rgba(0, 33, 71, 0.2); display: flex; align-items: center; justify-content: center;
      }
      .live-video { width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); }
      .camera-overlay {
        position: absolute; bottom: 20px; left: 20px; background: rgba(0, 0, 0, 0.6);
        color: white; padding: 5px 12px; border-radius: 20px; font-size: 0.8rem;
        display: flex; align-items: center; gap: 8px;
      }
      .recording-dot { width: 10px; height: 10px; background-color: red; border-radius: 50%; animation: pulse-red 1.5s infinite; }

      /* Chat Card */
      .chat-card {
        background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        padding: 2rem; display: flex; flex-direction: column; border-top: 4px solid var(--color-primary);
      }
      .ai-bubble {
        background-color: #F0F4F8; border-left: 4px solid var(--color-primary);
        padding: 1.5rem; border-radius: 0 12px 12px 12px; margin-bottom: 2rem; position: relative;
      }
      .ai-label {
        position: absolute; top: -12px; left: 0; background: var(--color-primary); color: white;
        font-size: 0.7rem; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px;
      }

      .user-input-area { margin-top: auto; text-align: center; }
      
      .mic-btn {
        width: 60px; height: 60px; border-radius: 50%; border: none;
        background-color: #E2E8F0; color: var(--color-secondary);
        display: flex; align-items: center; justify-content: center;
        transition: all 0.3s ease; margin: 0 auto 1rem;
      }
      .mic-btn.listening { background-color: var(--color-accent); color: var(--color-primary); animation: pulse-gold 1.5s infinite; }
      .mic-btn:hover { transform: scale(1.05); }

      .form-control { border: 2px solid #E2E8F0; border-radius: 12px; padding: 1rem; background: #F8FAFC; resize: none; width: 100%; }
      .form-control:focus { border-color: var(--color-primary); background: white; outline: none; box-shadow: 0 0 0 4px rgba(0,33,71,0.1); }

      .btn-submit {
        width: 100%; padding: 1rem; border-radius: 8px; border: none; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;
        background-color: var(--color-primary); color: white; margin-top: 1rem; transition: 0.2s;
      }
      .btn-submit:hover { background-color: #003366; transform: translateY(-2px); }
      .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

      @media (max-width: 992px) {
        .sidebar-container { display: none; }
        .main-content { margin-left: 0; padding: 1rem; }
        .interview-container { grid-template-columns: 1fr; height: auto; }
        .camera-card { height: 300px; }
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
          <button className="nav-btn active-btn">
            <span>Mock-V Live</span>
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
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="d-flex justify-content-between align-items-center mb-4 animate-entrance">
          <div>
            <h2
              className="hero-title mb-0"
              style={{ color: "#002147", fontWeight: "800" }}
            >
              Live Interview
            </h2>
            <p className="hero-sub mb-0">
              Question {questionNumber} •{" "}
              <span style={{ color: "#D4AF37" }}>AI Is Listening</span>
            </p>
          </div>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => navigate("/dashboard")}
          >
            End Session
          </button>
        </div>

        <div className="interview-container">
          {/* LEFT: Camera Feed */}
          <div
            className="camera-card animate-entrance"
            style={{ animationDelay: "0.1s" }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="live-video"
            />
            <div className="camera-overlay">
              <div className="recording-dot"></div>
              <span>LIVE</span>
            </div>
          </div>

          {/* RIGHT: Chat & Controls */}
          <div
            className="chat-card animate-entrance"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="ai-bubble">
              <span className="ai-label">AI Interviewer</span>
              <p
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#002147",
                  marginBottom: 0,
                }}
              >
                {question}
              </p>
            </div>

            <div className="user-input-area">
              <button
                className={`mic-btn ${isListening ? "listening" : ""}`}
                onClick={toggleListening}
                title={isListening ? "Stop Listening" : "Start Speaking"}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z" />
                  <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z" />
                </svg>
              </button>

              <textarea
                className="form-control"
                rows="4"
                placeholder="Speak now or type your answer..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />

              <button
                className="btn-submit"
                onClick={submitAnswer}
                disabled={loading}
              >
                {loading ? "Evaluating..." : "Submit Answer"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
