import { Link, useNavigate } from "react-router-dom";
import "./AdminNav.css"; // You'll need to create this CSS file

function AdminNav() {
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
        <Link to="/admin" className="topbar-link">
          Dashboard
        </Link>
        <Link to="/admin/courses" className="topbar-link">
          Courses
        </Link>
        <Link to="/admin/students" className="topbar-link">
          Students
        </Link>
        <Link to="/admin/faculty" className="topbar-link">
          Faculty
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

export default AdminNav;
