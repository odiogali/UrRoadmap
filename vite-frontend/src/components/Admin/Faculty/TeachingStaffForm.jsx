import { useState } from "react";

// Teaching Staff Form
export default function TeachingStaffForm() {
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
