
const originCheckMiddleware = (req, res, next) => {
  if (req.headers.origin?.toString() === process.env.FRONTEND_URL?.toString()) {
    next();
  } else {
    res.status(403).json({
      status: false,
      message: "Invalid request",
    });
  }
};

export default originCheckMiddleware;
