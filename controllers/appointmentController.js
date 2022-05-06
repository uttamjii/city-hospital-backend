import catchAsyncError from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import DoctorModel from "../models/DoctorModel.js";
import AppointmentModel from "../models/AppointmentModel.js";
import sendEmail from "../utils/sendEmail.js";

export const createAppointment = catchAsyncError(async (req, res, next) => {
  const {
    name,
    email,
    phone,
    appointmentDate,
    appointmentTime,
    gender,
    message,
    service,
  } = req.body;

  if (!name && !email && !phone && !appointmentDate && !gender) {
    return next(new ErrorHandler("Please fill all the fields", 400));
  }

  let loginUser;
  let doctorId;

  if (req.user) {
    loginUser = req.user._id;
  }

  if (req.body.doctorId) {
    try {
      const doctor = await DoctorModel.findById(req.body.doctorId);

      if (doctor.available === "YES") {
        doctorId = req.body.doctorId;
      } else {
        return next(new ErrorHandler("Sorry But Doctor is not available", 400));
      }
    } catch (error) {
      return next(new ErrorHandler("Doctor Not Found", 400));
    }
  }

  await AppointmentModel.create({
    name,
    email,
    phone,
    appointmentDate,
    appointmentTime,
    gender,
    message,
    loginUser,
    doctorId,
    service,
  });

  res.status(201).json({
    status: true,
    message: "Appointment created successfully",
  });
});

export const getAllAppointments = catchAsyncError(async (req, res, next) => {
  const appointments = await AppointmentModel.find().populate(
    "doctorId loginUser"
  );
  res.status(200).json({
    status: true,
    appointments: appointments.reverse(),
  });
});

export const getUserAppointments = catchAsyncError(async (req, res, next) => {
  const appointments = await AppointmentModel.find({
    loginUser: req.user._id,
  }).populate("doctorId");

  if (!appointments) {
    return next(new ErrorHandler("No appointments found", 404));
  }

  res.status(200).json({
    status: true,
    appointments: appointments.reverse(),
  });
});

export const deleteAppointment = catchAsyncError(async (req, res, next) => {
  const appointment = await AppointmentModel.findById(req.params.id);

  if (!appointment) {
    return next(new ErrorHandler("Appointment not found", 404));
  }

  if (appointment.loginUser?.toString() == req.user._id?.toString()) {
    await AppointmentModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      status: true,
      message: "Appointment deleted successfully",
    });
  }

  if (req.user.role == "admin") {
    await AppointmentModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      status: true,
      message: "Appointment deleted successfully",
    });
  }

  return next(
    new ErrorHandler("You are not authorized to delete this appointment", 401)
  );
});

export const updateAppointmentStatus = catchAsyncError(
  async (req, res, next) => {
    const appointment = await AppointmentModel.findById(req.params.id);

    if (!appointment) {
      return next(new ErrorHandler("Appointment not found", 404));
    }

    const { status } = req.body;

    if (!status) {
      return next(new ErrorHandler("Please provide status", 400));
    }

    if (
      !(
        status.toLowerCase() === "confirmed" ||
        status.toLowerCase() === "cancelled" ||
        status.toLowerCase() === "finished"
      )
    ) {
      return next(new ErrorHandler("Please provide valid status", 400));
    }

    let adminMessage;

    if (req.body.adminMessage) {
      adminMessage = {
        adminId: req.user._id,
        adminName: req.user.name,
        message: req.body.adminMessage,
      };
    } else {
      adminMessage = {
        adminId: req.user._id,
        adminName: req.user.name,
      };
    }
    // Send Email
    try {
      if (appointment.sendComfirmedMail === true) {
        const message = `Your Appointment Was Confirmed.`;

        await sendEmail({
          email: appointment.email,
          subject: `City Hospital - Appointment Confirmed`,
          message: message,
        });
      }
    } catch (error) {
      return next(
        // new ErrorHandler("Problem In Sending Confirmation Mail", 500)
        new ErrorHandler(error.message, 500)
      );
    }

    await AppointmentModel.findByIdAndUpdate(
      req.params.id,
      {
        status: status,
        adminMessage: adminMessage,
        sendComfirmedMail: false,
      },
      { new: true }
    );

    return res.status(200).json({
      status: true,
      message: "Appointment status updated successfully",
    });
  }
);
