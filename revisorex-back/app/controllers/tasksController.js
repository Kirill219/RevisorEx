import Task from "../models/task.js";
import mongoose from "mongoose";

export class Tasks {
    static async createTask(req, res) {
        try {
            const enteredTitle = {
                title: req.body.title
            };
            const existedTask = await Task.findOne(enteredTitle);
            if (existedTask) {
                return res.status(400).json({
                    message: 'Task already exists'
                });
            }
            const task = new Task({
                title: req.body.title,
                description: req.body.description,
                type: req.body.type,
                tag: req.body.tag,
                hotel: req.body.hotel,
                assignedTo: req.body.assignedTo,
                createdBy: req.userId
            })
            const createdTask = await task.save();
            res.json(createdTask);
        } catch (error) {
            console.error(error.message);
            return res.status(500).send('Failed to create task');
        }
    };

    static async addResult(req, res) {
        try {
            const taskId = {
                _id: req.params.id
            }
            const updatedFields = {
                result: req.body.result
            };

            if (req.file) {
                updatedFields.image = req.file.filename;
            }
            await Task.updateOne(taskId, updatedFields);
            res.json({
                success: true
            });
        } catch (error) {
            console.error(error.message);
            return res.status(500).send('Failed to get task');
        }
    };

    static async getTasks(req, res) {
        try {
            const filters = req.query;
            const tasks = await Task.find(filters).populate('hotel').populate('assignedTo').populate('createdBy').exec();
            res.json(tasks);
        } catch (error) {
            console.error(error.message);
            return res.status(500).send('Failed to get tasks');
        }
    };

    static async getMyTasks(req, res) {
        try {
            const filters = req.query;
            const tasks = await Task.find(filters).populate('hotel').populate('assignedTo').populate('createdBy').exec();
            const myTasks = tasks.filter(task => task.assignedTo._id.equals(new mongoose.Types.ObjectId(req.userId)) ||
                task.createdBy._id.equals(new mongoose.Types.ObjectId(req.userId))
            );
            res.json(myTasks);
        } catch (error) {
            console.error(error.message);
            return res.status(500).send('Failed to get tasks');
        }
    };

    static async getTask(req, res) {
        try {
            const task = await Task.findById(req.params.id).populate('hotel').populate('assignedTo').populate('createdBy').exec();
            res.json(task);
        } catch (error) {
            console.error(error.message);
            return res.status(500).send('Failed to get task');
        }
    };

    static async updateTask(req, res) {
        try {
            const taskId = {
                _id: req.params.id
            }
            await Task.updateOne(taskId, {
                title: req.body.title,
                description: req.body.description,
                tag: req.body.tag,
                assignedTo: req.body.assignedTo,
            });
            res.json({
                success: true
            });
        } catch (error) {
            console.error(error.message);
            return res.status(500).send('Failed to update task');
        }
    };

    static async deleteTask(req, res) {
        try {
            const taskId = {
                _id: req.params.id
            }
            await Task.deleteOne(taskId);
            res.json({
                success: true
            });
        } catch (error) {
            console.error(error.message);
            return res.status(500).send('Failed to delete task');
        }
    };
}
