import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="mb-4">V-Orbit Dashboard</h2>

      <div className="row g-4">
        {/* Resume Scorer */}
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">Resume Scorer</h5>
              <p className="card-text">
                AI-powered ATS resume analysis matched against real job
                descriptions.
              </p>
              <button
                className="btn btn-primary mt-auto"
                onClick={() => navigate("/resume-scorer")}
              >
                Open
              </button>
            </div>
          </div>
        </div>

        {/* Mock Interview */}
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">Mock Interview (Mock-V)</h5>
              <p className="card-text">
                Configure role, difficulty, and question count, then experience a
                real-time AI-driven mock interview with feedback.
              </p>
              <button
                className="btn btn-secondary mt-auto"
                onClick={() => navigate("/mock")}
              >
                Start Interview
              </button>
            </div>
          </div>
        </div>

        {/* Insight-VIT */}
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">Insight-VIT</h5>
              <p className="card-text">
                Ask questions strictly from official VIT syllabus, question
                papers, and question banks.
              </p>
              <button
                className="btn btn-success mt-auto"
                onClick={() => navigate("/insight")}
              >
                Open
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
