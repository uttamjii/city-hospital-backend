// Config file
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "./config/config.env" });
}


import app from "./app.js";
import connectDB from "./connectionDB/ConnectDB.js";
import cloudinary from "cloudinary";

const PORT = process.env.PORT || 4000;
const MONGODB_URL =
  process.env.MONGODB_URL || "mongodb://localhost/city-hospital";

//Uncaught Error:
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

// Database connection
connectDB(MONGODB_URL);

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// Unhandled Rejection
server.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
