import { useState } from "react";
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
          prof: formData.prof,
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
        prof: "",
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
