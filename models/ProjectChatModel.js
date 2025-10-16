import mongoose, { Schema } from "mongoose";

const projectChatSchema = new Schema({
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    sender_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    attachments: {
        type: String,
    },
    createdAt: {
        type: String,
    },
});

const ProjectChat = mongoose.model("ProjectChat", projectChatSchema);
export default ProjectChat;