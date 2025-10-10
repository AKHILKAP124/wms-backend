import Router from "express";
import SendEmail from "../utils/Otp-email.js";

const emailRouter = Router();


emailRouter.post("/send-otp", SendEmail);

export default emailRouter;