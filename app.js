import express from "express";
import errorMiddleware from "./middleware/errorMiddleware.js";
import originCheckMiddleware from "./middleware/originCheckMiddleware.js";
import "./utils/passportGoogleConfig.js";
import passport from "passport";
import cookieSession from "cookie-session";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

// Cookie parser
app.use(cookieParser());

// Cookie Session
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

// Cors
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
// middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(fileUpload());
app.use(passport.initialize());
app.use(passport.session());

// middleware for checking orgin of request or Frontend url
// app.use("*", originCheckMiddleware);

// routes
import userRoutes from "./routes/userRoutes.js";
import infoDataRoutes from "./routes/infoDataRoutes.js";
import userAdminRoutes from "./routes/userAdminRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import googleAuthRoutes from "./routes/googleAuthRoutes.js";

//use Routes
app.use("/api/user", userRoutes);
app.use("/api/infodata", infoDataRoutes);
app.use("/api/admin", userAdminRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/message", contactRoutes);
app.use("/api/auth", googleAuthRoutes);

//Errors Handler
app.use(errorMiddleware);

export default app;
