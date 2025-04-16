import { useEffect, useState } from "react";
import axios from "axios";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch courses from the Django API
  useEffect(() => {
    axios.get("http://localhost:8000/api/courses/")
      .then(res => {
        console.log("Fetched courses:", res.data);
        setCourses(res.data);
      })
      .catch(err => {
        console.error("Error fetching courses:", err);
      });
  }, []);

  // Filter courses by search string
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(search.toLowerCase()) ||
    course.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1>Courses</h1>
      <input
        type="text"
        placeholder="Search by name or code..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
      />

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Code</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Name</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Department</th>
          </tr>
        </thead>
        <tbody>
          {filteredCourses.map((course, i) => (
            <tr key={i}>
              <td>{course.code}</td>
              <td>{course.name}</td>
              <td>{course.department_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Courses;
