import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; 

export default function Register() {
  const navigate = useNavigate();

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
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
      }

      /* --- ANIMATIONS --- */
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .animate-entrance {
        animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        opacity: 0;
      }

      /* --- AUTH CARD --- */
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
      }

      .auth-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 5px;
        background: var(--color-primary);
      }

      .brand-title {
        color: var(--color-primary);
        font-weight: 800;
        letter-spacing: 1px;
        margin-bottom: 0.5rem;
        text-align: center;
      }

      .brand-subtitle {
        color: var(--color-secondary);
        font-size: 0.95rem;
        text-align: center;
        margin-bottom: 2rem;
      }

      /* --- FORMS --- */
      .form-label {
        color: var(--color-primary);
        font-weight: 700;
        font-size: 0.85rem;
        text-transform: uppercase;
        margin-bottom: 0.5rem;
      }

      .form-control {
        border: 2px solid #E2E8F0;
        border-radius: 8px;
        padding: 0.8rem 1rem;
        font-size: 1rem;
        background-color: #F8FAFC;
        transition: all 0.2s;
      }

      .form-control:focus {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 4px rgba(0, 33, 71, 0.1);
        background-color: #fff;
        outline: none;
      }

      /* --- BUTTONS --- */
      .btn-gold {
        background-color: var(--color-accent);
        color: var(--color-primary);
        font-weight: 800;
        border: none;
        padding: 1rem;
        border-radius: 8px;
        letter-spacing: 1px;
        text-transform: uppercase;
        width: 100%;
        transition: transform 0.2s, box-shadow 0.2s;
        margin-top: 1.5rem;
      }

      .btn-gold:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
        color: var(--color-primary);
      }

      .login-link {
        text-align: center;
        margin-top: 1.5rem;
        font-size: 0.9rem;
        color: var(--color-secondary);
      }
      
      .login-link a {
        color: var(--color-primary);
        font-weight: 700;
        text-decoration: none;
        transition: color 0.2s;
      }
      
      .login-link a:hover {
        color: var(--color-accent);
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      
      <div className="auth-card animate-entrance">
        
        <h2 className="brand-title">Join V-Orbit</h2>
        <p className="brand-subtitle">Start your journey to career excellence.</p>

        <form onSubmit={(e) => { e.preventDefault(); navigate("/dashboard"); }}>
          
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-control" placeholder="John Doe" />
          </div>

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-control" placeholder="name@vit.ac.in" />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" placeholder="••••••••" />
          </div>

          <button type="submit" className="btn-gold">
            Create Account
          </button>

          <div className="login-link">
            Already have an account? <span style={{cursor:'pointer'}} onClick={() => navigate("/login")}><a>Login here</a></span>
          </div>
          
          <div className="text-center mt-3">
            <small className="text-muted" style={{fontSize: '0.75rem'}}>
              * Firebase authentication integration pending
            </small>
          </div>

        </form>
      </div>
      
    </div>
  );
}