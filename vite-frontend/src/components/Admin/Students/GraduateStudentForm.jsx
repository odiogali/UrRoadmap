import { useState, useEffect } from "react";
import FormField from "../Dashboard/components/FormField";

// Graduate Student Form
export default function GraduateStudentForm() {
  const [formData, setFormData] = useState({
    student_id: "",
    fname: "",
    lname: "",
    thesis_title: "",
    research_area: "",
    make_teaching_staff: false,
    salary: "",
    department: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    // Function to fetch departments
    const fetchDepartments = async () => {
      try {
        console.log("Fetching departments...");
        const response = await fetch("/api/department/");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched departments:", data);
        setDepartments(data);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changed ${name} to ${value}`);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    console.log("Submitting form data:", formData);

    try {
      // Step 1: Create Student
      console.log("Creating student...");
      const studentRes = await fetch("/api/student/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: formData.student_id,
          fname: formData.fname,
          lname: formData.lname,
        }),
      });

      if (!studentRes.ok) {
        const err = await studentRes.json();
        console.error("Student creation failed:", err);
        throw new Error("Failed to create student: " + JSON.stringify(err));
      }

      console.log("Student created successfully");

      // Step 2: Create Employee and TeachingStaff if selected
      let teachingStaffId = null;

      if (formData.make_teaching_staff) {
        // Create employee record first
        console.log("Creating employee record...");
        const employeeRes = await fetch("/api/employees/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fname: formData.fname,
            lname: formData.lname,
            salary: parseInt(formData.salary) || 0, // Ensure salary is never null
            dno: formData.department || null // Allow null department if not selected
          }),
        });

        if (!employeeRes.ok) {
          const err = await employeeRes.json();
          console.error("Employee creation failed:", err);
          throw new Error("Failed to create employee: " + JSON.stringify(err));
        }

        const employeeData = await employeeRes.json();
        console.log("Employee created successfully:", employeeData);

        // Create teaching staff record - make sure we pass the employee ID properly
        console.log("Creating teaching staff record with employee ID:", employeeData.eid);
        const teachingStaffRes = await fetch("/api/teaching-staff/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employee: employeeData.eid
          }),
        });

        if (!teachingStaffRes.ok) {
          const err = await teachingStaffRes.json();
          console.error("Teaching staff creation failed:", err);
          throw new Error("Failed to create teaching staff: " + JSON.stringify(err));
        }

        const teachingStaffData = await teachingStaffRes.json();
        console.log("Teaching staff created successfully:", teachingStaffData);
        teachingStaffId = employeeData.eid; // Using EID as the teaching staff ID
      }

      // Step 3: Create Graduate
      console.log("Creating graduate with teaching ID:", teachingStaffId);
      const gradRes = await fetch("/api/graduates/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student: formData.student_id,
          thesis_title: formData.thesis_title,
          research_area: formData.research_area,
          teaching: teachingStaffId // This might be null if make_teaching_staff is false, which is fine
        }),
      });

      if (!gradRes.ok) {
        const err = await gradRes.json();
        console.error("Graduate creation failed:", err);
        throw new Error("Failed to create graduate: " + JSON.stringify(err));
      }

      console.log("Graduate created successfully");
      setSuccess(true);
      setFormData({
        student_id: "",
        fname: "",
        lname: "",
        thesis_title: "",
        research_area: "",
        make_teaching_staff: false,
        salary: "",
        department: "",
      });
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      console.log("Submission process ended");
    }
  };

  // Create department options for dropdown - ensure it's using the correct field names from API
  const departmentOptions = [
    { value: "", label: "Select a department" },
    ...(departments.length > 0
      ? departments.map((dept) => ({
        value: dept.dno || dept.id,
        label: dept.name || dept.dname || "Department " + (dept.dno || dept.id),
      }))
      : [])
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Register Graduate Student</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Graduate student registered successfully!
        </div>
      )}

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
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="make_teaching_staff"
              checked={formData.make_teaching_staff || false}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  make_teaching_staff: e.target.checked,
                }))
              }
            />
            <span>Register as Teaching Staff</span>
          </label>
        </div>

        {formData.make_teaching_staff && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
            <h3 className="col-span-2 font-medium text-gray-700">Teaching Staff Information</h3>
            <FormField
              label="Salary"
              name="salary"
              type="number"
              value={formData.salary}
              onChange={handleChange}
              required={formData.make_teaching_staff}
              placeholder="0"
            />
            <FormField
              label="Department"
              name="department"
              type="select"
              value={formData.department}
              onChange={handleChange}
              required={formData.make_teaching_staff}
              options={departmentOptions}
            />
          </div>
        )}

        <div className="pt-4">
          <div className="flex items-center space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Register Graduate Student"}
            </button>

            {loading && (
              <span className="text-gray-600">Processing...</span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
