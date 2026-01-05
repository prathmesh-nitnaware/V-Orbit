import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="mb-4">V-Orbit Dashboard</h2>

      <div className="row">
        {/* Resume Scorer */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Resume Scorer</h5>
              <p className="card-text">
                AI-powered ATS resume analysis against job descriptions.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/resume-scorer")}
              >
                Open
              </button>
            </div>
          </div>
        </div>

        {/* Mock Interview */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Mock Interview</h5>
              <p className="card-text">
                Practice interviews with AI based on your skills.
              </p>
              <button
                className="btn btn-secondary"
                onClick={() =>
                  window.open(
                    "https://github.com/prathmesh-nitnaware/interview",
                    "_blank"
                  )
                }
              >
                Open
              </button>
            </div>
          </div>
        </div>

        {/* Insight-VIT */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Insight-VIT</h5>
              <p className="card-text">
                Ask questions directly from official syllabus and papers.
              </p>
              <button
                className="btn btn-success"
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
