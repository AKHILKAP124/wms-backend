import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    owner: {
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
    estimatedTime: {
        type: String,
        default: "0s",
    },
    dueDate: {
        type: Date,
        default: null,

    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High", "Urgent"],
        default: "Low"
    },
},
{
    timestamps: true,
});

const Task = mongoose.model("Task", taskSchema);
export default Task;
