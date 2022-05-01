import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";
import catchAsyncError from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";

const isAuthenticated = catchAsyncError(async (req, res, next) => {
  let token;

  const { authorization } = req.headers;

  if (!authorization) {
    return next(new ErrorHandler("Unathorized User, No Token..", 401));
  }

  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1];

    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(id);

    if (!user) {
      return next(new ErrorHandler("User does not exist!", 401));
    }

    req.user = user;

    next();
  } else {
    return next(new ErrorHandler("Unathorized User", 401));
  }
});

export default isAuthenticated;
