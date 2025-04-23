import { useState, useEffect } from "react";
import FormField from "../Dashboard/components/FormField";

export default function UndergraduateStudentForm() {
  const [formData, setFormData] = useState({
    student: {
      student_id: "",
      fname: "",
      lname: ""
    },
    credits_completed: "",
    major: "",
    specialization: "",
    minor: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [responseDetails, setResponseDetails] = useState(null);
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
        [name]: value === "" ? null : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    setResponseDetails(null);

    try {
      const studentId = parseInt(formData.student.student_id);

      // Step 1: Check if student exists
      let studentExists = false;
      try {
        const checkStudentResponse = await fetch(`/api/student/${studentId}/`);
        if (checkStudentResponse.ok) {
          console.log("Student already exists, using existing record");
          studentExists = true;
        }
      } catch (error) {
        console.log("Error checking student existence:", error);
        // Continue with creation attempt if check fails
      }

      // Step 2: Create student only if it doesn't exist
      if (!studentExists) {
        const studentData = {
          student_id: studentId,
          fname: formData.student.fname,
          lname: formData.student.lname
        };

        console.log("Creating new student with data:", studentData);

        const studentResponse = await fetch("/api/student/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(studentData),
        });

        if (!studentResponse.ok) {
          const errorData = await studentResponse.json();
          console.error("Student creation failed:", errorData);

          // Check if it's a duplicate error (which means the student exists)
          if (studentResponse.status === 400 &&
            errorData.detail &&
            errorData.detail.includes("already exists")) {
            console.log("Student already exists (from error response)");
            studentExists = true;
          } else {
            setResponseDetails(errorData);
            throw new Error(`Failed to create student: ${JSON.stringify(errorData)}`);
          }
        } else {
          console.log("Student created successfully");
          studentExists = true;
        }
      }

      if (!studentExists) {
        throw new Error("Failed to create or find student record");
      }

      let specializationId = null;
      if (formData.specialization && formData.major) {
        try {
          // First try to check if degree program exists
          const checkProgramResponse = await fetch(`/api/degreeprogram/?prog_name=${encodeURIComponent(formData.major)}`);
          if (checkProgramResponse.ok) {
            const existingPrograms = await checkProgramResponse.json();
            if (existingPrograms.length > 0) {
              // Degree program exists, now check if specialization exists
              const checkSpecResponse = await fetch(`/api/specialization/?sname=${encodeURIComponent(formData.specialization)}&program=${encodeURIComponent(formData.major)}`);
              if (checkSpecResponse.ok) {
                const existingSpecs = await checkSpecResponse.json();
                if (existingSpecs.length > 0) {
                  specializationId = existingSpecs[0].id;
                  console.log("Found existing specialization with ID:", specializationId);
                } else {
                  // Create specialization if it doesn't exist
                  const specializationData = {
                    sname: formData.specialization,
                    program: formData.major
                  };

                  console.log("Creating new specialization with data:", specializationData);

                  const specResponse = await fetch("/api/specialization/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(specializationData),
                  });

                  if (specResponse.ok) {
                    const newSpec = await specResponse.json();
                    specializationId = newSpec.id;
                    console.log("Created specialization with ID:", specializationId);
                  } else {
                    console.log("Failed to create specialization, continuing without it");
                  }
                }
              }
            } else {
              console.log("Degree program does not exist, cannot create specialization");
            }
          }
        } catch (error) {
          console.error("Error handling specialization:", error);
          // Continue without specialization if there's an error
        }
      }

      // Step 4: Create undergraduate record
      console.log(studentId)
      const undergraduateData = {
        student_id: studentId,  // Make sure this is a number, not null or undefined
        credits_completed: formData.credits_completed ? parseInt(formData.credits_completed) : null,
        specialization: specializationId, // Pass specialization ID instead of name
        major: formData.major,
        minor: formData.minor || null
      };

      // Add debugging to see what's being sent
      console.log("Creating undergraduate with data:", JSON.stringify(undergraduateData));

      const undergradResponse = await fetch("/api/undergraduates/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(undergraduateData),
      });

      if (!undergradResponse.ok) {
        const errorData = await undergradResponse.json();
        console.error("Undergraduate creation failed:", errorData);
        setResponseDetails(errorData);
        throw new Error(`Failed to create undergraduate record: ${JSON.stringify(errorData)}`);
      } else {
        console.log("Undergraduate created successfully");
      }

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
        specialization: "",
        minor: ""
      });
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
          <div><strong>Error:</strong> {error}</div>
          {responseDetails && (
            <pre className="mt-2 text-sm overflow-auto max-h-40">
              {JSON.stringify(responseDetails, null, 2)}
            </pre>
          )}
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
            value={formData.major || ""}
            onChange={handleChange}
            required
            options={[
              { value: "", label: "Select a major" },
              ...degreePrograms.map((program) => ({
                value: program.prog_name || program.id,
                label: program.prog_name || program.name,
              })),
            ]}
          />

          {/* Specialization as text input */}
          <FormField
            label="Specialization (Optional)"
            name="specialization"
            type="text"
            value={formData.specialization || ""}
            onChange={handleChange}
            placeholder="Enter specialization name"
          />

          {/* Minor dropdown */}
          <FormField
            label="Minor"
            name="minor"
            type="select"
            value={formData.minor || ""}
            onChange={handleChange}
            options={[
              { value: "", label: "None" },
              ...degreePrograms.map((program) => ({
                value: program.prog_name || program.id,
                label: program.prog_name || program.name,
              })),
            ]}
          />
        </div>

        <div className="pt-4">
          <div className="flex items-center space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Register Undergraduate Student"}
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
