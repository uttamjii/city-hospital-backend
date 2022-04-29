import mongoose from "mongoose";
import validator from "validator";

const ContactSchema = new mongoose.Schema({
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
  subject: {
    type: String,
    required: [true, "Please enter your subject"],
    trim: true,
    minlength: [3, "Subject must be at least 3 characters long"],
  },
  message: {
    type: String,
    required: [true, "Please enter your message"],
    trim: true,
    minlength: [3, "Message must be at least 3 characters long"],
  },
  loggedInUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const ContactModel = mongoose.model("ContactMessage", ContactSchema);

export default ContactModel;
