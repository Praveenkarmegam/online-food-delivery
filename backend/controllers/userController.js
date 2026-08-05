import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";

//create token
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET);
}

//login user
const loginUser = async (req,res) => {
    const {email, password} = req.body;
    try{
        const user = await userModel.findOne({email})

        if(!user){
            return res.json({success:false,message: "User does not exist"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.json({success:false,message: "Invalid credentials"})
        }

        const token = createToken(user._id)
        res.json({success:true,token})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//register user
const registerUser = async (req,res) => {
    const {name, email, password} = req.body;
    try{
        //check if user already exists
        const exists = await userModel.findOne({email})
        if(exists){
            return res.json({success:false,message: "User already exists"})
        }

        // validating email format & strong password
        if(!validator.isEmail(email)){
            return res.json({success:false,message: "Please enter a valid email"})
        }
        if(password.length<8){
            return res.json({success:false,message: "Please enter a strong password"})
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({name, email, password: hashedPassword})
        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success:true,token})

    } catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// get user profile
const getProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.body.userId).select("-password");
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        res.json({ success: true, userData: user });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching profile" });
    }
}

// update user profile
const updateProfile = async (req, res) => {
    try {
        const { name, phone, address } = req.body;
        await userModel.findByIdAndUpdate(req.body.userId, {
            name,
            phone,
            address
        });
        res.json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating profile" });
    }
}

// change password
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await userModel.findById(req.body.userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Incorrect current password" });
        }

        if (newPassword.length < 8) {
            return res.json({ success: false, message: "New password must be at least 8 characters long" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await userModel.findByIdAndUpdate(req.body.userId, { password: hashedPassword });

        res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error changing password" });
    }
}

export { loginUser, registerUser, getProfile, updateProfile, changePassword }