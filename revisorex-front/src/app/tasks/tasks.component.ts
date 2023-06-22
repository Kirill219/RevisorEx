import {Component, ViewChild} from '@angular/core';
import {TasksService} from "./tasks.service";
import { Task } from "./task.model";
import {Tag} from "../tags/tag.model";
import {TagsService} from "../tags/tags.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Hotel} from "../hotels/hotel.model";
import {HotelsService} from "../hotels/hotels.service";
import {User} from "../users/user.model";
import {UsersService} from "../users/users.service";
import {NgbPopover} from "@ng-bootstrap/ng-bootstrap";
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent {
  @ViewChild('popover') popover!: NgbPopover;
  taskForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    tag: new FormControl('', Validators.required),
    hotel: new FormControl('', Validators.required),
    assignedTo: new FormControl('', Validators.required)
  });
  tasks: Task[] = [];
  currentUser!: User;
  users!: User[];
  tags: Tag[] = [];
  hotels: Hotel[] = [];
  filters: any = {};
  titleFilter: string = '';
  filteredTasks: Task[] = [];
  userName!: string;
  hotelName!: string;
  tagName!: string;
  errorMessage: string = '';
  loading: boolean = true;

  constructor(
    private tasksService: TasksService,
    private tagService: TagsService,
    private hotelService: HotelsService,
    private userService: UsersService
  ) {}

  ngOnInit() {
    const tasks$ = this.tasksService.getTasks();
    const currentUser$ = this.userService.getCurrentUser();
    const users$ = this.userService.getUsers();
    const hotels$ = this.hotelService.getHotels();
    const tags$ = this.tagService.getTags();

    forkJoin([tasks$, currentUser$, users$, hotels$, tags$]).subscribe(
      ([tasks, currentUser, users, hotels, tags]) => {
        this.tasks = this.searchTasksByTitle(tasks, this.titleFilter);
        this.currentUser = currentUser;
        this.users = users.filter(user => user.company === this.currentUser.company);
        this.hotels = hotels;
        this.tags = tags;
        this.titleFilter = '';
        this.loading = false;
      },
      (error) => {
        console.log('Error loading data:', error);
        this.loading = false;
      }
    );
  }

  loadTasks(filters?: {}) {
    this.tasksService.getTasks(filters).subscribe(
      (tasks: Task[]) => {
        this.tasks = this.searchTasksByTitle(tasks, this.titleFilter);
        this.titleFilter = '';
      },
      (error) => {
        console.log('Error loading tasks:', error);
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

  filterData(filterName: string, value: string) {
    this.titleFilter = '';
    let filters = { ...this.filters, [filterName]: value };
    this.loadTasks(filters);
  }

  searchTasksByTitle(tasks: Task[], searchText: string): Task[] {
    if (searchText !== '') {
      return tasks.filter(task =>
        task.title.toLowerCase().includes(searchText.toLowerCase())
      );
    } else {
      return tasks;
    }
  }

  loadHotels(): void {
    this.hotelService.getHotels().subscribe(
      (hotels: Hotel[]) => {
        this.hotels = hotels;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  createTask(): void {
    const taskData = this.taskForm.value;
    this.tasksService.createTask(taskData).subscribe(
      (task: Task) => {
        this.popover.close();
        this.loadTasks();
      },
      (error) => {
        this.errorMessage = 'Завдання вже існує, створіть інше';
      }
    );
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data.filter(user => user.company === this.currentUser.company);
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

  setHotel(id: string, title: string): void {
    this.hotelName = title;
    this.taskForm.controls.hotel.setValue(id);
  }

  setTag(title: string): void {
    this.tagName = title;
    this.taskForm.controls.tag.setValue(title);
  }

  setUser(id: string, title: string): void {
    this.userName = title;
    this.taskForm.controls.assignedTo.setValue(id);
  }

  reset(): void {
    this.taskForm.reset();
    this.userName = '-';
    this.hotelName = '-';
    this.tagName = '-';
    this.errorMessage = '';
  }
}
