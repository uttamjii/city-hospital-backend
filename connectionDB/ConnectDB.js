import mongoose from "mongoose";

const connectDB = async (MONGODB_URL) => {
    try {
        const options = {
            autoIndex: true,
          }
        await mongoose.connect(MONGODB_URL, options);
        console.log("MongoDB Connected...");
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

export default connectDB;