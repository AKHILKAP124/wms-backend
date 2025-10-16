import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    attachments: {
        type: String,
    },
        created_at: {
            type: String,
        },
});

export default mongoose.model("Message", messageSchema);