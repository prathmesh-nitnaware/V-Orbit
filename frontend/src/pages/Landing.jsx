import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; 

export default function Landing() {
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
        overflow-x: hidden;
      }

      /* --- ANIMATIONS --- */
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .animate-entrance {
        animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        opacity: 0;
      }

      /* --- NAVBAR --- */
      .landing-nav {
        padding: 1.5rem 0;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 10;
      }

      .nav-brand {
        color: var(--color-primary);
        font-weight: 800;
        font-size: 1.5rem;
        letter-spacing: 1px;
        text-decoration: none;
      }

      /* --- HERO SECTION --- */
      .hero-section {
        background-color: var(--color-primary);
        color: var(--color-white);
        padding: 8rem 0 6rem;
        position: relative;
        overflow: hidden;
        border-bottom-right-radius: 80px; /* Modern asymmetrical design */
      }

      /* Subtle background accent */
      .hero-section::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -10%;
        width: 600px;
        height: 600px;
        background: radial-gradient(circle, rgba(212,175,55,0.1) 0%, rgba(0,33,71,0) 70%);
        border-radius: 50%;
      }

      .hero-title {
        font-size: 3.5rem;
        font-weight: 800;
        margin-bottom: 1rem;
        line-height: 1.2;
      }

      .hero-title span {
        color: var(--color-accent);
      }

      .hero-lead {
        font-size: 1.25rem;
        color: #B0C4DE; /* Light steel blue for readability */
        margin-bottom: 2.5rem;
        max-width: 600px;
      }

      /* --- BUTTONS --- */
      .btn-gold {
        background-color: var(--color-accent);
        color: var(--color-primary);
        font-weight: 800;
        border: none;
        padding: 1rem 2.5rem;
        border-radius: 8px;
        letter-spacing: 1px;
        text-transform: uppercase;
        transition: transform 0.2s, box-shadow 0.2s;
        text-decoration: none;
        display: inline-block;
      }

      .btn-gold:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 25px rgba(212, 175, 55, 0.4);
        color: var(--color-primary);
      }

      .btn-outline-light-custom {
        border: 2px solid rgba(255,255,255,0.3);
        color: white;
        font-weight: 700;
        padding: 0.9rem 2rem;
        border-radius: 8px;
        margin-left: 1rem;
        transition: all 0.2s;
      }

      .btn-outline-light-custom:hover {
        border-color: var(--color-white);
        background-color: rgba(255,255,255,0.1);
        color: white;
      }

      /* --- FEATURES SECTION --- */
      .features-section {
        padding: 5rem 0;
      }

      .feature-card {
        background: white;
        padding: 2.5rem;
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        height: 100%;
        transition: transform 0.3s ease;
        border-top: 4px solid var(--color-primary);
      }

      .feature-card:hover {
        transform: translateY(-10px);
      }

      .feature-icon {
        width: 60px;
        height: 60px;
        background-color: #F0F4F8;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1.5rem;
        color: var(--color-primary);
      }

      .feature-title {
        color: var(--color-primary);
        font-weight: 700;
        margin-bottom: 0.5rem;
      }

      .feature-text {
        color: var(--color-secondary);
        font-size: 0.95rem;
      }

      /* --- FOOTER --- */
      .landing-footer {
        text-align: center;
        padding: 3rem 0;
        color: var(--color-secondary);
        font-size: 0.9rem;
        border-top: 1px solid #E2E8F0;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .hero-title { font-size: 2.5rem; }
        .hero-section { text-align: center; padding-top: 6rem; }
        .hero-lead { margin-left: auto; margin-right: auto; }
        .btn-outline-light-custom { margin-left: 0; margin-top: 1rem; display: block; width: 100%; }
        .btn-gold { display: block; width: 100%; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div>
      
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="container d-flex justify-content-between align-items-center">
          <span className="nav-brand" style={
             // Inverting color for navbar when on top of hero might be tricky with fixed position, 
             // but since hero is top, let's make navbar text white inside hero area logic.
             // Actually, simplest is to let it sit on top.
             {color: 'white'}
          }>V-Orbit</span>
          <div>
            <button 
              className="btn btn-sm text-white fw-bold me-3" 
              onClick={() => navigate("/login")}
            >
              Log In
            </button>
            <button 
              className="btn btn-sm bg-white text-dark fw-bold px-3 py-2 rounded" 
              onClick={() => navigate("/register")}
            >
              Join Now
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7 animate-entrance">
              <h1 className="hero-title">
                Orbiting Towards <br />
                <span>Career Success.</span>
              </h1>
              <p className="hero-lead">
                The comprehensive placement and academic readiness platform exclusively for VIT students. Master your interviews, optimize your resume, and query academic docs with AI.
              </p>
              <div className="d-flex flex-wrap">
                <button className="btn-gold" onClick={() => navigate("/register")}>
                  Get Started
                </button>
                <button className="btn-outline-light-custom" onClick={() => navigate("/login")}>
                  Sign In
                </button>
              </div>
            </div>
            
            {/* Visual Abstract / Illustration Placeholder */}
            <div className="col-lg-5 d-none d-lg-block animate-entrance" style={{animationDelay: '0.2s'}}>
              {/* Abstract simple illustration using CSS shapes */}
              <div style={{
                width: '100%',
                height: '400px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '20px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                 <div style={{
                   width: '150px', height: '150px', borderRadius: '50%', background: '#D4AF37',
                   boxShadow: '0 0 60px rgba(212,175,55,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                 }}>
                   <span style={{color: '#002147', fontWeight: '800', fontSize: '3rem'}}>V</span>
                 </div>
                 {/* Orbit ring */}
                 <div style={{
                   position: 'absolute', width: '280px', height: '280px', 
                   border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '50%',
                   animation: 'spin 10s linear infinite'
                 }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid (Replaces FeatureCard.jsx) */}
      <section className="features-section container">
        <div className="row g-4">
          
          {/* Feature 1 */}
          <div className="col-md-4 animate-entrance" style={{animationDelay: '0.3s'}}>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z"/>
                </svg>
              </div>
              <h4 className="feature-title">Mock-V</h4>
              <p className="feature-text">
                AI-driven mock interviews tailored to specific job roles and difficulties. Get instant feedback on your answers.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="col-md-4 animate-entrance" style={{animationDelay: '0.4s'}}>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
                </svg>
              </div>
              <h4 className="feature-title">Resume Scorer</h4>
              <p className="feature-text">
                Beat the ATS. Upload your PDF and compare it against job descriptions to identify missing keywords and skills.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="col-md-4 animate-entrance" style={{animationDelay: '0.5s'}}>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
                </svg>
              </div>
              <h4 className="feature-title">Insight-VIT</h4>
              <p className="feature-text">
                Your Academic Oracle. Query official VIT documents and syllabus PDFs to get precise answers instantly.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Footer (Replaces Footer.jsx) */}
      <footer className="landing-footer">
        <div className="container">
          <p>© 2026 V-Orbit. Built for VITians, Powered by AI.</p>
        </div>
      </footer>

    </div>
  );
}