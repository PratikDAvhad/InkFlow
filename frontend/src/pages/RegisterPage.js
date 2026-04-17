import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { register } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]     = useState({ username:"", email:"", password:"", bio:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const set = k => e => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const { data } = await register(form);
      loginUser(data.token, data.user);
      toast.success(`Welcome to InkFlow, ${data.user.username}!`);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-shell">
      <div className="auth-side" style={{ order:-1 }}>
        <div style={{ fontSize:"3rem", marginBottom:16 }}>📖</div>
        <div style={{ fontSize:"1.5rem", fontWeight:900, marginBottom:12 }}>Start your journey</div>
        <p style={{ opacity:.85, textAlign:"center", lineHeight:1.7, maxWidth:320 }}>
          Create an account to read, save, and engage with posts. Authors can publish their own stories.
        </p>
      </div>
      <div className="auth-panel">
        <div className="auth-card">
          <div className="auth-logo-wrap">
            <div className="auth-logo">IF</div>
            <span className="auth-logo-name">InkFlow</span>
          </div>
          <h1 className="auth-title">Create account</h1>
          <p className="auth-sub">Join InkFlow for free</p>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input className="form-control" value={form.username} onChange={set("username")} required minLength={3} placeholder="yourname" />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={form.email} onChange={set("email")} required placeholder="you@example.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" value={form.password} onChange={set("password")} required minLength={6} placeholder="Min. 6 characters" />
            </div>
            <div className="form-group">
              <label className="form-label">Bio <span style={{ color:"var(--text-muted)", fontWeight:400 }}>(optional)</span></label>
              <textarea className="form-control" value={form.bio} onChange={set("bio")} rows={2} placeholder="Tell us about yourself…" />
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop:4 }}>
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>
          <p style={{ textAlign:"center", marginTop:20, color:"var(--text-secondary)", fontSize:"0.875rem" }}>
            Already have an account? <Link to="/login" style={{ color:"var(--primary)", fontWeight:600 }}>Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
