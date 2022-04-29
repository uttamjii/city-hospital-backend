import express from "express";
import { getInfoData, updateInfoData } from "../controllers/infoDataController.js";
import authenticateRole from "../middleware/authenticateRoleMiddleware.js";
const router = express.Router();
import isAuthenticated from "../middleware/isAuthenticatedMiddleware.js";

// All  protected routes --- Admin Routes

//Middleware
router.use("/update", isAuthenticated, authenticateRole("admin"));


// Routes
router.route("/get").get(getInfoData)
router.route("/update").put(updateInfoData);





export default router;