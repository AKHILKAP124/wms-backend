import Task from "../models/TaskModel.js";


const createTask = async (req, res) => {
    try {
        const { owner, name, description, status, type, priority, dueDate, estimatedTime } = req.body;
        
        console.log("Creating task with data:", req.body);
        if (!owner || !name ) {
            return res.status(400).json({ message: "name is required" });
        }
        const task = new Task({
            owner,
            name,
            description,
            status,
            type,
            priority,
            dueDate,
            estimatedTime
        });
        await task.save();
        
        res.status(201).json({ message: "Task added successfully", task });
    } catch (error) {
        console.error("Error adding task:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getTasks = async (req, res) => {
    try {
        const { owner } = req.body;
        if (!owner) {
            return res.status(400).json({ message: "Owner ID is required" });
        }
        const tasks = await Task.find({ owner: owner });
        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ message: "No tasks found" });
        }
        res.status(200).json({ tasks });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getTaskById = async (req, res) => {
    try {
        const { taskId } = req.body;
        if (!taskId) {
            return res.status(400).json({ message: "Task ID is required" });
        }
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ message: "Task fetched successfully", task });
    } catch (error) {
        console.error("Error fetching task:", error);
        res.status(500).json({ message: "Server error" });
    }
};


const updateTask = async (req, res) => {
    try {
        var { id, name, description, status, type, priority, dueDate, estimatedTime } = req.body;
        if (!id ) {
            return res.status(400).json({ message: "Task ID is required" });
        }
        if (name==="") { name = await Task.findById(id ).then((task) => task.name); }
        if (description === "") { description = await Task.findById(id).then((task) => task.description); }
        if (status === "") { status = await Task.findById(id).then((task) => task.status); }
        if (type === "") { type = await Task.findById(id).then((task) => task.type); }
        if (priority === "") { priority = await Task.findById(id).then((task) => task.priority); }
        if (dueDate === "") { dueDate = await Task.findById(id).then((task) => task.dueDate); }
        if (estimatedTime === "") { estimatedTime = await Task.findById(id).then((task) => task.estimatedTime); }
        
        const task = await Task.findByIdAndUpdate(id, { name, description, status, type, priority, dueDate, estimatedTime }, { new: true });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ message: "Task updated successfully", task });
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.body;
        if (!taskId) {
            return res.status(400).json({ message: "Task ID is required" });
        }
        const task = await Task.findByIdAndDelete(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export { createTask , getTasks, deleteTask, getTaskById, updateTask };