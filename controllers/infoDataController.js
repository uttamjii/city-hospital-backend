import InfoDataModel from "../models/InfoDataModel.js";
import catchAsyncError from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";


export const getInfoData = catchAsyncError(async (req, res, next) => {


    const infoData = await InfoDataModel.findOne();
    if (!infoData) {
        return next(new ErrorHandler("No info data found", 404));
    }

    res.status(200).json({
        status: true,
        infoData: infoData,
    });
});

export const updateInfoData = catchAsyncError(async (req, res, next) => {

    const infoData = await InfoDataModel.findOne();
    if (!infoData) {
        return next(new ErrorHandler("No info data found", 404));
    }

    const updatedInfoData = await InfoDataModel.findOneAndUpdate(
        { _id: infoData._id },
        {
            $set: {
                emergencyNumber: req.body.emergencyNumber,
                phoneNumber: req.body.phoneNumber,
                email: req.body.email,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
            }
        },
        { new: true }
    );

    res.status(200).json({
        status: true,
        message: "Info data updated successfully",
        infoData: updatedInfoData,

    });
});