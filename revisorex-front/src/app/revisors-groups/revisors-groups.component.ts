import {Component, ViewChild} from '@angular/core';
import {RevisorsGroup} from "./revisors-group.model";
import {RevisorsGroupsService} from "./revisors-groups.service";
import {User} from "../users/user.model";
import {UsersService} from "../users/users.service";
import {NgbPopover} from "@ng-bootstrap/ng-bootstrap";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {TasksListsService} from "../tasks-lists/tasks-lists.service";
import {TasksList} from "../tasks-lists/tasks-list.model";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-revisors-groups',
  templateUrl: './revisors-groups.component.html',
  styleUrls: ['./revisors-groups.component.scss']
})
export class RevisorsGroupsComponent {
  @ViewChild('popover') popover!: NgbPopover;
  groupForm = new FormGroup({
    title: new FormControl('', Validators.required),
    tasksLists: new FormArray([], Validators.required),
    revisors: new FormArray([], Validators.required),
  });
  revisorsGroups: RevisorsGroup[] = [];
  currentUser!: User;
  tasksLists!: TasksList[];
  users!: User[];
  errorMessage: string = '';
  listsNames: string[] = [];
  usersNames: string[] = [];
  titleFilter: string = '';
  loading: boolean = true;

  constructor(
    private revisorsGroupService: RevisorsGroupsService,
    private userService: UsersService,
    private tasksListService: TasksListsService
    ) {}

  ngOnInit(): void {
    const revisorsGroups$ = this.revisorsGroupService.getRevisorsGroups();
    const tasksLists$ = this.tasksListService.getTasksLists();
    const currentUser$ = this.userService.getCurrentUser();
    const users$ = this.userService.getUsers();

    forkJoin([tasksLists$, currentUser$, users$, revisorsGroups$]).subscribe(
      ([tasksLists, currentUser, users, revisorsGroups]) => {
        this.revisorsGroups = this.searchTasksByTitle(revisorsGroups, this.titleFilter);
        this.currentUser = currentUser;
        this.tasksLists = tasksLists;
        this.users = users.filter(user => user.company === this.currentUser.company);
        this.titleFilter = '';
        this.loading = false;
      },
      (error) => {
        console.log('Error loading data:', error);
        this.loading = false;
      }
    );
  }

  loadRevisorsGroups(): void {
    this.revisorsGroupService.getRevisorsGroups().subscribe(
      (groups: RevisorsGroup[]) => {
        this.revisorsGroups = this.searchTasksByTitle(groups, this.titleFilter);
        this.titleFilter = '';
      },
      (error) => {
        console.error('Failed to fetch revisors groups', error);
      }
    );
  }

  searchTasksByTitle(groups: RevisorsGroup[], searchText: string): RevisorsGroup[] {
    if (searchText !== '') {
      return groups.filter(group =>
        group.title.toLowerCase().includes(searchText.toLowerCase())
      );
    } else {
      return groups;
    }
  }

  loadTasksLists(filters?: {}): void {
    this.tasksListService.getTasksLists(filters).subscribe(
      (tasksLists) => {
        this.tasksLists = tasksLists.filter(list => list.mainRevisor._id === this.currentUser._id);
      },
      (error) => {
        console.log('Error getting tasks lists:', error);
      }
    );
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data.filter(user => user.company === this.currentUser.company &&
          user._id !== this.currentUser._id);
      },
      (error) => {
        console.log('Error getting users:', error);
      }
    );
  }

  loadCurrentUser(): void {
    this.userService.getCurrentUser().subscribe(
      (user: User) => {
        this.currentUser = user;
      },
      (error) => {
        console.error(error);
      })
  }

  createGroup(): void {
    const groupData = this.groupForm.value;
    this.revisorsGroupService.createRevisorsGroup(groupData).subscribe(
      () => {
        this.popover.close()
        this.loadRevisorsGroups();
      },
      (error) => {
        this.errorMessage = 'Група вже існує, створіть іншу';
      }
    );
  }

  get formLists(): FormArray {
    return this.groupForm.get('tasksLists') as FormArray;
  }

  setLists(id: string, title: string): void {
    if (!this.listsNames.includes(title)) {
      this.listsNames.push(title);
      this.formLists.push(new FormControl(id, Validators.required));
    }
  }

  get formUsers(): FormArray {
    return this.groupForm.get('revisors') as FormArray;
  }

  setUsers(id: string, title: string): void {
    if (!this.usersNames.includes(title)) {
      this.usersNames.push(title);
      this.formUsers.push(new FormControl(id, Validators.required));
    }
  }

  reset(): void {
    this.groupForm.controls.title.setValue('');
    this.formUsers.clear();
    this.formLists.clear();
    this.usersNames = [];
    this.listsNames = [];
    this.errorMessage = '';
  }
}
