import StudentNav from "./StudentNav";
import { Routes, Route } from "react-router-dom";
import Courses from "../Courses/Courses";
import CourseGraph from "../CourseGraph";
import Progress from "./Progress";

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
                <div style={{ border: "1px solid #ddd", marginTop: "2rem" }}>
                  <CourseGraph />
                </div>
              </div>
            }
          />
          <Route path="/courses" element={<Courses />} />
          <Route path="/progress" element={<Progress />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </div>
  );
}

export default StudentDashboard;
