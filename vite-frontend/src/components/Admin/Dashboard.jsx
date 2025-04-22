import { useState } from "react";
import { User, BookOpen, Users } from "lucide-react";
import "./Dashboard.css";

// Main Dashboard Component
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("students");

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">University Management System</h1>

      {/* Tab Navigation */}
      <div className="tabs-container">
        <TabButton
          active={activeTab === "students"}
          onClick={() => setActiveTab("students")}
          icon={<User className="icon" />}
          label="Students"
        />
        <TabButton
          active={activeTab === "courses"}
          onClick={() => setActiveTab("courses")}
          icon={<BookOpen className="icon" />}
          label="Courses"
        />
        <TabButton
          active={activeTab === "faculty"}
          onClick={() => setActiveTab("faculty")}
          icon={<Users className="icon" />}
          label="Faculty"
        />
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "students" && <StudentForms />}
        {activeTab === "courses" && <CourseForm />}
        {activeTab === "faculty" && <FacultyForms />}
      </div>
    </div>
  );
}

// Tab Button Component
function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`tab-button ${active ? "active" : "inactive"}`}
    >
      {icon}
      {label}
    </button>
  );
}

// Student Forms Component
function StudentForms() {
  const [studentType, setStudentType] = useState("undergraduate");

  const handleStudentTypeChange = (e) => {
    setStudentType(e.target.value);
  };

  return (
    <div>
      <h2 className="tab-section-title">Student Registration</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Student Type
        </label>
        <div className="flex gap-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="undergraduate"
              checked={studentType === "undergraduate"}
              onChange={handleStudentTypeChange}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2">Undergraduate</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="graduate"
              checked={studentType === "graduate"}
              onChange={handleStudentTypeChange}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2">Graduate</span>
          </label>
        </div>
      </div>

      {studentType === "undergraduate" ? (
        <UndergraduateStudentForm />
      ) : (
        <GraduateStudentForm />
      )}
    </div>
  );
}

// Undergraduate Student Form
function UndergraduateStudentForm() {
  const [formData, setFormData] = useState({
    student_id: "",
    fname: "",
    lname: "",
    major: "",
    minor: "",
    credits_completed: "",
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
      const response = await fetch("/api/students/undergraduate/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Undergraduate student added successfully!");
        setFormData({
          student_id: "",
          fname: "",
          lname: "",
          major: "",
          minor: "",
          credits_completed: "",
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
          label="Credits Completed"
          name="credits_completed"
          type="number"
          value={formData.credits_completed}
          onChange={handleChange}
          required
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Register Undergraduate Student
        </button>
      </div>
    </form>
  );
}

// Graduate Student Form
function GraduateStudentForm() {
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

function CourseForm() {
  const [formData, setFormData] = useState({
    course_code: "",
    course_title: "",
    textbook_isbn: "",
    dno: "",
    prerequisites: [],
    antirequisites: [],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear error when user types in a field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateTextbookISBN = (isbn) => {
    // Allow empty values since textbook is optional
    if (!isbn || isbn.trim() === "") {
      return true;
    }
    // Add any additional ISBN validation logic here if needed
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Create the course
      const courseResponse = await fetch("/api/course/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_code: formData.course_code,
          course_title: formData.course_title,
          textbook_isbn: formData.textbook_isbn || null,
          dno: formData.dno,
        }),
      });

      if (!courseResponse.ok) throw new Error("Failed to create course");

      // Add prerequisites
      for (const prereq of formData.prerequisites) {
        await fetch("/api/has_as_preq/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            course_code: formData.course_code,
            prereq_code: prereq,
          }),
        });
      }

      // Add antirequisites
      for (const antireq of formData.antirequisites) {
        await fetch("/api/has_as_antireq/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            course_code: formData.course_code,
            antireq_code: antireq,
          }),
        });
      }

      alert("Course added with prerequisites and antirequisites!");
      setFormData({
        course_code: "",
        course_title: "",
        textbook_isbn: "",
        dno: "",
        prerequisites: [],
        antirequisites: [],
      });
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while submitting the course form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="tab-section-title">Course Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormField
              label="Course Code"
              name="course_code"
              type="text"
              value={formData.course_code}
              onChange={handleChange}
              required
              error={errors.course_code}
            />
            {errors.course_code && (
              <p className="text-red-500 text-sm mt-1">{errors.course_code}</p>
            )}
          </div>

          <div>
            <FormField
              label="Textbook ISBN (optional)"
              name="textbook_isbn"
              type="text"
              value={formData.textbook_isbn}
              onChange={handleChange}
              error={errors.textbook_isbn}
            />
            {errors.textbook_isbn && (
              <p className="text-red-500 text-sm mt-1">
                {errors.textbook_isbn}
              </p>
            )}
          </div>

          <div>
            <FormField
              label="Professor ID"
              name="prof"
              type="number"
              value={formData.prof}
              onChange={handleChange}
              required
              error={errors.prof}
            />
            {errors.prof && (
              <p className="text-red-500 text-sm mt-1">{errors.prof}</p>
            )}
          </div>

          <div>
            <FormField
              label="Department Number"
              name="dno"
              type="number"
              value={formData.dno}
              onChange={handleChange}
              required
              error={errors.dno}
            />
            {errors.dno && (
              <p className="text-red-500 text-sm mt-1">{errors.dno}</p>
            )}
          </div>
        </div>
        <FormField
          label="Course Title"
          name="course_title"
          type="text"
          value={formData.course_title}
          onChange={handleChange}
          required
        />

        <FormField
          label="Prerequisites (comma-separated course codes)"
          name="prerequisites"
          type="text"
          value={formData.prerequisites.join(",")}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              prerequisites: e.target.value.split(",").map((c) => c.trim()),
            }))
          }
        />

        <FormField
          label="Antirequisites (comma-separated course codes)"
          name="antirequisites"
          type="text"
          value={formData.antirequisites.join(",")}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              antirequisites: e.target.value.split(",").map((c) => c.trim()),
            }))
          }
        />

        <div className="pt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding Course..." : "Add Course"}
          </button>
        </div>
      </form>
    </div>
  );
}

