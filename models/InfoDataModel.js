import mongoose from "mongoose";
import validator from "validator";

const InfoDataSchema = new mongoose.Schema({
  emergencyNumber: {
    type: String,
    minlength: [10, "Phone number must be at least 10 characters long"],
    trim: true,
    validate: [validator.isMobilePhone, "Please enter a valid phone number"],
  },
  phoneNumber: {
    type: String,
    minlength: [10, "Phone number must be at least 10 characters long"],
    trim: true,
    validate: [validator.isMobilePhone, "Please enter a valid phone number"],
  },
  email: {
    type: String,
    trim: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  address: {
    type: String,
    trim: true,
    minlength: [3, "Address must be at least 5 characters long"],
  },
  city: {
    type: String,
    trim: true,
    minlength: [3, "City must be at least 3 characters long"],
  },
  state: {
    type: String,
    trim: true,
    minlength: [3, "State must be at least 3 characters long"],
  },
});

const InfoDataModel = mongoose.model("InfoData", InfoDataSchema);

export default InfoDataModel;
