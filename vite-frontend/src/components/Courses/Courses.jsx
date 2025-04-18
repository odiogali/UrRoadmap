import { useState } from "react";
import CourseCard from "./CourseCard";
import "./Courses.css";

//dummy courses so i dont fuck up the backend again lol
const dummyCourses = [
  {
    id: 1,
    code: "CPSC 471",
    title: "Database Systems",
    description: "Intro to relational databases and SQL.",
    instructor: "Dr. Smith",
    prerequisites: ["CPSC 319", "CPSC 331"],
  },
  {
    id: 2,
    code: "CPSC 457",
    title: "Operating Systems",
    description: "Modern OS concepts like concurrency.",
    instructor: "Dr. Lee",
    prerequisites: ["CPSC 313"],
  },
  {
    id: 3,
    code: "CPSC 329",
    title: "Cybersecurity",
    description: "Computer and network security basics.",
    instructor: null,
    prerequisites: [],
  },
];

function Courses() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses = dummyCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

export default Courses;
