import { Component, OnInit } from '@angular/core';
import {TaskFilter, TasksService} from './tasks.service';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  public tasks: Observable<any>;
  public datee;

  constructor(private tasksService: TasksService) { }

  ngOnInit() {
    this.getTasks();
  }

  getTasks() {
      this.tasksService.getAll(new TaskFilter()
          .openTasks()
          .inboundTasks()
          .forMessageCategoryId([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
          .limitTo(10).descending()
          .includeDrafts(false))
          .subscribe(tasks => {
              this.tasks = tasks;
              console.log(this.tasks);
          });
  }

  // getSla(slaDateTime) {
  //   const currentDate = new Date();
  //   const slaDate = new Date(slaDateTime);
  //   const timeTilSla = Math.abs(currentDate.getTime() - slaDate.getTime());
  //   console.log(slaDate);
  //   if ((timeTilSla / 1000 / 60 / 60 / 24) < 1 && currentDate.getDay() === slaDate.getDay()) {
  //     const hours = slaDate.getHours();
  //     const minutes = slaDate.getMinutes();
  //     console.log(hours + ':' + minutes);
  //   } else {
  //     console.log(Math.floor(timeTilSla / 1000 / 60 / 60 / 24));
  //
  //   }
  // }
}
