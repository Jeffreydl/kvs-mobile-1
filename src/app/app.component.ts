import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {Router} from '@angular/router';
import {fromEvent, Observable, Subscription, timer} from 'rxjs';
import {Meta} from '@angular/platform-browser';
import {fadeAnimation} from './animation';
import {switchMap} from 'rxjs/operators';
import {TaskFilter, TasksService} from './tasks/tasks.service';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {ITask} from './tasks/ITask';
import {EmployeeFilter, EmployeesService} from './employees/employees.service';

@AutoUnsubscribe()
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [fadeAnimation]
})
export class AppComponent implements OnInit, OnDestroy {
    public currentRoute: string;
    public isLoggedIn$: Observable<boolean>;

    public subscription: Subscription;
    public result;

    private mobHeight: number;
    private mobWidth: number;

    emitter = new EventEmitter<ITask[]>();

    private resizeObservable$: Observable<Event>;
    private resizeSubscription$: Subscription;

    constructor(private authService: AuthService,
                public router: Router,
                private metaService: Meta,
                private tasksService: TasksService,
                private employeesService: EmployeesService) {
        this.mobHeight = (window.innerHeight);
        this.mobWidth = (window.innerWidth);
    }

    ngOnInit(): void {
        this.isLoggedIn$ = this.authService.isLoggedIn;
        this.injectMetaTag();
        this.authService.checkPermission();
        if (this.authService.hasPermission) {
            this.router.navigate(['dashboard']);
            this.getTasksPeriodically();
            this.getEmployeeCategories();
            this.onWindowResize();
        }
    }

    ngOnDestroy(): void {
    }

    public onWindowResize() {
        this.resizeObservable$ = fromEvent(window, 'resize');
        this.resizeSubscription$ = this.resizeObservable$.subscribe( (evt: any) => {
            this.mobHeight = evt.target.screen.height;
            this.mobWidth = evt.target.screen.width;
            this.injectMetaTag();
        });
    }

    public injectMetaTag() {
        const viewport = this.metaService.getTag('name=viewport');
        if (viewport) {
            this.metaService.updateTag({
                    name: 'viewport',
                    content: `height=${this.mobHeight}, width=${this.mobWidth}, initial-scale=1.0`
                },
                `name='viewport'`
            );
        }
    }

    getTasksPeriodically() {
        this.subscription = timer(10000, 300000).pipe(
            switchMap(() => this.tasksService.getAll(new TaskFilter()
                    .openTasks()
                    .openTasks()
                    .inboundTasks()
                    .assignedTo(Number(this.authService.getUserId()))
                    .forCategories(this.employeesService.getCategories())
                    .limitTo(20)
                    .ascending()
                // .includeDrafts(true)))
            ))
        ).subscribe(result => {
            if (JSON.stringify(result) !== JSON.stringify(this.result)) {
                this.emitter.emit(result);
            } else {
            }
            this.result = result;
        });
    }
    public getEmployeeCategories() {
        this.employeesService.getCategories(new EmployeeFilter().forEmployee(this.authService.getUserId()));
    }

    onSwipe(event) {
        const direction = Math.abs(event.deltaX) > 40 ? (event.deltaX > 0 ? 'right' : 'left') : '';
        this.currentRoute = this.router.url;

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
