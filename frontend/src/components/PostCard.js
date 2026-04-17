import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { getUserById } from "../utils/api";

export default function PostCard({ post }) {
  const [authorData, setAuthorData] = useState(null);
  console.log(post)
  useEffect(() => {
    // If post.author is a string (the ID), fetch the data
    if (typeof post.author === "string") {
      getUserById(post.author)
        .then((res) => {
          // Check your API response structure, likely res.data.user
          console.log(res.data);
          setAuthorData(res.data.user || res.data);
        })
        .catch((err) => console.error("Error fetching author:", err));
    } else {
      // If it's already populated by the backend, just use it
      setAuthorData(post.author);
    }
  }, [post.author]);
  console.log(authorData);

  const authorName = authorData?.username || "user";
  const hasAvatar = !!authorData?.avatar; // Checks if avatar string exists
  const userAvatar = authorData?.avatar; // The URL
  const initials = authorName[0]?.toUpperCase() || "?"; // The Letter

  return (
    <div className="card card-hover post-card">
      <Link to={`/blog/${post.slug}`}>{post.coverImage
        ? <img src={post.coverImage} alt={post.title} className="post-card-img" onError={e => { e.target.style.display="none"; }} />
        : <div className="post-card-img-ph">✍️</div>
      }</Link>
      <div className="post-card-body">
        <div className="post-card-meta">
          {post.category && (
            <span className="badge" style={{ background: post.category.color + "20", color: post.category.color, border: `1px solid ${post.category.color}40` }}>
              {post.category.name}
            </span>
          )}
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{post.readTime || 1} min read</span>
        </div>

        <div className="post-card-title">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </div>

        <p className="post-card-excerpt">{post.excerpt}</p>

        <div className="post-card-footer">
          <Link to={`/profile/${post.author?.username || "user"}`} style={{ display:"flex", alignItems:"center", gap:6, textDecoration:"none", color:"var(--text-secondary)" }}>
            <div 
  className="avatar avatar-sm" 
  style={{ 
    display: "inline-flex", // Flex is better for centering initials
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden", // Ensures the image stays circular
    backgroundColor: hasAvatar ? "transparent" : "#4f46e5", // Background color if no image
    color: "white",
    fontSize: "14px",
    borderRadius: "50%", // Keep it perfectly round
    width: "32px",
    height: "32px",
    flexShrink: 0
  }}
>
  {hasAvatar ? (
    <img 
      src={userAvatar} 
      alt={authorName} 
      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
    />
  ) : (
    <span>{initials}</span>
  )}
</div></Link>
          <div style={{ display:"flex", gap:10 }}>
            <span>👁 {post.views || 0}</span>
            <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
