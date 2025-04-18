import StudentNav from "./StudentNav";
import { Routes, Route } from "react-router-dom";
import Courses from "../Courses/Courses";

function StudentDashboard() {
  return (
    <div>
      <StudentNav />
      <div style={{ padding: "2rem" }}>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <h1>Welcome to the Degree Tracker</h1>
                <p>
                  This would be a dashboard with graphs and cool stuff later.
                </p>
              </div>
            }
          />
          <Route path="/courses" element={<Courses />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </div>
  );
}

export default StudentDashboard;
