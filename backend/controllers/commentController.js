const Comment = require("../models/Comment");
const Post = require("../models/Post");

exports.addComment = async (req, res, next) => {
  try {
    const { content, postId, parentId } = req.body;
    if (!content || !postId)
      return res.status(400).json({ success: false, message: "content and postId required." });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found." });

    const comment = await Comment.create({
      content, author: req.user._id, post: postId, parent: parentId || null
    });
    await comment.populate("author", "username avatar");
    res.status(201).json({ success: true, comment });
  } catch (err) { next(err); }
};

exports.getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId, parent: null, isApproved: true })
      .populate("author", "username avatar")
      .populate({ path: "replies", populate: { path: "author", select: "username avatar" } })
      .sort("-createdAt");
    res.json({ success: true, count: comments.length, comments });
  } catch (err) { next(err); }
};

exports.updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found." });
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Not authorized." });
    comment.content = req.body.content;
    await comment.save();
    res.json({ success: true, comment });
  } catch (err) { next(err); }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found." });
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Not authorized." });
    await Comment.deleteMany({ parent: comment._id });
    await comment.deleteOne();
    res.json({ success: true, message: "Comment deleted." });
  } catch (err) { next(err); }
};

exports.toggleLike = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found." });
    const liked = comment.likes.includes(req.user._id);
    if (liked) comment.likes.pull(req.user._id);
    else comment.likes.push(req.user._id);
    await comment.save();
    res.json({ success: true, liked: !liked, likeCount: comment.likes.length });
  } catch (err) { next(err); }
};
