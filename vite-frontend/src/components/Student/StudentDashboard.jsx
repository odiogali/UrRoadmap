import { Routes, Route } from "react-router-dom";
import Sidebar from "./StudentSidebar";
import Courses from "../Courses/Courses";

function StudentDashboard() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "1rem" }}>
        <Routes>
          <Route
            index
            element={
              <div>
                <h1>Welcome to the Degree Tracker</h1>
                <p>This would be a dashboard with graphs and cool stuff later.</p>
              </div>
            }
          />
          <Route path="courses" element={<Courses />} />
        </Routes>
      </div>
    </div>
  );
}

export default StudentDashboard;
