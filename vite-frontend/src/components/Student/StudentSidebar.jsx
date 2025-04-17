import { Link, useNavigate } from "react-router-dom";
import "./StudentSidebar.css";

function StudentSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <h2 className="sidebar-title">Degree Tracker</h2>

        <div className="section">
          <p className="section-label">Dash</p>
          <Link to="/student" className="nav-link">
            🏠 Main
          </Link>
          <Link to="/student/courses" className="nav-link">
            🔍 Courses
          </Link>
          <Link to="/student/progress" className="nav-link">
            📈 Profile
          </Link>
        </div>

        <div className="section">
          <p className="section-label">Planning</p>
          <Link to="/student/options" className="nav-link">
            📋 Course Options
          </Link>
          <Link to="/student/music" className="nav-link">
            🎵 ???
          </Link>
          <Link to="/student/fun" className="nav-link">
            😊 ???
          </Link>
        </div>
      </div>

      <button onClick={handleLogout} className="logout-button">
        🚪 Logout
      </button>
    </div>
  );
}

export default StudentSidebar;
