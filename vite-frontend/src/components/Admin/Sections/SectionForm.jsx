import { useState, useEffect } from "react";
import FormField from "../Dashboard/components/FormField";

export default function SectionForm() {
  const [formData, setFormData] = useState({
    scourse_code: "",
    semester: "",
    instructor: "",
  });

  const [courses, setCourses] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await fetch("/api/course/");
        const courseData = await courseRes.json();
        setCourses(courseData);

        const profRes = await fetch("/api/professors/");
        const profData = await profRes.json();
        setProfessors(profData);
      } catch (error) {
        console.error("Error fetching section form data:", error);
        setErrorMessage("Failed to load form data.");
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/sections/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scourse_code: formData.scourse_code,
          semester: formData.semester,
          instructor: formData.instructor,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Submit error:", errorData);
        throw new Error("Failed to create section.");
      }

      setSuccessMessage("Section successfully created.");
      setFormData({ scourse_code: "", semester: "", instructor: "" });
    } catch (err) {
      console.error("Submit error:", err);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const courseOptions = [
    { value: "", label: "Select a course" },
    ...courses.map((c, index) => ({
      value: c.course_code,
      label: c.course_code,
      key: `course-${index}`,
    })),
  ];

  const instructorOptions = [
    { value: "", label: "Select an instructor" },
    ...professors.map((prof, index) => {
      const emp = prof.teaching?.employee;
      const eid = emp?.eid ?? index;
      const label = emp
        ? `${emp.fname} ${emp.lname} (ID: ${eid})`
        : `Unknown (ID: ${eid})`;

      return {
        value: eid,
        label,
        key: `instructor-${eid}`,
      };
    }),
  ];

  const semesterOptions = [
    { value: "", label: "Select a semester" },
    { value: "Fall", label: "Fall" },
    { value: "Winter", label: "Winter" },
    { value: "Spring", label: "Spring" },
    { value: "Summer", label: "Summer" },
  ];

  return (
    <div>
      <h2 className="tab-section-title">Section Creation</h2>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Course"
          name="scourse_code"
          type="select"
          value={formData.scourse_code}
          onChange={handleChange}
          options={courseOptions}
          required
        />

        <FormField
          label="Semester"
          name="semester"
          type="select"
          value={formData.semester}
          onChange={handleChange}
          options={semesterOptions}
          required
        />

        <FormField
          label="Instructor"
          name="instructor"
          type="select"
          value={formData.instructor}
          onChange={handleChange}
          options={instructorOptions}
          required
        />

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Section
        </button>
      </form>
    </div>
  );
}
