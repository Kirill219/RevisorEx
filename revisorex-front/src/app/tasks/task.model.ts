import {User} from "../users/user.model";
import {Hotel} from "../hotels/hotel.model";

export interface Task {
  _id: string;
  title: string;
  description: string;
  type: string;
  result?: string;
  image?: string;
  tag?: string;
  hotel: Hotel;
  assignedTo: User;
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
}
