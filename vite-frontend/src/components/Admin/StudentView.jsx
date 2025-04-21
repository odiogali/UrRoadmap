import { useEffect, useState } from "react";
import "./StudentView.css";

function StudentView() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/student/")
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
        setError("Failed to load students.");
        setLoading(false);
      });
  }, []);

  const filtered = students.filter(
    (s) =>
      `${s.fname} ${s.lname}`.toLowerCase().includes(search.toLowerCase()) ||
      s.student_id.toString().includes(search)
  );

  if (loading) return <p>Loading students...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="student-page">
      <h2 className="student-title">Student Directory</h2>

      <input
        type="text"
        className="student-search"
        placeholder="Search by name or ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="student-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>First</th>
            <th>Last</th>
            <th>Majors</th>
            <th>Minors</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map((s) => (
              <tr key={s.student_id}>
                <td>{s.student_id}</td>
                <td>{s.fname || "—"}</td>
                <td>{s.lname || "—"}</td>
                <td>{s.majors || "—"}</td>
                <td>{s.minors || "—"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No students match your search.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StudentView;
