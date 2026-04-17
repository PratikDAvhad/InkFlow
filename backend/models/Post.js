const mongoose = require("mongoose");
const slugify = require("slugify");

const postSchema = new mongoose.Schema({
  title:      { type: String, required: [true,"Title required"], trim: true, minlength: 5, maxlength: 200 },
  slug:       { type: String, unique: true },
  content:    { type: String, required: [true,"Content required"] },
  excerpt:    { type: String, maxlength: 300 },
  coverImage: { type: String, default: "" },
  author:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category:   { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
  tags:       [{ type: String, trim: true, lowercase: true }],
  status:     { type: String, enum: ["draft","published","archived"], default: "draft" },
  views:      { type: Number, default: 0 },
  likes:      [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  readTime:   { type: Number, default: 1 },
  featured:   { type: Boolean, default: false }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

postSchema.virtual("likeCount").get(function() { 
  return this.likes ? this.likes.length : 0; 
});

postSchema.pre("save", function(next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + "-" + Date.now();
  }
  if (this.isModified("content")) {
    const plain = this.content.replace(/(<([^>]+)>)/gi, "").replace(/\s+/g, " ").trim();
    if (!this.excerpt || this.isModified("content")) {
      this.excerpt = plain.substring(0, 200) + (plain.length > 200 ? "..." : "");
    }
    this.readTime = Math.max(1, Math.ceil(plain.split(" ").length / 200));
  }
  next();
});

postSchema.index({ title: "text", content: "text", tags: "text" });
postSchema.index({ slug: 1 });
postSchema.index({ author: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model("Post", postSchema);
