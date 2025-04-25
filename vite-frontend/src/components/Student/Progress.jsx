import React, { useEffect, useState } from 'react';
import CourseSelector from './CourseSelector';
import ProgressGraph from './ProgressGraph';

export default function Progress() {
  const [courses, setCourses] = useState([]);
  const [links, setLinks] = useState([]);
  const [takenCourses, setTakenCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/graph/');
        const data = await response.json();
        setCourses(data.nodes || []);
        setLinks(data.links || []);
      } catch (error) {
        console.error('Failed to fetch graph data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#222', minHeight: '100vh' }}>
      <h1 style={{ color: '#fff' }}>Course Progress Tracker</h1>
      <div style={{ backgroundColor: '#333', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <CourseSelector
          courses={courses}
          selectedCourses={takenCourses}
          onChange={setTakenCourses}
        />
      </div>
      <ProgressGraph
        takenCourses={takenCourses}
        allCourses={courses}
        links={links}
      />
    </div>
  );
}
