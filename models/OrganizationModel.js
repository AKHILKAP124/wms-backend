import mongoose, { Schema } from "mongoose";

const organizationSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        businessType: {
            type: String,
            required: true,
        },
        orgSize: {
            type: String,
            required: true,
        },
        ownerRole: {
            type: String,
            required: true,
        },
        ownerPhone : {
            type: String,
            required: true,
        },
        
    },
    {
        timestamps: true,
    }
);

const Organization = mongoose.model("Organization", organizationSchema);
export default Organization;