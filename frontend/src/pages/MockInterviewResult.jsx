import { useLocation, useNavigate } from "react-router-dom";

export default function MockInterviewResult() {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state) {
    return (
      <div className="text-center mt-5">
        <h4>No interview data found</h4>
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const { feedback, message } = location.state;

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Mock Interview Result</h3>

      <div className="alert alert-success">
        {message || "Interview Completed"}
      </div>

      <div className="card">
        <div className="card-body">
          <h5>AI Feedback</h5>
          <pre style={{ whiteSpace: "pre-wrap" }}>{feedback}</pre>
        </div>
      </div>

      <button
        className="btn btn-secondary mt-4"
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </button>
    </div>
  );
}
