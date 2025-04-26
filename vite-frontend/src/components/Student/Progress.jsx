import React, { useState } from 'react';
import CourseSelector from './CourseSelector';
import ProgressGraph from './ProgressGraph';

const Progress = () => {
  const [selectedCourses, setSelectedCourses] = useState([]);

  return (
    <div>
      <CourseSelector onSelectionChange={setSelectedCourses} />
      <ProgressGraph selectedCourses={selectedCourses} />
    </div>
  );
};

export default Progress;
