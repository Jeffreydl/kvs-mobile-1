import {Component, OnDestroy, OnInit} from '@angular/core';
import {TaskFilter, TasksService} from './tasks.service';
import {AuthService} from '../auth/auth.service';
import {ITask} from './ITask';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {CurrentTaskDialogComponent} from './current-task-dialog/current-task-dialog.component';
import {Router} from '@angular/router';

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

  constructor(private tasksService: TasksService, private authService: AuthService, public dialog: MatDialog, private router: Router) { }

  ngOnInit() {
      this.getTasks();
  }

  ngOnDestroy(): void {
  }

    public getTasks() {
      this.tasksService.getAll(new TaskFilter()
      // See TasksService.ts for all filter methods
          // .openTasks()
          .inboundTasks()
          .assignedTo(Number(this.authService.getUserId()))
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

    public openCurrentTask(task: any): void {
        const dialogRef = this.dialog.open(CurrentTaskDialogComponent, {
            height: '85%',
            width: '90%',
            maxWidth: '90%',
            panelClass: 'client-dialog',
            data: {task}
        });
        dialogRef.afterClosed().subscribe(() => { this.reloadComponent(); });
    }

    public reloadComponent() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['/dashboard']);
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

    logOut() {
      this.authService.logOut();
    }
}
