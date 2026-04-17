// routes/users.js
const express = require("express");
const r2 = express.Router();
const User = require("../models/User");
const { getAllUsers, getUserProfile, updateUserRole, deleteUser } = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");
r2.get("/", protect, authorize("admin"), getAllUsers);
r2.get("/id/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("username avatar");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user });
});
r2.get("/:username", getUserProfile);
r2.put("/:id/role", protect, authorize("admin"), updateUserRole);
r2.delete("/:id", protect, authorize("admin"), deleteUser);

module.exports = r2;
