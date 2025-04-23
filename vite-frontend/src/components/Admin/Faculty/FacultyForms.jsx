import { useState } from "react";
import ProfessorForm from "./ProfessorForm";
import AdminStaffForm from "./AdminStaffForm";

// Faculty Forms Component
export default function FacultyForms() {
  const [facultyType, setFacultyType] = useState("professor");

  const handleFacultyTypeChange = (e) => {
    setFacultyType(e.target.value);
  };

  return (
    <div>
      <h2 className="tab-section-title">Faculty Registration</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Faculty Type
        </label>
        <div className="flex flex-wrap gap-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="professor"
              checked={facultyType === "professor"}
              onChange={handleFacultyTypeChange}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2">Professor</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="adminStaff"
              checked={facultyType === "adminStaff"}
              onChange={handleFacultyTypeChange}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2">Admin Staff</span>
          </label>
        </div>
      </div>

      {facultyType === "professor" && <ProfessorForm />}
      {facultyType === "adminStaff" && <AdminStaffForm />}
    </div>
  );
}
