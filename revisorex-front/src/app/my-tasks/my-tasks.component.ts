import { Component } from '@angular/core';
import {Task} from "../tasks/task.model";
import {TasksService} from "../tasks/tasks.service";
import {Tag} from "../tags/tag.model";
import {TagsService} from "../tags/tags.service";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.scss']
})
export class MyTasksComponent {
  tasks: Task[] = [];
  filters: any = {};
  titleFilter: string = '';
  tags!: Tag[];
  loading: boolean = true;

  constructor(
    private tasksService: TasksService,
    private tagService: TagsService
  ) {}

  ngOnInit() {
    const tasks$ = this.tasksService.getTasks();
    const tags$ = this.tagService.getTags();

    forkJoin([tasks$, tags$]).subscribe(
      ([tasks, tags]) => {
        this.tasks = this.searchTasksByTitle(tasks, this.titleFilter);
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
    this.tasksService.getMyTasks(filters).subscribe(
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

  searchTasksByTitle(tasks: Task[], searchText: string): Task[] {
    if (searchText !== '') {
      return tasks.filter(task =>
        task.title.toLowerCase().includes(searchText.toLowerCase())
      );
    } else {
      return tasks;
    }
  }

  filterData(filterName: string, value: string) {
    let filters = { ...this.filters, [filterName]: value };
    this.loadTasks(filters);
  }
}
