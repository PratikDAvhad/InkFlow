import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ open, onClose }) {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef();

  // Avatar Logic
  const hasAvatar = !!user?.avatar;
  const userAvatar = user?.avatar;
  const initials = user?.username ? user.username[0].toUpperCase() : "?";

  useEffect(() => {
    const h = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target))
        setDropOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const go = (path) => {
    navigate(path);
    onClose();
    setDropOpen(false);
  };
  
  const handleLogout = () => {
    logoutUser();
    go("/");
  };

  const nl = ({ isActive }) => `nav-item${isActive ? " active" : ""}`;

  return (
    <>
      <div className={`sidebar-overlay${open ? " open" : ""}`} onClick={onClose} />
      <aside className={`sidebar${open ? " open" : ""}`}>
        <Link to="/" className="sidebar-brand" onClick={onClose}>
          <div className="sidebar-logo">IF</div>
          <span className="sidebar-brand-name">InkFlow</span>
        </Link>

        <div className="sidebar-section">
          <span className="sidebar-section-label">Discover</span>
          <NavLink to="/" end className={nl} onClick={onClose}>
            <span className="nav-icon">🏠</span> Home
          </NavLink>
          <NavLink to="/blog" className={nl} onClick={onClose}>
            <span className="nav-icon">📰</span> All Posts
          </NavLink>
          <NavLink to="/blog?featured=true" className={nl} onClick={onClose}>
            <span className="nav-icon">⭐</span> Featured
          </NavLink>
          <NavLink to="/categories" className={nl} onClick={onClose}>
            <span className="nav-icon">🏷️</span> Categories
          </NavLink>
        </div>

        {user && (
          <>
            <div className="sidebar-divider" />
            <div className="sidebar-section">
              <span className="sidebar-section-label">My Space</span>
              <NavLink to="/saved" className={nl} onClick={onClose}>
                <span className="nav-icon">🔖</span> Saved Posts
              </NavLink>
              {(user.role === "author" || user.role === "admin") && (
                <>
                  <NavLink to="/my-posts" className={nl} onClick={onClose}>
                    <span className="nav-icon">✍️</span> My Posts
                  </NavLink>
                  <NavLink to="/create" className={nl} onClick={onClose}>
                    <span className="nav-icon">➕</span> New Post
                  </NavLink>
                </>
              )}
              {user.role === "admin" && (
                <NavLink to="/dashboard" className={nl} onClick={onClose}>
                  <span className="nav-icon">⚡</span> Dashboard
                </NavLink>
              )}
            </div>
          </>
        )}

        <div className="sidebar-divider" />
        <div className="sidebar-section">
          <span className="sidebar-section-label">Help</span>
          <NavLink to="/about" className={nl} onClick={onClose}>
            <span className="nav-icon">ℹ️</span> About
          </NavLink>
        </div>

        <div className="sidebar-user">
          {user ? (
            <div className="dropdown" ref={dropRef}>
              <div className="sidebar-user-card" onClick={() => setDropOpen((d) => !d)}>
                {/* PROPER AVATAR FORMAT */}
                <div
                  className="avatar avatar-sm"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    backgroundColor: hasAvatar ? "transparent" : "#4f46e5",
                    color: "white",
                    fontSize: "14px",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    flexShrink: 0,
                  }}
                >
                  {hasAvatar ? (
                    <img
                      src={userAvatar}
                      alt={user.username}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>

                <div className="sidebar-user-info">
                  <div className="sidebar-user-name">{user.username}</div>
                  <div className="sidebar-user-role">{user.role}</div>
                </div>
                <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>▾</span>
              </div>

              {dropOpen && (
                <div className="dropdown-menu" style={{ bottom: "100%", top: "auto", marginBottom: 8 }}>
                  <button className="dropdown-item" onClick={() => go(`/profile/${user.username}`)}>
                    👤 Profile
                  </button>
                  <button className="dropdown-item" onClick={() => go("/settings")}>
                    ⚙️ Settings
                  </button>
                  <div className="dropdown-sep" />
                  <button className="dropdown-item danger" onClick={handleLogout}>
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button className="btn btn-primary btn-full btn-sm" onClick={() => go("/login")}>
                Sign In
              </button>
              <button className="btn btn-outline btn-full btn-sm" onClick={() => go("/register")}>
                Create Account
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}