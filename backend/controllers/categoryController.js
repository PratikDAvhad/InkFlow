const Category = require("../models/Category");
const Post = require("../models/Post");

exports.getCategories = async (req, res, next) => {
  try {
    const cats = await Category.find().sort("name");
    const result = await Promise.all(cats.map(async c => {
      const count = await Post.countDocuments({ category: c._id, status: "published" });
      return { ...c.toJSON(), postCount: count };
    }));
    res.json({ success: true, categories: result });
  } catch (err) { next(err); }
};

exports.createCategory = async (req, res, next) => {
  try {
    const cat = await Category.create(req.body);
    res.status(201).json({ success: true, category: cat });
  } catch (err) { next(err); }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!cat) return res.status(404).json({ success: false, message: "Category not found." });
    res.json({ success: true, category: cat });
  } catch (err) { next(err); }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const cat = await Category.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ success: false, message: "Category not found." });
    await Post.updateMany({ category: req.params.id }, { $set: { category: null } });
    res.json({ success: true, message: "Category deleted." });
  } catch (err) { next(err); }
};
