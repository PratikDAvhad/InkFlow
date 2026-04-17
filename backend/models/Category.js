const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema({
  name:        { type: String, required: true, unique: true, trim: true, maxlength: 50 },
  slug:        { type: String, unique: true },
  description: { type: String, maxlength: 200, default: "" },
  color:       { type: String, default: "#4f46e5" }
}, { timestamps: true });

categorySchema.pre("save", function(next) {
  if (this.isModified("name")) this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

module.exports = mongoose.model("Category", categorySchema);
