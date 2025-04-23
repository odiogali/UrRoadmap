import { useState } from "react";
import FormField from "../Dashboard/components/FormField";

// Professor Form
export default function ProfessorForm() {
  const [formData, setFormData] = useState({
    eid: "",
    fname: "",
    lname: "",
    salary: "",
    dno: "",
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
      const response = await fetch("/api/professors/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Professor added successfully!");
        setFormData({
          eid: "",
          fname: "",
          lname: "",
          salary: "",
          dno: "",
          research_area: "",
          teaching_id: "",
        });
      } else {
        alert("Failed to add professor");
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
          label="Employee ID"
          name="eid"
          type="number"
          value={formData.eid}
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
          label="Salary"
          name="salary"
          type="number"
          value={formData.salary}
          onChange={handleChange}
          required
        />
        <FormField
          label="Department Number"
          name="dno"
          type="number"
          value={formData.dno}
          onChange={handleChange}
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
          Add Professor
        </button>
      </div>
    </form>
  );
}
