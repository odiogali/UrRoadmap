import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isAuthenticated = true; 

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children ? children : <Outlet />;
}
