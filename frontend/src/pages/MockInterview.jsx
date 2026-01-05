import { useState } from "react";
import { startMock } from "../api/mock.api";

export default function MockInterview() {
  const [questions, setQuestions] = useState([]);

  const start = async () => {
    const res = await startMock({
      company: "TCS",
      skills: {
        frontend: ["react"],
        backend: ["node"]
      }
    });
    setQuestions(res.questions);
  };

  return (
    <>
      <h3>Mock Interview</h3>
      <button className="btn btn-success mb-3" onClick={start}>
        Start Interview
      </button>
      <ul className="list-group">
        {questions.map((q, i) => (
          <li key={i} className="list-group-item">{q}</li>
        ))}
      </ul>
    </>
  );
}
