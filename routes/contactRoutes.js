import express from "express";
import {
  createMessage,
  deleteMessage,
  getAllMessage,
} from "../controllers/contactController.js";
import authenticateRole from "../middleware/authenticateRoleMiddleware.js";
import isAuthenticated from "../middleware/isAuthenticatedMiddleware.js";
import yesOrnoAuthenticated from "../middleware/yesOrnoAuthenticated.js";

const router = express.Router();

// Middleware
router.use("/send", yesOrnoAuthenticated);

router.use("/getall", isAuthenticated, authenticateRole("admin"));
router.use("/delete", isAuthenticated, authenticateRole("admin"));

//Public Routes
router.route("/send").post(createMessage);

// Admin Routes
router.route("/getall").get(getAllMessage);
router.route("/delete/:id").delete(deleteMessage);

export default router;
