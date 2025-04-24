import { Link, useNavigate } from "react-router-dom";
import "./AdminSidebar.css";

function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/"); // Back to login
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <h2 className="sidebar-title">Admin Panel</h2>

        <div className="section">
          <p className="section-label">Management</p>
          <Link to="/admin/students" className="nav-link">
            View Students
          </Link>
          <Link to="/admin/faculty" className="nav-link">
            View Faculty
          </Link>
          <Link to="/admin/courses" className="nav-link">
            Manage Courses
          </Link>
          <Link to="/admin/textbooks" className="block px-4 py-2 hover:bg-red-100">
            Manage Textbooks
          </Link>
          <Link to="/admin" className="nav-link">
            🏠 Dashboard
          </Link>
        </div>
      </div>

      <button onClick={handleLogout} className="logout-button">
        🚪 Logout
      </button>
    </div>
  );
}

export default AdminSidebar;
