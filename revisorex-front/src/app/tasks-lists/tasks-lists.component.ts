import {Component, ViewChild} from '@angular/core';
import {TasksList} from "./tasks-list.model";
import {TasksListsService} from "./tasks-lists.service";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {Task} from "../tasks/task.model";
import {TasksService} from "../tasks/tasks.service";
import {NgbPopover} from "@ng-bootstrap/ng-bootstrap";
import { User } from '../users/user.model';
import {UsersService} from "../users/users.service";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-tasks-lists',
  templateUrl: './tasks-lists.component.html',
  styleUrls: ['./tasks-lists.component.scss']
})
export class TasksListsComponent {
  @ViewChild('popover') popover!: NgbPopover;
  tasksListForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    priority: new FormControl('', Validators.required),
    tasks: new FormArray([], Validators.required)
  });
  errorMessage!: string;
  tasksLists!: TasksList[];
  tasks!: Task[];
  filters: any = {};
  titleFilter: string = '';
  tasksNames: string[] = [];
  currentUser!: User;
  loading: boolean = true;

  constructor(
    private tasksListService: TasksListsService,
    private tasksService: TasksService,
    private userService: UsersService
  ) {}

  ngOnInit(): void {
    const tasks$ = this.tasksService.getTasks();
    const currentUser$ = this.userService.getCurrentUser();
    const tasksLists$ = this.tasksListService.getTasksLists();

    forkJoin([tasks$, currentUser$, tasksLists$]).subscribe(
      ([tasks, currentUser, tasksLists]) => {
        this.tasksLists = this.searchTasksByTitle(tasksLists, this.titleFilter);
        this.currentUser = currentUser;
        this.tasks = tasks;
        this.titleFilter = '';
        this.loading = false;
      },
      (error) => {
        console.log('Error loading data:', error);
        this.loading = false;
      }
    );
  }

  loadTasksLists(filters?: {}): void {
    this.tasksListService.getTasksLists(filters).subscribe(
      (tasksLists) => {
        this.tasksLists = this.searchTasksByTitle(tasksLists, this.titleFilter);
        this.titleFilter = '';
      },
      (error) => {
        console.log('Error getting tasks lists:', error);
      }
    );
  }

  loadTasks(filters?: {}) {
    this.tasksService.getTasks(filters).subscribe(
      (tasks: Task[]) => {
        this.tasks = tasks;
      },
      (error) => {
        console.log('Error loading tasks:', error);
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

  filterData(filterName: string, value: string) {
    let filters = { ...this.filters, [filterName]: value };
    this.loadTasksLists(filters);
  }

  createTasksList(): void {
    const tasksListData = this.tasksListForm.value;
    this.tasksListService.createTasksList(tasksListData).subscribe(
      (tasksList: TasksList) => {
        this.popover.close()
        this.loadTasksLists();
      },
      (error) => {
        this.errorMessage = 'Список вже існує, створіть інший';
      }
    );
  }

  searchTasksByTitle(tasksLists: TasksList[], searchText: string): TasksList[] {
    if (searchText !== '') {
      return tasksLists.filter(list =>
        list.title.toLowerCase().includes(searchText.toLowerCase())
      );
    } else {
      return tasksLists;
    }
  }

  get formTasks(): FormArray {
    return this.tasksListForm.get('tasks') as FormArray;
  }

  setTasks(id: string, title: string): void {
    if (!this.tasksNames.includes(title)) {
      this.tasksNames.push(title);
      this.formTasks.push(new FormControl(id, Validators.required));
    }
  }

  reset(): void {
    this.tasksListForm.controls.title.setValue('');
    this.tasksListForm.controls.description.setValue('');
    this.tasksListForm.controls.priority.setValue('');
    this.formTasks.clear();
    this.tasksNames = [];
    this.errorMessage = '';
  }
}
