import { Router } from "express";
import { createTask, getTasks, deleteTask , getTaskById, updateTask } from "../controllers/TaskController.js";
  

const taskRouter = Router();

taskRouter.post("/create", createTask);
taskRouter.post("/get", getTasks);
taskRouter.post("/delete", deleteTask);
taskRouter.post("/getbyid", getTaskById);
taskRouter.post("/update", updateTask);

export default taskRouter;
