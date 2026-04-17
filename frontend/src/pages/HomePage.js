import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPosts, getCategories } from "../utils/api";
import PostCard from "../components/PostCard";

export default function HomePage() {
  const [featured, setFeatured]   = useState([]);
  const [recent, setRecent]       = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]     = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      getPosts({ featured: true, limit: 3 }),
      getPosts({ limit: 6, sort: "-createdAt" }),
      getCategories(),
    ]).then(([f, r, c]) => {
      setFeatured(f.data.posts);
      setRecent(r.data.posts);
      setCategories(c.data.categories);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div>
      {/* Hero */}
      <div className="hero">
        <div className="hero-title">Ideas that <span>inspire</span>,<br />words that matter</div>
        <p className="hero-sub">Discover thoughtful articles, tutorials, and stories from writers who care about their craft.</p>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <button className="btn btn-primary btn-lg" onClick={() => navigate("/blog")}>Explore Posts</button>
          <button className="btn btn-outline btn-lg" onClick={() => navigate("/create")}>Start Writing</button>
        </div>
      </div>

      {/* Categories pill strip */}
      {categories.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div className="section-title">📂 Browse Topics</div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            <button className="tag" onClick={() => navigate("/blog")}>All Posts</button>
            {categories.map(c => (
              <button key={c._id} className="tag" onClick={() => navigate(`/blog?category=${c._id}`)}
                style={{ borderColor: c.color + "60", color: c.color }}>
                {c.name} <span style={{ opacity:.6, fontSize:"0.75rem" }}>({c.postCount})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div className="section-title">⭐ Featured Posts</div>
            <Link to="/blog?featured=true" className="btn btn-ghost btn-sm">View all →</Link>
          </div>
          <div className="grid-3">
            {featured.map(p => <PostCard key={p._id} post={p} />)}
          </div>
        </div>
      )}

      {/* Recent */}
      <div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div className="section-title">🕐 Latest Posts</div>
          <Link to="/blog" className="btn btn-ghost btn-sm">View all →</Link>
        </div>
        {recent.length === 0
          ? <div className="empty-state"><div className="empty-icon">📝</div><h3>No posts yet</h3><p>Be the first to write something!</p></div>
          : <div className="grid-auto">{recent.map(p => <PostCard key={p._id} post={p} />)}</div>
        }
      </div>
    </div>
  );
}
