import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import villeModel from "../models/villeModel.js";

export const loginUser = async (req, res) => {
  const { Email, Password } = req.body;

  if (!Email || !Password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }

  if (Password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters",
    });
  }

  const user = await userModel.findOne({ Email: Email });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Email or password is incorrect",
    });
  }

  const pass = await bcrypt.compare(Password, user.Password);
  if (!pass) {
    return res.status(401).json({
      success: false,
      message: "Email or password is incorrect",
    });
  }

  const token = jwt.sign(
    { user: user._id, is_admin: user.is_admin },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  res.json({ success: true, message: "You are logged in", token });
};

export const getMe = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.user).select("-Password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const createUser = async (req, res) => {
  const { FullName, Email, Password, VilleId } = req.body; // is_admin intentionally excluded

  if (!FullName || !Email || !Password || !VilleId) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }

  if (Password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters",
    });
  }

  const exists = await userModel.findOne({ Email });
  if (exists) {
    return res.status(400).json({
      success: false,
      message: "This email is already registered",
    });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(Password, salt);
    await userModel.create({
      FullName,
      Email,
      Password: hashPassword,
      VilleId,
      // is_admin defaults to false in the model — never set here
    });
    return res.json({ success: true, message: "Registration successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Registration failed. Please try again later",
    });
  }
};

export const updateUser = async (req, res) => {
  const { FullName, Email, VilleId } = req.body;

  if (!FullName || !Email || !VilleId) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }

  const villeExists = await villeModel.findById(VilleId);
  if (!villeExists) {
    return res.status(400).json({
      success: false,
      message: "City reference does not exist",
    });
  }

  if (req.params._id !== req.user.user) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  const exists = await userModel.find({ Email, _id: { $ne: req.params._id } });
  if (exists.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Someone else is already registered with this email",
    });
  }

  try {
    await userModel.updateOne(
      { _id: req.params._id },
      { FullName, Email, VilleId }
    );
    res.json({ success: true, message: "Updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Update failed. Please try again later",
    });
  }
};

export const deleteUser = async (req, res) => {
  if (req.params._id !== req.user.user) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  try {
    await userModel.deleteOne({ _id: req.params._id });
    res.json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Delete failed. Please try again later",
    });
  }
};

export const updatePassword = async (req, res) => {
  const { OldPassword, NewPassword } = req.body;

  if (!OldPassword || !NewPassword) {
    return res.status(400).json({
      success: false,
      message: "Current and new passwords are required",
    });
  }

  try {
    const user = await userModel.findById(req.params._id);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(OldPassword, user.Password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Current password isn't correct" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(NewPassword, salt);
    await userModel.updateOne({ _id: req.params._id }, { Password: hashPass });

    return res
      .status(200)
      .json({ success: true, message: "Your password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
