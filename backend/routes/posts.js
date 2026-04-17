const express = require("express");
const router = express.Router();
const {
  getPosts, getMyPosts, getStats, getPostById,
  getPost, createPost, updatePost, deletePost,
  toggleLike, toggleSave
} = require("../controllers/postController");
const { protect, authorize, optionalAuth } = require("../middleware/auth");

// Static routes MUST come before dynamic /:slug
router.get("/my-posts", protect, getMyPosts);
router.get("/stats", protect, authorize("admin"), getStats);
router.get("/id/:id", optionalAuth, getPostById);

router.get("/", optionalAuth, getPosts);
router.post("/", protect, authorize("user","author", "admin"), createPost);

router.get("/:slug", optionalAuth, getPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.post("/:id/like", protect, toggleLike);
router.post("/:id/save", protect, toggleSave);

module.exports = router;
