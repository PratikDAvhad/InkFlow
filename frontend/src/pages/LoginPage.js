import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { login } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]     = useState({ email:"", password:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const set = k => e => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const { data } = await login(form);
    
    // Ensure the user has a role. If not, default to "user"
    const userWithRole = {
      ...data.user,
      role: data.user.role || "user" 
    };

    loginUser(data.token, userWithRole);
    toast.success(`Welcome back, ${userWithRole.username}!`);
    navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-shell">
      <div className="auth-panel">
        <div className="auth-card">
          <div className="auth-logo-wrap">
            <div className="auth-logo">IF</div>
            <span className="auth-logo-name">InkFlow</span>
          </div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-sub">Sign in to continue to InkFlow</p>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={form.email} onChange={set("email")} required placeholder="you@example.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" value={form.password} onChange={set("password")} required placeholder="••••••••" />
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop:4 }}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
          <p style={{ textAlign:"center", marginTop:20, color:"var(--text-secondary)", fontSize:"0.875rem" }}>
            Don't have an account? <Link to="/register" style={{ color:"var(--primary)", fontWeight:600 }}>Create one →</Link>
          </p>
        </div>
      </div>
      <div className="auth-side">
        <div style={{ fontSize:"3rem", marginBottom:16 }}>✍️</div>
        <div style={{ fontSize:"1.5rem", fontWeight:900, marginBottom:12 }}>Join the conversation</div>
        <p style={{ opacity:.85, textAlign:"center", lineHeight:1.7, maxWidth:320 }}>
          Thousands of readers and writers share ideas, tutorials, and stories on InkFlow every day.
        </p>
      </div>
    </div>
  );
}
