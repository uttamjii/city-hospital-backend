import catchAsyncError from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import UserModel from "../models/UserModel.js";
import cloudinary from "cloudinary";
import sendEmail from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";

export const createUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  const existUser = await UserModel.findOne({ email });

  if (existUser) {
    return next(new ErrorHandler("User already exist", 400));
  }

  if (name && email && password && confirmPassword) {
    if (password !== confirmPassword) {
      return next(new ErrorHandler("Passwords do not match", 400));
    }
  } else {
    return next(new ErrorHandler("Please fill all the fields", 400));
  }

  let avatar;

  try {
    // image uploade to cloudinary
    if (req.body.avatar) {
      const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatarscityhospital",
      });
      avatar = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }
  } catch (err) {
    return next(new ErrorHandler("Error uploading image", 400));
  }

  const newUser = await UserModel.create({
    name,
    email,
    password,
    avatar,
  });

  const token = newUser.generateAuthToken();

  res.status(201).json({
    status: true,
    message: "User created successfully",
    token,
    // ...newUser._doc,
  });
});

export const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please fill all the fields", 400));
  }

  const user = await UserModel.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("User does not exist", 400));
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new ErrorHandler("Incorrect Authentication", 400));
  }

  const token = user.generateAuthToken();

  const newUser = await UserModel.findOne({ email });

  res.status(200).json({
    status: true,
    message: "User logged in successfully",
    token,
    ...newUser._doc,
  });
});

export const loggedUserDetails = catchAsyncError(async (req, res, next) => {
  res.status(200).json({
    status: true,
    message: "User details fetched successfully",
    user: req.user,
  });
});

export const updateUserProfile = catchAsyncError(async (req, res, next) => {
  const { name, email } = req.body;

  if (!name && !email) {
    return next(new ErrorHandler("Please fill all the fields", 400));
  }

  let avatar;

  // destory cloudinary image avater if it is
  if (req.body.avatar) {
    if (req.user.avatar.public_id) {
      await cloudinary.v2.uploader.destroy(req.user.avatar.public_id);
    }

    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatarscityhospital",
    });

    avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      name,
      email,
      avatar,
    },
    { new: true }
  );

  res.status(200).json({
    status: true,
    message: "User profile updated successfully",
    ...user._doc,
  });
});

export const changePassword = catchAsyncError(async (req, res, next) => {
  const { password, newPassword, confirmNewPassword } = req.body;

  if (!password && !newPassword && !confirmNewPassword) {
    return next(new ErrorHandler("Please fill all the fields", 400));
  }

  if (newPassword !== confirmNewPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }
  const user = await UserModel.findById(req.user._id).select("+password");

  user.password = newPassword;

  await user.save();

  const newUser = await UserModel.findById(req.user._id);

  res.status(200).json({
    status: true,
    message: "Password changed successfully",
    ...newUser._doc,
  });
});

export const deleteAccount = catchAsyncError(async (req, res, next) => {
  if (!req.user._id) {
    return next(new ErrorHandler("User does not exist", 400));
  }

  if (req.user.avatar) {
    if (req.user.avatar.public_id) {
      await cloudinary.v2.uploader.destroy(req.user.avatar.public_id);
    }
  }

  await UserModel.findByIdAndDelete(req.user._id);

  res.status(200).json({
    status: true,
    message: "User deleted successfully",
  });
});

export const resetPasswordEmail = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorHandler("Please fill all the fields", 400));
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("User does not exist", 400));
  }

  const secret = user._id + process.env.JWT_SECRET;
  const token = jwt.sign({ userID: user._id }, secret, { expiresIn: "15m" });

  const link = `${req.headers.origin}/resetpassword/${user._id}/${token}`;

  // Send Email


  const message = `<a href="${link}">Click here </a> to reset your password`;

  await sendEmail({
    email: user.email,
    subject: `City Hospital Password Recovery`,
    message: message,
  });

  res.status(200).json({
    status: true,
    message: "Please check your email.",
  });
});

export const userPasswordReset = catchAsyncError(async (req, res, next) => {
  const { password, confirmPassword } = req.body;

  if (!password && !confirmPassword) {
    return next(new ErrorHandler("Please fill all the fields", 400));
  }

  const { id, token } = req.params;

  const user = await UserModel.findById(id);

  const new_secret = user._id + process.env.JWT_SECRET;

  jwt.verify(token, new_secret);

  if (password !== confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  } else {
    user.password = password;

    await user.save();

    res.status(200).json({
      status: true,
      message: "Password changed successfully",
    });
  }
});
