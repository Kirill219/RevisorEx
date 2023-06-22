import {Component, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TasksList} from "../tasks-list.model";
import {TasksListsService} from "../tasks-lists.service";
import {User} from "../../users/user.model";
import {UsersService} from "../../users/users.service";
import {NgbPopover} from "@ng-bootstrap/ng-bootstrap";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {Task} from "../../tasks/task.model";
import {TasksService} from "../../tasks/tasks.service";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent {
  @ViewChild('popover') popover!: NgbPopover;
  @ViewChild('popoverDelete') popoverDelete!: NgbPopover;
  tasksListForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    priority: new FormControl('', Validators.required),
    tasks: new FormArray([], Validators.required)
  });
  currentUser!: User;
  taskListId!: string | null;
  tasksList!: TasksList;
  tasks!: Task[];
  errorMessage: string = '';
  tasksNames: string[] = [];
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private tasksListService: TasksListsService,
    private userService: UsersService,
    private tasksService: TasksService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.taskListId = this.route.snapshot.paramMap.get('id');
    const tasks$ = this.tasksService.getTasks();
    const currentUser$ = this.userService.getCurrentUser();
    const tasksList$ = this.tasksListService.getTasksList(this.taskListId!);

    forkJoin([tasks$, currentUser$, tasksList$]).subscribe(
      ([tasks, currentUser, tasksList]) => {
        this.tasksList = tasksList;
        this.currentUser = currentUser;
        this.tasks = tasks;
        this.loading = false;
      },
      (error) => {
        console.log('Error loading data:', error);
        this.loading = false;
      }
    );
  }

  loadListDetails(taskListId: string): void {
    this.tasksListService.getTasksList(taskListId).subscribe(
      (tasksList: TasksList) => {
        this.tasksList = tasksList;
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

  deleteTasksList(listId: string): void {
    this.tasksListService.deleteTasksList(listId).subscribe(
      () => {
        this.popoverDelete.close();
        this.router.navigate(['/tasksLists']);
      },
      (error) => {
        console.error('Failed to delete tag', error);
      }
    );
  }

  updateTasksList(): void {
    const tasksListData = this.tasksListForm.value;
    this.tasksListService.updateTasksList(this.taskListId!, tasksListData).subscribe(
      (tasksList: TasksList) => {
        this.popover.close()
        this.loadListDetails(this.taskListId!);
      },
      (error) => {
        this.errorMessage = 'Помилка серверу, спробуйте ще';
      }
    );
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
