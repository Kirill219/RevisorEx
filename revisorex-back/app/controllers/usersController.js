import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {hashUserPassword} from "../shared/hashUserPassword.js";
import {generateAttributes} from "../shared/generateAttributes.js";

export class Users {
    static async createUser(req, res) {
        try {
            const enteredEmail = {
                email: req.body.email
            };
            const existedUser = await User.findOne(enteredEmail);
            if (existedUser) {
                return res.status(400).json({
                    message: 'User already exists'
                });
            }
            const user = new User({
                fullName: `${req.body.secondName} ${req.body.firstName}`,
                email: req.body.email,
                password: await hashUserPassword(req.body.password),
                company: req.body.company,
                role: req.body.role,
                initials: generateAttributes.generateInitials(req.body.firstName, req.body.secondName)
            });
            await user.save();
            const token = jwt.sign(
                {
                    _id: user.id
                },
                'secret525'
            );
            res.json({
                user,
                token
            });
        } catch (error) {
            console.error(error.message);
            return res.status(500).send('Authorization failed');
        }
    };

    static async getCurrentUser(req, res) {
        try {
            const user = await User.findById(req.userId);
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                })
            }
            res.json(user);
        } catch (error) {
            console.log(error);
            return res.status(403).json({
                message: 'No access'
            });
        }
    };

    static async getUsers(req, res) {
        try {
            const filters = req.query;
            const users = await User.find(filters);
            res.json(users);
        } catch (error) {
            console.error(error.message);
            return res.status(500).send('Failed to get users');
        }
    };

    static async login(req, res) {
        try {
            const enteredEmail = {
                email: req.body.email
            };
            const user = await User.findOne(enteredEmail);
            if (!user) {
                return res.status(404).json({ message: 'User is not found'
                });
            }
            const isValidPass = await bcrypt.compare(req.body.password, user.password);
            if (!isValidPass) {
                return res.status(404).json({
                    message: 'Wrong password'
                });
            }
            const token = jwt.sign(
                {
                    _id: user.id
                },
                'secret525'
            );
            res.json({
                user,
                token
            });
        } catch (error) {
            console.error(error.message);
            return res.status(500).send('Authorization failed');
        }
    };

    static async updateCurrentUser(req, res) {
        try {
            const currentUserId = {
                _id: req.userId
            };
            console.log(currentUserId);
            await User.updateOne(currentUserId, {
                email: req.body.email,
                password: await hashUserPassword(req.body.password)
            });
            res.json({
                success: true
            });
        } catch (error) {
            console.error(error.message);
            return res.status(500).send('Failed to update user');
        }
    };

    static async deleteCurrentUser(req, res) {
        try {
            const currentUserId = {
                _id: req.userId
            };
            await User.deleteOne(currentUserId);
            res.json({
                success: true
            });
        } catch (error) {
            console.error(error.message);
            return res.status(500).send('Failed to delete user');
        }
    };
}
