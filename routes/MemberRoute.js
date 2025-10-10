import { Router } from "express";

    import { addMember, deleteMember, getMembers } from "../controllers/MemberController.js";

const memberRouter = Router();

memberRouter.post("/add", addMember);
memberRouter.post("/get", getMembers);
memberRouter.post("/delete", deleteMember);
// memberRouter.post("/getbyid", getMemberById);
// memberRouter.post("/update", updateMember);

export default memberRouter;