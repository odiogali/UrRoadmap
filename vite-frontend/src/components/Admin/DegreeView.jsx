import { useEffect, useState } from "react";
import "./StudentView.css"; // reuse existing styles

export default function DegreeView() {
  const [degrees, setDegrees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/api/degreeprogram/")
      .then((res) => res.json())
      .then((data) => {
        setDegrees(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching degree programs:", err);
        setError("Failed to load degree programs.");
        setLoading(false);
      });
  }, []);

  const filteredDegrees = degrees.filter((d) =>
    d.prog_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="student-page">
      <h2 className="student-title">Degree Program Catalog</h2>

      <input
        type="text"
        className="student-search"
        placeholder="Search by program name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <div className="loading">Loading degree programs...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <table className="student-table">
          <thead>
            <tr>
              <th>Program Name</th>
            </tr>
          </thead>
          <tbody>
            {filteredDegrees.length > 0 ? (
              filteredDegrees.map((d, i) => (
                <tr key={i}>
                  <td>{d.prog_name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="1">No degree programs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

const handleDegreeSubmit = async (formData) => {
    try {
      const res = await fetch("/api/degreeprogram/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Server returned an invalid response.");
      }
  
      if (res.ok) {
        setMessage("✅ Degree program registered successfully!");
      } else {
        setMessage(`Error: ${data.detail || "Something went wrong."}`);
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };
  
