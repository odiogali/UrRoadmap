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
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [degreePrograms, setDegreePrograms] = useState([]);

  useEffect(() => {
    const fetchDegreePrograms = async () => {
      try {
        console.log("Fetching degree programs...");
        const response = await fetch("/api/degreeprogram/");
        const data = await response.json();
        console.log("Fetched degree programs:", data);
        setDegreePrograms(data);
      } catch (error) {
        console.error("Failed to fetch degree programs:", error);
      }
    };

    fetchDegreePrograms();
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

      // Step 2: Create Graduate
      console.log("Creating graduate...");
      const gradRes = await fetch("/api/graduates/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student: formData.student_id,
          thesis_title: formData.thesis_title,
          research_area: formData.research_area,
          fname: formData.fname,
          lname: formData.lname,
          make_teaching_staff: formData.make_teaching_staff,
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
      });
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      console.log("Submission process ended");
    }
  };

  const programOptions = [
    { value: "", label: "Select a program" },
    ...degreePrograms.map((program) => ({
      value: program.prog_name || program.id,
      label: program.prog_name || program.name,
    })),
  ];

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

      <div className="pt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Register Graduate Student
        </button>
        {loading && <p>Submitting...</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-600 mt-2">Graduate student registered!</p>}
      </div>
    </form>
  );
}
