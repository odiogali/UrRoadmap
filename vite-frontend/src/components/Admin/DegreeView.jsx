import { useEffect, useState } from "react";
import axios from "axios";
import "./StudentView.css";

export default function DegreeView() {
  const [degrees, setDegrees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingDegree, setEditingDegree] = useState(null);
  const [editFormData, setEditFormData] = useState({ prog_name: "" });

  const fetchDegrees = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/degreeprogram/");
      setDegrees(res.data);
    } catch (err) {
      console.error("Error fetching degrees:", err);
      setError("Failed to load degree programs.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDegrees();
  }, []);

  const filteredDegrees = degrees.filter((d) =>
    d.prog_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditClick = (degree) => {
    setEditingDegree(degree.prog_name);
    setEditFormData({ prog_name: degree.prog_name });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/degreeprogram/${editingDegree}/`, {
        prog_name: editFormData.prog_name,
      });

      await fetchDegrees();
      setEditingDegree(null);
      alert("Degree program updated!");
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      alert("Failed to update degree program.");
    }
  };

  const handleDelete = async (prog_name) => {
    const confirmed = window.confirm(`Delete degree program "${prog_name}"?`);
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:8000/api/degreeprogram/${prog_name}/`);
      setDegrees((prev) => prev.filter((d) => d.prog_name !== prog_name));
      alert("Degree program deleted.");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete degree program.");
    }
  };

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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDegrees.length > 0 ? (
              filteredDegrees.map((d) => (
                <tr key={d.prog_name}>
                  <td>{d.prog_name}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEditClick(d)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(d.prog_name)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No degree programs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {editingDegree && (
        <div className="modal-overlay" onClick={() => setEditingDegree(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Degree Program</h3>
            <form onSubmit={handleEditSubmit} className="modal-form">
              <label>Program Name</label>
              <input
                type="text"
                value={editFormData.prog_name}
                onChange={(e) => setEditFormData({ prog_name: e.target.value })}
                required
              />
              <div className="modal-actions">
                <button type="submit" className="save-btn">Save</button>
                <button type="button" onClick={() => setEditingDegree(null)} className="cancel-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
