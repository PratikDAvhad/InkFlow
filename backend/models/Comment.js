const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content:    { type: String, required: true, trim: true, minlength: 2, maxlength: 1000 },
  author:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  post:       { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  parent:     { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
  likes:      [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isApproved: { type: Boolean, default: true }
}, { timestamps: true, toJSON: { virtuals: true } });

commentSchema.virtual("likeCount").get(function() { return this.likes.length; });
commentSchema.virtual("replies", { ref: "Comment", localField: "_id", foreignField: "parent" });
commentSchema.index({ post: 1, createdAt: -1 });

module.exports = mongoose.model("Comment", commentSchema);
