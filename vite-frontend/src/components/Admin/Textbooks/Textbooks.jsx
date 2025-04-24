import { useState } from 'react';
import TextbookForm from './TextbookForm';

export default function Textbooks() {
  const [message, setMessage] = useState("");

  const handleTextbookSubmit = async (formData) => {
    try {
      const res = await fetch("/api/textbook/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage("✅ Textbook registered successfully!");
      } else {
        const data = await res.json();
        setMessage(`Error: ${data.detail || "Something went wrong."}`);
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4 text-black">Textbook Registration</h2>

      {message && (
        <p className="mb-4 p-2 rounded font-medium" style={{ color: "black", backgroundColor: "#f3f3f3" }}>
        {message}
        </p>
      )}

      <TextbookForm onSubmit={handleTextbookSubmit} />
    </div>
  );
}
