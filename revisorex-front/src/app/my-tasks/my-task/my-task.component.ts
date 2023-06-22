import { Component, ViewChild } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Task} from "../../tasks/task.model";
import {TasksService} from "../../tasks/tasks.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import {User} from "../../users/user.model";
import {UsersService} from "../../users/users.service";
import {Tag} from "../../tags/tag.model";
import {TagsService} from "../../tags/tags.service";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-my-task',
  templateUrl: './my-task.component.html',
  styleUrls: ['./my-task.component.scss']
})
export class MyTaskComponent {
  @ViewChild('popover') popover!: NgbPopover;
  @ViewChild('popoverChange') popoverChange!: NgbPopover;
  @ViewChild('popoverDelete') popoverDelete!: NgbPopover;
  user!: User;
  users!: User[];
  taskId!: string | null;
  task!: Task;
  addResultForm = new FormGroup({
    result: new FormControl('', Validators.required),
    image: new FormControl(null, Validators.required)
  })
  changeTaskForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    tag: new FormControl('', Validators.required),
    assignedTo: new FormControl('', Validators.required)
  });
  tags: Tag[] = [];
  errorMessage: string = '';
  userName!: string;
  tagName!: string;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private tasksService: TasksService,
    private userService: UsersService,
    private tagService: TagsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    const task$ = this.tasksService.getTask(this.taskId!);
    const currentUser$ = this.userService.getCurrentUser();
    const users$ = this.userService.getUsers();
    const tags$ = this.tagService.getTags();

    forkJoin([task$, currentUser$, users$, tags$]).subscribe(
      ([task, currentUser, users, tags]) => {
        this.task = task;
        this.user = currentUser;
        this.users = users.filter(user => user.company === this.user.company);
        this.tags = tags;
        this.loading = false;
      },
      (error) => {
        console.log('Error loading data:', error);
        this.loading = false;
      }
    );
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.log('Error getting users:', error);
      }
    );
  }

  loadTags(): void {
    this.tagService.getTags().subscribe(
      (tags: Tag[]) => {
        this.tags = tags;
      },
      (error) => {
        console.error('Failed to fetch tags', error);
      }
    );
  }

  loadTaskDetails(taskId: string): void {
    this.tasksService.getTask(taskId).subscribe(
      (task: Task) => {
        this.task = task;
      },
      (error) => {
        console.log('Error loading tasks:', error);
      }
    );
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.addResultForm.controls.image.setValue(file);
  }

  onSubmitResult(popover: NgbPopover): void {
    const formData = new FormData();
    formData.append('result', this.addResultForm.controls.result.value!);
    if (this.addResultForm.controls.image.value) {
      formData.append('image', this.addResultForm.controls.image.value);
    }

    this.tasksService.addResult(this.task._id, formData).subscribe(
      () => {
        this.addResultForm.reset();
        this.loadTaskDetails(this.task._id);
        popover.close();
      },
      (error) => {
        console.log('Error adding result:', error);
      }
    );
  }

  loadCurrentUser(): void {
    this.userService.getCurrentUser().subscribe(
      (user: User) => {
        this.user = user;
      },
      (error) => {
        console.error(error);
      })
  }

  updateTask(): void {
    const taskData = this.changeTaskForm.value;

    this.tasksService.updateTask(this.task._id, taskData).subscribe(
      () => {
        this.loadTaskDetails(this.task._id);
        this.popoverChange.close();
      },
      (error) => {
        console.error('Failed to update task:', error);
      }
    );
  }

  deleteTask(): void {
    this.tasksService.deleteTask(this.task._id).subscribe(
      () => {
        this.popoverDelete.close();
        this.router.navigate(['/myTasks']);
      },
      (error) => {
        console.error('Failed to delete task:', error);
      }
    );
  }

  setTag(title: string): void {
    this.tagName = title;
    this.changeTaskForm.controls.tag.setValue(title);
  }

  setUser(id: string, title: string): void {
    this.userName = title;
    this.changeTaskForm.controls.assignedTo.setValue(id);
  }

  reset(): void {
    this.changeTaskForm.reset();
    this.userName = '-';
    this.tagName = '-';
    this.errorMessage = '';
  }
}
