import mongoose from 'mongoose';

const TagSchema = mongoose.Schema({
    title: {type: String, required: true},
});

export default mongoose.model('Tag', TagSchema);
