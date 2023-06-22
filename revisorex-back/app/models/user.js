import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
    fullName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, required: true},
    company: {type: String, required: true},
    initials: {type: String, required: true, unique: true}
}, {
    timestamps: true
});

export default mongoose.model('User', UserSchema);
