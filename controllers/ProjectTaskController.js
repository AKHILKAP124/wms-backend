import ProjectTask from "../models/ProjectTasksModel.js";

const addProjectTask = async (req, res) => {

    try {

        const { ownerId, projectId, name, description, status, type, priority, dueDate, estimatedTime, assignedTo } = req.body;

        if (!ownerId || !projectId || !name ) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingTask = await ProjectTask.findOne({ name });
        if (existingTask) {
            return res.status(400).json({ message: "Task already exists" });
        }

        const task = new ProjectTask({
            ownerId,
            projectId,
            name,
            description,
            status,
            type, 
            priority,
            dueDate,
            estimatedTime,
            assignedTo
        });
        await task.save();
        res.status(200).json({ message: "Task added successfully", task });

        
    } catch (error) {
        console.error("Error adding task:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const updateProjectTask = async (req, res) => {
    try {
        var { id, name, description, status, type, priority, dueDate, estimatedTime } = req.body;

        if (!id ) {
            return res.status(400).json({ message: "Task ID is required" });
        }
        if (name==="") { name = await ProjectTask.findById(id ).then((task) => task.name); }
        if (description === "") { description = await ProjectTask.findById(id).then((task) => task.description); }
        if (status === "") { status = await ProjectTask.findById(id).then((task) => task.status); }
        if (type === "") { type = await ProjectTask.findById(id).then((task) => task.type); }
        if (priority === "") { priority = await ProjectTask.findById(id).then((task) => task.priority); }
        if (dueDate === "") { dueDate = await ProjectTask.findById(id).then((task) => task.dueDate); }
        if (estimatedTime === "") { estimatedTime = await ProjectTask.findById(id).then((task) => task.estimatedTime); }    

        
        const task = await ProjectTask.findByIdAndUpdate(id, { name, description, status, type, priority, dueDate, estimatedTime }, { new: true });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ message: "Task updated successfully", task });
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteProjectTask = async (req, res) => {
    try {
        const { taskId } = req.body;
        if (!taskId) {
            return res.status(400).json({ message: "Task ID is required" });
        }
        await ProjectTask.findByIdAndDelete(taskId);
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const getProjectTasks = async (req, res) => {
    try {
        const { projectId } = req.body;
        if (!projectId) {
            return res.status(400).json({ message: "Project ID is required" });
        }
        const tasks = await ProjectTask.find({  projectId }).populate('ownerId');
        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ message: "No tasks found" });
        }
        res.status(200).json({message: "Project Task fetched successfully", tasks });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const getProjectTaskById = async (req, res) => {
    try {
        const { taskId } = req.body;
        if (!taskId) {
            return res.status(400).json({ message: "Task ID is required" });
        }
        const task = await ProjectTask.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ message: "Task fetched successfully", task });
    } catch (error) {
        console.error("Error fetching task:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export { addProjectTask, deleteProjectTask, getProjectTasks, getProjectTaskById, updateProjectTask };
