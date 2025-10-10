import { Router } from "express";

import { addProjectTask, deleteProjectTask, getProjectTaskById, getProjectTasks, updateProjectTask } from "../controllers/ProjectTaskController.js";

const projectTaskRouter = Router();

projectTaskRouter.post("/add", addProjectTask);
projectTaskRouter.post("/get", getProjectTasks);
projectTaskRouter.post("/update", updateProjectTask);
projectTaskRouter.post("/getbyid", getProjectTaskById);
projectTaskRouter.post("/delete", deleteProjectTask);

export default projectTaskRouter;