import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        setError("Invalid credentials");
        return;
      }

      const data = await response.json();
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      // Force admin redirect
      if (username === "admin") {
        navigate("/admin");
      } else {
        setError("You are not authorized as an admin.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <h1 className="login-title">
          <span className="logo-black">Admin</span>
          <span className="logo-red">Portal</span>
        </h1>

        <form className="login-form" onSubmit={handleLogin}>
          <h2 style={{ color: "black" }}>Admin Login</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <input
            type="text"
            placeholder="Admin Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Log In</button>

          <p style={{ fontSize: "0.9rem", color: "black" }}>
             Are you a Student?{" "}
            <span
                onClick={() => navigate("/")}
                style={{ color: "#d6001c", cursor: "pointer", textDecoration: "underline" }}
             >
                Go to student login
            </span>
        </p>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
