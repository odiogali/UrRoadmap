import React from 'react';

export default function CourseSelector({ courses, selectedCourses, onChange }) {
  const handleToggle = (courseCode) => {
    const newSelection = selectedCourses.includes(courseCode)
      ? selectedCourses.filter(c => c !== courseCode)
      : [...selectedCourses, courseCode];
    onChange(newSelection);
  };

  // Group courses by department
  const coursesByDepartment = courses.reduce((acc, course) => {
    const dept = course.dno?.dname || 'Other';
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
              <div
                key={course.course_code}
                style={{
                  backgroundColor: selectedCourses.includes(course.course_code) ? '#444' : '#333',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s',
                  cursor: 'pointer',
                }}
                onClick={() => handleToggle(course.course_code)}
              >
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedCourses.includes(course.course_code)}
                    onChange={() => {}}
                    style={{ marginRight: '0.75rem' }}
                  />
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#fff' }}>{course.course_code}</div>
                    <div style={{ fontSize: '0.9rem', color: '#bbb' }}>
                      {course.course_title || 'Untitled Course'}
                    </div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
