import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function MockInterviewLive() {
  const navigate = useNavigate();
  const location = useLocation();

  const interviewId = location.state?.interviewId;
  const firstQuestion = location.state?.question;

  const [question, setQuestion] = useState(firstQuestion || "");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);

  // 🚨 Safety check
  useEffect(() => {
    if (!interviewId || !question) {
      navigate("/dashboard");
    }
  }, [interviewId, question, navigate]);

  const submitAnswer = async () => {
    if (!answer.trim()) return;

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/mock/answer",
        {
          interviewId,
          answer,
        }
      );

      // ✅ IF INTERVIEW IS COMPLETE → GO TO RESULT PAGE
      if (res.data.isLast) {
        navigate("/mock-interview/result", {
          state: {
            interviewId,
            feedback: res.data.feedback,
            message: res.data.message,
          },
        });
        return;
      }

      // ✅ OTHERWISE LOAD NEXT QUESTION
      setQuestion(res.data.question);
      setQuestionNumber(res.data.questionNumber);
      setAnswer("");
    } catch (err) {
      console.error("❌ Failed to submit answer", err);
      alert("Something went wrong while submitting your answer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">
        Mock Interview — Question {questionNumber}
      </h4>

      <div className="card">
        <div className="card-body">
          <p className="fw-semibold">{question}</p>

          <textarea
            className="form-control mt-3"
            rows="4"
            placeholder="Type your answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />

          <button
            className="btn btn-primary mt-3"
            onClick={submitAnswer}
            disabled={loading}
          >
            {loading ? "Evaluating..." : "Submit Answer"}
          </button>
        </div>
      </div>
    </div>
  );
}
