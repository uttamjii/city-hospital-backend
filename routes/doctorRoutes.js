import express from 'express'
import { createDoctor, deleteDoctor, getAllDoctors ,getDoctor, updateDoctor } from '../controllers/doctorController.js';
import authenticateRole from '../middleware/authenticateRoleMiddleware.js';
import isAuthenticated from '../middleware/isAuthenticatedMiddleware.js';
const router = express.Router()







// Middleware
router.use("/create",isAuthenticated,authenticateRole('admin'));
router.use("/delete",isAuthenticated,authenticateRole('admin'));
router.use("/update",isAuthenticated,authenticateRole('admin'));


//Public Routes
router.route("/get/:id").get(getDoctor)
router.route("/getAll").get(getAllDoctors);


// Admin Routes :- Protected Routes
router.route("/create").post(createDoctor);
router.route("/delete/:id").delete(deleteDoctor);
router.route("/update/:id").put(updateDoctor);




export default router;