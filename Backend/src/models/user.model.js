// mongoose helps us define the structure of documents in MongoDB
// Schema is a blueprint that tells Mongoose what fields our documents should have
import mongoose, { Schema } from "mongoose";

// bcrypt is a library used to securely hash passwords before storing them
// Never store plain-text passwords in the database!
import bcrypt from "bcrypt";

// Define the shape of a "User" document in MongoDB.
// Each property here becomes a field in the database.
const userSchema = new Schema({

    // The user's unique display name
    username: {
        type: String,
        required: true,       // this field must be provided
        unique: true,         // no two users can share the same username
        lowercase: true,      // automatically convert to lowercase before saving
        trim: true,           // remove leading/trailing whitespace
        minLength: [4, "Username must be at least 4 characters long"],
        maxLength: [30, "Username must be at most 30 characters long"]
    },

    // The user's email address (used for login and identification)
    email: {
        type: String,
        required: true,
        unique: true,         // each email can only be registered once
        lowercase: true,
        trim: true
    },

    // The user's password (will be hashed before saving — see pre-save hook below)
    password: {
        type: String,
        required: true,
        minLength: [4, "Password must be at least 8 characters long"]
    },

    // Tracks whether the user is currently logged in
    loggedIn: {
        type: Boolean,
        default: false
    }

    // { timestamps: true } automatically adds createdAt and updatedAt fields
}, { timestamps: true });


// --- PRE-SAVE HOOK ---
// This runs automatically BEFORE a user document is saved to the database.
// Its job is to hash the password so we never store it in plain text.
userSchema.pre("save", async function (next) {
    // If the password field was NOT changed (e.g. only email was updated),
    // skip hashing and move on — no need to re-hash an already hashed password.
    if (!this.isModified("password")) return next();

    // Hash the password using bcrypt with a "salt rounds" value of 10.
    // Higher salt rounds = more secure but slower. 10 is a safe standard.
    this.password = await bcrypt.hash(this.password, 10);

    next(); // continue saving the document
});


// --- INSTANCE METHOD: comparePassword ---
// This is a custom method we attach to every User document.
// It lets us safely check if a plain-text password matches the hashed one in the DB.
// Usage: const isMatch = await user.comparePassword("enteredPassword")
userSchema.methods.comparePassword = async function (password) {
    // bcrypt.compare hashes the entered password and compares it to the stored hash.
    // Returns true if they match, false otherwise.
    return await bcrypt.compare(password, this.password);
};


// Create the "User" model from the schema and export it.
// Mongoose will map this to a "users" collection in MongoDB (auto-pluralized).
export const User = mongoose.model("User", userSchema);