import express from "express";
const router = express.Router();
import {
  changePassword,
  createUser,
  deleteAccount,
  loggedUserDetails,
  loginUser,
  resetPasswordEmail,
  updateUserProfile,
  userPasswordReset,
} from "../controllers/userController.js";
import isAuthenticated from "../middleware/isAuthenticatedMiddleware.js";

// Route Level Middleware - To Protect Route
router.use("/loggeduser", isAuthenticated);
router.use("/updateprofile", isAuthenticated);
router.use("/changepassword", isAuthenticated);
router.use("/deleteaccount", isAuthenticated);

// Public Routes
router.route("/create").post(createUser);
router.route("/login").post(loginUser);
router.route("/sendresetpasswordmail").post(resetPasswordEmail);
router.route("/resetpassword/:id/:token").put(userPasswordReset);

// Protected Routes
router.route("/loggeduser").get(loggedUserDetails);
router.route("/updateprofile").put(updateUserProfile);
router.route("/changepassword").put(changePassword);
router.route("/deleteaccount").delete(deleteAccount);

export default router;
