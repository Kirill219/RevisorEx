import mongoose from 'mongoose';
import User from "./user.js";

const CommentSchema = mongoose.Schema({
    title: {type: String, required: true},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: User, required: true}
}, {
    timestamps: true
});

export default mongoose.model('Comment', CommentSchema);
