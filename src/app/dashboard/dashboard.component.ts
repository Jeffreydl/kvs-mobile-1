import {Component, OnInit} from '@angular/core';
import {switchMap} from 'rxjs/operators';
import {Subscription, timer} from 'rxjs';
import {TaskFilter, TasksService} from '../tasks/tasks.service';
import {AuthService} from '../auth/auth.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  subscription: Subscription;
  statusText: string;

  constructor(private tasksService: TasksService, private authService: AuthService) { }

  ngOnInit(): void {
    this.subscription = timer(0, 300000).pipe(
        switchMap(() => this.tasksService.getAll(new TaskFilter()
        // See TasksService.ts for all filter methods
        // .openTasks()
            .inboundTasks()
            .assignedTo(Number(this.authService.getUserId()))
            .limitTo(10)
            .descending()
            .includeDrafts(true)))
    ).subscribe(result => console.log(result));
    }
}
