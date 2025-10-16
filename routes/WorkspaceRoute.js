import { Router } from "express";

import { getWorkspaceById } from "../controllers/WorkspaceController.js";


const workspaceRouter = Router();

workspaceRouter.post("/get/:sId", getWorkspaceById);

export default workspaceRouter;