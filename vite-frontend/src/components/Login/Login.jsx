import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin") {
      navigate("/admin");
    } else {
      navigate("/student");
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <h1 className="login-title">Your Roadmap</h1>

        <form className="login-form" onSubmit={handleLogin}>
          <h2>Log In</h2>
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
        </form>
      </div>
    </div>
  );
}

export default Login;
