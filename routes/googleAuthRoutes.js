import express from "express";
const router = express.Router();
import passport from "passport";
import ErrorHandler from "../utils/errorHandler.js";
import Buffer from "buffer";

router.get("/google/success", (req, res, next) => {
  console.log(req.cookies.session);
  console.log(req.cookies);
  console.log(req.session);
  // console.log(req.session.passport);
  if (req.user) {
    return res.status(200).json({
      status: true,
      message: "User logged in successfully",
      token: req.user.token,
      ...req.user.user,
    });
  }
  if (req.cookies.session) {
    const data = JSON.parse(
      Buffer.Buffer.from(req.cookies.session, "base64").toString()
    );
    return res.status(200).json({
      status: true,
      message: "User logged in successfully",
      ...data.passport.user.user,
      token: data.passport.user.token,
    });
  }

  // return next(new ErrorHandler("login failed", 400));

  return res.status(200).json({
    status: false,
    message: "login failed",
    cookies: req.cookies,
    session: req.session,
  });
});

router.get("/google/logout", (req, res) => {
  req.cookies.session = undefined;
  req.session = undefined;

  req.logout();
  res.redirect(process.env.FRONTEND_URL);
});

router.get("/google/failed", (req, res) => {
  res.status(401).json({
    status: false,
    message: "Login failed Please try again",
  });
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.FRONTEND_URL,
    failureRedirect: "/google/failed",
  })
);

export default router;
