import { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import "./Courses.css";
import axios from "axios";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get('http://localhost:8000/api/course/')
      .then(async (res) => {
        const rawCourses = res.data;

        const enhancedCourses = await Promise.all(
          rawCourses.map(async (course, index) => {
            let profName = "TBA";
            let textbookTitle = null;
            let prerequisites = [];
            let antirequisites = [];

            try {
              const profRes = await axios.get(`http://localhost:8000/api/professors/${course.prof}/`);
              profName = profRes.data.fname + " " + profRes.data.lname;
            } catch (err) {
              console.warn(`Prof ${course.prof} not found`);
            }

            if (course.textbook_isbn) {
              try {
                const tbRes = await axios.get(`http://localhost:8000/api/textbook/${course.textbook_isbn}/`);
                textbookTitle = tbRes.data.title;
              } catch (err) {
                console.warn(`Textbook ${course.textbook_isbn} not found`);
              }
            }

            try {
              const antiRes = await axios.get(`http://localhost:8000/api/antirequisites/${course.course_code}/`);
              antirequisites = antiRes.data.map(obj => obj.antireq_code); // Extract the course codes
            } catch (err) {
              console.warn(`Antireqs for ${course.course_code} not found`);
            }

            try {
              const preRes = await axios.get(`http://localhost:8000/api/prerequisites/${course.course_code}/`);
              prerequisites = preRes.data.map(obj => obj.prereq_code); // Extract the course codes
            } catch (err) {
              console.warn(`Prereqs for ${course.course_code} not found`);
            }

            return {
              id: index,
              code: course.course_code,
              title: `${course.course_code}`,
              textbook: textbookTitle
                ? `${textbookTitle}`
                : "No textbook assigned.",
              instructor: profName,
              prerequisites: prerequisites,
              antirequisites: antirequisites
            }
          })
        )
        setCourses(enhancedCourses);
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
