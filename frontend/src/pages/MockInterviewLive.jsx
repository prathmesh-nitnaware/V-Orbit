import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import * as faceapi from "face-api.js"; // <--- 1. IMPORT AI
import config from "../utils/config"; // <--- ADDED THIS IMPORT
import "bootstrap/dist/css/bootstrap.min.css";

export default function MockInterviewLive() {
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef(null);
  const audioRef = useRef(new Audio());

  const interviewId = location.state?.interviewId;
  const firstQuestion = location.state?.question;

  // --- State ---
  const [user, setUser] = useState(null);
  const [question, setQuestion] = useState(firstQuestion || "");
  const [audioUrl, setAudioUrl] = useState(location.state?.audioUrl || "");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(
    location.state?.questionNumber || 1,
  );
  const [isListening, setIsListening] = useState(false);

  // --- PROCTORING STATE ---
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [proctorStatus, setProctorStatus] = useState("Loading AI..."); // "Verified", "Warning", "Error"
  const [warningMsg, setWarningMsg] = useState("");

  // --- 2. SECURITY CHECK ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) setUser(currentUser);
      else {
        if (localStorage.getItem("userMode") === "guest")
          setUser({ displayName: "Guest" });
        else navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // --- 3. LOAD MODELS ---
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "/models";
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        setModelsLoaded(true);
        console.log("Proctoring AI Loaded");
      } catch (e) {
        console.error("Model Load Failed", e);
      }
    };
    loadModels();
  }, []);

  // --- 4. CAMERA & PROCTORING LOOP ---
  useEffect(() => {
    if (!interviewId || !question) {
      navigate("/dashboard");
      return;
    }

    let intervalId;

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
        alert("Please enable camera for AI Proctoring.");
      }
    };

    // --- THE PROCTORING LOGIC ---
    const startProctoring = () => {
      intervalId = setInterval(async () => {
        if (videoRef.current && modelsLoaded) {
          // Detect faces
          const detections = await faceapi.detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions(),
          );

          const faceCount = detections.length;

          if (faceCount === 0) {
            setProctorStatus("Warning");
            setWarningMsg("⚠️ No face detected!");
          } else if (faceCount > 1) {
            setProctorStatus("Warning");
            setWarningMsg("⚠️ Multiple faces detected!");
          } else {
            setProctorStatus("Verified");
            setWarningMsg("");
          }
        }
      }, 1000); // Scan every 1 second
    };

    startCamera().then(() => startProctoring());

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      clearInterval(intervalId); // Stop scanning on unmount
    };
  }, [interviewId, question, navigate, modelsLoaded]);

  // --- 5. Audio Playback ---
  useEffect(() => {
    if (audioUrl) {
      audioRef.current.src = audioUrl;
      audioRef.current
        .play()
        .catch((err) => console.error("Audio play error:", err));
    }
  }, [audioUrl]);

  // --- 6. Speech Recognition ---
  const toggleListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser not supported. Use Chrome.");

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

  // --- 7. Submit Answer ---
  const submitAnswer = async () => {
    if (!answer.trim()) return;
    audioRef.current.pause();
    setLoading(true);

    try {
      // UPDATED: Use dynamic URL from config
      const res = await axios.post(`${config.API_BASE_URL}/api/mock/answer`, {
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
      console.error(err);
      alert("Error submitting answer.");
    } finally {
      setLoading(false);
    }
  };

  // --- Styles Injection ---
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      :root { --color-primary: #002147; --color-secondary: #708090; --color-bg: #F8FAFC; --color-accent: #D4AF37; --color-white: #FFFFFF; }
      body { background-color: var(--color-bg); font-family: 'Segoe UI', sans-serif; overflow-x: hidden; }

      @keyframes pulse-gold { 0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(212, 175, 55, 0); } 100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); } }
      @keyframes pulse-red { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
      @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      .animate-entrance { animation: slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }

      /* Layout */
      .sidebar-container { background-color: var(--color-primary); height: 100vh; width: 280px; position: fixed; top: 0; left: 0; display: flex; flex-direction: column; z-index: 1000; box-shadow: 4px 0 15px rgba(0,33,71,0.15); }
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
      .interview-container { display: grid; grid-template-columns: 2fr 1.5fr; gap: 2rem; height: 75vh; }

      /* Camera Card - PROCTORING UPDATE */
      .camera-card {
        background: black; border-radius: 16px; overflow: hidden; position: relative;
        box-shadow: 0 10px 30px rgba(0, 33, 71, 0.2); display: flex; align-items: center; justify-content: center;
        border: 4px solid transparent; transition: border-color 0.3s ease;
      }
      /* Dynamic Border based on Status */
      .border-verified { border-color: #28a745; }
      .border-warning { border-color: #dc3545; }

      .live-video { width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); }
      
      .camera-overlay {
        position: absolute; bottom: 20px; left: 20px; background: rgba(0, 0, 0, 0.6);
        color: white; padding: 5px 12px; border-radius: 20px; font-size: 0.8rem;
        display: flex; align-items: center; gap: 8px;
      }
      .warning-overlay {
        position: absolute; top: 20px; left: 50%; transform: translateX(-50%);
        background: #dc3545; color: white; padding: 8px 16px; border-radius: 8px;
        font-weight: bold; font-size: 0.9rem; animation: pulse-red 1s infinite;
      }
      
      .recording-dot { width: 10px; height: 10px; background-color: red; border-radius: 50%; animation: pulse-red 1.5s infinite; }

      /* Chat Card */
      .chat-card { background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); padding: 2rem; display: flex; flex-direction: column; border-top: 4px solid var(--color-primary); }
      .ai-bubble { background-color: #F0F4F8; border-left: 4px solid var(--color-primary); padding: 1.5rem; border-radius: 0 12px 12px 12px; margin-bottom: 2rem; position: relative; }
      .ai-label { position: absolute; top: -12px; left: 0; background: var(--color-primary); color: white; font-size: 0.7rem; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px; }
      .user-input-area { margin-top: auto; text-align: center; }
      .mic-btn { width: 60px; height: 60px; border-radius: 50%; border: none; background-color: #E2E8F0; color: var(--color-secondary); display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; margin: 0 auto 1rem; }
      .mic-btn.listening { background-color: var(--color-accent); color: var(--color-primary); animation: pulse-gold 1.5s infinite; }
      .mic-btn:hover { transform: scale(1.05); }
      .form-control { border: 2px solid #E2E8F0; border-radius: 12px; padding: 1rem; background: #F8FAFC; resize: none; width: 100%; }
      .form-control:focus { border-color: var(--color-primary); background: white; outline: none; box-shadow: 0 0 0 4px rgba(0,33,71,0.1); }
      .btn-submit { width: 100%; padding: 1rem; border-radius: 8px; border: none; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; background-color: var(--color-primary); color: white; margin-top: 1rem; transition: 0.2s; }
      .btn-submit:hover { background-color: #003366; transform: translateY(-2px); }
      .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

      @media (max-width: 992px) { .sidebar-container { display: none; } .main-content { margin-left: 0; padding: 1rem; } .interview-container { grid-template-columns: 1fr; height: auto; } .camera-card { height: 300px; } }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="container-fluid p-0">
      <div className="sidebar-container">
        <div className="sidebar-header">
          <h2 className="sidebar-title">V-Orbit</h2>
        </div>
        <div className="nav-menu">
          <button className="nav-btn" onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>
          <button className="nav-btn" onClick={() => navigate("/insight")}>
            Insight-VIT
          </button>
          <button className="nav-btn active-btn">Mock-V Live</button>
          <button
            className="nav-btn"
            onClick={() => navigate("/resume-scorer")}
          >
            Resume Scorer
          </button>
          <button className="nav-btn">Lectures</button>
        </div>
        <div className="user-footer">
          <div className="profile-info">
            <span className="small fw-bold text-white">
              {user ? user.displayName?.split(" ")[0] : "Student"}
            </span>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="d-flex justify-content-between align-items-center mb-4 animate-entrance">
          <div>
            <h2 className="hero-title mb-0">Live Interview</h2>
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
          {/* LEFT: Camera Feed with AI Overlay */}
          <div
            className={`camera-card animate-entrance ${proctorStatus === "Warning" ? "border-warning" : "border-verified"}`}
            style={{ animationDelay: "0.1s" }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="live-video"
            />

            {/* Live Indicator */}
            <div className="camera-overlay">
              <div className="recording-dot"></div>
              <span>PROCTOR: {proctorStatus.toUpperCase()}</span>
            </div>

            {/* Warning Message */}
            {warningMsg && <div className="warning-overlay">{warningMsg}</div>}
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