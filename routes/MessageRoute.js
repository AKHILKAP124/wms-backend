import express from "express";
import { clearProjectMessages, deleteAll, getMessages, newMessage } from "../controllers/MessageController.js";

const messageRouter = express.Router();

messageRouter.post("/new", newMessage);
messageRouter.post("/get", getMessages);
messageRouter.post("/clear", clearProjectMessages);
messageRouter.get("/delete", deleteAll);

export default messageRouter;

