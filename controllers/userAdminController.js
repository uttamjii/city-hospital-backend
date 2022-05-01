// Admin Routes
import catchAsyncError from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import UserModel from "../models/UserModel.js";
import cloudinary from "cloudinary";

export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await UserModel.find({ role: "user" });
  res.status(200).json({
    status: true,
    users: users.reverse(),
  });
});

export const getAllAdmins = catchAsyncError(async (req, res, next) => {
  const admins = await UserModel.find({ role: "admin" });
  res.status(200).json({
    status: true,
    admins: admins.reverse(),
  });
});

export const updateUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const role = req.body.role.toLowerCase();

  const user = await UserModel.findByIdAndUpdate(
    id,
    { role },
    { new: true, runValidators: true }
  );
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({
    status: true,
    message: "User role updated successfully",
    user,
  });
});

export const deleteUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = await UserModel.findById(id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  if (user.avatar) {
    if (user.avatar.public_id) {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    }
  }
  await UserModel.findByIdAndDelete(id);

  res.status(200).json({
    status: true,
    message: "User deleted successfully",
  });
});
