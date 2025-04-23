import { useState, useEffect } from "react";
import FormField from "../Dashboard/components/FormField";

export default function ProfessorForm() {
  const [formData, setFormData] = useState({
    eid: "",
    fname: "",
    lname: "",
    salary: "",
    dno: "",
    research_area: "",
  });

  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("/api/department");
        const data = await response.json();
        console.log(data)
        setDepartments(data);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
        setError("Failed to load departments");
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const payload = {
      teaching: {
        employee: {
          eid: parseInt(formData.eid),
          fname: formData.fname,
          lname: formData.lname,
          salary: parseInt(formData.salary),
          dno: parseInt(formData.dno),
        },
      },
      research_area: formData.research_area,
    };

    try {
      const response = await fetch("/api/professors/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        console.error("Failed to create professor:", errData);
        setError("Failed to add professor");
        return;
      }

      setSuccess(true);
      setFormData({
        eid: "",
        fname: "",
        lname: "",
        salary: "",
        dno: "",
        research_area: "",
      });
    } catch (err) {
      console.error("Error submitting professor:", err);
      setError("An error occurred while submitting the form");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Add Professor</h2>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">Professor added successfully!</div>}

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

          {/* Department dropdown */}
          <FormField
            label="Department"
            name="dno"
            type="select"
            value={formData.dno}
            onChange={handleChange}
            required
            options={[
              { value: "", label: "Select a department" },
              ...departments.map((dept) => ({
                value: dept.dno,
                label: dept.department_name,
              })),
            ]}
          />

          <FormField
            label="Research Area"
            name="research_area"
            type="text"
            value={formData.research_area}
            onChange={handleChange}
            required
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
    </div>
  );
}
