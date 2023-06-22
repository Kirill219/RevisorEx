import TasksList from "../models/tasksList.js";

export class TasksLists {
    static async createTasksList(req, res) {
        try {
            const enteredTitle = {
                title: req.body.title
            };
            const existedTaskList = await TasksList.findOne(enteredTitle);
            if (existedTaskList) {
                return res.status(400).json({
                    message: 'Tasks list already exists'
                });
            }
            const taskList = new TasksList({
                title: req.body.title,
                description: req.body.description,
                priority: req.body.priority,
                tasks: req.body.tasks,
                mainRevisor: req.userId
            })
            const createdTaskList = await taskList.save();
            res.json(createdTaskList);
        } catch (error) {
            console.error(error.message);
            return res.status(500).send('Failed to create tasks list');
        }
    };

    static async getTasksLists(req, res) {
        try {
            const filters = req.query;
            const tasksLists = await TasksList.find(filters).populate('tasks').populate('mainRevisor').exec();
            res.json(tasksLists);
        } catch (error) {
            console.error(error.message);
            return res.status(500).send('Failed to get tasks lists');
        }
    };

    static async getTasksList(req, res) {
        try {
            const taskList = await TasksList.findById(req.params.id).populate('tasks').populate('mainRevisor').exec();
            res.json(taskList);
        } catch (error) {
            console.error(error.message);
            return res.status(500).send('Failed to get tasks list');
        }
    };

    static async updateTasksList(req, res) {
        try {
            const taskListId = {
                _id: req.params.id
            }
            await TasksList.updateOne(taskListId, {
                title: req.body.title,
                description: req.body.description,
                priority: req.body.priority,
                tasks: req.body.tasks
            });
            res.json({
                success: true
            });
        } catch (error) {
            console.error(error.message);
            return res.status(500).send('Failed to update tasks list');
        }
    };

    static async deleteTasksList(req, res) {
        try {
            const taskListId = {
                _id: req.params.id
            }
            await TasksList.deleteOne(taskListId);
            res.json({
                success: true
            });
        } catch (error) {
            console.error(error.message);
            return res.status(500).send('Failed to delete tasks list');
        }
    };
}
