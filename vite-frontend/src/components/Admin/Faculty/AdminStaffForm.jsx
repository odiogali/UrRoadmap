import { useState, useEffect } from "react";
import FormField from "../Dashboard/components/FormField";

export default function AdminStaffForm() {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    salary: "",
    dno: "",
  });

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const response = await fetch("/api/department/"); // <-- Adjust endpoint if needed
        if (response.ok) {
          const data = await response.json();
          setDepartments(data);
        } else {
          console.error("Failed to fetch departments");
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    }

    fetchDepartments();
  }, []);

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
      // Step 1: Create the employee
      const employeePayload = {
        fname: formData.fname,
        lname: formData.lname,
        salary: parseInt(formData.salary),
        dno: parseInt(formData.dno),
      };

      const employeeResponse = await fetch("/api/employees/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employeePayload),
      });

      if (!employeeResponse.ok) {
        const errData = await employeeResponse.json();
        alert("Failed to create employee record: " + JSON.stringify(errData));
        return;
      }

      const employeeData = await employeeResponse.json();
      const employeeId = employeeData.eid;

      console.log("Created Employee with ID:", employeeId);

      // Step 2: Create admin staff linked to that employee
      const adminResponse = await fetch("/api/admin-staff/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eid: employeeId }),
      });

      if (adminResponse.ok) {
        alert("Admin staff added successfully!");
        setFormData({
          fname: "",
          lname: "",
          salary: "",
          dno: "",
        });
      } else {
        const adminErr = await adminResponse.json();
        alert("Failed to create admin staff: " + JSON.stringify(adminErr));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              label: dept.dname,
            })),
          ]}
        />

      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Admin Staff
        </button>
      </div>
    </form>
  );
}
