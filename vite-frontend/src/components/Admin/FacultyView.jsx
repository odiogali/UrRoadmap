import { useEffect, useState } from "react";
import "./FacultyView.css";

function FacultyView() {
  const [faculty, setFaculty] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetch("http://localhost:8000/api/employees/")
      .then((res) => res.json())
      .then((data) => {
        const parsed = data.map((emp) => {
          let role = "Employee";
          if (emp.is_professor) role = "Professor";
          else if (emp.is_admin) role = "Admin Staff";
          else if (emp.is_teaching) role = "Teaching Staff";

          return {
            ...emp,
            type: role,
          };
        });

        setFaculty(parsed);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching employees:", err);
        setError("Failed to load faculty information.");
        setLoading(false);
      });
  }, []);

  // Filter faculty based on search and active tab
  const filtered = faculty.filter((f) => {
    // First filter by name or ID
    const matchesSearch =
      `${f.fname} ${f.lname}`.toLowerCase().includes(search.toLowerCase()) ||
      f.eid.toString().includes(search);

    // Then filter by type if not "all"
    if (activeTab === "all") {
      return matchesSearch;
    } else {
      return matchesSearch && f.type.toLowerCase() === activeTab.toLowerCase();
    }
  });

  if (loading) return <p>Loading faculty data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="faculty-page">
      <h2 className="faculty-title">Faculty Directory</h2>

      <div className="faculty-controls">
        <input
          type="text"
          className="faculty-search"
          placeholder="Search by name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="faculty-tabs">
          <button
            className={activeTab === "all" ? "active" : ""}
            onClick={() => setActiveTab("all")}
          >
            All Faculty
          </button>
          <button
            className={activeTab === "Professor" ? "active" : ""}
            onClick={() => setActiveTab("Professor")}
          >
            Professors
          </button>
          <button
            className={activeTab === "Admin Staff" ? "active" : ""}
            onClick={() => setActiveTab("Admin Staff")}
          >
            Admin Staff
          </button>
          <button
            className={activeTab === "Teaching Staff" ? "active" : ""}
            onClick={() => setActiveTab("Teaching Staff")}
          >
            Teaching Staff
          </button>
        </div>
      </div>

      <table className="faculty-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Department</th>
            <th>Role</th>
            {(activeTab === "Professor" || activeTab === "Teaching Staff" || activeTab === "all") && (
              <th>Research Area</th>
            )}
            <th>Salary</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map((f) => (
              <tr key={f.eid}>
                <td>{f.eid}</td>
                <td>{f.fname || "—"}</td>
                <td>{f.lname || "—"}</td>
                <td>{f.dno || "—"}</td>
                <td>{f.type}</td>
                {(activeTab === "Professor" || activeTab === "Teaching Staff" || activeTab === "all") && (
                  <td>
                    {(f.type === "Professor" || f.type === "Teaching Staff") ? f.research_area || "—" : "—"}
                  </td>
                )}
                <td>${f.salary?.toLocaleString() || "—"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={
                  (activeTab === "Professor" || activeTab === "Teaching Staff" || activeTab === "all") ? 7 : 6
                }
              >
                No faculty members match your search.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default FacultyView;
