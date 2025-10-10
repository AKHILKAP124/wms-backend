import Project from "../models/ProjectModel.js";
import User from "../models/UserModel.js";

const addProject = async (req, res) => {
  try {
    const { name, owner, members } = req.body;

    if (!name || !owner || !members) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingProject = await Project.findOne({ name });
    if (existingProject) {
      return res.status(400).json({ message: "Project already exists" });
    }

    if (members.length === 0) {
      return res.status(400).json({ message: "Members are required" });
    }

    if (members.length > 5) {
      return res.status(400).json({ message: "Maximum of 5 members allowed" });
    }

    if (members.includes(owner)) {
      return res.status(400).json({ message: "Owner cannot be a member" });
    }

    for (const member of members) {
      const existingMember = await User.findOne({ _id: member });
      if (!existingMember) {
        return res.status(400).json({ message: "Member not found" });
      }
    }

    const project = new Project({
      name,
      owner,
      members,
    });
    await project.save();
    res.status(200).json({ message: "Project added successfully", project });
  } catch (error) {
    console.error("Error adding project:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const addMemberToProject = async (req, res) => {
  try {
    const { projectId, members } = req.body;
    if (!projectId || !members || members.length === 0) {
      return res
        .status(400)
        .json({ message: "Project ID and members are required" });
    }
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (project.members.length >= 5) {
      return res
        .status(400)
        .json({ message: "Project already has maximum members " });
    }
    for (const member of members) {
      const existingMember = await User.findById(member);
      if (!existingMember) {
        return res
          .status(400)
          .json({ message: `Member with ID ${member} not found` });
      }
      if (project.members.includes(member)) {
        return res.status(400).json({
          message: `Member with ID ${member} already exists in the project`,
        });
      }
    }
    project.members.push(...members);
    await project.save();

    res
      .status(200)
      .json({ message: "Member added to project successfully", project });
  } catch (error) {
    console.error("Error adding member to project:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const removeMemberFromProject = async (req, res) => {
  try {
    const { projectId, memberId } = req.body;

    if (!projectId || !memberId) {
      return res
        .status(400)
        .json({ message: "Project ID and Member ID are required" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!project.members.includes(memberId)) {
      return res
        .status(400)
        .json({ message: "Member not found in the project" });
    }

    if (project.owner.toString() === memberId) {
      return res
        .status(400)
        .json({ message: "Owner cannot be removed from the project" });
    }

    project.members = project.members.filter(
      (member) => member.toString() !== memberId
    );
    await project.save();

    res
      .status(200)
      .json({ message: "Member removed from project successfully", project });
  } catch (error) {
    console.error("Error removing member from project:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteMemberFromProjectOfspecificUser = async (req, res) => {
  try {
    const { userId, memberId } = req.body;
    if (!userId || !memberId) {
      return res
        .status(400)
        .json({ message: "Project ID and Member ID are required" });
    }

    const userProjects = await Project.find({ owner: userId });
    if (!userProjects) {
      return res.status(404).json({ message: "Project not found" });
    }

    const userUpdatedProjects = await Promise.all(
      userProjects.map(async (project) => {
        if (project.members.includes(memberId)) {
          project.members = project.members.filter(
            (member) => member.toString() !== memberId
          );
          return await project.save();
        }
        return project;
      })
    );

    const memberProjects = await Project.find({ owner: memberId });
    if (!memberProjects) {
      return res
        .status(404)
        .json({ message: "Member not found in any project" });
    }

    const memberUpdatedProjects = await Promise.all(
      memberProjects.map(async (project) => {
        if (project.members.includes(userId)) {
          project.members = project.members.filter(
            (member) => member.toString() !== userId
          );
          return await project.save();
        }
        return project;
      })
    );

    res.status(200).json({
      message: "Member removed from project successfully",
      UserProjects: userUpdatedProjects,
      Memberprojects: memberUpdatedProjects,
    });
  } catch (error) {
    console.error("Error removing member from project:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.body;
    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }
    await Project.findByIdAndDelete({ _id: projectId });
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id, name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Project ID is required" });
    }
    const project = await Project.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project updated successfully", project });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllUserProjects = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const projects = await Project.find({
      $or: [{ owner: id }, { members: id }],
    })
      .populate("owner")
      .populate("members");
    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: "No projects found" });
    }
    res.status(200).json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.body;
    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }
    const project = await Project.findById(projectId)
      .populate("owner")
      .populate("members");
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ project });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getProjectManager = async (req, res) => {
  try {
    const { projectId } = req.body;
    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }
    const project = await Project.findById(projectId).populate("owner");
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ projectManager: project.owner });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  addProject,
  addMemberToProject,
  removeMemberFromProject,
  deleteMemberFromProjectOfspecificUser,
  deleteProject,
  getAllUserProjects,
  getProjectById,
  updateProject,
  getProjectManager,
};
