import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    memberId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    }
},
    {
        timestamps: true
    }
)

export default mongoose.model("Member", memberSchema);