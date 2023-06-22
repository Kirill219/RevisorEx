import RevisorsGroup from "../models/revisorsGroup.js";
import mongoose from "mongoose";

export class RevisorsGroups {
    static async createRevisorsGroup(req, res) {
        try {
            const enteredTitle = {
                title: req.body.title
            };
            const existedGroup = await RevisorsGroup.findOne(enteredTitle);
            if (existedGroup) {
                return res.status(400).json({ message: 'Group already exists' });
            }
            const revisorsGroup = new RevisorsGroup({
                title: req.body.title,
                mainRevisor: req.userId,
                revisors: req.body.revisors,
                tasksLists: req.body.tasksLists
            });
            const createdGroup = await revisorsGroup.save();
            res.json(createdGroup);
        } catch (error) {
            console.error(error.message);
            return res.status(500).send('Failed to create group');
        }
    };

    static async getRevisorsGroups(req, res) {
        try {
            const revisorsGroups = await RevisorsGroup.find().populate('mainRevisor').populate('revisors').populate('tasksLists').populate('comments').exec();
            const myGroups = revisorsGroups.filter(group => group.mainRevisor._id.equals(new mongoose.Types.ObjectId(req.userId)) ||
                group.revisors.some(revisor => revisor._id.equals(new mongoose.Types.ObjectId(req.userId)))
            );
            res.json(myGroups);
        } catch (error) {
            console.error(error.message);
            return res.status(500).send('Failed to get groups');
        }
    };

    static async getRevisorsGroup(req, res) {
        try {
            const group = await RevisorsGroup.findById(req.params.id).populate('mainRevisor').populate('revisors').populate('tasksLists').populate('comments').exec();
            res.json(group);
        } catch (error) {
            console.error(error.message);
            return res.status(500).send('Failed to get group');
        }
    };

    static async updateRevisorsGroup(req, res) {
        try {
            const revisorsGroupId = {
                _id: req.params.id
            };
            await RevisorsGroup.updateOne(revisorsGroupId, {
                title: req.body.title,
                revisors: req.body.revisors,
                tasksLists: req.body.tasksLists
            });
            res.json({
                success: true
            });
        } catch (error) {
            console.error(error.message);
            return res.status(500).send('Failed to update group');
        }
    };

    static async deleteRevisorsGroup(req, res) {
        try {
            const revisorsGroupId = {
                _id: req.params.id
            };
            await RevisorsGroup.deleteOne(revisorsGroupId);
            res.json({
                success: true
            });
        } catch (error) {
            console.error(error.message);
            return res.status(500).send('Failed to delete group');
        }
    };
}
