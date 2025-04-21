import { useState } from "react";
import "./AddStudentModal.css";

function AddStudentModal({ isOpen, onClose, onStudentAdded }) {
  const [formData, setFormData] = useState({
    student_id: "",
    fname: "",
    lname: "",
    major: "",
    minor: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/student/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add student");
      const data = await res.json();

      alert("Student added!");
      onStudentAdded && onStudentAdded(data);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error adding student.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Add New Student</h3>
        <form onSubmit={handleSubmit}>
          <input
            name="student_id"
            type="number"
            placeholder="Student ID"
            value={formData.student_id}
            onChange={handleChange}
            required
          />
          <input
            name="fname"
            type="text"
            placeholder="First Name"
            value={formData.fname}
            onChange={handleChange}
            required
          />
          <input
            name="lname"
            type="text"
            placeholder="Last Name"
            value={formData.lname}
            onChange={handleChange}
            required
          />
          <input
            name="major"
            type="text"
            placeholder="Major"
            value={formData.major}
            onChange={handleChange}
          />
          <input
            name="minor"
            type="text"
            placeholder="Minor"
            value={formData.minor}
            onChange={handleChange}
          />

          <div className="modal-buttons">
            <button type="submit">Add</button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStudentModal;
