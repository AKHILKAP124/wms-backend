import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
        enum: ["New task", "In progress", "Completed", "On hold"],
        default: "New task",
    },
    type: {
        type: String,
        enum: ["Operational", "Technical", "Strategic", "Financial"],
        default: "Operational",
    },
    estimatedTime: {
        type: String,
        default: "0s",
    },
    dueDate: {
        type: Date,
    },
    priority: {
        type: String,
        enum: ["Lowest", "Low", "Medium", "High", "Urgent", "None"],
        default: "None"
    },
},
{
    timestamps: true,
});

export default mongoose.model("Task", taskSchema);
