import {User} from "../users/user.model";
import {Task} from "../tasks/task.model";

export interface TasksList {
  _id: string;
  title: string;
  description: string;
  priority: string;
  tasks: Task[];
  mainRevisor: User;
  createdAt: Date;
  updatedAt: Date;
}
