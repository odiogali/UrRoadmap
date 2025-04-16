import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Courses from "./components/Courses/Courses";

function App() {
  return (
    <Router>
      <div style={{ display: "flex", height: "100vh" }}>
        <Sidebar />

        <div style={{ flex: 1, padding: "1rem" }}>
          <Routes>
            <Route 
              path="/" 
              element={
                <div>
                  <h1>Welcome to the Degree Tracker</h1>
                  <p>This would be a dashboard with graphs and cool stuff later.</p>
                </div>
              } 
            />
            <Route path="/courses" element={<Courses />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
