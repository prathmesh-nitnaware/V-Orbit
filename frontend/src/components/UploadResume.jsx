import { useState } from "react";
import { analyzeResume } from "../api/career.api";

export default function UploadResume({ onResult }) {
  const [text, setText] = useState("");
  const [company, setCompany] = useState("TCS");

  const submit = async () => {
    console.log("Analyze button clicked");

    const result = await analyzeResume({
      resumeText: text,
      company,
    });

    console.log("API response:", result);
    onResult(result);
  };

  return (
    <>
      <textarea
        className="form-control mb-2"
        rows="5"
        placeholder="Paste resume text here (OCR connected later)"
        onChange={(e) => setText(e.target.value)}
      />
      <select
        className="form-select mb-2"
        onChange={(e) => setCompany(e.target.value)}
      >
        <option>TCS</option>
        <option>Accenture</option>
        <option>Barclays</option>
      </select>
      <button className="btn btn-primary" onClick={submit}>
        Analyze
      </button>
    </>
  );
}
