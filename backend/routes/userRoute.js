import express from 'express';
import { loginUser, registerUser, getProfile, updateProfile, changePassword } from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/get-profile", authMiddleware, getProfile);
userRouter.post("/get-profile", authMiddleware, getProfile);
userRouter.post("/update-profile", authMiddleware, updateProfile);
userRouter.post("/change-password", authMiddleware, changePassword);

export default userRouter;