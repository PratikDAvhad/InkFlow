import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight:"60vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", gap:12 }}>
      <div style={{ fontSize:"5rem" }}>🌊</div>
      <h1 style={{ fontSize:"4rem", fontWeight:900, color:"var(--primary)", lineHeight:1 }}>404</h1>
      <h2 style={{ fontSize:"1.3rem", fontWeight:700 }}>Page not found</h2>
      <p style={{ color:"var(--text-secondary)", maxWidth:360 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div style={{ display:"flex", gap:10, marginTop:8 }}>
        <button className="btn btn-outline" onClick={() => navigate(-1)}>← Go Back</button>
        <Link to="/" className="btn btn-primary">Home</Link>
      </div>
    </div>
  );
}
