import express from "express";
import errorMiddleware from "./middleware/errorMiddleware.js";
import originCheckMiddleware from "./middleware/originCheckMiddleware.js";
import fileUpload from "express-fileupload";
import cors from "cors";
const app = express();

// middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(fileUpload());

// middleware

// middleware for checking orgin of request or Frontend url
// app.use("*", originCheckMiddleware);

// routes
import userRoutes from "./routes/userRoutes.js";
import infoDataRoutes from "./routes/infoDataRoutes.js";
import userAdminRoutes from "./routes/userAdminRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

//use Routes
app.use("/api/user", userRoutes);
app.use("/api/infodata", infoDataRoutes);
app.use("/api/admin", userAdminRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/message", contactRoutes);

//Errors Handler
app.use(errorMiddleware);

export default app;
