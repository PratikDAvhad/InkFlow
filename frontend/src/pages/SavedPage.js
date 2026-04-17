import React, { useEffect, useState } from "react";
import { getMe } from "../utils/api";
import PostCard from "../components/PostCard";
import { Link } from "react-router-dom";

export default function SavedPage() {
  const [posts, setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  getMe()
    .then(r => {
      // Use optional chaining to safely access nested data
      console.log(r.data);
      const saved = r.data?.user?.savedPosts || [];
      console.log(saved);
      setPosts(saved);
    })
    .catch(err => {
      console.error("Failed to fetch saved posts", err);
      setPosts([]); // Fallback to empty array on error
    })
    .finally(() => setLoading(false));
}, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">🔖 Saved Posts</h1>
          <p className="page-subtitle">{posts.length} saved post{posts.length !== 1 ? "s" : ""}</p>
        </div>
      </div>
      {posts.length === 0
        ? <div className="empty-state"><div className="empty-icon">🔖</div><h3>Nothing saved yet</h3><p>Tap the bookmark icon on any post to save it here.</p>
            <Link to="/blog" className="btn btn-primary" style={{ marginTop:12 }}>Browse Posts</Link>
          </div>
        : <div className="grid-auto">{posts.map(p => <PostCard key={p._id} post={p} />)}</div>
      }
    </div>
  );
}
