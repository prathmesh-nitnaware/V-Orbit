import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../utils/config"; // <--- ADDED THIS IMPORT
import "bootstrap/dist/css/bootstrap.min.css";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // --- 1. Get Data passed from Login.jsx ---
  // If user tries to access /register directly without login, redirect them back.
  useEffect(() => {
    if (!location.state) {
      navigate("/login");
    }
  }, [location, navigate]);

  const googleData = location.state || {};

  // --- 2. Form State ---
  const [formData, setFormData] = useState({
    fullName: googleData.fullName || "",
    email: googleData.email || "",
    uid: googleData.uid || "",
    profilePic: googleData.photoURL || "",
    regNo: "",
    branch: "Computer Science",
    phone: "",
    cgpa: "",
    bio: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 3. Submit to Backend ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send all details to MongoDB
      // UPDATED: Use dynamic URL from config
      await axios.post(`${config.API_BASE_URL}/api/auth/register`, formData);

      // Success -> Go to Dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration Failed:", err);
      alert("Registration failed. Please try again.");
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

      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .animate-entrance {
        animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        opacity: 0;
      }

      .reg-card {
        background: var(--color-white);
        border: none;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 33, 71, 0.08);
        padding: 3rem 2.5rem;
        width: 100%;
        max-width: 700px; /* Wider for 2 columns */
        position: relative;
        overflow: hidden;
      }

      .reg-card::before {
        content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 5px; background: var(--color-primary);
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

      .form-label {
        color: var(--color-primary);
        font-weight: 700;
        font-size: 0.85rem;
        text-transform: uppercase;
        margin-bottom: 0.5rem;
      }

      .form-control, .form-select {
        border: 2px solid #E2E8F0;
        border-radius: 8px;
        padding: 0.8rem 1rem;
        font-size: 0.95rem;
        background-color: #F8FAFC;
        transition: all 0.2s;
        color: #333;
      }

      .form-control:focus, .form-select:focus {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 4px rgba(0, 33, 71, 0.1);
        background-color: #fff;
        outline: none;
      }

      .form-control:disabled {
        background-color: #E2E8F0;
        cursor: not-allowed;
        opacity: 0.7;
      }

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

      .btn-gold:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", padding: "2rem" }}
    >
      <div className="reg-card animate-entrance">
        <h2 className="brand-title">Complete Your Profile</h2>
        <p className="brand-subtitle">
          We need a few details to customize your experience.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* Auto-Filled Info (Read Only) */}
            <div className="col-12">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.fullName}
                disabled
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Registration No.</label>
              <input
                type="text"
                className="form-control"
                name="regNo"
                required
                placeholder="e.g. 22BCE10XXX"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                name="phone"
                required
                placeholder="+91 98765 43210"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Branch</label>
              <select
                className="form-select"
                name="branch"
                onChange={handleChange}
              >
                <option>Computer Science</option>
                <option>Information Technology</option>
                <option>Electronics & Communication</option>
                <option>Mechanical Engineering</option>
                <option>Civil Engineering</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Current CGPA</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                name="cgpa"
                placeholder="e.g. 9.2"
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <label className="form-label">Short Bio</label>
              <textarea
                className="form-control"
                rows="3"
                name="bio"
                placeholder="Tell us about your academic interests..."
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <button type="submit" className="btn-gold" disabled={loading}>
            {loading ? (
              <div
                className="spinner-border spinner-border-sm text-primary"
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              "Finish Setup"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}