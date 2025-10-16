import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import SendEmailOtp from "../utils/Otp-email.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/generateTokens.js";
import Task from "../models/TaskModel.js";
import ProjectTask from "../models/ProjectTaskModel.js";
import Project from "../models/ProjectModel.js";

const verifyEmailIsExistingOrNot = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }
    return res.status(200).json({ message: "Email does not exist" });
  } catch (error) {
    console.error("Error verifying email:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const sendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    const otp = Math.floor(100000 + Math.random() * 900000);

    const response = await SendEmailOtp(email, otp);

    console.log(response, "otp send response");
    if (!response) {
      return res.status(400).json({ message: "Error sending email" });
    }

    user.otp = `${otp}`;
    await user.save();
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const verifyUserEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.otp === otp) {
      user.isVerified = true;
      return res.status(200).json({ message: "Email verified successfully", user });
    } else {
      return res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying email:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const createDefaults = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create default workspace
    const defaultWorkspace = {
      name: "My Workspace",
      owner: user?._id,
      type: "workspace",
    };
    const workspace = await Workspace.create(defaultWorkspace);

    // Create default user task
    const defaultUserTask = {
      owner: user?._id,
      title: "✨ Explore your workspace",
      description:
        "This is your personal task. Try completing it, adding a due date, or creating new tasks to keep track of your work.",
      createdBy: user?._id,
      assignedTo: "",
      status: "New task", // "New task" | "In-progress" | "Completed" | "On hold"
      priority: "High", // "Low" | "Medium" | "High" | "Urgent"
      dueDate: null,
    };
    const task = await Task.create(defaultUserTask);

    // Create default project
    const defaultProject = {
      name: "🚀 Getting Started Workspace",
      description:
        "This is your personal workspace where you can organize ideas, tasks, and goals. Create more projects as your work grows!",
      owner: user?._id,
    };
    const project = await Project.create(defaultProject);

    // Create default project task
    const defaultProjectTask = {
      project_id: project?._id,
      title: "🎯 Set up your first milestone",
      description:
        "Welcome aboard! This is your first task. Try editing its title, adding details, or marking it complete to learn how everything works.",
      assigned_by: user?._id,
      assigned_to: user?._id,
      priority: "Medium", // "Low" | "Medium" | "High" | "Urgent"
      status: "New task", // "New task" | "In-progress" | "Completed" | "On hold"
      due_date: null,
    };
    const projectTask = await ProjectTask.create(defaultProjectTask);

    project?.tasks.push(projectTask._id);
    await project.save();

    workspace?.tasks.push(task._id);
    workspace?.projects.push(project._id);
    await workspace.save();

    user.workspace = workspace._id;
    await user.save();

    return res
      .status(201)
      .json({
        message: "Workspace created successfully",
        user,
        createdWorkspace: {
          workspace: workspace,
          createdTask: task,
          createdProject: project,
          createdProjectTask: projectTask,
        },
      });
  } catch (error) {
    console.error("Error creating Workspace:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, accountType } = req.body;

    if (!firstName || !lastName || !email || !password || !accountType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      accountType,
    });
    await newUser.save();

    const user = await User.findOne({ email });

    const payload = { id: user._id };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("wms_rf_tkn_v1", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res
      .status(201)
      .json({ message: "User registered successfully", user, accessToken });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const payload = { id: user._id };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.accessToken = String(accessToken);
    user.refreshToken = String(refreshToken);

    await user.save();

    res.cookie("wms_rf_tkn_v1", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res
      .status(200)
      .json({ message: "User logged in successfully", user, accessToken });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error logging out user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getMe = async (req, res) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  
    const me = await User.findById(req.user.id).select("-password");

    return res.status(200).json({ message: "User found", me });

  } catch (error) {
    console.error("Error getting user:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

// generate new access token

const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.wms_rf_tkn_v1;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = await verifyRefreshToken(token);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const accessToken = generateAccessToken(user);

    user.accessToken = accessToken;

    await user.save();

    res.cookie("refreshToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    return res
      .status(200)
      .json({ message: "Token refreshed successfully", accessToken });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



const changePassword = async (req, res) => {
  try {
    const user = req.user;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (oldPassword === newPassword) {
      return res
        .status(400)
        .json({
          message: "New password cannot be the same as the old password",
        });
    }

    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export {
  verifyEmailIsExistingOrNot,
  sendEmailOtp,
  verifyUserEmailOtp,
  createDefaults,
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  forgetPassword,
  getMe,
  changePassword,
};
