import React, { useEffect, useState } from 'react';

export default function CourseSelector({ onSelectionChange }) {
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/course/")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error("Failed to fetch courses", err));
  }, []);

  const toggleCourse = (code) => {
    const updated = selectedCourses.includes(code)
      ? selectedCourses.filter(c => c !== code)
      : [...selectedCourses, code];

    setSelectedCourses(updated);
    onSelectionChange(updated);
  };

  const coursesByDepartment = courses.reduce((acc, course) => {
    const dept = course.department_name || 'Other';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(course);
    return acc;
  }, {});

  return (
    <div>
      <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Select Completed Courses</h3>

      {Object.entries(coursesByDepartment).map(([department, deptCourses], index) => (
        <div key={`${department}-${index}`} style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ color: '#ddd', marginBottom: '0.5rem' }}>{department}</h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '0.5rem'
          }}>
            {deptCourses.map(course => (
              <label key={course.course_code} style={{
                backgroundColor: selectedCourses.includes(course.course_code) ? '#444' : '#333',
                padding: '0.75rem',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}>
                <input
                  type="checkbox"
                  checked={selectedCourses.includes(course.course_code)}
                  onChange={() => toggleCourse(course.course_code)}
                  name={course.course_code}
                  id={`course-${course.course_code}`}
                  style={{ marginRight: '0.75rem' }}
                />
                <div>
                  <div style={{ fontWeight: 'bold', color: '#fff' }}>{course.course_code}</div>
                  <div style={{ fontSize: '0.9rem', color: '#bbb' }}>
                    {course.course_title || 'Untitled Course'}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}