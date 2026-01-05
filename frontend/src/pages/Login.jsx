import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <p className="text-muted">Firebase will be added later</p>

      <button
        className="btn btn-success mt-3"
        onClick={() => navigate("/dashboard")}
      >
        Continue to Dashboard
      </button>
    </div>
  );
}
