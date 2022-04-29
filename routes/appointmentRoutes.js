import express from "express";
import {
  createAppointment,
  deleteAppointment,
  getAllAppointments,
  getUserAppointments,
  updateAppointmentStatus,
} from "../controllers/appointmentController.js";
const router = express.Router();
import yesOrnoAuthenticated from "../middleware/yesOrnoAuthenticated.js";
import isAuthenticated from "../middleware/isAuthenticatedMiddleware.js";
import authenticateRole from "../middleware/authenticateRoleMiddleware.js";

// Middleware

router.use(yesOrnoAuthenticated);
router.use("/delete", isAuthenticated);
router.use("/getuserappointments", isAuthenticated);
router.use("/getall", isAuthenticated, authenticateRole("admin"));
router.use("/update", isAuthenticated, authenticateRole("admin"));


// Routes
router.route("/create").post(createAppointment);

// Protected Routes - user
router.route("/delete/:id").delete(deleteAppointment);
router.route("/getuserappointments").get(getUserAppointments);

// Admin Routes
router.route("/getall").get(getAllAppointments);
router.route("/update/:id").put(updateAppointmentStatus);

export default router;
