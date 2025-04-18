// src/pages/StudentTable.jsx
import { useEffect, useState } from "react";
import "./StudentView.css";

function StudentView() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const mockStudents = [
    {
      student_id: 10001,
      fname: "Amina",
      lname: "Diallo",
      student_type: "undergraduate",
      degree_program: "BSc Computer Science",
      degree_program_name: "BSc Computer Science",
      gpa: 3.78,
      majors: ["Computer Science"],
      minors: ["Mathematics"],
    },
    {
      student_id: 10002,
      fname: "David",
      lname: "Lee",
      student_type: "graduate",
      degree_program: "MSc Data Science",
      degree_program_name: "MSc Data Science",
      gpa: 3.92,
      majors: ["Data Science"],
      minors: [],
    },
  ];

  /*
    useEffect(() => {
    fetch("http://localhost:8000/api/students/")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("Error fetching students:", err));
  }, []);
  */

  useEffect(() => {
    setStudents(mockStudents);
  }, []);

  const filtered = students.filter(
    (s) =>
      `${s.fname} ${s.lname}`.toLowerCase().includes(search.toLowerCase()) ||
      s.student_id.toString().includes(search)
  );

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
            <th>Program</th>
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
                <td>{s.degree_program_name || "—"}</td>
                <td>{s.majors?.join(", ") || "—"}</td>
                <td>{s.minors?.join(", ") || "—"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No students match your search.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StudentView;
