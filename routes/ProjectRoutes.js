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

const projectRouter = Router();

projectRouter.post("/add", addProject);
projectRouter.post("/addmember", addMemberToProject);
projectRouter.post("/removemember", removeMemberFromProject);
projectRouter.post(
  "/deletememberfromallprojectsofspecificuser",
  deleteMemberFromProjectOfspecificUser
);
projectRouter.put("/update", updateProject);
projectRouter.post("/delete", deleteProject);
projectRouter.post("/getbyid", getProjectById);
projectRouter.post("/getuserallprojects", getAllUserProjects);
projectRouter.post("/getprojectmanager", getProjectManager);

export default projectRouter;
