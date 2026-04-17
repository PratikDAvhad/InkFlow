import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getPosts, getCategories } from "../utils/api";
import PostCard from "../components/PostCard";

export default function BlogListPage() {
  const [posts, setPosts]       = useState([]);
  const [cats, setCats]         = useState([]);
  const [meta, setMeta]         = useState({ total:0, pages:1, currentPage:1 });
  const [loading, setLoading]   = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const page     = Number(searchParams.get("page"))     || 1;
  const category = searchParams.get("category")         || "";
  const search   = searchParams.get("search")           || "";
  const sort     = searchParams.get("sort")             || "-createdAt";
  const featured = searchParams.get("featured")         || "";
  const tag      = searchParams.get("tag")              || "";

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9, sort };
      if (category) params.category = category;
      if (search)   params.search   = search;
      if (featured) params.featured = featured;
      if (tag)      params.tag      = tag;
      const { data } = await getPosts(params);
      setPosts(data.posts);
      setMeta({ total: data.total, pages: data.pages, currentPage: data.currentPage });
    } finally { setLoading(false); }
  }, [page, category, search, sort, featured, tag]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);
  useEffect(() => { getCategories().then(r => setCats(r.data.categories)); }, []);

  const setParam = (k, v) => {
    const p = new URLSearchParams(searchParams);
    if (v) p.set(k, v); else p.delete(k);
    p.delete("page");
    setSearchParams(p);
  };
  const setPage = n => {
    const p = new URLSearchParams(searchParams);
    p.set("page", n);
    setSearchParams(p);
  };

  const activeFilters = [
    category && cats.find(c => c._id === category)?.name,
    search && `"${search}"`,
    tag && `#${tag}`,
    featured && "Featured",
  ].filter(Boolean);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">📰 All Posts</h1>
          <p className="page-subtitle">{meta.total} post{meta.total !== 1 ? "s" : ""} found</p>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:20, alignItems:"center" }}>
        <select className="form-control" style={{ width:"auto" }} value={category} onChange={e => setParam("category", e.target.value)}>
          <option value="">All Categories</option>
          {cats.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <select className="form-control" style={{ width:"auto" }} value={sort} onChange={e => setParam("sort", e.target.value)}>
          <option value="-createdAt">Newest</option>
          <option value="createdAt">Oldest</option>
          <option value="-views">Most Viewed</option>
        </select>
        {activeFilters.length > 0 && (
          <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
            {activeFilters.map(f => (
              <span key={f} className="badge badge-gray">{f}</span>
            ))}
            <button className="btn btn-ghost btn-sm" onClick={() => setSearchParams({})}>Clear all</button>
          </div>
        )}
      </div>

      {loading
        ? <div className="spinner-wrap"><div className="spinner" /></div>
        : posts.length === 0
          ? <div className="empty-state"><div className="empty-icon">🔍</div><h3>No posts found</h3><p>Try different filters.</p><button className="btn btn-outline" style={{ marginTop:12 }} onClick={() => setSearchParams({})}>Clear filters</button></div>
          : <div className="grid-auto">{posts.map(p => <PostCard key={p._id} post={p} />)}</div>
      }

      {meta.pages > 1 && (
        <div className="pagination">
          <button className="page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>← Prev</button>
          {Array.from({ length: meta.pages }, (_, i) => i + 1).map(n => (
            <button key={n} className={`page-btn${n === meta.currentPage ? " active" : ""}`} onClick={() => setPage(n)}>{n}</button>
          ))}
          <button className="page-btn" disabled={page === meta.pages} onClick={() => setPage(page + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
}
