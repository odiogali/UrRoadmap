import React from 'react';

export default function CourseSelector({ courses, selectedCourses, onChange }) {
  const handleToggle = (courseCode) => {
    const updated = selectedCourses.includes(courseCode)
      ? selectedCourses.filter(c => c !== courseCode)
      : [...selectedCourses, courseCode];
    onChange(updated);
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <h3 style={{ color: '#fff' }}>Select Completed Courses</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {courses.map((course) => (
          <label key={course.id} style={{ color: '#fff' }}>
            <input
              type="checkbox"
              checked={selectedCourses.includes(course.id)}
              onChange={() => handleToggle(course.id)}
              style={{ marginRight: '6px' }}
            />
            {course.id}
          </label>
        ))}
      </div>
    </div>
  );
}
