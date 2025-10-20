import userMOdel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// login user

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
    const user = await userMOdel.findOne({ email });

    if (!user) {
         return res.status(404).json({ success:false , message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ success: false, message: "Invalid password" });
    }
    const token =  createToken (user._id);
    res.json({ success: true, token, message: "Logged in successfully" });
        
    } catch (error) {
        console.log(error);
         res.status(500).json({ success: false, message: "Internal server error" });
    }

}

const createToken = (id) => {
    return jwt.sign({ id },process.env.JWT_SECRET)
}

// Register user 

const registerUser = async (req, res) => {
    const { name,password,email } = req.body;
    try {
        // checking if user already exists
        const exists = await userMOdel.findOne({ email });
        if (exists) {
            return res.status(400).json({success:false, message: "User already exists" });
        }
        // validating email format and strong password

        if (!validator.isEmail(email)) {
            return res.status(400).json({success:false, message: "Invalid email format" });
            
        }
        if (password.length < 8) {
            return res.status(400).json({success:false, message: "Password must be at least 8 characters"});
        }

        // hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userMOdel({
            name : name,
            email: email,
            password: hashedPassword
        })

        const user = await newUser.save();
        const token = createToken(user._id);
        res.status(201).json({success:true, message: "User created successfully", token: token });

    } catch (error) {
         console.error(error);
         res.status(500).json({success:false, message: "Internal server error" });
    }
}


export {loginUser , registerUser };