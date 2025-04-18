import { Routes, Route } from "react-router-dom";
import AdminNav from "./AdminNav";
import StudentView from "./StudentView";
import CourseView from "./CourseView";

function AdminDashboard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AdminNav />

      <div style={{ flex: 1, padding: "1rem" }}>
        <Routes>
          <Route
            index
            element={
              <div>
                <h1>Welcome Admin 👋</h1>
                <p>
                  This is your dashboard. You can manage students, faculty, and
                  courses from here.
                </p>
              </div>
            }
          />
          <Route path="students" element={<StudentView />} />
          <Route
            path="faculty"
            element={
              <div>
                <h2>View Faculty</h2>
                <p>Here you would view or manage faculty members.</p>
              </div>
            }
          />
          <Route path="courses" element={<CourseView />} />
          <Route
            path="manage-courses"
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
