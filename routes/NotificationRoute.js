import express from "express";
import { deleteNotification, getNotifications, newNotification } from "../controllers/NotificationController.js";

const notificationRouter = express.Router();

notificationRouter.post("/get", getNotifications);
notificationRouter.post("/new", newNotification);
notificationRouter.post("/delete", deleteNotification);

export default notificationRouter;