import {body} from "express-validator";

export const loginValidator = [
    body('email', 'Please enter a valid email').isEmail(),
    body('password', 'Please enter a valid password').isLength({ min: 6 })
];

export const registrationValidator = [
    body('firstName', 'Please enter your first name').notEmpty(),
    body('secondName', 'Please enter your second name').notEmpty(),
    body('email', 'Please enter a valid email').isEmail(),
    body('company', 'Please enter a company name').notEmpty(),
    body('password', 'Please enter a password with at least 6 characters').isLength({ min: 6 }),
    body('role', 'Please choose a role').notEmpty()
];

export const userUpdateValidator = [
    body('email', 'Please enter a valid email').isEmail(),
    body('password', 'Please enter a password with at least 6 characters').isLength({ min: 6 })
];

export const hotelCreateValidator = [
    body('title', 'Please enter a title').notEmpty(),
    body('city', 'Please enter a city').notEmpty(),
    body('region', 'Please enter a region').notEmpty()
];

export const tagCreateValidator = [
    body('title', 'Please enter a title').notEmpty()
];

export const commentCreateValidator = [
    body('title', 'Please write a comment').notEmpty()
];

export const taskCreateValidator = [
    body('title', 'Please enter a title').notEmpty(),
    body('description', 'Please enter a description').notEmpty(),
    body('type', 'Please choose a type').notEmpty(),
    body('tags', 'Please add tags').optional(),
    body('hotel', 'Please choose a type').isMongoId(),
    body('assignedTo', 'Please choose a type').isMongoId()
];

export const taskUpdateValidator = [
    body('title', 'Please enter a title').notEmpty(),
    body('description', 'Please enter a description').notEmpty(),
    body('tags', 'Please add tags').optional(),
    body('assignedTo', 'Please choose a type').isMongoId()
];

export const taskAddResultValidator = [
    body('result', 'Please enter a result').notEmpty()
];

export const tasksListCreateValidator = [
    body('title', 'Please enter a title').notEmpty(),
    body('description', 'Please enter a description').notEmpty(),
    body('priority', 'Please choose a priority').notEmpty(),
    body('tasks', 'Please add tasks').isArray().notEmpty()
];

export const tasksListUpdateValidator = [
    body('title', 'Please enter a title').notEmpty(),
    body('description', 'Please enter a description').notEmpty(),
    body('priority', 'Please choose a priority').notEmpty(),
    body('tasks', 'Please add tasks').isArray().notEmpty()
];

export const revisorsGroupCreateValidator = [
    body('title', 'Please enter a title').notEmpty(),
    body('revisors', 'Please add revisors').isArray().notEmpty(),
    body('tasksLists', 'Please add tasks lists').isArray().notEmpty()
];

export const revisorsGroupUpdateValidator = [
    body('title', 'Please enter a title').notEmpty(),
    body('revisors', 'Please add revisors').isArray().notEmpty(),
    body('tasksLists', 'Please add tasks lists').isArray().notEmpty()
];
