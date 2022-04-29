import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";
import catchAsyncError from "../middleware/catchAsyncErrors.js";

// add middleware to check if user is authenticated and add it into req.user
const isAuthenticated = catchAsyncError(async (req, res, next) => {
  let token;

  const { authorization } = req.headers;

  try {
    if (authorization && authorization.startsWith("Bearer")) {
      token = authorization.split(" ")[1];

      const { id } = jwt.verify(token, process.env.JWT_SECRET);

      if (id) {
        req.user = await UserModel.findById(id);
      }

      next();
    }else{
        next();
    }

  } catch (error) {
    next();
  }
});

export default isAuthenticated;
