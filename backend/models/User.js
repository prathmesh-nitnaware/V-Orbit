import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  uid: { type: String, required: true, unique: true }, // Firebase UID
  profilePic: { type: String },
  
  // Student Specific Details
  regNo: { type: String, default: "" },
  branch: { type: String, default: "" },
  phone: { type: String, default: "" },
  cgpa: { type: String, default: "" },
  
  // Professional Links
  linkedin: { type: String, default: "" },
  github: { type: String, default: "" },
  portfolio: { type: String, default: "" },
  skills: { type: String, default: "" },
  bio: { type: String, default: "" },

  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model("User", userSchema);