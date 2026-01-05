import { useState } from "react";
import axios from "axios";

export default function ResumeScorer() {
  const [jdText, setJdText] = useState("");
  const [resume, setResume] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setError("");
    setResult(null);

    if (!resume) {
      setError("Please upload your resume PDF");
      return;
    }

    if (jdText.trim().length < 50) {
      setError("Please paste a valid Job Description (at least 2–3 lines)");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("jdText", jdText);

      const res = await axios.post(
        "http://localhost:3000/api/career/analyze",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      setResult(res.data);
    } catch (err) {
      setError("AI analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "900px" }}>
      <h3 className="mb-4">Resume Scorer (AI Powered)</h3>

      {/* Job Description */}
      <label className="form-label fw-semibold">
        Paste Job Description
      </label>
      <textarea
        className="form-control"
        rows="6"
        placeholder="Paste the full Job Description here..."
        value={jdText}
        onChange={(e) => setJdText(e.target.value)}
      />

      {/* Resume Upload */}
      <label className="form-label fw-semibold mt-3">
        Upload Resume (PDF)
      </label>
      <input
        type="file"
        accept=".pdf"
        className="form-control"
        onChange={(e) => setResume(e.target.files[0])}
      />

      {/* Button */}
      <button
        className="btn btn-primary mt-4"
        onClick={handleAnalyze}
        disabled={loading}
      >
        {loading ? "Analyzing with AI..." : "Analyze Resume"}
      </button>

      {/* Error */}
      {error && (
        <div className="alert alert-danger mt-4">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="mt-5">
          <h4>Analysis Result</h4>

          {/* ATS Score */}
          <div className="mt-3">
            <strong>ATS Score:</strong> {result.atsScore}%
            <div className="progress mt-1">
              <div
                className="progress-bar bg-success"
                style={{ width: `${result.atsScore}%` }}
              />
            </div>
          </div>

          {/* JD Match */}
          <div className="mt-3">
            <strong>JD Match:</strong> {result.jdMatchPercentage}%
          </div>

          {/* Missing Skills */}
          <div className="mt-4">
            <strong>Missing Skills:</strong>
            <ul className="mt-2">
              {result.missingSkills.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          </div>

          {/* Suggestions */}
          <div className="mt-4">
            <strong>AI Recommendations:</strong>
            <ul className="mt-2">
              {result.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
