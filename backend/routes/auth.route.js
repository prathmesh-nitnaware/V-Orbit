import express from "express";
import { User } from "../models/User.js";

const router = express.Router();

// 1. Check if User Exists (Called after Google Login)
router.post("/google-login", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      return res.status(200).json({ exists: true, user });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// 2. Register New User (Called from Registration Form)
router.post("/register", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

// 3. Get Profile Data
router.get("/:uid", async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 4. Update Profile (REQUIRED for Profile Page Save)
router.put("/update/:uid", async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { uid: req.params.uid },
      req.body,
      { new: true } // Return the updated document
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
});

export default router;