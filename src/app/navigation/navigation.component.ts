import {Component, OnDestroy, OnInit} from '@angular/core';
import {TasksService} from '../tasks/tasks.service';
import {BehaviorSubject} from 'rxjs';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {
  tasksCount$: BehaviorSubject<number>;
  isVisible = false;

  constructor(private tasksService: TasksService) { }

  ngOnInit() {
      this.tasksCount$ = this.tasksService.getTasksLength();
      this.tasksService.getTasksLength().subscribe(
          (value) => {
              this.isVisible = value !== 0;
          }
      );
  }

  ngOnDestroy(): void {
  }
}
