import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {HomeComponent} from "./home/home.component";
import {AuthGuard} from "./login/auth.guard";
import {TagsComponent} from "./tags/tags.component";
import {RevisorsGroupsComponent} from "./revisors-groups/revisors-groups.component";
import {MyTasksComponent} from "./my-tasks/my-tasks.component";
import {TasksListsComponent} from "./tasks-lists/tasks-lists.component";
import {TasksComponent} from "./tasks/tasks.component";
import {HotelsComponent} from "./hotels/hotels.component";
import {UsersComponent} from "./users/users.component";
import {MyTaskComponent} from "./my-tasks/my-task/my-task.component";
import {RegisterComponent} from "./register/register.component";
import {TaskComponent} from "./tasks/task/task.component";
import {TasksListComponent} from "./tasks-lists/tasks-list/tasks-list.component";
import {RevisorsGroupComponent} from "./revisors-groups/revisors-group/revisors-group.component";
import {UserProfileComponent} from "./users/user-profile/user-profile.component";
import {AddUserComponent} from "./add-user/add-user.component";

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'tags', component: TagsComponent, canActivate: [AuthGuard] },
  { path: 'revisorsGroups', component: RevisorsGroupsComponent, canActivate: [AuthGuard] },
  { path: 'myTasks', component: MyTasksComponent, canActivate: [AuthGuard] },
  { path: 'tasksLists', component: TasksListsComponent, canActivate: [AuthGuard] },
  { path: 'tasks', component: TasksComponent, canActivate: [AuthGuard] },
  { path: 'hotels', component: HotelsComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'myTask/:id', component: MyTaskComponent, canActivate: [AuthGuard]  },
  { path: 'task/:id', component: TaskComponent, canActivate: [AuthGuard]  },
  { path: 'tasksList/:id', component: TasksListComponent, canActivate: [AuthGuard]  },
  { path: 'revisorsGroup/:id', component: RevisorsGroupComponent, canActivate: [AuthGuard]  },
  { path: 'currentUser', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'addUser', component: AddUserComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
