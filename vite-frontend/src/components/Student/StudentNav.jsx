import { Link, useNavigate } from "react-router-dom";
import "./StudentNav.css";

function StudentNav() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="topbar">
      <div className="topbar-left">
        <h1 className="logo">
          <span className="logo-black">Your</span>
          <span className="logo-red">Roadmap</span>
        </h1>
      </div>

      <div className="topbar-links">
        <Link to="/student" className="topbar-link">
          Dashboard
        </Link>
        <Link to="/student/courses" className="topbar-link">
          Courses
        </Link>
      </div>

      <div className="topbar-right">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default StudentNav;
