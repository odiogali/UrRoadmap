import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Degree Tracker</h2>

      <div className="section">
        <p className="section-label">Dash</p>
        <Link to="/" className="nav-link">🏠 Main</Link>
        <Link to="/courses" className="nav-link">🔍 Courses</Link>
        <Link to="/progress" className="nav-link">📈 Profile</Link>
      </div>

      <div className="section">
        <p className="section-label">Planning</p>
        <Link to="/options" className="nav-link">📋 Course Options</Link>
        <Link to="/music" className="nav-link">🎵 ???</Link>
        <Link to="/fun" className="nav-link">😊 ???</Link>
      </div>
    </div>
  );
}

export default Sidebar;
