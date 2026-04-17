// routes/comments.js
const express = require("express");
const r1 = express.Router();
const { addComment, getPostComments, updateComment, deleteComment, toggleLike } = require("../controllers/commentController");
const { protect } = require("../middleware/auth");
r1.get("/post/:postId", getPostComments);
r1.post("/", protect, addComment);
r1.put("/:id", protect, updateComment);
r1.delete("/:id", protect, deleteComment);
r1.post("/:id/like", protect, toggleLike);
module.exports = r1;
