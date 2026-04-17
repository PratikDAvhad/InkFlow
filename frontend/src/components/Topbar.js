import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Topbar({ onHamburger }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const handleSearch = e => {
    e.preventDefault();
    if (q.trim()) { navigate(`/blog?search=${encodeURIComponent(q.trim())}`); setQ(""); }
  };

  return (
    <header className="topbar">
      <button className="hamburger" onClick={onHamburger} aria-label="Menu">
        ☰
      </button>

      <form className="topbar-search" onSubmit={handleSearch}>
        <span className="topbar-search-icon">🔍</span>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search posts, topics…"
        />
      </form>

      <div className="topbar-actions">
        {user && (user.role === "author" || user.role === "admin") && (
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/create")}>
            + Write
          </button>
        )}
        {!user && (
          <>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("/login")}>Sign In</button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate("/register")}>Join</button>
          </>
        )}
      </div>
    </header>
  );
}
