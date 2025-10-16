import mongoose from "mongoose";

const projectTaskSchema = new mongoose.Schema({
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    assigned_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    assigned_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ["New task", "In progress", "Completed", "On hold"],
        default: "New task",
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High", "Urgent"],
        default: "Low",
    },
    due_date: {
        type: String,
    },
},
{
    timestamps: true,
    });

const ProjectTask = mongoose.model("ProjectTasks", projectTaskSchema);
export default ProjectTask;