import {Component, OnDestroy, OnInit} from '@angular/core';
import {TaskFilter, TasksService} from './tasks.service';
import {AuthService} from '../auth/auth.service';
import {ITask} from './itask';
import {MatTableDataSource} from '@angular/material';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit, OnDestroy {
  public tasks: ITask[];
  public displayedColumnsTasks: string[] = ['category', 'subject', 'sla'];
  public dataSourceTasks: MatTableDataSource<ITask>;
  public datee;
  public userId: number;

  constructor(private tasksService: TasksService, private authService: AuthService) { }

  ngOnInit() {
      // this.userId = this.authService.getUserId();
      this.getTasks();
  }

  ngOnDestroy(): void {
  }

    getTasks() {
      this.tasksService.getAll(new TaskFilter()
      // See TasksService.ts for all filter methods
          // .openTasks()
          .inboundTasks()
          .assignedTo(13)
          // .assignedTo(this.userId)
          .limitTo(10)
          .descending()
          .includeDrafts(true))
          .subscribe(tasks => {
              this.tasks = tasks;
              console.log(this.tasks);
              this.dataSourceTasks = new MatTableDataSource(this.tasks);
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
