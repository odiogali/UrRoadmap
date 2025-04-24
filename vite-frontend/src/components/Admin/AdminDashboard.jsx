import { Outlet } from "react-router-dom";
import AdminNav from "./AdminNav";

function AdminDashboard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AdminNav />
      <div style={{ flex: 1, padding: "1rem" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default AdminDashboard;
