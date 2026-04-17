import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import { getMyPosts, deletePost } from "../utils/api";

export default function MyPostsPage() {
  const [posts, setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getMyPosts({ status: filter });
      setPosts(data.posts);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filter]);

  const handleDelete = async id => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await deletePost(id);
      setPosts(prev => prev.filter(p => p._id !== id));
      toast.success("Deleted");
    } catch { toast.error("Failed"); }
  };

  const statusBadge = s => {
    if (s === "published") return <span className="badge badge-success">Published</span>;
    if (s === "draft")     return <span className="badge badge-warning">Draft</span>;
    return <span className="badge badge-gray">{s}</span>;
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">✍️ My Posts</h1>
          <p className="page-subtitle">{posts.length} post{posts.length !== 1 ? "s" : ""}</p>
        </div>
        <Link to="/create" className="btn btn-primary">+ New Post</Link>
      </div>

      <div className="tab-bar" style={{ maxWidth:360 }}>
        {["all","published","draft","archived"].map(s => (
          <button key={s} className={`tab-btn${filter === s ? " active" : ""}`} onClick={() => setFilter(s)}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading
        ? <div className="spinner-wrap"><div className="spinner" /></div>
        : posts.length === 0
          ? <div className="empty-state"><div className="empty-icon">📝</div><h3>No posts yet</h3><p>Start writing your first post!</p>
              <Link to="/create" className="btn btn-primary" style={{ marginTop:12 }}>Write Now</Link>
            </div>
          : (
            <div className="card">
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Views</th>
                      <th>Likes</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map(p => (
                      <tr key={p._id}>
                        <td style={{ maxWidth:280 }}>
                          <Link to={`/blog/${p.slug}`} style={{ fontWeight:600, color:"var(--text)" }}>{p.title}</Link>
                          {p.category && <div style={{ marginTop:2 }}><span className="badge" style={{ fontSize:"0.7rem" }}>{p.category.name}</span></div>}
                        </td>
                        <td>{statusBadge(p.status)}</td>
                        <td>{p.views || 0}</td>
                        <td>{p.likeCount || 0}</td>
                        <td style={{ whiteSpace:"nowrap" }}>{formatDistanceToNow(new Date(p.createdAt), { addSuffix:true })}</td>
                        <td>
                          <div style={{ display:"flex", gap:6 }}>
                            <button className="btn btn-outline btn-sm" onClick={() => navigate(`/edit/${p._id}`)}>Edit</button>
                            <button className="btn btn-ghost btn-sm" style={{ color:"var(--danger)" }} onClick={() => handleDelete(p._id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
      }
    </div>
  );
}
