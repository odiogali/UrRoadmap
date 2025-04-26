import { useState, useEffect } from "react";
import FormField from "../Dashboard/components/FormField";

export default function ProfessorForm() {
  const [formData, setFormData] = useState({
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

    try {
      // Step 1: Create the employee without specifying an ID
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
        setError("Failed to create employee record: " + JSON.stringify(errData));
        return;
      }

      // Get the auto-generated employee ID from the response
      const employeeData = await employeeResponse.json();
      const employeeId = employeeData.eid;
      console.log(employeeId)

      // Step 2: Check if teaching staff exists, if not create it
      let teachingStaffExists = false;
      let teachingStaffId = null;

      try {
        const teachingResponse = await fetch(`/api/teaching-staff/`);
        const teachingData = await teachingResponse.json();
        const existingTeachingStaff = teachingData.find(ts => ts.employee === employeeId);

        if (existingTeachingStaff) {
          teachingStaffExists = true;
          teachingStaffId = existingTeachingStaff.id;
        }
      } catch (err) {
        console.log("Error checking teaching staff:", err);
      }

      if (!teachingStaffExists) {
        const teachingPayload = {
          employee: employeeId
        };

        const createTeachingResponse = await fetch("/api/teaching-staff/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(teachingPayload),
        });

        if (!createTeachingResponse.ok) {
          const errData = await createTeachingResponse.json();
          console.error("Failed to create teaching staff:", errData);
          setError("Failed to create teaching staff: " + JSON.stringify(errData));
          return;
        }

        const newTeachingData = await createTeachingResponse.json();
        teachingStaffId = newTeachingData.employee;  // This should be the EID
      }

      // Step 3: Create the professor with the teaching staff ID
      const professorPayload = {
        teaching_id: teachingStaffId,
        research_area: formData.research_area,
      };

      const professorResponse = await fetch("/api/professors/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(professorPayload),
      });

      if (!professorResponse.ok) {
        const errData = await professorResponse.json();
        console.error("Failed to create professor:", errData);
        setError("Failed to add professor: " + JSON.stringify(errData));
        return;
      }

      setSuccess(true);
      setFormData({
        fname: "",
        lname: "",
        salary: "",
        dno: "",
        research_area: "",
      });
    } catch (err) {
      console.error("Error submitting professor:", err);
      setError("An error occurred while submitting the form: " + err.message);
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
                label: dept.dname,
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
