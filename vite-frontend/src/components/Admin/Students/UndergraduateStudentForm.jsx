import { useState, useEffect } from "react";
import FormField from "../Dashboard/components/FormField";

// Undergraduate Student Form
export default function UndergraduateStudentForm() {
  const [formData, setFormData] = useState({
    student: {
      student_id: "",
      fname: "",
      lname: ""
    },
    credits_completed: "",
    major: "",
    minor: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [degreePrograms, setDegreePrograms] = useState([]);

  // Fetch degree programs from the API
  useEffect(() => {
    const fetchDegreePrograms = async () => {
      try {
        const response = await fetch("/api/degreeprogram/");
        const data = await response.json();
        setDegreePrograms(data);
      } catch (error) {
        console.error("Failed to fetch degree programs:", error);
        setError("Failed to load degree programs");
      }
    };

    fetchDegreePrograms();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("student.")) {
      const studentField = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        student: {
          ...prevData.student,
          [studentField]: value
        }
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // First, create the student record if it doesn't exist
    try {
      // First step: Create or verify student record
      const studentResponse = await fetch("/api/student/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: formData.student.student_id,
          fname: formData.student.fname,
          lname: formData.student.lname
        }),
      });

      if (!studentResponse.ok) {
        // Check if it's a 400 error due to student already existing
        const errorData = await studentResponse.json();
        // If it's not because the student already exists, throw an error
        if (studentResponse.status !== 400 || !errorData.detail?.includes("already exists")) {
          throw new Error(`Failed to create student: ${errorData.detail || studentResponse.statusText}`);
        }
        // If student exists, we can continue to create the undergraduate record
      }

      // Second step: Create undergraduate record
      // Prepare data for the undergraduate record
      const undergraduateData = {
        student: formData.student.student_id,
        credits_completed: formData.credits_completed ? parseInt(formData.credits_completed) : null,
        major: formData.major,
        minor: formData.minor || null
      };

      const undergradResponse = await fetch("/api/undergraduates/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(undergraduateData),
      });

      if (undergradResponse.ok) {
        setSuccess(true);
        // Reset form after successful submission
        setFormData({
          student: {
            student_id: "",
            fname: "",
            lname: ""
          },
          credits_completed: "",
          major: "",
          minor: ""
        });
      } else {
        const errorData = await undergradResponse.json();
        throw new Error(`Failed to create undergraduate record: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "An error occurred while submitting the form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Register Undergraduate Student</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Undergraduate student registered successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Student ID"
            name="student.student_id"
            type="number"
            value={formData.student.student_id}
            onChange={handleChange}
            required
          />
          <FormField
            label="First Name"
            name="student.fname"
            type="text"
            value={formData.student.fname}
            onChange={handleChange}
            required
          />
          <FormField
            label="Last Name"
            name="student.lname"
            type="text"
            value={formData.student.lname}
            onChange={handleChange}
            required
          />
          <FormField
            label="Credits Completed"
            name="credits_completed"
            type="number"
            value={formData.credits_completed}
            onChange={handleChange}
            required
          />

          {/* Major dropdown */}
          <FormField
            label="Major"
            name="major"
            type="select"
            value={formData.major}
            onChange={handleChange}
            required
            options={[
              { value: "", label: "Select a major" },
              ...degreePrograms.map((program) => ({
                value: program.id || program.prog_name,
                label: program.prog_name || program.name,
              })),
            ]}
          />

          {/* Minor dropdown */}
          <FormField
            label="Minor"
            name="minor"
            type="select"
            value={formData.minor}
            onChange={handleChange}
            options={[
              { value: "", label: "None" },
              ...degreePrograms.map((program) => ({
                value: program.id || program.prog_name,
                label: program.prog_name || program.name,
              })),
            ]}
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Register Undergraduate Student"}
          </button>
        </div>
      </form>
    </div>
  );
}
