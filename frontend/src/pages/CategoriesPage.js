import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../utils/api";

export default function CategoriesPage() {
  const [cats, setCats]     = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  getCategories()
    .then(r => {
      console.log("Category Data:", r.data); // Look at this in F12 Console!
      
      // Safety check: handle both r.data and r.data.categories
      const data = r.data.categories || r.data;
      setCats(data || []); 
    })
    .catch(err => {
      console.error("Fetch error:", err);
    })
    .finally(() => setLoading(false));
}, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">🏷️ Categories</h1>
          <p className="page-subtitle">Browse posts by topic</p>
        </div>
      </div>

      {cats.length === 0
        ? <div className="empty-state"><div className="empty-icon">🏷️</div><h3>No categories yet</h3></div>
        : (
          <div className="grid-3">
            {cats.map(c => (
              <div key={c._id} className="card card-hover" style={{ cursor:"pointer" }} onClick={() => navigate(`/blog?category=${c._id}`)}>
                <div className="card-body">
                  <div style={{ width:44, height:44, borderRadius:10, background: c.color + "20", border:`2px solid ${c.color}40`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:12, fontSize:"1.4rem" }}>
                    🏷️
                  </div>
                  <div style={{ fontWeight:700, fontSize:"1.05rem", marginBottom:4 }}>{c.name}</div>
                  {c.description && <p style={{ color:"var(--text-secondary)", fontSize:"0.85rem", marginBottom:10 }}>{c.description}</p>}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:"0.82rem", color:"var(--text-muted)" }}>{c.postCount} post{c.postCount !== 1 ? "s" : ""}</span>
                    <span style={{ fontSize:"0.82rem", color: c.color, fontWeight:600 }}>Browse →</span>
                  </div>
                </div>
                <div style={{ height:4, background: c.color }} />
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}
