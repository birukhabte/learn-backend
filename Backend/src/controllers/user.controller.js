
import { User } from "../models/user.model.js";

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        //basic validation 

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are important"
            })
        }
        // check if user exists already

        const existing = await User.findOne({
            email: email.toLowerCase()
        });
        if (existing) {
            return res.status(400).json({
                message: "User already exists"
            });
        }
        // create user

        const user = await User.create({
            username,
            email: email.toLowerCase(),
            password,
            loggedIn: false
        })
        return res.status(201).json({
            message: "User registered successfully",
            user: { id: user._id, email: user.email, username: user.username }
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })

    }

}

const loginUser = async (req, res) => {
    try {
        //check if the user already exists
        const { email, password } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });
        email: email.toLowerCase()

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        if (user.password !== password) {
            return res.status(401).json({
                message: "Invalid password"
            })
        }
        user.loggedIn = true;
        await user.save();
        return res.status(200).json({
            message: "User logged in successfully",
            user: { id: user._id, email: user.email, username: user.username }
        })
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export {
    registerUser
}
