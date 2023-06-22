import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { TagsComponent } from './tags/tags.component';
import { RevisorsGroupsComponent } from './revisors-groups/revisors-groups.component';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { TasksListsComponent } from './tasks-lists/tasks-lists.component';
import { TasksComponent } from './tasks/tasks.component';
import { HotelsComponent } from './hotels/hotels.component';
import { UsersComponent } from './users/users.component';
import { MenuComponent } from './menu/menu.component';
import { UserToolbarComponent } from './user-toolbar/user-toolbar.component';
import {NgbDropdownModule} from "@ng-bootstrap/ng-bootstrap";
import { MyTaskComponent } from './my-tasks/my-task/my-task.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RegisterComponent } from './register/register.component';
import { TaskComponent } from './tasks/task/task.component';
import { TasksListComponent } from './tasks-lists/tasks-list/tasks-list.component';
import { RevisorsGroupComponent } from './revisors-groups/revisors-group/revisors-group.component';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { AddUserComponent } from './add-user/add-user.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    TagsComponent,
    RevisorsGroupsComponent,
    MyTasksComponent,
    TasksListsComponent,
    TasksComponent,
    HotelsComponent,
    UsersComponent,
    MenuComponent,
    UserToolbarComponent,
    MyTaskComponent,
    RegisterComponent,
    TaskComponent,
    TasksListComponent,
    RevisorsGroupComponent,
    UserProfileComponent,
    AddUserComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        NgbDropdownModule,
        NgbModule,
        BrowserAnimationsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