// Faculty Forms Component
function FacultyForms() {
  const [facultyType, setFacultyType] = useState("professor");

  const handleFacultyTypeChange = (e) => {
    setFacultyType(e.target.value);
  };

  return (
    <div>
      <h2 className="tab-section-title">Faculty Registration</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Faculty Type
        </label>
        <div className="flex flex-wrap gap-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="professor"
              checked={facultyType === "professor"}
              onChange={handleFacultyTypeChange}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2">Professor</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="adminStaff"
              checked={facultyType === "adminStaff"}
              onChange={handleFacultyTypeChange}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2">Admin Staff</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="supportStaff"
              checked={facultyType === "supportStaff"}
              onChange={handleFacultyTypeChange}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2">Support Staff</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="teachingStaff"
              checked={facultyType === "teachingStaff"}
              onChange={handleFacultyTypeChange}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2">Teaching Staff</span>
          </label>
        </div>
      </div>

      {facultyType === "professor" && <ProfessorForm />}
      {facultyType === "adminStaff" && <AdminStaffForm />}
      {facultyType === "supportStaff" && <SupportStaffForm />}
      {facultyType === "teachingStaff" && <TeachingStaffForm />}
    </div>
  );
}

// Professor Form
function ProfessorForm() {
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

// Admin Staff Form
function AdminStaffForm() {
  const [formData, setFormData] = useState({
    eid: "",
    fname: "",
    lname: "",
    salary: "",
    dno: "",
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
      const response = await fetch("/api/admin-staff/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Admin staff added successfully!");
        setFormData({
          eid: "",
          fname: "",
          lname: "",
          salary: "",
          dno: "",
        });
      } else {
        alert("Failed to add admin staff");
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

// Support Staff Form
function SupportStaffForm() {
  const [formData, setFormData] = useState({
    eid: "",
    fname: "",
    lname: "",
    salary: "",
    dno: "",
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
      const response = await fetch("/api/support-staff/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Support staff added successfully!");
        setFormData({
          eid: "",
          fname: "",
          lname: "",
          salary: "",
          dno: "",
        });
      } else {
        alert("Failed to add support staff");
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
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Support Staff
        </button>
      </div>
    </form>
  );
}

// Teaching Staff Form
function TeachingStaffForm() {
  const [formData, setFormData] = useState({
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
      const response = await fetch("/api/teaching-staff/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Teaching staff added successfully!");
        setFormData({
          teaching_id: "",
        });
      } else {
        alert("Failed to add teaching staff");
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
          label="Teaching ID"
          name="teaching_id"
          type="number"
          value={formData.teaching_id}
          onChange={handleChange}
          required
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Teaching Staff
        </button>
      </div>
    </form>
  );
}

// Reusable Form Field Component
function FormField({ label, name, type, value, onChange, required = false }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}
