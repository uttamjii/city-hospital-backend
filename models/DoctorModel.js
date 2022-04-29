import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
        trim: true,
        minlength: [3, "Name must be at least 3 characters"]

    },
    avatar: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    },
    description: {
        type: String,
        required: [true, "Please add a description"],
        trim: true,
        minlength: [5, "Description must be at least 5 characters"]
    },
    speciality: {
        type: String,
        required: [true, "Please add a speciality"],
        trim: true,
        minlength: [3, "Speciality must be at least 3 characters"]
    },
    available:{
        type: String,
        required: [true, "Please add a status"],
        default: "yes"

    },
    location: {
        type: String,
        trim: true,
    },
    status:{
        type: String,
        default: "active",
        
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const DoctorModel = mongoose.model("Doctor", DoctorSchema);

export default DoctorModel;