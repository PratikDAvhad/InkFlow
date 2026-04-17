const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, required: [true, "Username required"], unique: true, trim: true, minlength: 3, maxlength: 30 },
  email:    { type: String, required: [true, "Email required"], unique: true, lowercase: true, trim: true },
  password: { type: String, required: [true, "Password required"], minlength: 6, select: false },
  role:     { type: String, enum: ["user","author","admin"], default: "user" },
  avatar:   { type: String, default: "" },
  bio:      { type: String, maxlength: 300, default: "" },
  isActive: { type: Boolean, default: true },
  savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }]
}, { timestamps: true });

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
