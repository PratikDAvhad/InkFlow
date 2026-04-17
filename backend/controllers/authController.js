const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || "7d" });

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, message: errors.array()[0].msg });

    const { username, email, password, bio } = req.body;
    const user = await User.create({ username, email, password, bio });
    const token = signToken(user._id);
    res.status(201).json({ success: true, message: "Registered successfully", token, user });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, message: errors.array()[0].msg });

    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    if (!user.isActive)
      return res.status(403).json({ success: false, message: "Account deactivated." });

    const token = signToken(user._id);
    res.json({ success: true, message: "Login successful", token, user });
  } catch (err) { next(err); }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("savedPosts", "title author slug coverImage createdAt");
    console.log(user);
    res.json({ success: true, user });
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { username, bio, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id, { username, bio, avatar }, { new: true, runValidators: true }
    );
    res.json({ success: true, message: "Profile updated", user });
  } catch (err) { next(err); }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, message: "Both passwords required." });

    const user = await User.findById(req.user._id).select("+password");
    if (!(await user.comparePassword(currentPassword)))
      return res.status(400).json({ success: false, message: "Current password incorrect." });

    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: "Password changed." });
  } catch (err) { next(err); }
};
