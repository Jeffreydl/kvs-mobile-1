import { Component, OnInit } from '@angular/core';
import { TasksService} from './tasks.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tasks;
  datee;

  constructor(private tasksService: TasksService) { }

  ngOnInit() {
    this.getTasks();
  }

  getTasks() {
      // this.tasks$ = this.tasksService.getAll();
      this.tasksService.getAll().subscribe(
          (tasks) => {
            this.tasks = tasks;
            console.log(tasks.slaDateTime);
            tasks.forEach((value) => {
              this.getSla(value.slaDateTime);
                }
            );
          }
      );
  }
  getSla(slaDateTime) {
    const currentDate = new Date();
    const slaDate = new Date(slaDateTime);
    const timeTilSla = Math.abs(currentDate.getTime() - slaDate.getTime());
    console.log(slaDate);
    if ((timeTilSla / 1000 / 60 / 60 / 24) < 1 && currentDate.getDay() === slaDate.getDay()) {
      const hours = slaDate.getHours();
      const minutes = slaDate.getMinutes();
      console.log(hours + ':' + minutes);
    } else {
      console.log(Math.floor(timeTilSla / 1000 / 60 / 60 / 24));

    }
  }
}
