import { Router } from "express";

import {
  addMemberToProject,
  addProject,
  deleteMemberFromProjectOfspecificUser,
  deleteProject,
  getAllUserProjects,
  getProjectById,
  getProjectManager,
  removeMemberFromProject,
  updateProject,
} from "../controllers/ProjectController.js";
import { protect } from "../middleware/auth.js";

const projectRouter = Router();

projectRouter.use(protect);

projectRouter.post("/add", addProject);
projectRouter.post("/addmember", addMemberToProject);
projectRouter.post("/removemember", removeMemberFromProject);
projectRouter.post(
  "/deletememberfromallprojectsofspecificuser",
  deleteMemberFromProjectOfspecificUser
);
projectRouter.put("/update", updateProject);
projectRouter.post("/delete/:projectId", deleteProject);
projectRouter.post("/get/:projectId", getProjectById);
projectRouter.post("/get", getAllUserProjects);
projectRouter.post("/getprojectmanager", getProjectManager);

export default projectRouter;
