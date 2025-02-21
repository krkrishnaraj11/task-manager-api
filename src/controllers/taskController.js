const Task = require("../models/Task");

//Create a new Task
exports.createTask = async(req, res) => {
    try{
        const {title, description } = req.body;
        const task = new Task({ title, description, user: req.userId });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

//Get all tasks for the logged-in user
exports.getTasks = async (req, res) => {
    try{
        const tasks = await Task.find({ user: req.userId });
        res.json(tasks);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

//Get a specific Task
exports.getTask = async (req, res) => {
    try{
        const task = await Task.findOne({ _id: req.params.id, user: req.userId });
        if(!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

//Update a task
exports.updateTask = async (req, res) => {
    try{
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            req.body,
            { new: true }
        );
        if(!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json({
            _id: task._id,
            description: task.description,
            completed: task.completed,
            message:"Task updated successfully"
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: res.message });
    }
};

//Delete a Task
exports.deleteTask = async ( req, res ) => {
    try{
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        });
        if(!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json({ message: "Task deleted successfully" });
    }
    catch (err) {
        console.error("Error deleting task:", error); // Log the error for debugging
        res.status(500).json({ error: "Internal server error" }); // Send a 500 error to the client
    }
}