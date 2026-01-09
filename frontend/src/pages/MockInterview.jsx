import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MockInterview() {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [totalQuestions, setTotalQuestions] = useState(3);
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);

  const startInterview = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:3000/api/mock/start",
        {
          role,
          difficulty,
          totalQuestions,
          jobDescription,
          resumeText,
        }
      );

      navigate("/mock/live", {
        state: {
          interviewId: res.data.interviewId,
          question: res.data.question,
          questionNumber: res.data.questionNumber,
          totalQuestions,
        },
      });
    } catch (err) {
      alert("Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Start Mock Interview</h3>

      <input
        className="form-control mt-3"
        placeholder="Role (e.g. Software Developer)"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />

      <div className="row mt-3">
        <div className="col">
          <select
            className="form-select"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option>Easy</option>
            <option>Moderate</option>
            <option>Hard</option>
          </select>
        </div>

        <div className="col">
          <input
            type="number"
            min="1"
            max="10"
            className="form-control"
            value={totalQuestions}
            onChange={(e) => setTotalQuestions(e.target.value)}
          />
        </div>
      </div>

      <textarea
        className="form-control mt-3"
        rows="3"
        placeholder="Paste Job Description (optional)"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <textarea
        className="form-control mt-3"
        rows="3"
        placeholder="Paste Resume Text (optional)"
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
      />

      <button
        className="btn btn-primary mt-3"
        disabled={loading || !role}
        onClick={startInterview}
      >
        {loading ? "Starting..." : "Start Interview"}
      </button>
    </div>
  );
}
