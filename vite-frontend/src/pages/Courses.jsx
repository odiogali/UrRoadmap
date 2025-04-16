import { useEffect, useState } from "react";
import axios from "axios";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("/api/courses/")
      .then(res => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load courses");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Course List</h1>
      <ul>
        {courses.map(course => (
          <li key={course.id}>
            <strong>{course.name}</strong> ({course.code}) — Dept: {course.department}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Courses;
