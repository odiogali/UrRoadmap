import { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import "./Courses.css";
import axios from "axios";

//dummy courses so i dont fuck up the backend again lol
// const dummyCourses = [
//   {
//     id: 1,
//     code: "CPSC 471",
//     title: "Database Systems",
//     description: "Intro to relational databases and SQL.",
//     instructor: "Dr. Smith",
//     prerequisites: ["CPSC 319", "CPSC 331"],
//   },
//   {
//     id: 2,
//     code: "CPSC 457",
//     title: "Operating Systems",
//     description: "Modern OS concepts like concurrency.",
//     instructor: "Dr. Lee",
//     prerequisites: ["CPSC 313"],
//   },
//   {
//     id: 3,
//     code: "CPSC 329",
//     title: "Cybersecurity",
//     description: "Computer and network security basics.",
//     instructor: null,
//     prerequisites: [],
//   },
// ];

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get('http://localhost:8000/api/course/')
      .then((res) => {
        const transformed = res.data.map((course, index) => ({
          id: index,
          code: course.course_code,
          title: `Course: ${course.course_code}`,
          description: course.textbook_isbn
            ? `Uses ISBN: ${course.textbook_isbn}`
            : "No textbook assigned.",
          instructor: `Professor ID: ${course.prof}`,
        }));
        setCourses(transformed);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching course:", err);
        setError("Failed to load courses.");
        setLoading(false);
      });
  }, []);

  const filteredCourses = courses.filter(
    (course) =>
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading course...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="courses-container">
      <h2>Available Courses</h2>
      <input
        type="text"
        placeholder="Search courses..."
        className="search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="courses-grid">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        ) : (
          <p>No course matches your search.</p>
        )}
      </div>
    </div>
  );
}

export default Courses;
