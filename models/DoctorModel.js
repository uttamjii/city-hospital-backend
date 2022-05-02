import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
    minlength: [3, "Name must be at least 3 characters"],
  },
  gender: {
    type: String,
    required: [true, "Please add a gender"],
    enum: {
      values: ["Male", "Female", "Other", "male", "female", "other"],
      message: "Please enter a valid gender",
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
  description: {
    type: String,
    required: [true, "Please add a description"],
    trim: true,
    minlength: [24, "Description must be at least 24 characters"],

  },
  speciality: {
    type: String,
    required: [true, "Please add a speciality"],
    trim: true,
    minlength: [3, "Speciality must be at least 3 characters"],
  },
  available: {
    type: String,
    required: [true, "Please add a status"],
    toUpperCase: true,
    default: "YES",
  },
  location: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    lowercase: true,
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const DoctorModel = mongoose.model("Doctor", DoctorSchema);

export default DoctorModel;
