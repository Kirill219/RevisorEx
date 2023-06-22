import mongoose from 'mongoose';

const HotelSchema = mongoose.Schema({
    title: {type: String, required: true},
    city: {type: String, required: true},
    region: {type: String, required: true},
    code: {type: String, required: true}
});

export default mongoose.model('Hotel', HotelSchema);
