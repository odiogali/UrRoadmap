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
          textbook_isbn: course.textbook_isbn || "",
          department: course.department_name || "—",
          dno: course.dno || "",
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

  //deleting course functionality
  const handleDelete = async (courseCode) => {
    const confirmed = window.confirm(
      //confirmation window
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

  //for editing courses
  const [editingCourse, setEditingCourse] = useState(null); // course_code
  const [editFormData, setEditFormData] = useState({
    course_title: "",
    textbook: "",
    dno: "",
  });

  //handler
  const handleEditClick = (course) => {
    setEditingCourse(course.code);
    setEditFormData({
      course_title: course.title,
      textbook_isbn: course.textbook_isbn || "",
      dno: course.dno || "",
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/course/${editingCourse}/`, {
        course_title: editFormData.course_title,
        textbook_isbn: editFormData.textbook_isbn || null,
        dno: parseInt(editFormData.dno),
      });

      setCourses((prev) =>
        prev.map((c) =>
          c.code === editingCourse
            ? {
                ...c,
                title: editFormData.course_title,
                textbook: editFormData.textbook_isbn,
                department: editFormData.dno,
              }
            : c
        )
      );

      setEditingCourse(null);
      alert("Course updated successfully!");
    } catch (err) {
      console.error("Error updating course:", err);
      alert("Failed to update course. Make sure Dno and ISBN are valid.");
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
                    className="edit-btn"
                    onClick={() => handleEditClick(c)}
                  >
                    Edit
                  </button>
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
      {editingCourse && (
        <div className="modal-overlay" onClick={() => setEditingCourse(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Course: {editingCourse}</h3>
            <form onSubmit={handleEditSubmit} className="modal-form">
              <label>Course Title</label>
              <input
                type="text"
                value={editFormData.course_title}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    course_title: e.target.value,
                  })
                }
                required
              />

              <label>Textbook ISBN</label>
              <input
                type="text"
                value={editFormData.textbook_isbn}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    textbook_isbn: e.target.value,
                  })
                }
              />

              <label>Department Number (Dno)</label>
              <input
                type="number"
                value={editFormData.dno}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, dno: e.target.value })
                }
                required
              />

              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseView;
