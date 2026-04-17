// routes/categories.js
const express = require("express");
const r3 = express.Router();
const { getCategories, createCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");
const { protect, authorize } = require("../middleware/auth");
r3.get("/", getCategories);
r3.post("/", protect, authorize("admin"), createCategory);
r3.put("/:id", protect, authorize("admin"), updateCategory);
r3.delete("/:id", protect, authorize("admin"), deleteCategory);
module.exports = r3;
