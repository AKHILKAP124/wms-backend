import { Router } from 'express';
import { updateProfile, getAllUsers, getUserById } from '../controllers/UserController.js';
import { protect } from '../middleware/auth.js';

const userRouter = Router();

// protected middleware
userRouter.use(protect);

userRouter.put("/update", updateProfile);
userRouter.get("/getallusers", getAllUsers);
userRouter.post("/getbyid", getUserById);

export default userRouter;
