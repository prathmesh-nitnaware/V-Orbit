import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; 

export default function MockInterviewLive() {
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef(null);

  const interviewId = location.state?.interviewId;
  const firstQuestion = location.state?.question;

  const [question, setQuestion] = useState(firstQuestion || "");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(location.state?.questionNumber || 1);
  const [isListening, setIsListening] = useState(false);

  // --- 1. Camera Setup ---
  useEffect(() => {
    // Safety check
    if (!interviewId || !question) {
      navigate("/dashboard");
      return;
    }

    // Request Camera Access
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        alert("Please enable camera permissions for the live interview experience.");
      }
    };

    startCamera();

    // Cleanup: Stop camera when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      window.speechSynthesis.cancel(); // Stop AI speaking
    };
  }, [interviewId, question, navigate]);

  // --- 2. Text-to-Speech (AI Voice) ---
  useEffect(() => {
    if (!question) return;
    
    // Simple delay to make it feel natural
    const timer = setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(question);
      utterance.rate = 1; 
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }, 1000);

    return () => clearTimeout(timer);
  }, [question]);

  // --- 3. Speech-to-Text (Microphone) ---
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Your browser does not support voice recognition. Please use Chrome.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return; // Stop logic handled by 'end' event usually, but we can rely on UI toggle
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join("");
      setAnswer(transcript);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  // --- Logic: Submit Answer ---
  const submitAnswer = async () => {
    if (!answer.trim()) return;
    window.speechSynthesis.cancel(); // Stop speaking if user interrupts
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/mock/answer",
        { interviewId, answer }
      );

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
      setQuestionNumber(prev => prev + 1);
      setAnswer("");
    } catch (err) {
      console.error("Answer Error:", err);
      alert("Something went wrong. Please try again.");
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

      /* Animation */
      @keyframes pulse-gold {
        0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4); }
        70% { box-shadow: 0 0 0 10px rgba(212, 175, 55, 0); }
        100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
      }

      @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      .animate-entrance { animation: slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }

      /* Layout */
      .sidebar-container { background-color: var(--color-primary); height: 100vh; width: 280px; color: var(--color-white); position: fixed; top: 0; left: 0; display: flex; flex-direction: column; z-index: 1000; }
      .nav-menu { padding: 2rem 1rem; }
      .nav-btn { background: transparent; color: #B0C4DE; border: none; padding: 1rem; width: 100%; text-align: left; font-weight: 500; border-radius: 8px; margin-bottom: 0.5rem; transition: 0.2s; }
      .nav-btn.active-btn { background: var(--color-accent); color: var(--color-primary); font-weight: 700; }
      .main-content { margin-left: 280px; padding: 3rem 4rem; min-height: 100vh; }

      /* Video & Chat Interface */
      .interview-container {
        display: grid;
        grid-template-columns: 2fr 1.5fr;
        gap: 2rem;
        height: 75vh;
      }

      /* Camera Card */
      .camera-card {
        background: black;
        border-radius: 16px;
        overflow: hidden;
        position: relative;
        box-shadow: 0 10px 30px rgba(0, 33, 71, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .live-video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transform: scaleX(-1); /* Mirror effect */
      }

      .camera-overlay {
        position: absolute;
        bottom: 20px;
        left: 20px;
        background: rgba(0, 0, 0, 0.6);
        color: white;
        padding: 5px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .recording-dot {
        width: 10px; height: 10px; background-color: red; border-radius: 50%;
        animation: pulse-red 1.5s infinite;
      }

      /* Chat/Question Card */
      .chat-card {
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        padding: 2rem;
        display: flex;
        flex-direction: column;
        border-top: 4px solid var(--color-primary);
      }

      .ai-bubble {
        background-color: #F0F4F8;
        border-left: 4px solid var(--color-primary);
        padding: 1.5rem;
        border-radius: 0 12px 12px 12px;
        margin-bottom: 2rem;
        position: relative;
      }
      
      .ai-label {
        position: absolute; top: -12px; left: 0;
        background: var(--color-primary); color: white;
        font-size: 0.7rem; padding: 2px 8px; border-radius: 4px;
        text-transform: uppercase; letter-spacing: 1px;
      }

      .user-input-area {
        margin-top: auto;
      }

      .mic-btn {
        width: 60px; height: 60px;
        border-radius: 50%;
        border: none;
        background-color: #E2E8F0;
        color: var(--color-secondary);
        display: flex; align-items: center; justify-content: center;
        transition: all 0.3s ease;
        margin: 0 auto 1rem;
      }

      .mic-btn.listening {
        background-color: var(--color-accent);
        color: var(--color-primary);
        animation: pulse-gold 1.5s infinite;
      }

      .form-control { border: 2px solid #E2E8F0; border-radius: 12px; padding: 1rem; background: #F8FAFC; resize: none; }
      .form-control:focus { border-color: var(--color-primary); background: white; outline: none; }

      .btn-submit {
        width: 100%; padding: 1rem; border-radius: 8px; border: none; font-weight: 700;
        background-color: var(--color-primary); color: white; margin-top: 1rem;
        transition: 0.2s;
      }
      .btn-submit:hover { background-color: #003366; }
      .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

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
        <div style={{padding: '2rem'}}>
          <h2 style={{color: '#D4AF37', fontWeight: '800'}}>V-Orbit</h2>
        </div>
        <div className="nav-menu">
          <button className="nav-btn" onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button className="nav-btn active-btn">Mock-V Live</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        
        <div className="d-flex justify-content-between align-items-center mb-4 animate-entrance">
          <div>
            <h2 className="hero-title mb-0">Live Interview</h2>
            <p className="hero-sub mb-0">Role: <span style={{color:'#D4AF37'}}>Full Stack Developer</span> • Question {questionNumber}</p>
          </div>
          <button className="btn btn-outline-danger btn-sm" onClick={() => navigate("/dashboard")}>End Session</button>
        </div>

        <div className="interview-container">
          
          {/* LEFT: Camera Feed */}
          <div className="camera-card animate-entrance" style={{animationDelay: '0.1s'}}>
            <video ref={videoRef} autoPlay playsInline muted className="live-video" />
            <div className="camera-overlay">
              <div className="recording-dot"></div>
              <span>REC</span>
            </div>
          </div>

          {/* RIGHT: AI Interaction */}
          <div className="chat-card animate-entrance" style={{animationDelay: '0.2s'}}>
            
            {/* AI Question Bubble */}
            <div className="ai-bubble">
              <span className="ai-label">AI Interviewer</span>
              <p style={{fontSize: '1.25rem', fontWeight: '600', color: '#002147', marginBottom: 0}}>
                {question}
              </p>
            </div>

            {/* Controls */}
            <div className="user-input-area">
              
              {/* Mic Button */}
              <button 
                className={`mic-btn ${isListening ? 'listening' : ''}`}
                onClick={toggleListening}
                title={isListening ? "Stop Listening" : "Start Speaking"}
              >
                <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z"/>
                  <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
                </svg>
              </button>

              <textarea 
                className="form-control" 
                rows="4" 
                placeholder="Your answer will appear here as you speak..." 
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />

              <button 
                className="btn-submit" 
                onClick={submitAnswer}
                disabled={loading}
              >
                {loading ? "Analyzing..." : "Submit Answer"}
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}