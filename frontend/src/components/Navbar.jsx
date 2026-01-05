import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-light bg-white shadow-sm px-4">
      {/* LEFT: Brand */}
      <span
        className="fw-bold fs-5 text-primary"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/dashboard")}
      >
        V-Orbit
      </span>

      {/* RIGHT: Profile */}
      <div className="d-flex align-items-center gap-2">
        <span className="fw-semibold">User</span>
        <img
          src="https://ui-avatars.com/api/?name=User&background=0D6EFD&color=fff"
          alt="profile"
          width="36"
          height="36"
          className="rounded-circle"
        />
      </div>
    </nav>
  );
}
