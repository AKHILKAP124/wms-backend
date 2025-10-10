import { Router } from 'express';
import { LoginUser, logoutUser, RegisterUser, updateProfile, getUser, getAllUsers, getUserById, changePassword, resetPassword } from '../controllers/UserController.js';

const userRouter = Router();

userRouter.post("/signup", RegisterUser);
userRouter.post("/signin", LoginUser);
userRouter.post("/change-password", changePassword);
userRouter.post("/reset-password", resetPassword);
userRouter.get("/logout", logoutUser);  
userRouter.post("/getUser", getUser);
userRouter.put("/update", updateProfile);
userRouter.get("/getallusers", getAllUsers);
userRouter.post("/getbyid", getUserById);

export default userRouter;
