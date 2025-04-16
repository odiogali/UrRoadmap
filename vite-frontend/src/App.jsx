import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Courses from "./pages/Courses";

function App() {
  return (
    <Router>
      <nav style={{ padding: "1rem" }}>
        <Link to="/">Home</Link> | <Link to="/courses">Courses</Link>
      </nav>

      <Routes>
        <Route path="/" element={<h1>Welcome to the Degree Tracker</h1>} />
        <Route path="/courses" element={<Courses />} />
      </Routes>
    </Router>
  );
}

export default App;
