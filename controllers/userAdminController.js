// Admin Routes
import catchAsyncError from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import UserModel from "../models/UserModel.js";



export const getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await UserModel.find({ role: "user" });
    res.status(200).json({
        status: true,
        users,
    });
});

export const getAllAdmins = catchAsyncError(async (req, res, next) => {
    const admins = await UserModel.find({ role: "admin" });
    res.status(200).json({
        status: true,
        admins,
    });
});

export const updateUser = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!(role === 'admin') || !(role === 'user')) {
        return next(new ErrorHandler("Invalid Role", 400));
    }


    const user = await UserModel.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    res.status(200).json({
        status: true,
        message: "User role updated successfully",
        user
    });
});

export const deleteUser = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    res.status(200).json({
        status: true,
        message: "User deleted successfully",
    });
});