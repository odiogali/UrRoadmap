import React from 'react';

export default function ProgressGraph({ takenCourses }) {
  return (
    <div>
      <h2 style={{ color: '#fff' }}>Progress Graph (Coming Soon)</h2>
      <p style={{ color: '#ccc' }}>Visualize remaining courses based on what you've completed.</p>
      <p style={{ color: '#aaa' }}>Selected Courses: {takenCourses.join(', ')}</p>
    </div>
  );
}
