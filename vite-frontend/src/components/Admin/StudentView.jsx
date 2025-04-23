import { useEffect, useState } from "react";
import "./StudentView.css";

function StudentView() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentType, setStudentType] = useState("all");

  useEffect(() => {
    setLoading(true);
    fetch(
      `http://localhost:8000/api/student/?search=${search}&type=${studentType}`
    )
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
  }, [search, studentType]);

  const renderTableHeader = () => {
    if (studentType === "undergraduate") {
      return (
        <tr>
          <th>ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Credits</th>
          <th>Major</th>
          <th>Specialization</th>
          <th>Minor</th>
        </tr>
      );
    }

    if (studentType === "graduate") {
      return (
        <tr>
          <th>ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Research Area</th>
          <th>Thesis Title</th>
        </tr>
      );
    }

    // "all" view
    return (
      <tr>
        <th>ID</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Type</th>
      </tr>
    );
  };

  const renderTableRow = (student) => {
    const baseCols = (
      <>
        <td>{student.student_id}</td>
        <td>{student.fname || "—"}</td>
        <td>{student.lname || "—"}</td>
      </>
    );

    if (studentType === "undergraduate") {
      return (
        <tr key={student.student_id}>
          {baseCols}
          <td>{student.credits_completed ?? "—"}</td>
          <td>{student.major ?? "—"}</td>
          <td>{student.specialization ?? "—"}</td>
          <td>{student.minor ?? "—"}</td>
        </tr>
      );
    }

    if (studentType === "graduate") {
      return (
        <tr key={student.student_id}>
          {baseCols}
          <td>{student.research_area ?? "—"}</td>
          <td>{student.thesis_title ?? "—"}</td>
        </tr>
      );
    }

    // "all" view
    return (
      <tr key={student.student_id}>
        {baseCols}
        <td>{student.type || "—"}</td>
      </tr>
    );
  };

  const getColumnCount = () => {
    if (studentType === "undergraduate") return 7;
    if (studentType === "graduate") return 6;
    return 4; // "all"
  };

  return (
    <div className="student-page">
      <h2 className="student-title">Student Directory</h2>

      <div className="controls-container">
        <div className="filter-container">
          <label className="filter-label">Filter by type:</label>
          <select
            value={studentType}
            onChange={(e) => setStudentType(e.target.value)}
            className="student-filter"
          >
            <option value="all">All Students</option>
            <option value="undergraduate">Undergraduates</option>
            <option value="graduate">Graduates</option>
          </select>
        </div>
      </div>

      <input
        type="text"
        className="student-search"
        placeholder="Search by name or ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <div className="loading">Loading students...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <table className="student-table">
          <thead>{renderTableHeader()}</thead>
          <tbody>
            {students.length > 0 ? (
              students.map(renderTableRow)
            ) : (
              <tr>
                <td colSpan={getColumnCount()}>
                  No students match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

    </div>
  );
}

export default StudentView;
