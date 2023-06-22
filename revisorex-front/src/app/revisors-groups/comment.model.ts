import {User} from "../users/user.model";

export interface Comment {
  _id: string;
  title: string;
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
}
