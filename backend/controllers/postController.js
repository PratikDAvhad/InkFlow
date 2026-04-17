const Post = require("../models/Post");
const Comment = require("../models/Comment");

// GET /api/posts
exports.getPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 9, category, tag, search, author, sort = "-createdAt", featured, status } = req.query;
    const query = {};

    // Status filtering
    const isPrivileged = req.user && (req.user.role === "admin" || req.user.role === "author");
    if (status && isPrivileged) {
      if (status !== "all") query.status = status;
    } else {
      query.status = "published";
    }

    if (category) query.category = category;
    if (tag) query.tags = { $in: [tag.toLowerCase()] };
    if (author) query.author = author;
    if (featured === "true") query.featured = true;
    if (search) query.$text = { $search: search };

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate("author", "username avatar")
      .populate("category", "name slug color")
      .select("-content")
      .sort(sort)
      .skip((page - 1) * Number(limit))
      .limit(Number(limit))
      .lean({ virtuals: true });

    res.json({ success: true, posts, total, pages: Math.ceil(total / limit), currentPage: Number(page) });
  } catch (err) { next(err); }
};

// GET /api/posts/mystats  — author's own posts
exports.getMyPosts = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { author: req.user._id };
    if (status && status !== "all") query.status = status;
    const posts = await Post.find(query)
      .populate("category", "name color")
      .select("-content")
      .sort("-createdAt")
      .lean({ virtuals: true });
    res.json({ success: true, posts });
  } catch (err) { next(err); }
};

// GET /api/posts/stats  — admin stats
exports.getStats = async (req, res, next) => {
  try {
    const [total, published, drafts, viewsAgg] = await Promise.all([
      Post.countDocuments(),
      Post.countDocuments({ status: "published" }),
      Post.countDocuments({ status: "draft" }),
      Post.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }])
    ]);
    const topPosts = await Post.find({ status: "published" })
      .sort("-views").limit(5).select("title slug views likes").lean({ virtuals: true });
    res.json({ success: true, stats: { total, published, drafts, totalViews: viewsAgg[0]?.total || 0 }, topPosts });
  } catch (err) { next(err); }
};

// GET /api/posts/id/:id  — fetch by mongo ID (for edit page)
exports.getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username avatar")
      .populate("category", "name slug color");
    if (!post) return res.status(404).json({ success: false, message: "Post not found." });

    // Only author or admin can see draft
    if (post.status !== "published") {
      if (!req.user || (req.user._id.toString() !== post.author._id.toString() && req.user.role !== "admin"))
        return res.status(403).json({ success: false, message: "Access denied." });
    }
    res.json({ success: true, post });
  } catch (err) { next(err); }
};

// GET /api/posts/:slug
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { views: 1 } },
      { new: true }
    ).populate("author", "username avatar bio").populate("category", "name slug color");

    if (!post) return res.status(404).json({ success: false, message: "Post not found." });
    if (post.status !== "published") {
      if (!req.user || (req.user._id.toString() !== post.author._id.toString() && req.user.role !== "admin"))
        return res.status(403).json({ success: false, message: "Access denied." });
    }

    const comments = await Comment.find({ post: post._id, parent: null, isApproved: true })
      .populate("author", "username avatar")
      .populate({ path: "replies", populate: { path: "author", select: "username avatar" } })
      .sort("-createdAt");

    res.json({ success: true, post, comments });
  } catch (err) { next(err); }
};

// POST /api/posts
exports.createPost = async (req, res, next) => {
  try {
    const { title, content, excerpt, coverImage, category, tags, status, featured } = req.body;
    const post = await Post.create({
      title, content, excerpt, coverImage,
      category: category || null,
      tags: Array.isArray(tags) ? tags.map(t => t.toLowerCase()) : [],
      status: status || "draft",
      featured: featured || false,
      author: req.user._id
    });
    await post.populate("author", "username avatar");
    await post.populate("category", "name slug color");
    res.status(201).json({ success: true, message: "Post created.", post });
  } catch (err) { next(err); }
};

// PUT /api/posts/:id
exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found." });
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Not authorized." });

    const { title, content, excerpt, coverImage, category, tags, status, featured } = req.body;
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (coverImage !== undefined) post.coverImage = coverImage;
    if (category !== undefined) post.category = category || null;
    if (tags !== undefined) post.tags = Array.isArray(tags) ? tags.map(t => t.toLowerCase()) : [];
    if (status !== undefined) post.status = status;
    if (featured !== undefined) post.featured = featured;

    await post.save();
    await post.populate("author", "username avatar");
    await post.populate("category", "name slug color");
    res.json({ success: true, message: "Post updated.", post });
  } catch (err) { next(err); }
};

// DELETE /api/posts/:id
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found." });
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Not authorized." });

    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();
    res.json({ success: true, message: "Post deleted." });
  } catch (err) { next(err); }
};

// POST /api/posts/:id/like
exports.toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found." });
    const liked = post.likes.includes(req.user._id);
    if (liked) post.likes.pull(req.user._id);
    else post.likes.push(req.user._id);
    await post.save();
    res.json({ success: true, liked: !liked, likeCount: post.likes.length });
  } catch (err) { next(err); }
};

// POST /api/posts/:id/save
exports.toggleSave = async (req, res, next) => {
  try {
    const User = require("../models/User");
    const user = await User.findById(req.user._id);
    const idx = user.savedPosts.indexOf(req.params.id);
    if (idx > -1) user.savedPosts.splice(idx, 1);
    else user.savedPosts.push(req.params.id);
    await user.save();
    res.json({ success: true, saved: idx === -1 });
  } catch (err) { next(err); }
};
