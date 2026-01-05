import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-3">V-Orbit</h1>
      <p className="lead">
        Placement & Academic Readiness Platform for VIT Students
      </p>

      <div className="d-flex justify-content-center gap-3 mt-4">
        <button
          className="btn btn-primary btn-lg"
          onClick={() => navigate("/login")}
        >
          Sign In
        </button>
        <button
          className="btn btn-outline-secondary btn-lg"
          onClick={() => navigate("/register")}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
