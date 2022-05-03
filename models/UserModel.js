import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    trim: true,
    minlength: [3, "Name must be at least 3 characters long"],
    maxlength: [60, "Name must be at most 20 characters long"],
  },
  email: {
    type: String,
    unique: [true, "Email already exists"],
    required: [true, "Please enter your email"],
    trim: true,
    minlength: [10, "Email must be at least 3 characters long"],
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    trim: true,
    minlength: [8, "Password must be at least 8 characters long"],
    select: false,
  },
  role: {
    type: String,
    default: "user",
    lowercase: true,
    trim: true,
    enum: {
      values: ["user", "User", "Admin", "admin"],
      message: "Not a valid role",
    },
  },
  avatar: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  appointments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
  ],
  googleAuth: {
    type: Boolean,
    default: false,
  },
  googleId: {
    type: String,
    default: "",
    select: false,
  },
});

// Password Hash using bcrypt js
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
});

// JWT TOKEN
UserSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Compare Password
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
