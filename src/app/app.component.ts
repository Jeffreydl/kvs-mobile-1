import {Component, EventEmitter, OnDestroy} from '@angular/core';
import { OnInit } from '@angular/core';
import {AuthService} from './auth/auth.service';
import {Router} from '@angular/router';
import {Observable, Subscription, timer} from 'rxjs';
import {Meta} from '@angular/platform-browser';
import {fadeAnimation} from './animation';
import {switchMap} from 'rxjs/operators';
import {TaskFilter, TasksService} from './tasks/tasks.service';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {ITask} from './tasks/ITask';

@AutoUnsubscribe()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation]
})
export class AppComponent implements OnInit, OnDestroy {
  public title = 'KVS Mobile';
  public currentRoute: string;
  public isLoggedIn$: Observable<boolean>;

  public subscription: Subscription;
  public result;

  private readonly mobHeight: number;
  private readonly mobWidth: number;

  emitter = new EventEmitter<ITask[]>();

  constructor(private authService: AuthService, public router: Router, private metaService: Meta, private tasksService: TasksService) {
      this.mobHeight = (window.innerHeight);
      this.mobWidth = (window.innerWidth);
  }


  ngOnInit(): void {
    const viewport = this.metaService.getTag('name=viewport');
    if (viewport) {
      this.metaService.updateTag({
            name: 'viewport',
            content: `height=${this.mobHeight}, width=${this.mobWidth}, initial-scale=1.0`
          },
          `name='viewport'`
      );
    }

    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.authService.checkPermission();
    if (this.authService.hasPermission) {
      this.router.navigate(['dashboard']);
      this.getTasksPeriodically();
    }
  }

  ngOnDestroy(): void {
  }

    getTasksPeriodically() {
        this.subscription = timer(10000, 1000000).pipe(
            switchMap(() => this.tasksService.getAll(new TaskFilter()
            .openTasks()
                .inboundTasks()
                .assignedTo(Number(this.authService.getUserId()))
                .limitTo(20)
                .descending()
                .includeDrafts(true)))
        ).subscribe(result => {
            if (JSON.stringify(result) !== JSON.stringify(this.result)) {
              this.emitter.emit(result);
            } else {
            }
            this.result = result;
        });
    }

  onSwipe(event) {
    const x = Math.abs(event.deltaX) > 40 ? (event.deltaX > 0 ? 'right' : 'left') : '';
    this.currentRoute = this.router.url;
    const direction = x;

    if (direction === 'left') {
      if (this.currentRoute === '/dashboard') {
        this.router.navigate(['kennisbank']);
      } else if (this.currentRoute === '/kennisbank') {
        this.router.navigate(['klanten']);
      } else if (this.currentRoute === '/klanten') {
        this.router.navigate(['taak-aanmaken']);
      }
    } else {
      if (this.currentRoute === '/kennisbank') {
        this.router.navigate(['dashboard']);
      } else if (this.currentRoute === '/klanten') {
        this.router.navigate(['kennisbank']);
      } else if (this.currentRoute === '/taak-aanmaken') {
        this.router.navigate(['klanten']);
      }
    }
  }

}
