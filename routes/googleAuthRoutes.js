import express from "express";
const router = express.Router();
import passport from "passport";

router.get("/google/redirect", (req, res) => {
  res.redirect(process.env.FRONTEND_URL + "/" + req?.user?.token);
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
    successRedirect: "redirect",
    failureRedirect: "google/failed",
  })
);

export default router;
