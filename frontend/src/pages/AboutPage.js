import React from "react";
import { Link } from "react-router-dom";

const features = [
  { icon:"🔐", title:"Secure Auth", desc:"JWT-based authentication with bcrypt password hashing and role-based access control." },
  { icon:"📝", title:"Full CRUD", desc:"Create, read, update and delete posts, comments, and categories with proper authorization." },
  { icon:"💬", title:"Comments", desc:"Nested comment threads with likes, letting readers engage with authors directly." },
  { icon:"🔍", title:"Search & Filter", desc:"Full-text search, category filters, tag browsing, and multiple sort options." },
  { icon:"📊", title:"Analytics", desc:"Admin dashboard with post views, top content stats, and user management." },
  { icon:"📱", title:"Responsive", desc:"Clean light theme with sidebar navigation that collapses gracefully on mobile." },
];

const stack = [
  { layer:"Frontend", tech:"React 18, React Router v6, Axios", color:"#61dafb" },
  { layer:"Backend",  tech:"Node.js, Express.js (MVC pattern)", color:"#68a063" },
  { layer:"Database", tech:"MongoDB with Mongoose ODM",         color:"#4db33d" },
  { layer:"Auth",     tech:"JWT + bcryptjs",                    color:"#f59e0b" },
  { layer:"Security", tech:"Helmet, CORS, Rate Limiting",       color:"#ef4444" },
];

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 780 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">ℹ️ About InkFlow</h1>
          <p className="page-subtitle">A full-stack Web Engineering demonstration project</p>
        </div>
      </div>

      {/* Hero card */}
      <div className="card" style={{ marginBottom:28, background:"linear-gradient(135deg,#eef2ff,#f0f9ff)", border:"1px solid #c7d2fe" }}>
        <div className="card-body">
          <h2 style={{ fontSize:"1.3rem", fontWeight:800, marginBottom:8 }}>What is InkFlow?</h2>
          <p style={{ color:"var(--text-secondary)", lineHeight:1.8 }}>
            InkFlow is a full-featured blog platform built to demonstrate core Web Engineering principles:
            the HTTP protocol, RESTful API design, client–server architecture, the MVC design pattern,
            and asynchronous programming with Node.js and React.
          </p>
        </div>
      </div>

      {/* Tech stack */}
      <div className="section-title">🛠 Tech Stack</div>
      <div className="card" style={{ marginBottom:28 }}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Layer</th><th>Technology</th></tr></thead>
            <tbody>
              {stack.map(s => (
                <tr key={s.layer}>
                  <td><span style={{ fontWeight:700, color: s.color }}>{s.layer}</span></td>
                  <td style={{ color:"var(--text-secondary)" }}>{s.tech}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Features */}
      <div className="section-title">✨ Features</div>
      <div className="grid-2" style={{ marginBottom:28 }}>
        {features.map(f => (
          <div key={f.title} className="card">
            <div className="card-body">
              <div style={{ fontSize:"1.6rem", marginBottom:8 }}>{f.icon}</div>
              <div style={{ fontWeight:700, marginBottom:4 }}>{f.title}</div>
              <p style={{ color:"var(--text-secondary)", fontSize:"0.875rem" }}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* API endpoints summary */}
      <div className="section-title">🔌 API Overview</div>
      <div className="card" style={{ marginBottom:28 }}>
        <div className="card-body">
          <p style={{ color:"var(--text-secondary)", marginBottom:16, fontSize:"0.875rem" }}>
            The REST API runs on <code style={{ background:"var(--bg-gray)", padding:"2px 6px", borderRadius:4 }}>http://localhost:5000/api</code> and exposes 20+ endpoints across 5 resource groups:
          </p>
          {[
            ["/api/auth",       "Register, login, profile, password"],
            ["/api/posts",      "CRUD, like, save, search, stats"],
            ["/api/comments",   "CRUD, like, nested replies"],
            ["/api/categories", "CRUD (admin only for write)"],
            ["/api/users",      "Profiles, role management (admin)"],
          ].map(([route, desc]) => (
            <div key={route} style={{ display:"flex", gap:16, padding:"8px 0", borderBottom:"1px solid var(--border)", fontSize:"0.875rem" }}>
              <code style={{ background:"var(--primary-light)", color:"var(--primary)", padding:"2px 8px", borderRadius:4, minWidth:180 }}>{route}</code>
              <span style={{ color:"var(--text-secondary)" }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:"flex", gap:10 }}>
        <Link to="/blog" className="btn btn-primary">Explore Posts</Link>
        <Link to="/register" className="btn btn-outline">Create Account</Link>
      </div>
    </div>
  );
}
