import express from 'express';
import mongoose from 'mongoose';
import cors from "cors";
import authHandler from "./app/middleware/authHandler.js";
import * as validators from "./app/middleware/validators.js";
import validationHandler from "./app/middleware/errorsHandler.js";
import fs from 'fs';
import https from 'https';
import multer from "multer";
import {Users} from "./app/controllers/usersController.js";
import {Hotels} from "./app/controllers/hotelsController.js";
import {RevisorsGroups} from "./app/controllers/revisorsGroupsController.js";
import {Comments} from "./app/controllers/commentsController.js";
import {Tags} from "./app/controllers/tagsController.js";
import {Tasks} from "./app/controllers/tasksController.js";
import {TasksLists} from "./app/controllers/tasksListsController.js";

const app = express();
const PORT = 443;
const DB_URL = `mongodb+srv://user:user@cluster.povrcu1.mongodb.net/blog?retryWrites=true&w=majority`;
app.use(express.json(), cors());
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

const privateKey = fs.readFileSync('./certificate/revisorex.decrypted.key', 'utf8');
const certificate = fs.readFileSync('./certificate/revisorex.crt', 'utf8');

const serverOptions = {
    key: privateKey,
    cert: certificate,
};

const server = https.createServer(serverOptions, app);

app.get('/account', authHandler, Users.getCurrentUser);
app.get('/revisors', authHandler, validationHandler, Users.getUsers);
app.post('/register', validators.registrationValidator, validationHandler, Users.createUser);
app.post('/login', validators.loginValidator, validationHandler, Users.login);
app.put('/account', authHandler, validators.userUpdateValidator, validationHandler, Users.updateCurrentUser);
app.delete('/account', authHandler, validationHandler, Users.deleteCurrentUser);

app.get('/hotels', authHandler, validationHandler, Hotels.getHotels);
app.post('/hotels', authHandler, validators.hotelCreateValidator, validationHandler, Hotels.createHotel);
app.delete('/hotels', authHandler, validationHandler, Hotels.deleteHotel);

app.get('/revisorsGroups', authHandler, validationHandler, RevisorsGroups.getRevisorsGroups);
app.get('/revisorsGroups/:id', authHandler, validationHandler, RevisorsGroups.getRevisorsGroup);
app.post('/revisorsGroups', authHandler, validators.revisorsGroupCreateValidator, validationHandler, RevisorsGroups.createRevisorsGroup);
app.put('/revisorsGroups/:id', authHandler, validators.revisorsGroupUpdateValidator, validationHandler, RevisorsGroups.updateRevisorsGroup);
app.delete('/revisorsGroups/:id', authHandler, validationHandler, RevisorsGroups.deleteRevisorsGroup);

app.get('/comments/:id', authHandler, validationHandler, Comments.getComments);
app.post('/comments/:id', authHandler, validators.commentCreateValidator, validationHandler, Comments.createComment);
app.delete('/comments/:id', authHandler, validationHandler, Comments.deleteComment);

app.get('/tags', authHandler, validationHandler, Tags.getTags);
app.post('/tags', authHandler, validators.tagCreateValidator, validationHandler, Tags.createTag);
app.delete('/tags', authHandler, validationHandler, Tags.deleteTag);

app.get('/tasks', authHandler, validationHandler, Tasks.getTasks);
app.get('/tasks/:id', authHandler, validationHandler, Tasks.getTask);
app.post('/tasks', authHandler, validators.taskCreateValidator, validationHandler, Tasks.createTask);
app.put('/tasks/:id', authHandler, validators.taskUpdateValidator, validationHandler, Tasks.updateTask);
app.put('/tasks/:id/result', authHandler, upload.single('image'), validators.taskAddResultValidator, validationHandler, Tasks.addResult);
app.delete('/tasks/:id', authHandler, validationHandler, Tasks.deleteTask);
app.get('/myTasks', authHandler, validationHandler, Tasks.getMyTasks);

app.get('/tasksLists', authHandler, validationHandler, TasksLists.getTasksLists);
app.get('/tasksLists/:id', authHandler, validationHandler, TasksLists.getTasksList);
app.post('/tasksLists', authHandler, validators.tasksListCreateValidator, validationHandler, TasksLists.createTasksList);
app.put('/tasksLists/:id', authHandler, validators.tasksListUpdateValidator, validationHandler, TasksLists.updateTasksList);
app.delete('/tasksLists/:id', authHandler, validationHandler, TasksLists.deleteTasksList);

async function startApp() {
    try {
        await mongoose.connect(DB_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        }).then(() => {
            console.log('Database works')
        }).catch((error) => {
            console.log('Database is not working', error)
        });

        server.listen(PORT, () => {
            console.log('Server started on port', PORT);
        });
    } catch (error) {
        console.log(error);
    }
}

startApp();
