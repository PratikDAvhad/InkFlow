const User = require("../models/User");
const Post = require("../models/Post");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort("-createdAt");
    res.json({ success: true, count: users.length, users });
  } catch (err) { next(err); }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    const posts = await Post.find({ author: user._id, status: "published" })
      .populate("category", "name slug color")
      .select("title slug excerpt coverImage createdAt views likes readTime tags")
      .sort("-createdAt")
      .lean({ virtuals: true });
    res.json({ success: true, user, posts });
  } catch (err) { next(err); }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    res.json({ success: true, message: "Role updated.", user });
  } catch (err) { next(err); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    if (req.user._id.toString() === req.params.id)
      return res.status(400).json({ success: false, message: "Cannot delete yourself." });
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    await Post.deleteMany({ author: req.params.id });
    res.json({ success: true, message: "User deleted." });
  } catch (err) { next(err); }
};
