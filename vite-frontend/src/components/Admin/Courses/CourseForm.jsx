import { useState, useEffect } from "react";
import FormField from "../Dashboard/components/FormField";

export default function CourseForm() {
  const [formData, setFormData] = useState({
    course_code: "",
    course_title: "",
    textbook_isbn: "",
    dno: "",
    prof: "",
    prerequisites: [],
    antirequisites: [],
    section: {
      semester: "",
      instructor: "",
      s_id: 1, // or you can generate this on the backend
    }
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for dropdown options
  const [textbooks, setTextbooks] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all dropdown data on component mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      setIsLoading(true);
      try {
        // Fetch textbooks
        const textbooksResponse = await fetch("/api/textbook/");
        const textbooksData = await textbooksResponse.json();
        setTextbooks(textbooksData);

        // Fetch professors
        const professorsResponse = await fetch("/api/teaching-staff/");
        const professorsData = await professorsResponse.json();
        setProfessors(professorsData);

        // Fetch departments
        const departmentsResponse = await fetch("/api/department/");
        const departmentsData = await departmentsResponse.json();
        setDepartments(departmentsData);

        // Fetch all courses for prerequisites and antirequisites
        const coursesResponse = await fetch("/api/course/");
        const coursesData = await coursesResponse.json();
        setAllCourses(coursesData);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

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

  // Toggle a course in or out of prerequisites/antirequisites
  const toggleCourseSelection = (courseCode, fieldName) => {
    setFormData(prevData => {
      const currentSelection = [...prevData[fieldName]];

      if (currentSelection.includes(courseCode)) {
        // Remove the course if already selected
        return {
          ...prevData,
          [fieldName]: currentSelection.filter(code => code !== courseCode)
        };
      } else {
        // Add the course if not selected
        return {
          ...prevData,
          [fieldName]: [...currentSelection, courseCode]
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // 1. Create the course
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

      // 2. Create the initial section for the course
      const sectionResponse = await fetch("/api/sections/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scourse_code: formData.course_code,
          s_id: formData.section.s_id, // or generate on backend
          semester: formData.section.semester || "Fall", // default/fixed or form input
          instructor: formData.prof, // link professor here
        }),
      });

      if (!sectionResponse.ok) throw new Error("Failed to create section");

      // 3. Add prerequisites
      for (const prereq of formData.prerequisites) {
        await fetch("/api/prerequisites/create/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            course_code: formData.course_code,
            prereq_code: prereq,
          }),
        });
      }

      // 4. Add antirequisites
      for (const antireq of formData.antirequisites) {
        await fetch("/api/antirequisites/create/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            course_code: formData.course_code,
            antireq_code: antireq,
          }),
        });
      }

      alert("Course and section successfully added!");
      setFormData({
        course_code: "",
        course_title: "",
        textbook_isbn: "",
        dno: "",
        prof: "",
        prerequisites: [],
        antirequisites: [],
        section: {
          semester: "",
          instructor: "",
          s_id: 1,
        },
      });
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while submitting the course form");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prepare dropdown option arrays in the format used by FormField
  const textbookOptions = isLoading
    ? [{ value: "", label: "Loading textbooks..." }]
    : [
      { value: "", label: "Select a textbook (optional)" },
      ...textbooks.map(book => ({
        value: book.isbn,
        label: `${book.title} (ISBN: ${book.isbn})`
      }))
    ];

  const professorOptions = isLoading
    ? [{ value: "", label: "Loading professors..." }]
    : [
      { value: "", label: "Select a professor" },
      ...professors
        .filter(p => p.professor_details !== null) // Only include professors
        .map(p => {
          const prof = p.professor_details.employee;
          return {
            value: prof.eid,
            label: `${prof.fname} ${prof.lname} (ID: ${prof.eid})`
          };
        })
    ];

  const departmentOptions = isLoading
    ? [{ value: "", label: "Loading departments..." }]
    : [
      { value: "", label: "Select a department" },
      ...departments.map(dept => ({
        value: dept.dno,
        label: `${dept.dname} (Dept #: ${dept.dno})`
      }))
    ];

  // Filter courses for prerequisites (excluding antirequisites)
  const prerequisiteOptions = isLoading
    ? []
    : allCourses
      .filter(course => !formData.antirequisites.includes(course.course_code))
      .map(course => ({
        value: course.course_code,
        label: `${course.course_code}: ${course.course_title}`
      }));

  // Filter courses for antirequisites (excluding prerequisites)
  const antirequisiteOptions = isLoading
    ? []
    : allCourses
      .filter(course => !formData.prerequisites.includes(course.course_code))
      .map(course => ({
        value: course.course_code,
        label: `${course.course_code}: ${course.course_title}`
      }));

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
          </div>

          <div>
            <FormField
              label="Textbook"
              name="textbook_isbn"
              type="select"
              value={formData.textbook_isbn}
              onChange={handleChange}
              options={textbookOptions}
              error={errors.textbook_isbn}
              disabled={isLoading}
            />
          </div>

          <div>
            <FormField
              label="Professor"
              name="prof"
              type="select"
              value={formData.prof}
              onChange={handleChange}
              options={professorOptions}
              required
              error={errors.prof}
              disabled={isLoading}
            />
          </div>

          <div>
            <FormField
              label="Department"
              name="dno"
              type="select"
              value={formData.dno}
              onChange={handleChange}
              options={departmentOptions}
              required
              error={errors.dno}
              disabled={isLoading}
            />
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Prerequisites Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prerequisites
            </label>
            <div className="bg-gray-800 rounded-md h-64 overflow-hidden">
              <div className="h-full overflow-y-auto p-3">
                {isLoading ? (
                  <p className="text-gray-300">Loading courses...</p>
                ) : prerequisiteOptions.length > 0 ? (
                  <div className="space-y-2">
                    {prerequisiteOptions.map(option => (
                      <div key={option.value} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`prereq-${option.value}`}
                          checked={formData.prerequisites.includes(option.value)}
                          onChange={() => toggleCourseSelection(option.value, "prerequisites")}
                          className="h-4 w-4 text-blue-500 focus:ring-blue-400 bg-gray-700 border-gray-600"
                        />
                        <label
                          htmlFor={`prereq-${option.value}`}
                          className="ml-2 text-sm text-gray-200 cursor-pointer hover:text-white"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-300">No available courses for prerequisites</p>
                )}
              </div>
            </div>
            {formData.prerequisites.length > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: {formData.prerequisites.length} course(s)
              </p>
            )}
          </div>

          {/* Antirequisites Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Antirequisites
            </label>
            <div className="bg-gray-800 rounded-md h-64 overflow-hidden">
              <div className="h-full overflow-y-auto p-3">
                {isLoading ? (
                  <p className="text-gray-300">Loading courses...</p>
                ) : antirequisiteOptions.length > 0 ? (
                  <div className="space-y-2">
                    {antirequisiteOptions.map(option => (
                      <div key={option.value} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`antireq-${option.value}`}
                          checked={formData.antirequisites.includes(option.value)}
                          onChange={() => toggleCourseSelection(option.value, "antirequisites")}
                          className="h-4 w-4 text-blue-500 focus:ring-blue-400 bg-gray-700 border-gray-600"
                        />
                        <label
                          htmlFor={`antireq-${option.value}`}
                          className="ml-2 text-sm text-gray-200 cursor-pointer hover:text-white"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-300">No available courses for antirequisites</p>
                )}
              </div>
            </div>
            {formData.antirequisites.length > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: {formData.antirequisites.length} course(s)
              </p>
            )}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? "Adding Course..." : "Add Course"}
          </button>
        </div>
      </form>
    </div>
  );
}
