import { useEffect, useState } from "react";
import "./StudentView.css";

function StudentView() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentType, setStudentType] = useState("all");
  const [currentStudent, setCurrentStudent] = useState(null);

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

  const handleEdit = (student) => {
    setCurrentStudent(student);
    setIsModalOpen(true);
    // You would implement an edit modal/form here
    console.log("Editing student:", student);
  };

  const handleDelete = (student) => {
    // We need the full student object, not just the ID
    if (window.confirm("Are you sure you want to delete this student?")) {
      console.log("Deleting student:", student);

      // Step 1: Determine student type and delete the specific record first
      const studentType = student.type?.toLowerCase();

      // Function to delete the main student record after the specific record is deleted
      const deleteMainStudent = () => {
        fetch(`http://localhost:8000/api/student/${student}/`, {
          method: 'DELETE'
        })
          .then(() => {
            setStudents(students.filter(s => s.student_id !== student));
            console.log("Student deleted successfully");
          })
          .catch(err => {
            console.error("Error deleting main student record:", err);
            setError("Failed to delete student completely.");
          });
      };

      // If it's an undergraduate or graduate student, delete the specific record first
      if (studentType === "undergraduate") {
        fetch(`http://localhost:8000/api/undergraduate/${student.student_id}/`, {
          method: 'DELETE'
        })
          .then(() => {
            console.log("Undergraduate record deleted successfully");
            // Then delete the main student record
            deleteMainStudent();
          })
          .catch(err => {
            console.error("Error deleting undergraduate record:", err);
            setError("Failed to delete undergraduate record.");
          });
      }
      else if (studentType === "graduate") {
        fetch(`http://localhost:8000/api/graduate/${student}/`, {
          method: 'DELETE'
        })
          .then(() => {
            console.log("Graduate record deleted successfully");
            // Then delete the main student record
            deleteMainStudent();
          })
          .catch(err => {
            console.error("Error deleting graduate record:", err);
            setError("Failed to delete graduate record.");
          });
      }
      // If the type is unspecified or unknown, just delete the main student record
      else {
        deleteMainStudent();
      }
    }
  };

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
          <th>Actions</th>
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
          <th>Actions</th>
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
        <th>Actions</th>
      </tr>
    );
  };

  const renderActionButtons = (student) => {
    return (
      <td className="action-buttons">
        <button
          className="edit-button"
          onClick={() => handleEdit(student)}
        >
          Edit
        </button>
        <button
          className="delete-button"
          onClick={() => handleDelete(student.student_id)}
        >
          Delete
        </button>
      </td>
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
          {renderActionButtons(student)}
        </tr>
      );
    }

    if (studentType === "graduate") {
      return (
        <tr key={student.student_id}>
          {baseCols}
          <td>{student.research_area ?? "—"}</td>
          <td>{student.thesis_title ?? "—"}</td>
          {renderActionButtons(student)}
        </tr>
      );
    }

    // "all" view
    return (
      <tr key={student.student_id}>
        {baseCols}
        <td>{student.type || "—"}</td>
        {renderActionButtons(student)}
      </tr>
    );
  };

  const getColumnCount = () => {
    if (studentType === "undergraduate") return 8; // +1 for Actions column
    if (studentType === "graduate") return 6; // +1 for Actions column
    return 5; // "all" (+1 for Actions column)
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

      {/* Add styling for the action buttons */}
      <style>{`
        .action-buttons {
          display: flex;
          gap: 8px;
        }
        
        .edit-button {
          background-color: #f44336;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .delete-button {
          background-color: #f44336;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .edit-button:hover, .delete-button:hover {
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
}

export default StudentView;
