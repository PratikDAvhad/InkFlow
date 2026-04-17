import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { createPost, getCategories } from "../utils/api";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [cats, setCats]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm]     = useState({ title:"", content:"", excerpt:"", coverImage:"", category:"", tags:"", status:"draft", featured:false });

  useEffect(() => {
  getCategories()
    .then(r => {
      const fetched = r.data.categories || r.data
      if (Array.isArray(fetched) && fetched.length > 0) {
        setCats(fetched);
      } else {
        // FALLBACK: These will show up if your database is empty
        setCats([
          { _id: "650000000000000000000001", name: "Technology" },
          { _id: "650000000000000000000002", name: "Programming" },
          { _id: "650000000000000000000003", name: "Lifestyle" }
        ]);
      }
    })
    .catch(err => {
      console.error("Failed to load categories:", err);
      toast.error("Could not load categories");
      setCats([
        { _id: "1", name: "Technology" },
        { _id: "2", name: "Lifestyle" }
      ]);
    });
}, []);

  const set = k => e => {
  const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
  setForm({ ...form, [k]: value });
};

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
        category: form.category || undefined,
      };
      const { data } = await createPost(payload);
      toast.success("Post created!");
      navigate(`/blog/${data.post.slug}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create post");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 720 }}>
      <div className="breadcrumb">
        <Link to="/my-posts">My Posts</Link>
        <span className="breadcrumb-sep">›</span>
        <span>New Post</span>
      </div>
      <div className="page-header">
        <div>
          <h1 className="page-title">✍️ New Post</h1>
          <p className="page-subtitle">Write and publish your story</p>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="form-control" value={form.title} onChange={set("title")} required minLength={5} placeholder="Give your post a great title…" style={{ fontSize:"1.1rem" }} />
            </div>
            <div className="form-group">
              <label className="form-label">Content * <span style={{ color:"var(--text-muted)", fontWeight:400 }}>(HTML supported)</span></label>
              <textarea className="form-control" value={form.content} onChange={set("content")} required rows={16} placeholder="Write your post here… HTML tags like <h2>, <p>, <strong>, <code> are supported." />
            </div>
            <div className="form-group">
              <label className="form-label">Excerpt <span style={{ color:"var(--text-muted)", fontWeight:400 }}>(auto-generated if empty)</span></label>
              <textarea className="form-control" value={form.excerpt} onChange={set("excerpt")} rows={2} placeholder="Short summary shown in post listings…" />
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
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Cover Image URL</label>
              <input className="form-control" value={form.coverImage} onChange={set("coverImage")} placeholder="https://example.com/image.jpg" />
            </div>
            <div className="form-group">
              <label className="form-label">Tags <span style={{ color:"var(--text-muted)", fontWeight:400 }}>(comma-separated)</span></label>
              <input className="form-control" value={form.tags} onChange={set("tags")} placeholder="react, tutorial, javascript" />
            </div>
            <div className="form-group" style={{ display:"flex", alignItems:"center", gap:10 }}>
              <input type="checkbox" id="featured" checked={form.featured} onChange={set("featured")} style={{ width:16,height:16,cursor:"pointer" }} />
              <label htmlFor="featured" style={{ cursor:"pointer", fontWeight:500, marginBottom:0 }}>Mark as Featured post</label>
            </div>
            <div style={{ display:"flex", gap:10, marginTop:8 }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Publishing…" : form.status === "published" ? "Publish Post" : "Save Draft"}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => navigate("/my-posts")}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
