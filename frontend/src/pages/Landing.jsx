import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // <--- Import Framer Motion
import "bootstrap/dist/css/bootstrap.min.css";

export default function Landing() {
  const navigate = useNavigate();

  // --- Animation Variants ---
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // --- Styles Injection (Kept your core styling) ---
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

      /* Navbar */
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

      /* Hero Section */
      .hero-section {
        min-height: 100vh;
        display: flex;
        align-items: center;
        background: linear-gradient(135deg, #F8FAFC 0%, #E6EEF5 100%);
        position: relative;
        overflow: hidden;
      }

      /* Abstract Background Shapes */
      .hero-bg-blob {
        position: absolute;
        width: 600px;
        height: 600px;
        background: radial-gradient(circle, rgba(212,175,55,0.08) 0%, rgba(0,33,71,0) 70%);
        border-radius: 50%;
        top: -20%;
        right: -10%;
        z-index: 0;
      }

      .hero-title {
        font-size: 4rem;
        font-weight: 800;
        margin-bottom: 1.5rem;
        line-height: 1.1;
        color: var(--color-primary);
      }

      .hero-title span {
        color: var(--color-accent);
      }

      .hero-lead {
        font-size: 1.25rem;
        color: var(--color-secondary);
        margin-bottom: 2.5rem;
        max-width: 550px;
        line-height: 1.6;
      }

      /* Buttons */
      .btn-gold {
        background-color: var(--color-accent);
        color: var(--color-primary);
        font-weight: 800;
        border: none;
        padding: 1rem 2.5rem;
        border-radius: 50px;
        letter-spacing: 1px;
        text-transform: uppercase;
        box-shadow: 0 10px 20px rgba(212, 175, 55, 0.3);
        text-decoration: none;
        display: inline-block;
      }

      .btn-outline {
        border: 2px solid var(--color-primary);
        color: var(--color-primary);
        font-weight: 700;
        padding: 0.9rem 2rem;
        border-radius: 50px;
        margin-left: 1rem;
        background: transparent;
      }

      /* Features */
      .feature-card {
        background: white;
        padding: 2.5rem;
        border-radius: 20px;
        box-shadow: 0 15px 40px rgba(0,33,71,0.05);
        height: 100%;
        border-bottom: 4px solid var(--color-accent);
        transition: all 0.3s;
      }

      .feature-icon {
        width: 64px;
        height: 64px;
        background-color: #F0F4F8;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1.5rem;
        color: var(--color-primary);
        font-size: 1.5rem;
      }

      .feature-title { color: var(--color-primary); font-weight: 700; margin-bottom: 0.8rem; }
      .feature-text { color: var(--color-secondary); font-size: 0.95rem; line-height: 1.6; }

      @media (max-width: 992px) {
        .hero-section { padding-top: 8rem; text-align: center; display: block; }
        .hero-lead { margin: 0 auto 2rem auto; }
        .hero-title { font-size: 3rem; }
        .btn-outline { margin-left: 0; margin-top: 1rem; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div>
      {/* Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="landing-nav"
      >
        <div className="container d-flex justify-content-between align-items-center">
          <span className="nav-brand">V-Orbit</span>
          <div>
            <button
              className="btn btn-sm text-secondary fw-bold me-3"
              onClick={() => navigate("/login")}
            >
              Log In
            </button>
            <button
              className="btn btn-sm text-white fw-bold px-4 py-2 rounded-pill"
              style={{ background: "var(--color-primary)" }}
              onClick={() => navigate("/login")}
            >
              Join Now
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-blob"></div>

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="row align-items-center">
            {/* Left: Text Content */}
            <motion.div
              className="col-lg-6"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <span className="badge bg-light text-primary border border-primary px-3 py-2 rounded-pill mb-3 fw-bold">
                  ★ The Gold Standard for VITians
                </span>
              </motion.div>

              <motion.h1 className="hero-title" variants={fadeInUp}>
                Master Your <br />
                <span>Engineering Arc.</span>
              </motion.h1>

              <motion.p className="hero-lead" variants={fadeInUp}>
                The first AI-native platform bridging academic theory with
                industry reality. Experience <b>Computer Vision Proctoring</b>,{" "}
                <b>Hybrid RAG Syllabus Search</b>, and{" "}
                <b>Holographic Resume Scoring</b>.
              </motion.p>

              <motion.div variants={fadeInUp}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-gold"
                  onClick={() => navigate("/login")}
                >
                  Launch Console
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-outline"
                  onClick={() => navigate("/login")}
                >
                  Login
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right: Visual Abstract (Animated Orbit) */}
            <div className="col-lg-6 d-none d-lg-block">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                style={{
                  width: "100%",
                  height: "500px",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Central Core */}
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    width: "180px",
                    height: "180px",
                    background: "var(--color-primary)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 20px 50px rgba(0,33,71,0.3)",
                    zIndex: 2,
                    color: "#D4AF37",
                    fontSize: "4rem",
                    fontWeight: "800",
                  }}
                >
                  V
                </motion.div>

                {/* Orbit Rings */}
                <motion.div
                  style={{
                    position: "absolute",
                    width: "350px",
                    height: "350px",
                    border: "2px dashed #D4AF37",
                    borderRadius: "50%",
                    zIndex: 1,
                  }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {/* Planet 1 */}
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      background: "#D4AF37",
                      borderRadius: "50%",
                      position: "absolute",
                      top: "0",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  ></div>
                </motion.div>

                <motion.div
                  style={{
                    position: "absolute",
                    width: "500px",
                    height: "500px",
                    border: "1px solid rgba(0,33,71,0.1)",
                    borderRadius: "50%",
                    zIndex: 0,
                  }}
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {/* Planet 2 */}
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      background: "#002147",
                      borderRadius: "50%",
                      position: "absolute",
                      bottom: "20%",
                      right: "10%",
                    }}
                  ></div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container" style={{ padding: "6rem 0" }}>
        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h6
            style={{
              color: "var(--color-accent)",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            Deep Tech Features
          </h6>
          <h2
            style={{
              color: "var(--color-primary)",
              fontWeight: "800",
              fontSize: "2.5rem",
            }}
          >
            Built for the Future of Engineering
          </h2>
        </motion.div>

        <div className="row g-4">
          {[
            {
              title: "Mock-V (Proctoring)",
              text: "Browser-based Computer Vision detects user presence and focus. NLP algorithms analyze speech sentiment and filler words in real-time.",
              icon: "🎥",
            },
            {
              title: "Insight-VIT (RAG)",
              text: "Hybrid RAG engine connected to Google Cloud. Semantic search over university syllabus PDFs powered by Gemini Embeddings.",
              icon: "🧠",
            },
            {
              title: "Resume Scorer",
              text: "Generates a Holographic Skill Graph (Radar Chart) to visualize your fit against JDs. Optimized for ATS parsing.",
              icon: "📊",
            },
          ].map((feature, i) => (
            <div className="col-md-4" key={i}>
              <motion.div
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -10 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h4 className="feature-title">{feature.title}</h4>
                <p className="feature-text">{feature.text}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        className="landing-footer text-center py-5"
        style={{ borderTop: "1px solid #eee", color: "#708090" }}
      >
        <div className="container">
          <p className="mb-0">
            © 2026 V-Orbit. The Gold Standard for Engineers.
          </p>
          <small>Powered by Google Cloud • Gemini • Llama 3</small>
        </div>
      </footer>
    </div>
  );
}
