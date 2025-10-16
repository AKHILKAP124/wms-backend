import mongoose from "mongoose";
import Workspace from "../models/WorkspaceModel.js";

const getWorkspaceById = async (req, res) => {
    const { sId } = req.params;
    try {
        if (!sId) {
            return res.status(400).json({ message: "Workspace ID is required" });
        }
        const workspace = await Workspace.aggregate([
          {
            $match: { _id: new mongoose.Types.ObjectId(sId) }, // ← Filter by workspace ID
          },
          {
            $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "workspace",
              as: "owner",
            },
          },
          {
            // Populate workspace-level tasks
            $lookup: {
              from: "tasks",
              localField: "tasks",
              foreignField: "_id",
              as: "tasks",
            },
          },
          {
            // Populate projects for the workspace
            $lookup: {
              from: "projects",
              localField: "projects",
              foreignField: "_id",
              as: "projects",
            },
          },
          {
            // Populate each project's tasks
            $lookup: {
              from: "projecttasks",
              let: { projectIds: "$projects._id" },
              pipeline: [
                { $match: { $expr: { $in: ["$project_id", "$$projectIds"] } } },
              ],
              as: "projectTasks",
            },
          },
          {
            // Merge projectTasks into each project
            $addFields: {
              projects: {
                $map: {
                  input: "$projects",
                  as: "proj",
                  in: {
                    $mergeObjects: [
                      "$$proj",
                      {
                        tasks: {
                          $filter: {
                            input: "$projectTasks",
                            as: "t",
                            cond: { $eq: ["$$t.project_id", "$$proj._id"] },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
          {
            $project: {
              projectTasks: 0, // remove temp field
            },
          },
        ]);

        if (!workspace || workspace.length === 0) {
            return res.status(404).json({ message: "Workspace not found" });
        }
        
        res.status(200).json(workspace[0]);
    } catch (err) {
        res.status(400).json(err);
    }
};

export { getWorkspaceById };