import { useEffect, useState } from "react";
import axios from "axios";
import "./TextbookView.css";

export default function TextbookView() {
  const [textbooks, setTextbooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingISBN, setEditingISBN] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    edition_no: "",
    price: "",
  });

  useEffect(() => {
    fetchTextbooks();
  }, []);

  const fetchTextbooks = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/textbook/");
      setTextbooks(res.data);
    } catch (err) {
      console.error("Error fetching textbooks:", err);
      setError("Failed to load textbooks.");
    }
    setLoading(false);
  };

  const handleDelete = async (isbn) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${isbn}"?`);
    if (!confirmed) return;
    try {
      await axios.delete(`http://localhost:8000/api/textbook/${isbn}/`);
      setTextbooks(prev => prev.filter(tb => tb.isbn !== isbn));
      alert("Textbook deleted successfully.");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete textbook.");
    }
  };

  const handleEditClick = (tb) => {
    setEditingISBN(tb.isbn);
    setEditFormData({
      title: tb.title,
      edition_no: tb.edition_no,
      price: tb.price,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/textbook/${editingISBN}/`, {
        isbn: editingISBN,
        title: editFormData.title,
        edition_no: parseInt(editFormData.edition_no),
        price: parseFloat(editFormData.price),
      });
      await fetchTextbooks();
      setEditingISBN(null);
      alert("Textbook updated successfully.");
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      alert("Failed to update textbook.");
    }
  };

  const filteredTextbooks = textbooks.filter((tb) =>
    tb.title.toLowerCase().includes(search.toLowerCase()) ||
    tb.isbn.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="student-page">
      <h2 className="student-title">Textbook Catalog</h2>

      <input
        type="text"
        className="student-search"
        placeholder="Search by title or ISBN..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <div className="loading">Loading textbooks...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <table className="student-table">
          <thead>
            <tr>
              <th>ISBN</th>
              <th>Title</th>
              <th>Edition</th>
              <th>Price ($)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTextbooks.length > 0 ? (
              filteredTextbooks.map((tb) => (
                <tr key={tb.isbn}>
                  <td>{tb.isbn}</td>
                  <td>{tb.title}</td>
                  <td>{tb.edition_no}</td>
                  <td>{parseFloat(tb.price).toFixed(2)}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEditClick(tb)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(tb.isbn)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No textbooks found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {editingISBN && (
        <div className="modal-overlay" onClick={() => setEditingISBN(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Textbook: {editingISBN}</h3>
            <form onSubmit={handleEditSubmit} className="modal-form">
              <label>Title</label>
              <input
                type="text"
                value={editFormData.title}
                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                required
              />
              <label>Edition</label>
              <input
                type="number"
                value={editFormData.edition_no}
                onChange={(e) => setEditFormData({ ...editFormData, edition_no: e.target.value })}
                required
              />
              <label>Price</label>
              <input
                type="number"
                step="0.01"
                value={editFormData.price}
                onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                required
              />
              <div className="modal-actions">
                <button type="submit" className="save-btn">Save</button>
                <button type="button" onClick={() => setEditingISBN(null)} className="cancel-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
