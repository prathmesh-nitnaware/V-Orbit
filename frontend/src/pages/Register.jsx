import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      <p className="text-muted">Firebase will be added later</p>

      <button
        className="btn btn-primary mt-3"
        onClick={() => navigate("/dashboard")}
      >
        Create Account
      </button>
    </div>
  );
}
