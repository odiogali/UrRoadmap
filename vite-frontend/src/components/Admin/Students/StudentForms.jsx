import { useState } from "react";
import UndergraduateStudentForm from "./UndergraduateStudentForm";
import GraduateStudentForm from "./GraduateStudentForm";

// Student Forms Component
export default function StudentForms() {
  const [studentType, setStudentType] = useState("undergraduate");

  const handleStudentTypeChange = (e) => {
    setStudentType(e.target.value);
  };

  return (
    <div>
      <h2 className="tab-section-title">Student Registration</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Student Type
        </label>
        <div className="flex gap-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="undergraduate"
              checked={studentType === "undergraduate"}
              onChange={handleStudentTypeChange}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2">Undergraduate</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="graduate"
              checked={studentType === "graduate"}
              onChange={handleStudentTypeChange}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2">Graduate</span>
          </label>
        </div>
      </div>

      {studentType === "undergraduate" ? (
        <UndergraduateStudentForm />
      ) : (
        <GraduateStudentForm />
      )}
    </div>
  );
}
