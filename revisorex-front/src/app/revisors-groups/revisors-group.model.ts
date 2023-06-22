import {Comment} from "./comment.model";
import {User} from "../users/user.model";
import {TasksList} from "../tasks-lists/tasks-list.model";

export interface RevisorsGroup {
  _id: string;
  title: string;
  mainRevisor: User;
  revisors: User[];
  tasksLists: TasksList[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}
