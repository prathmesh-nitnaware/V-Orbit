import { useState } from "react";
import axios from "axios";

export default function InsightVIT() {
  const [subject, setSubject] = useState("ALL");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    if (!question) return;

    setLoading(true);
    setAnswer("");
    setSource("");

    try {
      const res = await axios.post(
        "http://localhost:3000/api/insight/ask",
        { subject, question }
      );

      setAnswer(res.data.answer);
      setSource(res.data.source || "");
    } catch {
      setAnswer("Failed to fetch answer.");
    } finally {
      setLoading(false);
    }
  };

  const openPDF = () => {
    if (!source) return;
    window.open(
      `http://localhost:3000/api/insight/pdf/${source}`,
      "_blank"
    );
  };

  return (
    <div className="container mt-4">
      <h3>Insight-VIT (Academic Oracle)</h3>
      <p className="text-muted">
        Ask questions strictly based on official VIT academic documents.
      </p>

      <label className="fw-bold mt-3">Select Subject</label>
      <select
        className="form-select"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      >
        <option value="ALL">ALL</option>
        <option value="DWM">Data Warehousing & Mining</option>
        <option value="AI">Artificial Intelligence</option>
        <option value="SE">Software Engineering</option>
        <option value="DS">Data Structures</option>
      </select>

      <label className="fw-bold mt-3">Your Question</label>
      <textarea
        className="form-control"
        rows="3"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        className="btn btn-primary mt-3"
        onClick={ask}
        disabled={loading}
      >
        {loading ? "Searching documents..." : "Ask"}
      </button>

      {answer && (
        <div className="card mt-4">
          <div className="card-body">
            <h5>Answer</h5>
            <p>{answer}</p>

            {source && (
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={openPDF}
              >
                View Source PDF
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
