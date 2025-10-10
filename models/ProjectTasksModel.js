import mongoose from "mongoose";

const projectTaskSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        default: "New task",
    },
    type: {
        type: String,
        default: "Operational",
    },
    priority: {
        type: String,
        default: "Low",
    },
    dueDate: {
        type: String,
    },
    estimatedTime: {
        type: String,
        default: "0s",
    },
    assignedTo: {
        type: Object,
        default: {},
    },
},
{
    timestamps: true,
    });

export default mongoose.model("ProjectTask", projectTaskSchema);