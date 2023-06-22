import mongoose from 'mongoose';
import User from "./user.js";
import Hotel from "./hotel.js";

const TaskSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    type: {type: String, required: true},
    result: {type: String},
    image: { type: String },
    tag: {type: String},
    hotel: {type: mongoose.Schema.Types.ObjectId, ref: Hotel, required: true},
    assignedTo: {type: mongoose.Schema.Types.ObjectId, ref: User, required: true},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: User, required: true}
}, {
    timestamps: true
});

export default mongoose.model('Task', TaskSchema);
