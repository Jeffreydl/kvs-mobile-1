import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {TaskFilter, TasksService} from './tasks.service';
import {AuthService} from '../auth/auth.service';
import {ITask} from './ITask';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {CurrentTaskDialogComponent} from './current-task-dialog/current-task-dialog.component';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';

@AutoUnsubscribe()
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit, OnDestroy {
  public tasks: ITask[];
  public displayedColumnsTasks: string[] = ['category', 'subject', 'sla'];
  public dataSourceTasks = new MatTableDataSource<ITask>();

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
          .limitTo(10)
          .descending()
          .includeDrafts(true))
          .subscribe(tasks => {
              this.tasks = tasks;
              this.dataSourceTasks.data = tasks;
          });
  }

    public openCurrentTask(task: ITask): void {
        const dialogRef = this.dialog.open(CurrentTaskDialogComponent, {
            position: {top: '0'},
            height: 'calc(100% - 80px)',
            width: '100%',
            maxWidth: '100%',
            panelClass: 'task-dialog',
            data: {task}
        });
        // dialogRef.afterClosed().subscribe(() => { this.reloadComponent(); });
        dialogRef.afterClosed().subscribe(() => { this.getTasks(); });
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
  //   if ((timeTilSla / 1000 / 60 / 60 / 24) < 1 && currentDate.getDay() === slaDate.getDay()) {
  //     const hours = slaDate.getHours();
  //     const minutes = slaDate.getMinutes();
  //   } else {
  //
  //   }
  // }

    logOut() {
      this.authService.logOut();
    }
}
