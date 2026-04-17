import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserProfile } from "../utils/api";
import PostCard from "../components/PostCard";

export default function ProfilePage() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getUserProfile(username)
      .then((r) => setData(r.data))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (!data) return <div className="empty-state"><div className="empty-icon">👤</div><h3>User not found</h3></div>;

  const { user, posts } = data;

  // Avatar Logic
  const hasAvatar = !!user?.avatar;
  const userAvatar = user?.avatar;
  const initials = user?.username ? user.username[0].toUpperCase() : "?";

  return (
    <div>
      <div className="card" style={{ marginBottom: 28 }}>
        <div className="card-body">
          <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
            
            {/* --- AVATAR PART START --- */}
            <div
              className="avatar avatar-xl"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                backgroundColor: hasAvatar ? "transparent" : "#4f46e5",
                color: "white",
                fontSize: "2.5rem", // Larger font for XL size
                fontWeight: "bold",
                borderRadius: "50%",
                width: "100px", // Standard XL size
                height: "100px",
                flexShrink: 0,
                border: "4px solid var(--border-color)"
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
            {/* --- AVATAR PART END --- */}

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                <h1 style={{ fontSize: "1.8rem", fontWeight: 900 }}>{user.username}</h1>
                <span className="badge" style={{ textTransform: "capitalize", padding: "4px 12px" }}>
                  {user.role}
                </span>
              </div>
              
              {user.bio && (
                <p style={{ color: "var(--text-secondary)", marginBottom: 8, fontSize: "1.05rem", maxWidth: "600px" }}>
                  {user.bio}
                </p>
              )}

              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                <strong>{posts.length}</strong> published post{posts.length !== 1 ? "s" : ""} · 
                Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="section-title">Posts by {user.username}</div>
      {posts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No posts yet</h3>
        </div>
      ) : (
        <div className="grid-auto">
          {posts.map((p) => (
            <PostCard key={p._id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}