import { Router } from "express";
import {
    verifyEmailIsExistingOrNot,
    sendEmailOtp,
    verifyUserEmailOtp,
    createDefaults,
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    forgetPassword,
    changePassword,
    getMe
} from "../controllers/AuthController.js";
import { protect } from "../middleware/auth.js";

const authRouter = Router();

// Register
authRouter.post("/verify-email", verifyEmailIsExistingOrNot);
authRouter.post("/send-otp", sendEmailOtp);
authRouter.post("/verify-otp", verifyUserEmailOtp);
authRouter.post("/register", registerUser);

// Login
authRouter.post("/login", loginUser);

// Logout
authRouter.post("/logout", logoutUser);

// Create Default Workspace
authRouter.post("/create-default-workspace", createDefaults);

// Refresh Access token
authRouter.post("/refresh-token", refreshAccessToken);

// Forget Password
authRouter.post("/forget-password", forgetPassword);

// Protected routes
authRouter.use(protect);

// Get me
authRouter.get("/me", getMe);

// Change password
authRouter.post("/change-password", changePassword);



export default authRouter;