import { useState } from "react";
import FormField from "../Dashboard/components/FormField";

// Graduate Student Form
export default function GraduateStudentForm() {
  const [formData, setFormData] = useState({
    student_id: "",
    fname: "",
    lname: "",
    major: "",
    minor: "",
    thesis_title: "",
    research_area: "",
    teaching_id: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/students/graduate/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Graduate student added successfully!");
        setFormData({
          student_id: "",
          fname: "",
          lname: "",
          major: "",
          minor: "",
          thesis_title: "",
          research_area: "",
          teaching_id: "",
        });
      } else {
        alert("Failed to add student");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while submitting the form");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Student ID"
          name="student_id"
          type="number"
          value={formData.student_id}
          onChange={handleChange}
          required
        />
        <FormField
          label="First Name"
          name="fname"
          type="text"
          value={formData.fname}
          onChange={handleChange}
          required
        />
        <FormField
          label="Last Name"
          name="lname"
          type="text"
          value={formData.lname}
          onChange={handleChange}
          required
        />
        <FormField
          label="Major"
          name="major"
          type="text"
          value={formData.major}
          onChange={handleChange}
        />
        <FormField
          label="Minor"
          name="minor"
          type="text"
          value={formData.minor}
          onChange={handleChange}
        />
        <FormField
          label="Thesis Title"
          name="thesis_title"
          type="text"
          value={formData.thesis_title}
          onChange={handleChange}
          required
        />
        <FormField
          label="Research Area"
          name="research_area"
          type="text"
          value={formData.research_area}
          onChange={handleChange}
          required
        />
        <FormField
          label="Teaching ID"
          name="teaching_id"
          type="number"
          value={formData.teaching_id}
          onChange={handleChange}
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Register Graduate Student
        </button>
      </div>
    </form>
  );
}
