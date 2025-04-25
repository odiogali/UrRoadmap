import { useState } from 'react';
import DegreeForm from './DegreeForm';

export default function Degrees() {
  const [message, setMessage] = useState("");

  const handleDegreeSubmit = async (formData) => {
    try {
      const res = await fetch("/api/degreeprogram/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Degree program registered successfully!");
      } else {
        setMessage(`Error: ${data.detail || "Something went wrong."}`);
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="p-4">
      <h2 className="tab-section-title">Degree Program Registration</h2>
      <p className="mb-4 p-2 rounded font-medium" style={{ color: "black", backgroundColor: "#f3f3f3" }}>
        {message}
        </p>
      <DegreeForm onSubmit={handleDegreeSubmit} />
    </div>
  );
}
