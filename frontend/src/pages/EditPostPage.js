import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getPostById, updatePost, deletePost, getCategories } from "../utils/api";

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cats, setCats]       = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm]       = useState(null);
  const [slug, setSlug]       = useState("");

  useEffect(() => {
    Promise.all([getPostById(id), getCategories()])
      .then(([pr, cr]) => {
        const p = pr.data.post;
        setSlug(p.slug);
        setForm({
          title:      p.title || "",
          content:    p.content || "",
          excerpt:    p.excerpt || "",
          coverImage: p.coverImage || "",
          category:   p.category?._id || "",
          tags:       (p.tags || []).join(", "),
          status:     p.status || "draft",
          featured:   p.featured || false,
        });
        setCats(cr.data.categories);
      })
      .catch(() => { toast.error("Post not found"); navigate("/my-posts"); })
      .finally(() => setFetching(false));
  }, [id, navigate]);

  const set = k => e => setForm({ ...form, [k]: e.type === "checkbox" ? e.target.checked : e.target.value });

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
        category: form.category || undefined,
      };
      const { data } = await updatePost(id, payload);
      toast.success("Post updated!");
      navigate(`/blog/${data.post.slug}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm("Permanently delete this post and all its comments?")) return;
    try {
      await deletePost(id);
      toast.success("Post deleted");
      navigate("/my-posts");
    } catch { toast.error("Failed to delete"); }
  };

  if (fetching) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (!form) return null;

  return (
    <div style={{ maxWidth: 720 }}>
      <div className="breadcrumb">
        <Link to="/my-posts">My Posts</Link>
        <span className="breadcrumb-sep">›</span>
        {slug && <Link to={`/blog/${slug}`}>View Post</Link>}
        {slug && <span className="breadcrumb-sep">›</span>}
        <span>Edit</span>
      </div>
      <div className="page-header">
        <div>
          <h1 className="page-title">✏️ Edit Post</h1>
        </div>
        <button className="btn btn-danger btn-sm" onClick={handleDelete}>🗑 Delete Post</button>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="form-control" value={form.title} onChange={set("title")} required minLength={5} style={{ fontSize:"1.05rem" }} />
            </div>
            <div className="form-group">
              <label className="form-label">Content *</label>
              <textarea className="form-control" value={form.content} onChange={set("content")} required rows={16} />
            </div>
            <div className="form-group">
              <label className="form-label">Excerpt</label>
              <textarea className="form-control" value={form.excerpt} onChange={set("excerpt")} rows={2} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-control" value={form.category} onChange={set("category")}>
                  <option value="">None</option>
                  {cats.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-control" value={form.status} onChange={set("status")}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Cover Image URL</label>
              <input className="form-control" value={form.coverImage} onChange={set("coverImage")} />
            </div>
            <div className="form-group">
              <label className="form-label">Tags (comma-separated)</label>
              <input className="form-control" value={form.tags} onChange={set("tags")} />
            </div>
            <div className="form-group" style={{ display:"flex", alignItems:"center", gap:10 }}>
              <input type="checkbox" id="featured" checked={form.featured} onChange={set("featured")} style={{ width:16,height:16,cursor:"pointer" }} />
              <label htmlFor="featured" style={{ cursor:"pointer", fontWeight:500, marginBottom:0 }}>Featured post</label>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Saving…" : "Save Changes"}</button>
              <Link to={`/blog/${slug}`} className="btn btn-outline">View Post</Link>
              <button type="button" className="btn btn-ghost" onClick={() => navigate("/my-posts")}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
