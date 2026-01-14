import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, storage } from "../firebase"; // Import Firebase
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from "axios"; // <--- Import Axios
import "bootstrap/dist/css/bootstrap.min.css";

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const [uploadingImg, setUploadingImg] = useState(false);

  // --- Form State ---
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    regNo: "",
    branch: "",
    cgpa: "",
    bio: "",
    linkedin: "",
    github: "",
    portfolio: "",
    skills: "",
  });

  // --- 1. Load User & Fetch Data from Backend ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setPhotoURL(currentUser.photoURL);

        try {
          // Fetch existing profile data from MongoDB
          const res = await axios.get(
            `http://localhost:3000/api/auth/${currentUser.uid}`
          );
          const data = res.data;

          setFormData({
            fullName: data.fullName || currentUser.displayName || "",
            email: data.email || currentUser.email || "",
            phone: data.phone || "",
            regNo: data.regNo || "",
            branch: data.branch || "",
            cgpa: data.cgpa || "",
            bio: data.bio || "",
            linkedin: data.linkedin || "",
            github: data.github || "",
            portfolio: data.portfolio || "",
            skills: data.skills || "",
          });
        } catch (err) {
          console.error("Failed to fetch profile data", err);
        }
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // --- 2. Handle Image Upload ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    setUploadingImg(true);
    try {
      const storageRef = ref(storage, `profile_pictures/${user.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      // Update Firebase Auth Profile
      await updateProfile(user, { photoURL: url });

      // Update Local State
      setPhotoURL(url);

      // Update Backend (Save URL to MongoDB)
      await axios.put(`http://localhost:3000/api/auth/update/${user.uid}`, {
        profilePic: url,
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Failed to upload image.");
    } finally {
      setUploadingImg(false);
    }
  };

  // --- 3. Handle Logout ---
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  // --- 4. Handle Save Changes ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Send updated data to MongoDB
      await axios.put(
        `http://localhost:3000/api/auth/update/${user.uid}`,
        formData
      );
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Update Error:", err);
      alert("Failed to update profile.");
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
        overflow-x: hidden;
      }

      @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      .animate-entrance { animation: slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }

      /* Sidebar */
      .sidebar-container { background-color: var(--color-primary); height: 100vh; width: 280px; color: var(--color-white); position: fixed; top: 0; left: 0; display: flex; flex-direction: column; z-index: 1000; box-shadow: 4px 0 15px rgba(0, 33, 71, 0.15); }
      .sidebar-header { padding: 2.5rem 2rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
      .sidebar-title { color: var(--color-accent); font-weight: 700; letter-spacing: 1.5px; margin: 0; font-size: 1.6rem; text-transform: uppercase; }
      .nav-menu { display: flex; flex-direction: column; padding: 1.5rem 1rem; gap: 0.8rem; flex-grow: 1; }
      .nav-btn { background-color: transparent; color: #B0C4DE; border: none; padding: 0.9rem 1.2rem; transition: all 0.3s ease; text-align: left; font-weight: 500; border-radius: 6px; font-size: 1rem; display: flex; align-items: center; }
      .nav-btn:hover { color: var(--color-white); background-color: rgba(255, 255, 255, 0.05); transform: translateX(5px); }
      .user-footer { padding: 1.5rem 2rem; background-color: rgba(0, 0, 0, 0.2); display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255, 255, 255, 0.05); }
      .profile-info { display: flex; align-items: center; gap: 12px; cursor: pointer; }

      /* Main Content */
      .main-content { margin-left: 280px; padding: 3.5rem 4.5rem; min-height: 100vh; }
      .hero-title { color: var(--color-primary); font-weight: 800; margin-bottom: 0.5rem; }
      .hero-sub { color: var(--color-secondary); font-size: 1.1rem; font-weight: 500; }

      /* Cards */
      .custom-card { border: none; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04); background: var(--color-white); position: relative; overflow: hidden; height: 100%; }
      .custom-card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: var(--color-primary); }

      .profile-avatar-large { width: 120px; height: 120px; background: linear-gradient(135deg, #002147 0%, #003366 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; border: 4px solid var(--color-accent); color: var(--color-accent); font-size: 3rem; font-weight: 800; box-shadow: 0 10px 20px rgba(0, 33, 71, 0.15); overflow: hidden; cursor: pointer; position: relative; }
      .profile-img { width: 100%; height: 100%; object-fit: cover; }
      .upload-overlay { position: absolute; bottom: 0; left: 0; width: 100%; background: rgba(0,0,0,0.6); color: white; font-size: 0.7rem; padding: 4px 0; text-align: center; opacity: 0; transition: 0.3s; }
      .profile-avatar-large:hover .upload-overlay { opacity: 1; }

      .section-header { color: var(--color-primary); font-weight: 700; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 1px; border-bottom: 1px solid #E2E8F0; padding-bottom: 1rem; margin-bottom: 1.5rem; }
      .form-label { color: var(--color-primary); font-weight: 700; font-size: 0.85rem; margin-bottom: 0.5rem; }
      .form-control { border: 2px solid #E2E8F0; border-radius: 8px; padding: 0.8rem; font-size: 0.95rem; background-color: #F8FAFC; transition: all 0.2s; color: #334155; }
      .form-control:focus { border-color: var(--color-primary); box-shadow: 0 0 0 4px rgba(0, 33, 71, 0.1); background-color: #fff; outline: none; }

      .btn-gold { background-color: var(--color-accent); color: var(--color-primary); font-weight: 800; border: none; padding: 0.9rem 2.5rem; border-radius: 8px; letter-spacing: 1px; text-transform: uppercase; transition: transform 0.2s, box-shadow 0.2s; }
      .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3); color: var(--color-primary); }
      .btn-gold:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

      .btn-outline-danger { color: #dc3545; border: 2px solid #dc3545; font-weight: 600; padding: 0.8rem 2rem; border-radius: 8px; transition: 0.2s; }
      .btn-outline-danger:hover { background-color: #dc3545; color: white; }

      .alert-custom { background-color: #F0FFF4; border: 1px solid #C6F6D5; color: #276749; border-radius: 8px; padding: 1rem; font-weight: 600; margin-bottom: 2rem; display: flex; align-items: center; animation: slideInUp 0.3s ease; }

      @media (max-width: 992px) {
        .sidebar-container { width: 80px; align-items: center; }
        .sidebar-header { padding: 1.5rem 0; text-align: center; }
        .sidebar-title { font-size: 0.6rem; }
        .nav-btn span, .profile-info span { display: none; }
        .nav-btn { justify-content: center; padding: 1rem 0; }
        .main-content { margin-left: 80px; padding: 2rem; }
        .user-footer { flex-direction: column; gap: 1rem; padding: 1rem 0; }
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
          <div className="profile-info">
            <svg
              width="36"
              height="36"
              viewBox="0 0 16 16"
              fill="#D4AF37"
              className="bi bi-person-circle"
            >
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              <path
                fillRule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
              />
            </svg>
            <span className="small fw-bold text-white">
              {user?.displayName?.split(" ")[0] || "User"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="d-flex justify-content-between align-items-end mb-5 animate-entrance">
          <div>
            <h1 className="display-4 hero-title">My Profile</h1>
            <p className="hero-sub">
              Manage your personal information and academic portfolio.
            </p>
          </div>
          <div className="d-flex gap-3">
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Sign Out
            </button>
            <button
              className="btn-gold"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="alert-custom">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-check-circle-fill me-2"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
            </svg>
            Profile updated successfully!
          </div>
        )}

        <div className="row g-4">
          {/* Identity Card */}
          <div
            className="col-lg-4 animate-entrance"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="custom-card p-4 text-center">
              <label
                className="profile-avatar-large"
                title="Click to change photo"
              >
                {photoURL ? (
                  <img src={photoURL} alt="Profile" className="profile-img" />
                ) : (
                  <span>{user?.displayName?.charAt(0) || "P"}</span>
                )}

                <div className="upload-overlay">
                  {uploadingImg ? "Uploading..." : "CHANGE PHOTO"}
                </div>

                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImg}
                />
              </label>

              <h3 style={{ color: "#002147", fontWeight: "800" }}>
                {formData.fullName || "Student Name"}
              </h3>
              <p style={{ color: "#708090", fontWeight: "600" }}>
                Student • {formData.branch || "Branch"}
              </p>

              <div className="mt-4 text-start">
                <label className="form-label">Bio</label>
                <textarea
                  className="form-control"
                  rows="4"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Details Form */}
          <div
            className="col-lg-8 animate-entrance"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="custom-card p-4 mb-4">
              <h5 className="section-header">Personal Information</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Registration Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="regNo"
                    value={formData.regNo}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    disabled
                    style={{ opacity: 0.7, cursor: "not-allowed" }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="custom-card p-4">
              <h5 className="section-header">Professional Profile</h5>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">CGPA</label>
                  <input
                    type="text"
                    className="form-control"
                    name="cgpa"
                    value={formData.cgpa}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-8">
                  <label className="form-label">Skills (Comma separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12 mt-4">
                  <h6 className="form-label text-muted small uppercase">
                    Social Links
                  </h6>
                </div>

                <div className="col-md-4">
                  <label className="form-label">LinkedIn</label>
                  <input
                    type="text"
                    className="form-control"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">GitHub</label>
                  <input
                    type="text"
                    className="form-control"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Portfolio</label>
                  <input
                    type="text"
                    className="form-control"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
