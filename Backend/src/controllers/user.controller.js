
import { user } from "../models/user.model.js";

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
        eamil:email.toLowerCase()});
     }
    }
}