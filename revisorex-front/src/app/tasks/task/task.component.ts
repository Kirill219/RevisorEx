import {Component} from '@angular/core';
import {Task} from "../task.model";
import {ActivatedRoute} from "@angular/router";
import {TasksService} from "../tasks.service";
import {forkJoin} from "rxjs";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent {
  taskId!: string | null;
  task!: Task;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private tasksService: TasksService
  ) { }

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    const task$ = this.tasksService.getTask(this.taskId!);

    forkJoin([task$]).subscribe(
      ([task]) => {
        this.task = task;
        this.loading = false;
      },
      (error) => {
        console.log('Error loading data:', error);
        this.loading = false;
      }
    );
  }

  getTaskDetails(taskId: string): void {
    this.tasksService.getTask(taskId).subscribe(
      (task: Task) => {
        this.task = task;
      },
      (error) => {
        console.log('Error loading tasks:', error);
      }
    );
  }
}
