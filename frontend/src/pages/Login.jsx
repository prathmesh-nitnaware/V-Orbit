import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- 1. Google Login Logic ---
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check Backend
      try {
        const res = await axios.post(
          "http://localhost:3000/api/auth/google-login",
          { email: user.email }
        );

        if (res.data.exists) {
          localStorage.setItem("userMode", "authenticated"); // Mark as auth
          navigate("/dashboard");
        } else {
          navigate("/register", {
            state: {
              uid: user.uid,
              email: user.email,
              fullName: user.displayName,
              photoURL: user.photoURL,
            },
          });
        }
      } catch (backendError) {
        console.error("Backend Error:", backendError);
        // Fallback if backend is down but Firebase worked
        localStorage.setItem("userMode", "authenticated");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Google Auth Error:", err);
      setError("Failed to sign in with Google. Try Guest Mode below.");
    } finally {
      setLoading(false);
    }
  };

  // --- 2. Guest Login Logic (The Bypass) ---
  const handleGuestLogin = () => {
    localStorage.setItem("userMode", "guest");
    navigate("/dashboard");
  };

  // --- Styles ---
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      :root {
        --color-primary: #002147;
        --color-bg: #F8FAFC;
        --color-white: #FFFFFF;
        --color-accent: #D4AF37;
      }
      body {
        background-color: var(--color-bg);
        color: #333;
        font-family: 'Segoe UI', 'Roboto', sans-serif;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
      }
      .animate-entrance { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
      @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

      .auth-card {
        background: var(--color-white);
        border: none;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 33, 71, 0.08);
        padding: 3rem 2.5rem;
        width: 100%;
        max-width: 450px;
        position: relative;
        overflow: hidden;
        text-align: center;
      }
      .auth-card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 5px; background: var(--color-primary); }
      
      .brand-title { color: var(--color-primary); font-weight: 800; letter-spacing: 1px; margin-bottom: 0.5rem; }
      .brand-subtitle { color: #708090; font-size: 0.95rem; margin-bottom: 2rem; }

      .btn-google {
        display: flex; align-items: center; justify-content: center; gap: 12px; width: 100%; padding: 1rem;
        border: 2px solid #E2E8F0; border-radius: 8px; background: white; color: #333; font-weight: 600; font-size: 1rem;
        transition: all 0.2s ease; cursor: pointer; margin-bottom: 1rem;
      }
      .btn-google:hover { border-color: var(--color-primary); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); transform: translateY(-2px); }
      
      /* Guest Button Style */
      .btn-guest {
        width: 100%; padding: 0.8rem; background: #E2E8F0; color: #333; border: none; border-radius: 8px;
        font-weight: 600; cursor: pointer; transition: 0.2s; font-size: 0.95rem;
      }
      .btn-guest:hover { background: var(--color-accent); color: var(--color-primary); }

      .divider { margin: 1.5rem 0; color: #adb5bd; font-size: 0.85rem; font-weight: 500; }
      .error-msg { color: #dc3545; font-size: 0.9rem; margin-bottom: 1rem; background: #FFF5F5; padding: 0.5rem; border-radius: 4px; }
      .footer-text { font-size: 0.85rem; color: #708090; margin-top: 2rem; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="auth-card animate-entrance">
        <h2 className="brand-title">Welcome Back</h2>
        <p className="brand-subtitle">Sign in to access your V-Orbit dashboard.</p>

        {error && <div className="error-msg">{error}</div>}

        <button className="btn-google" onClick={handleGoogleLogin} disabled={loading}>
          {loading ? (
            <div className="spinner-border spinner-border-sm text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            <>
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Sign in with Google</span>
            </>
          )}
        </button>

        <div className="divider">OR</div>

        {/* Guest Button to Bypass Error */}
        <button className="btn-guest" onClick={handleGuestLogin}>
          Continue as Guest (Demo Mode)
        </button>

        <div className="footer-text">V-Orbit · The Gold Standard for Engineers</div>
      </div>
    </div>
  );
}