import { useEffect, useState } from "react";
import axios from "axios";
import "./CourseView.css";

function CourseView() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/course/")
      .then((res) => {
        const transformed = res.data.map((course, index) => ({
          id: index,
          code: course.course_code,
          textbook: course.textbook_isbn
            ? `${course.textbook_isbn}`
            : "No textbook assigned.",
          professorId: course.prof || "—",
          department: course.department_name || "—",
        }));
        setCourses(transformed);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses.");
        setLoading(false);
      });
  }, []);

  const filtered = courses.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="course-page">
      <h2 className="course-title">Course Catalog</h2>

      <input
        type="text"
        className="course-search"
        placeholder="Search by course code..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="course-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Textbook (ISBN)</th>
            <th>Professor ID</th>
            <th>Department</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map((c) => (
              <tr key={c.id}>
                <td>{c.code}</td>
                <td>{c.textbook}</td>
                <td>{c.professorId}</td>
                <td>{c.department}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No courses match your search.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CourseView;
