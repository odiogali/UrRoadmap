import { useEffect, useState } from "react";
import "./FacultyView.css";

function FacultyView() {
  const [faculty, setFaculty] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8000/api/professors/").then((res) => res.json()),
      fetch("http://localhost:8000/api/admin-staff/").then((res) => res.json()),
    ])
      .then(([professors, adminStaff]) => {
        const professorData = professors.map((p) => ({
          ...p,
          type: "professor",
        }));
        const adminData = adminStaff.map((a) => ({ ...a, type: "admin" }));

        // Combine all faculty data
        const allFaculty = [...professorData, ...adminData];
        setFaculty(allFaculty);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching faculty data:", err);
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
      return matchesSearch && f.type === activeTab;
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
            className={activeTab === "professor" ? "active" : ""}
            onClick={() => setActiveTab("professor")}
          >
            Professors
          </button>
          <button
            className={activeTab === "admin" ? "active" : ""}
            onClick={() => setActiveTab("admin")}
          >
            Admin Staff
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
            {activeTab === "professor" || activeTab === "all" ? (
              <th>Research Area</th>
            ) : null}
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
                <td>{f.type.charAt(0).toUpperCase() + f.type.slice(1)}</td>
                {activeTab === "professor" || activeTab === "all" ? (
                  <td>
                    {f.type === "professor" ? f.research_area || "—" : "—"}
                  </td>
                ) : null}
                <td>${f.salary?.toLocaleString() || "—"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={
                  activeTab === "professor" || activeTab === "all" ? 7 : 6
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
