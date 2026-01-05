export default function FeatureCard({ title, description, onClick }) {
  return (
    <div className="col-md-4 mb-3">
      <div className="card h-100">
        <div className="card-body">
          <h5>{title}</h5>
          <p>{description}</p>
          <button className="btn btn-outline-primary" onClick={onClick}>
            Open
          </button>
        </div>
      </div>
    </div>
  );
}
