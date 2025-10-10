import Router from "express";
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
} from "../controllers/NoteController.js";

const noteRouter = Router();

noteRouter.post("/create", createNote);
noteRouter.post("/get", getNotes);
noteRouter.post("/update", updateNote);
noteRouter.post("/delete", deleteNote);

export default noteRouter;