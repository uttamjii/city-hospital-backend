import mongoose from "mongoose";
import validator from "validator";

const AppointmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    trim: true,
    minlength: [3, "Name must be at least 3 characters long"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    trim: true,
    validate: [validator.isEmail, "Please enter a valid email"],
    minlength: [10, "Email must be at least 10 characters long"],
  },
  phone: {
    type: String,
    required: [true, "Please enter your phone number"],
    trim: true,
    minlength: [10, "Phone number must be at least 10 characters long"],
    validate: [validator.isMobilePhone, "Please enter a valid phone number"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  appointmentDate: {
    type: Date,
    required: [true, "Please enter your appointment date"],
    trim: true,
  },
  appointmentTime: {
    type: String,

    trim: true,
  },
  message: {
    type: String,
  },
  gender: {
    type: String,
    required: [true, "Please enter your gender"],
    enum: {
      values: ["female", "male", "other", "Female", "Other", "Male"],
      message: "Not a valid gender",
    },
  },
  service: {
    type: String,
    required: [true, "Please enter your service"],
  },
  loginUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
  },
  status: {
    type: String,
    default: "pending",
    lowercase: true,
    enum: {
      values: ["pending", "confirmed", "cancelled", "finished"],
      message: "Not a valid status",
    },
  },
  adminMessage: {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    adminName: {
      type: String,
    },
    message: {
      type: String,
      default: "No message yet",
    },
  },
  sendComfirmedMail: {
    type: Boolean,
    default: true,
  },
});

const AppointmentModel = mongoose.model("Appointment", AppointmentSchema);

export default AppointmentModel;
