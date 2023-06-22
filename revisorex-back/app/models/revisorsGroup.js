import mongoose from 'mongoose';
import User from "./user.js";
import Comment from "./comment.js";
import TasksList from "./tasksList.js";

const RevisorsGroupSchema = mongoose.Schema({
    title: {type: String, required: true},
    mainRevisor: {type: mongoose.Schema.Types.ObjectId, ref: User, required: true},
    revisors: [{type: mongoose.Schema.Types.ObjectId, ref: User, required: true}],
    tasksLists: [{type: mongoose.Schema.Types.ObjectId, ref: TasksList, required: true}],
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: Comment, required: true}]
}, {timestamps: true}
);

export default mongoose.model('RevisorsGroup', RevisorsGroupSchema);
