import Hotel from "../models/hotel.js";
import {generateAttributes} from "../shared/generateAttributes.js";

export class Hotels {
    static async createHotel(req, res) {
        try {
            const enteredTitle = {
                title: req.body.title
            };
            const existedHotel = await Hotel.findOne(enteredTitle);
            if (existedHotel) {
                return res.status(400).json({
                    message: 'Hotel is already added'
                });
            }
            const hotel = new Hotel({
                title: req.body.title,
                city: req.body.city,
                region: req.body.region,
                code: generateAttributes.generateCode(req.body.title, req.body.city, req.body.region)
            });
            const addedHotel = await hotel.save();
            res.json(addedHotel);
        } catch (error) {
            console.error(error.message);
            return res.status(500).send('Failed to add hotel');
        }
    };

    static async getHotels(req, res) {
        try {
            const filters = req.query;
            const hotels = await Hotel.find(filters);
            res.json(hotels);
        } catch (error) {
            console.error(error.message);
            return res.status(500).send('Failed to get hotels');
        }
    };

    static async deleteHotel(req, res) {
        try {
            const hotelId = {
                _id: req.body.id
            };
            await Hotel.deleteOne(hotelId);
            res.json({
                success: true
            });
        } catch (error) {
            console.error(error.message);
            return res.status(500).send('Failed to delete hotel');
        }
    };
}
