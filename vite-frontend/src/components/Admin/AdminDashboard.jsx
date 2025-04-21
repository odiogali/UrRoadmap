import { Routes, Route } from "react-router-dom";
import AdminNav from "./AdminNav";
import StudentView from "./StudentView";
import CourseView from "./CourseView";
import FacultyView from "./FacultyView";
//import Dashboard from "./Dashboard";

function AdminDashboard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AdminNav />

      <div style={{ flex: 1, padding: "1rem" }}>
        <Routes>
          <Route
            index
            element={
              //<Dashboard />
              //added this bc frontend wouldnt run. can resolve this once dashboard file is added.
              <div>
                <h1>Admin Home</h1>
                <p>Dashboard component missing for now.</p>
              </div>
            }
          />
          <Route path="students" element={<StudentView />} />
          <Route path="faculty" element={<FacultyView />} />
          <Route path="courses" element={<CourseView />} />
        </Routes>
      </div>
    </div>
  );
}

export default AdminDashboard;
