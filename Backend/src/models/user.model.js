import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        minLength: [4, "Username must be at least 4 characters long"],
        maxLength: [30, "Username must be at most 30 characters long"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minLength: [4, "Password must be at least 8 characters long"],
        maxLength: [30, "Password must be at most 30 characters long"]
    }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);