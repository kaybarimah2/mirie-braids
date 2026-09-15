import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import "./admin.css";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, username: uname } = await api.login(username, password);
      localStorage.setItem("mirie_admin_token", token);
      localStorage.setItem("mirie_admin_username", uname);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login">
      <form className="admin-login__card" onSubmit={handleSubmit}>
        <h1>Mirie Braids Admin</h1>
        <p>Log in to manage services and testimonials.</p>

        {error && <p className="admin-error">{error}</p>}

        <div className="admin-field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>

        <div className="admin-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <button className="admin-btn" type="submit" disabled={loading}>
          {loading ? "Logging in…" : "Log In"}
        </button>
      </form>
    </div>
  );
}
