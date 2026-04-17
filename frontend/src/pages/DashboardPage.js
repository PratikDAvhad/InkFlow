import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getPostStats, getAllUsers, getCategories, createCategory, deleteCategory, updateUserRole } from "../utils/api";

export default function DashboardPage() {
  const [stats, setStats]   = useState(null);
  const [topPosts, setTopPosts] = useState([]);
  const [users, setUsers]   = useState([]);
  const [cats, setCats]     = useState([]);
  const [tab, setTab]       = useState("overview");
  const [loading, setLoading] = useState(true);
  const [newCat, setNewCat] = useState({ name:"", description:"", color:"#4f46e5" });

  useEffect(() => {
    Promise.all([getPostStats(), getAllUsers(), getCategories()])
      .then(([s, u, c]) => {
        setStats(s.data.stats);
        setTopPosts(s.data.topPosts);
        setUsers(u.data.users);
        setCats(c.data.categories);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCreateCat = async e => {
    e.preventDefault();
    try {
      const { data } = await createCategory(newCat);
      setCats(prev => [...prev, { ...data.category, postCount: 0 }]);
      setNewCat({ name:"", description:"", color:"#4f46e5" });
      toast.success("Category created!");
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const handleDeleteCat = async id => {
    if (!window.confirm("Delete this category? Posts will be uncategorised.")) return;
    try {
      await deleteCategory(id);
      setCats(prev => prev.filter(c => c._id !== id));
      toast.success("Category deleted");
    } catch { toast.error("Failed"); }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await updateUserRole(id, role);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, role } : u));
      toast.success("Role updated");
    } catch { toast.error("Failed"); }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  const statCards = [
    { label:"Total Posts",  value: stats.total,      icon:"📝" },
    { label:"Published",    value: stats.published,  icon:"✅" },
    { label:"Drafts",       value: stats.drafts,     icon:"📄" },
    { label:"Total Views",  value: stats.totalViews, icon:"👁" },
    { label:"Users",        value: users.length,     icon:"👥" },
    { label:"Categories",   value: cats.length,      icon:"🏷️" },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">⚡ Admin Dashboard</h1>
          <p className="page-subtitle">Manage your blog platform</p>
        </div>
      </div>

      <div className="tab-bar">
        {[["overview","📊 Overview"], ["users","👥 Users"], ["categories","🏷️ Categories"]].map(([k, label]) => (
          <button key={k} className={`tab-btn${tab === k ? " active" : ""}`} onClick={() => setTab(k)}>{label}</button>
        ))}
      </div>

      {/* ── Overview ── */}
      {tab === "overview" && (
        <>
          <div className="stats-row">
            {statCards.map(s => (
              <div key={s.label} className="card stat-card">
                <div style={{ fontSize:"1.5rem", marginBottom:8 }}>{s.icon}</div>
                <div className="stat-num">{s.value.toLocaleString()}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="section-title">🔥 Top Posts by Views</div>
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>#</th><th>Title</th><th>Views</th><th>Likes</th></tr>
                </thead>
                <tbody>
                  {topPosts.map((p, i) => (
                    <tr key={p._id}>
                      <td style={{ fontWeight:700, color:"var(--primary)", width:40 }}>#{i+1}</td>
                      <td><Link to={`/blog/${p.slug}`} style={{ fontWeight:600, color:"var(--text)" }}>{p.title}</Link></td>
                      <td>👁 {p.views}</td>
                      <td>❤️ {p.likeCount || 0}</td>
                    </tr>
                  ))}
                  {topPosts.length === 0 && (
                    <tr><td colSpan={4} style={{ textAlign:"center", color:"var(--text-muted)", padding:"24px" }}>No published posts yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── Users ── */}
      {tab === "users" && (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>User</th><th>Email</th><th>Role</th><th>Joined</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td>
                      <Link to={`/profile/${u.username}`} style={{ fontWeight:600, color:"var(--text)", display:"flex", alignItems:"center", gap:8 }}>
                        <div className="avatar avatar-sm">{u.username[0].toUpperCase()}</div>
                        {u.username}
                      </Link>
                    </td>
                    <td style={{ fontSize:"0.85rem" }}>{u.email}</td>
                    <td>
                      <select value={u.role} onChange={e => handleRoleChange(u._id, e.target.value)} className="form-control" style={{ width:"auto", padding:"4px 8px", fontSize:"0.82rem" }}>
                        <option value="user">user</option>
                        <option value="author">author</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td style={{ fontSize:"0.82rem", color:"var(--text-muted)" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Categories ── */}
      {tab === "categories" && (
        <>
          <div className="card" style={{ marginBottom:20 }}>
            <div className="card-body">
              <div className="section-title">➕ Add Category</div>
              <form onSubmit={handleCreateCat}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr auto auto", gap:12, alignItems:"flex-end" }}>
                  <div className="form-group" style={{ marginBottom:0 }}>
                    <label className="form-label">Name *</label>
                    <input className="form-control" value={newCat.name} onChange={e => setNewCat({ ...newCat, name: e.target.value })} required placeholder="Technology" />
                  </div>
                  <div className="form-group" style={{ marginBottom:0 }}>
                    <label className="form-label">Description</label>
                    <input className="form-control" value={newCat.description} onChange={e => setNewCat({ ...newCat, description: e.target.value })} placeholder="Optional description" />
                  </div>
                  <div className="form-group" style={{ marginBottom:0 }}>
                    <label className="form-label">Colour</label>
                    <input type="color" value={newCat.color} onChange={e => setNewCat({ ...newCat, color: e.target.value })}
                      style={{ height:40, width:56, padding:4, border:"1.5px solid var(--border)", borderRadius:"var(--radius-sm)", cursor:"pointer" }} />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ height:40 }}>Add</button>
                </div>
              </form>
            </div>
          </div>

          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Colour</th><th>Name</th><th>Description</th><th>Posts</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {cats.map(c => (
                    <tr key={c._id}>
                      <td><div style={{ width:24, height:24, borderRadius:6, background: c.color }} /></td>
                      <td style={{ fontWeight:600 }}>{c.name}</td>
                      <td style={{ color:"var(--text-muted)", fontSize:"0.85rem" }}>{c.description || "—"}</td>
                      <td>{c.postCount}</td>
                      <td>
                        <button className="btn btn-ghost btn-sm" style={{ color:"var(--danger)" }} onClick={() => handleDeleteCat(c._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {cats.length === 0 && (
                    <tr><td colSpan={5} style={{ textAlign:"center", color:"var(--text-muted)", padding:"24px" }}>No categories yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
