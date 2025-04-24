import { useEffect, useState } from "react";
import "./TextbookView.css";

export default function TextbookView() {
  const [textbooks, setTextbooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/api/textbook/")
      .then((res) => res.json())
      .then((data) => {
        setTextbooks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching textbooks:", err);
        setError("Failed to load textbooks.");
        setLoading(false);
      });
  }, []);

  const filteredTextbooks = textbooks.filter((tb) =>
    tb.title.toLowerCase().includes(search.toLowerCase()) ||
    tb.isbn.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="student-page">
      <h2 className="student-title">Textbook Catalog</h2>

      {/* Search input */}
      <input
        type="text"
        className="student-search"
        placeholder="Search by title or ISBN..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Loading/Error/Textbook Table */}
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No textbooks found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
