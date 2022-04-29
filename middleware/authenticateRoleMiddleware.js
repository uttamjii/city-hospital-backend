import ErrorHandler from "../utils/errorHandler.js";

const authenticateRole = (role) => {
  return (req, res, next) => {
    if (req.user.role === role) {
      next();
    } else {
      return next(
        new ErrorHandler("You are not authorized to perform this action", 401)
      );
    }
  };
};

export default authenticateRole;
