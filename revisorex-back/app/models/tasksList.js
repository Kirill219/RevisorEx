import mongoose from 'mongoose';
import User from "./user.js";
import Task from "./task.js";

const TasksListSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    priority: {type: String, required: true},
    tasks: [{type: mongoose.Schema.Types.ObjectId, ref: Task, required: true}],
    mainRevisor: {type: mongoose.Schema.Types.ObjectId, ref: User, required: true}
}, {
    timestamps: true
});

export default mongoose.model('TasksList', TasksListSchema);
