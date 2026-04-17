import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import { getPost, toggleLikePost, toggleSavePost, addComment, deleteComment } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function BlogPostPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost]       = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting]   = useState(false);
  const [liked, setLiked]   = useState(false);
  const [saved, setSaved]   = useState(false);

  useEffect(() => {
    setLoading(true);
    getPost(slug)
      .then(({ data }) => {
        setPost(data.post);
        setComments(data.comments || []);
        if (user) {
          setLiked(data.post.likes?.some(id => id === user._id || id?._id === user._id));
          setSaved(user.savedPosts?.some(id => id === data.post._id || id?._id === data.post._id));
        }
      })
      .catch(() => navigate("/404"))
      .finally(() => setLoading(false));
  }, [slug, navigate]); // user excluded intentionally to avoid refetch on state change

  const handleLike = async () => {
    if (!user) { toast.error("Sign in to like posts"); return; }
    try {
      const { data } = await toggleLikePost(post._id);
      setLiked(data.liked);
      setPost(p => ({ ...p, likeCount: data.likeCount }));
    } catch { toast.error("Failed"); }
  };

  const handleSave = async () => {
    if (!user) { toast.error("Sign in to save posts"); return; }
    try {
      const { data } = await toggleSavePost(post._id);
      setSaved(data.saved);
      toast.success(data.saved ? "Saved!" : "Removed from saved");
    } catch { toast.error("Failed"); }
  };

  const handleComment = async e => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await addComment({ content: commentText, postId: post._id });
      setComments(prev => [data.comment, ...prev]);
      setCommentText("");
      toast.success("Comment posted!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally { setSubmitting(false); }
  };

  const handleDeleteComment = async id => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await deleteComment(id);
      setComments(prev => prev.filter(c => c._id !== id));
      toast.success("Deleted");
    } catch { toast.error("Failed"); }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (!post)   return null;

  const isOwner = user && (user._id === post.author?._id || user.role === "admin");

  return (
    <div className="post-detail">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb-sep">›</span>
        <Link to="/blog">Posts</Link>
        <span className="breadcrumb-sep">›</span>
        <span style={{ color:"var(--text-secondary)" }}>{post.title}</span>
      </div>

      {/* Meta */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14, alignItems:"center" }}>
        {post.category && (
          <Link to={`/blog?category=${post.category._id}`} className="badge"
            style={{ background: post.category.color + "20", color: post.category.color, border:`1px solid ${post.category.color}40` }}>
            {post.category.name}
          </Link>
        )}
        <span className="badge badge-gray">{post.readTime} min read</span>
        <span className="badge badge-gray">👁 {post.views}</span>
        {post.featured && <span className="badge badge-warning">⭐ Featured</span>}
      </div>

      <h1 className="post-detail-title">{post.title}</h1>

      {/* Author row */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24, flexWrap:"wrap" }}>
        <Link to={`/profile/${post.author?.username}`} style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
          <div className="avatar avatar-md">{post.author?.username?.[0]?.toUpperCase()}</div>
          <div>
            <div style={{ fontWeight:700, fontSize:"0.9rem" }}>{post.author?.username}</div>
            <div style={{ fontSize:"0.78rem", color:"var(--text-muted)" }}>
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </div>
          </div>
        </Link>
        {isOwner && (
          <Link to={`/edit/${post._id}`} className="btn btn-outline btn-sm" style={{ marginLeft:"auto" }}>✏️ Edit</Link>
        )}
      </div>

      {post.coverImage && <img src={post.coverImage} alt={post.title} className="post-cover" onError={e => e.target.style.display="none"} />}

      <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:20 }}>
          {post.tags.map(t => (
            <Link key={t} to={`/blog?tag=${t}`} className="tag">#{t}</Link>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="post-actions-bar">
        <button className={`action-btn${liked ? " active-like" : ""}`} onClick={handleLike}>
          ❤️ {liked ? "Liked" : "Like"} · {post.likeCount || 0}
        </button>
        <button className={`action-btn${saved ? " active-save" : ""}`} onClick={handleSave}>
          🔖 {saved ? "Saved" : "Save"}
        </button>
        <button className="action-btn" onClick={() => navigator.clipboard?.writeText(window.location.href).then(() => toast.success("Link copied!"))}>
          🔗 Share
        </button>
      </div>

      {/* Author bio */}
      {post.author?.bio && (
        <div className="card" style={{ marginBottom:28 }}>
          <div className="card-body" style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
            <div className="avatar avatar-lg">{post.author.username[0].toUpperCase()}</div>
            <div>
              <div style={{ fontWeight:700, marginBottom:4 }}>{post.author.username}</div>
              <div style={{ color:"var(--text-secondary)", fontSize:"0.875rem" }}>{post.author.bio}</div>
              <Link to={`/profile/${post.author.username}`} className="btn btn-outline btn-sm" style={{ marginTop:10 }}>
                View profile →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Comments */}
      <section>
        <h2 style={{ fontSize:"1.2rem", fontWeight:800, marginBottom:20 }}>💬 Comments ({comments.length})</h2>

        {user ? (
          <form onSubmit={handleComment} style={{ marginBottom:28 }}>
            <div style={{ display:"flex", gap:10 }}>
              <div className="avatar avatar-md">{user.username[0].toUpperCase()}</div>
              <div style={{ flex:1 }}>
                <textarea className="form-control" rows={3} value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Share your thoughts…" style={{ marginBottom:8 }} />
                <button type="submit" className="btn btn-primary btn-sm" disabled={submitting || !commentText.trim()}>
                  {submitting ? "Posting…" : "Post Comment"}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="alert alert-info" style={{ marginBottom:24 }}>
            <Link to="/login" style={{ fontWeight:700 }}>Sign in</Link> to leave a comment.
          </div>
        )}

        {comments.length === 0
          ? <div className="empty-state" style={{ padding:"32px 0" }}><div className="empty-icon">💭</div><h3>No comments yet</h3><p>Be the first to share your thoughts!</p></div>
          : comments.map(c => (
            <div key={c._id}>
              <div className="comment-item">
                <div className="avatar avatar-sm">{c.author?.username?.[0]?.toUpperCase()}</div>
                <div className="comment-bubble">
                  <div className="comment-header">
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span className="comment-author">{c.author?.username}</span>
                      <span className="comment-date">{formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}</span>
                    </div>
                    {user && (user._id === c.author?._id || user.role === "admin") && (
                      <button onClick={() => handleDeleteComment(c._id)}
                        style={{ background:"none", border:"none", color:"var(--danger)", cursor:"pointer", fontSize:"0.8rem" }}>
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="comment-text">{c.content}</p>
                </div>
              </div>
              {c.replies?.length > 0 && (
                <div className="replies-wrap">
                  {c.replies.map(r => (
                    <div key={r._id} className="comment-item">
                      <div className="avatar avatar-sm" style={{ width:24,height:24,fontSize:"0.7rem" }}>{r.author?.username?.[0]?.toUpperCase()}</div>
                      <div className="comment-bubble" style={{ background:"#fff", border:"1px solid var(--border)" }}>
                        <div className="comment-header">
                          <span className="comment-author">{r.author?.username}</span>
                          <span className="comment-date">{formatDistanceToNow(new Date(r.createdAt), { addSuffix: true })}</span>
                        </div>
                        <p className="comment-text">{r.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </section>
    </div>
  );
}
