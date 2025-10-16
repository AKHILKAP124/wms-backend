import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["manager", "employee", "user", "admin"],
      default: "user",
    },
    workspace: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    accountType: {
      type: String,
      enum: ["personal", "organizational"],
      default: "personal",
    },
    refreshToken: {
      type: String,
      default: "",
    },
    accessToken: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: "",
    },
    workspace: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
      },
  },
  {
    timestamps: true,
  }
);

// Compare password
userSchema.methods.comparePassword = async function (password) {
  const res = await bcrypt.compare(password, this.password);
  return res;
};
// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
