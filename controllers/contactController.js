import catchAsyncError from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import ContactModel from "../models/ContactModel.js";

export const createMessage = catchAsyncError(async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  if (!name && !email && !subject && !message) {
    return next(new ErrorHandler("Please fill all the fields", 400));
  }

  let loggedInUser;
  if (req.user) {
    loggedInUser = req.user._id;
  }

  await ContactModel.create({
    name,
    email,
    subject,
    message,
    loggedInUser,
  });

  res.status(201).json({
    status: true,
    message: "Message Sent Successfully",
  });
});

export const getAllMessage = catchAsyncError(async (req, res, next) => {
  const messages = await ContactModel.find();

  res.status(200).json({
    status: true,
    messages:messages.reverse(),
  });
});

export const deleteMessage = catchAsyncError(async (req, res, next) => {
  const message = await ContactModel.findById(req.params.id);

  if (!message) {
    return next(new ErrorHandler("Message not found", 404));
  }

  await message.remove();

  return res.status(200).json({
    status: true,
    message: "Message Deleted Successfully",
  });
});
