import { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import "./Courses.css";
import axios from "axios";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseSections, setCourseSections] = useState([]);
  const [loadingSections, setLoadingSections] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/course/")
      .then(async (res) => {
        const rawCourses = res.data;
        const enhancedCourses = await Promise.all(
          rawCourses.map(async (course, index) => {
            let profName = "TBA";
            let textbookTitle = null;
            let prerequisites = [];
            let antirequisites = [];
            try {
              const secRes = await axios.get(
                `http://localhost:8000/api/sections/by-course/${course.course_code}/`
              );
              // Extract instructor_name from each object
              profName = [
                ...new Set(
                  secRes.data.map((section) => section.instructor_name)
                ),
              ].join(", ");
            } catch (err) {
              console.warn(`Prof for ${course.course_code} not found`);
            }
            if (course.textbook_isbn) {
              try {
                const tbRes = await axios.get(
                  `http://localhost:8000/api/textbook/${course.textbook_isbn}/`
                );
                textbookTitle = tbRes.data.title;
              } catch (err) {
                console.warn(`Textbook ${course.textbook_isbn} not found`);
              }
            }
            try {
              const antiRes = await axios.get(
                `http://localhost:8000/api/antirequisites/${course.course_code}/`
              );
              antirequisites = antiRes.data.map((obj) => obj.antireq_code); // Extract the course codes
            } catch (err) {
              console.warn(`Antireqs for ${course.course_code} not found`);
            }
            try {
              const preRes = await axios.get(
                `http://localhost:8000/api/prerequisites/${course.course_code}/`
              );
              prerequisites = preRes.data.map((obj) => obj.prereq_code); // Extract the course codes
            } catch (err) {
              console.warn(`Prereqs for ${course.course_code} not found`);
            }
            return {
              id: index,
              code: course.course_code,
              title: course.course_title,
              textbook: textbookTitle
                ? `${textbookTitle}`
                : "No textbook assigned.",
              instructor: profName,
              prerequisites: prerequisites,
              antirequisites: antirequisites,
            };
          })
        );
        setCourses(enhancedCourses);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching course:", err);
        setError("Failed to load courses.");
        setLoading(false);
      });
  }, []);

  const fetchSectionsForCourse = async (courseCode) => {
    try {
      setLoadingSections(true);
      const response = await axios.get(
        `http://localhost:8000/api/sections/by-course/${courseCode}/`
      );
      setCourseSections(response.data);
      setLoadingSections(false);
    } catch (error) {
      console.error("Error fetching course sections:", error);
      setCourseSections([]);
      setLoadingSections(false);
    }
  };

  // Function to handle course selection
  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    fetchSectionsForCourse(course.code);
  };

  // Function to go back to the course list
  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setCourseSections([]);
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="courses-container">
      {selectedCourse ? (
        <div className="sections-view">
          <button onClick={handleBackToCourses} className="back-button">
            &larr; Back to Courses
          </button>
          <h2>
            {selectedCourse.code}: {selectedCourse.title} - Sections
          </h2>

          {loadingSections ? (
            <p>Loading sections...</p>
          ) : courseSections.length > 0 ? (
            <div className="sections-list">
              <table className="sections-table">
                <thead>
                  <tr>
                    <th>Section ID</th>
                    <th>Semester</th>
                    <th>Instructor</th>
                  </tr>
                </thead>
                <tbody>
                  {courseSections.map((section) => (
                    <tr key={section.s_id}>
                      <td>{section.s_id}</td>
                      <td>{section.semester || "N/A"}</td>
                      <td>
                        {section.instructor_name
                          ? section.instructor_name
                          : "TBA"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No sections available for this course.</p>
          )}
        </div>
      ) : (
        <>
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
                <div key={course.id} onClick={() => handleCourseSelect(course)}>
                  <CourseCard course={course} />
                </div>
              ))
            ) : (
              <p>No course matches your search.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Courses;
