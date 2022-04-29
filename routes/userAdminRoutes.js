import express from "express";
import { deleteUser, getAllAdmins, getAllUsers, updateUser } from "../controllers/userAdminController.js";
import authenticateRole from "../middleware/authenticateRoleMiddleware.js";
import isAuthenticated from "../middleware/isAuthenticatedMiddleware.js";
const router = express.Router();



// Admin Routes : Protected Routes

// Middleware
router.use(isAuthenticated,authenticateRole("admin"));


// Routes
router.route("/getallusers").get(getAllUsers);
router.route("/getalladmins").get(getAllAdmins);
router.route("/updaterole/:id").put(updateUser);
router.route("/deleteuser/:id").delete(deleteUser);


export default router;