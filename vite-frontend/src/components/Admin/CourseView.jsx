import { useEffect, useState } from "react";
import axios from "axios";
import "./CourseView.css";

function CourseView() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const url = search
          ? `http://localhost:8000/api/course/?search=${encodeURIComponent(
              search
            )}`
          : "http://localhost:8000/api/course/";

        const res = await axios.get(url);
        const transformed = res.data.map((course, index) => ({
          id: index,
          code: course.course_code,
          title: course.course_title || "—",
          textbook: course.textbook_title || "—",
          department: course.department_name || "—",
        }));

        setCourses(transformed);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses.");
        setLoading(false);
      }
    };

    fetchCourses();
  }, [search]);

  const handleDelete = async (courseCode) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete course "${courseCode}"?`
    );
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:8000/api/course/${courseCode}/`);
      setCourses((prevCourses) =>
        prevCourses.filter((c) => c.code !== courseCode)
      );
      alert("Course deleted successfully!");
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete course.");
    }
  };

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
            <th>Title</th>
            <th>Textbook</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {courses.length > 0 ? (
            courses.map((c) => (
              <tr key={c.id}>
                <td>{c.code}</td>
                <td>{c.title}</td>
                <td>{c.textbook}</td>
                <td>{c.department}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(c.code)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No courses match your search.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CourseView;
