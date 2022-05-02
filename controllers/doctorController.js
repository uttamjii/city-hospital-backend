// Admin Routes
import catchAsyncError from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import DoctorModel from "../models/DoctorModel.js";
import cloudinary from "cloudinary";

export const createDoctor = catchAsyncError(async (req, res, next) => {
  const { name, description, speciality, location, available, status, gender } =
    req.body;

  if (!name && !description && !speciality && !available && !gender) {
    return next(new ErrorHandler("Please fill all the fields", 400));
  }

  let avatar;
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

  await DoctorModel.create({
    name,
    avatar,
    description,
    speciality,
    location,
    available: available.toUpperCase(),
    status,
    gender,
  });
  res.status(201).json({
    status: true,
    message: "Doctor created successfully",
  });
});

export const updateDoctor = catchAsyncError(async (req, res, next) => {
  const { name, description, speciality, location, available, status, gender } =
    req.body;

  const doctor = await DoctorModel.findById(req.params.id);

  if (!doctor) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  let avatar;
  // image uploade to cloudinary if there is a new image
  if (req.body?.avatar) {
    if (doctor.avatar?.public_id) {
      await cloudinary.v2.uploader.destroy(doctor.avatar.public_id);
    }

    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatarscityhospital",
    });
    avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  await DoctorModel.findByIdAndUpdate(
    req.params.id,
    {
      name,
      avatar,
      description,
      speciality,
      location,
      available: available.toUpperCase(),
      status,
      gender,
    },
    { new: true }
  );

  res.status(200).json({
    status: true,
    message: "Doctor updated successfully",
  });
});
export const getAllDoctors = catchAsyncError(async (req, res, next) => {
  const doctors = await DoctorModel.find();
  res.status(200).json({
    status: true,
    doctors: doctors.reverse(),
  });
});

export const getDoctor = catchAsyncError(async (req, res, next) => {
  const doctor = await DoctorModel.findById(req.params.id);
  if (!doctor) {
    return next(new ErrorHandler("No doctor found with that ID", 404));
  }
  res.status(200).json({
    status: true,
    doctor,
  });
});

export const deleteDoctor = catchAsyncError(async (req, res, next) => {
  const doctor = await DoctorModel.findById(req.params.id);
  if (!doctor) {
    return next(new ErrorHandler("No doctor found with that ID", 404));
  }

  // remove image from the cloudinary
  if (doctor.avatar?.public_id) {
    await cloudinary.v2.uploader.destroy(doctor.avatar?.public_id);
  }

  await doctor.remove();
  res.status(200).json({
    status: true,
    message: "Doctor deleted successfully",
  });
});
