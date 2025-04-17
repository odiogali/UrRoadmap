import { Routes, Route } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

function AdminDashboard() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <AdminSidebar />

      <div style={{ flex: 1, padding: "1rem" }}>
        <Routes>
          <Route
            index
            element={
              <div>
                <h1>Welcome Admin 👋</h1>
                <p>This is your dashboard. You can manage students, faculty, and courses from here.</p>
              </div>
            }
          />
          <Route
            path="students"
            element={
              <div>
                <h2>View Students</h2>
                <p>Here you would list/search/edit student records.</p>
              </div>
            }
          />
          <Route
            path="faculty"
            element={
              <div>
                <h2>View Faculty</h2>
                <p>Here you would view or manage faculty members.</p>
              </div>
            }
          />
          <Route
            path="courses"
            element={
              <div>
                <h2>Manage Courses</h2>
                <p>Add, update, or remove courses from the database.</p>
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default AdminDashboard;
