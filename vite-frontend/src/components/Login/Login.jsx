import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
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

      
      if (username === "admin") {
        setError("Use the Admin Login");
      } else {
        navigate("/student");
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
          <span className="logo-black">Your</span>
          <span className="logo-red">Roadmap</span>
        </h1>

        <form className="login-form" onSubmit={handleLogin}>
          <h2 style={{ color: "black" }}>Log In</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <input
            type="text"
            placeholder="Username"
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

          <div>
            <p style={{ fontSize: "0.9rem", color: "black"}}>
              Are you Admin?{" "}
              <span
                onClick={() => navigate("/admin-login")}
                style={{ color: "#d6001c", cursor: "pointer", textDecoration: "underline" }}
              >
                Go to Admin Login
              </span>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Login;
