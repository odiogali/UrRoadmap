import React, { useEffect, useState } from 'react';
import CourseSelector from './CourseSelector';
import ProgressGraph from './ProgressGraph';

export default function Progress() {
  const [courses, setCourses] = useState([]);
  const [takenCourses, setTakenCourses] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/course/')
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => {
        console.error("Failed to fetch courses:", err);
      });
  }, []);

  return (
    <div>
      <h1 style={{ color: '#fff', marginBottom: '1rem' }}>Course Progress Tracker</h1>
      <CourseSelector
        courses={courses}
        selectedCourses={takenCourses}
        onChange={setTakenCourses}
      />
      <ProgressGraph takenCourses={takenCourses} />
    </div>
  );
}
