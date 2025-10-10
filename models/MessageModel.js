import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
        createdAt: {
            type: String,
        },
});

export default mongoose.model("Message", messageSchema);