import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import StudentDashboard from "./components/Student/StudentDashboard";
import AdminDashboard from "./components/Admin/AdminDashboard";
import Textbooks from './components/Admin/Textbooks/Textbooks';
import ProtectedRoute from "./components/ProtectedRoute";
import StudentView from "./components/Admin/StudentView";
import CourseView from "./components/Admin/CourseView";
import FacultyView from "./components/Admin/FacultyView";
import Dashboard from "./components/Admin/Dashboard/Dashboard";
import TextbookView from "./components/Admin/TextbookView";
import Degrees from './components/Admin/Degrees/Degrees';
import DegreeView from './components/Admin/DegreeView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Student Routes (Protected) */}
        <Route
          path="/student/*"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes (Protected) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<Dashboard />} />
            <Route path="students" element={<StudentView />} />
            <Route path="courses" element={<CourseView />} />
            <Route path="faculty" element={<FacultyView />} />
            <Route path="textbook" element={<TextbookView />} />
            <Route path="degree" element={<DegreeView />} />
            <Route path="degrees" element={<Degrees />} />
          </Route>
          <Route path="/admin/textbooks" element={<Textbooks />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
