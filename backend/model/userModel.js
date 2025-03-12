const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "The first name is required."],
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
    default: "",
  },
  email: {
    type: String,
    unique: true,
    required: [true, "The email is required."],
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "The password is required."],
  },
  department: {
    type: String,
    required: [true, "The department is a required."],
  },
  gender: {
    type: String,
    enum: ["male" || "female" || "others"],
    required: [true, "The gender is a required."],
  },
  phoneNumber: {
    type: Number,
    required: [true, "The phone number is a required."],
  },
  skills: {
    type: [String],
    default: [],
  },
  bio: {
    type: String,
    trim: true,
    default: "",
  },
  linkedIn: {
    type: String,
    trim: true,
    default: "",
  },
  github: {
    type: String,
    trim: true,
    default: "",
  },
  twitter: {
    type: String,
    trim: true,
    default: "",
  },
  interests: {
    type: [String],
    default: [],
  },
  companyName: {
    type: String,
    trim: true,
    default: "",
  },
  role: {
    type: String,
    enum: ["admin", "user", "alumni"],
    default: "user",
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
