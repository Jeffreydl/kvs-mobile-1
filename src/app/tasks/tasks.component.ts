import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TaskFilter, TasksService} from './tasks.service';
import {AuthService} from '../auth/auth.service';
import {ITask} from './ITask';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {CurrentTaskDialogComponent} from './current-task-dialog/current-task-dialog.component';
import {Router} from '@angular/router';
import {FilterTableService} from '../filterTable.service';

@AutoUnsubscribe()
@Component({
    selector: 'app-tasks',
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit, OnDestroy {
    public tasks: ITask[];
    public displayedColumnsTasks: string[] = ['werknemer', 'category', 'subject', 'sla'];
    public dataSourceTasks = new MatTableDataSource<ITask>();
    public isSearching: boolean;

    constructor(private tasksService: TasksService,
                private authService: AuthService,
                public dialog: MatDialog,
                private router: Router,
                private filterTableService: FilterTableService) {
    }

    ngOnInit() {
        this.getTasks();
    }

    ngOnDestroy(): void {
    }

    applyFilter(filterValue: string) {
        this.dataSourceTasks.filter = filterValue.trim().toLowerCase();
    }

    public getTasks() {
        this.tasksService.getAll(new TaskFilter()
                .openTasks()
                .inboundTasks()
                .assignedTo(Number(this.authService.getUserId()))
                .forCategories([8, 1, 2, 3, 4, 7])
                .limitTo(20)
                .ascending()
            // .includeDrafts(true))
        ).subscribe(tasks => {
            this.tasks = tasks;
            this.dataSourceTasks.data = tasks;
            this.filterTableService.filterNestedObjects(this.dataSourceTasks);
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
        dialogRef.afterClosed().subscribe(() => {
            this.getTasks();
        });
    }

    public reloadComponent() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['/dashboard']);
    }

    getSla(slaDateTime, taskId) {
        const currentDate = new Date();
        const slaDate = new Date(slaDateTime);
        const timeTilSla = Math.abs(currentDate.getTime() - slaDate.getTime());

        const days = Math.floor(timeTilSla / 1000 / 60 / 60 / 24);
        const hours = Math.floor(timeTilSla / 1000 / 60 / 60) % 24;
        const minutes = Math.floor(timeTilSla / 1000 / 60) % 60;

        if (currentDate > slaDate) {
            (document.getElementById('sla-date-' + taskId) as HTMLElement).style.backgroundColor = '#f3263f';
            if (days > 0) {
                return '-' + days + 'd';
            } else if (hours > 0) {
                return '-' + hours + 'u';
            } else {
                return '-' + minutes + 'm';
            }
        } else {
            if (days > 0) {
                (document.getElementById('sla-date-' + taskId) as HTMLElement).style.backgroundColor = '#89bd51';
                return days + 'd';
            } else if (hours > 0) {
                (document.getElementById('sla-date-' + taskId) as HTMLElement).style.backgroundColor = '#89bd51';
                return hours + 'u';
            } else {
                (document.getElementById('sla-date-' + taskId) as HTMLElement).style.backgroundColor = '#f5a623';
                return minutes + 'm';
            }
        }
    }

    public getName(profile: any) {
        if (profile) {
            return profile.firstname.substring(0, 1) + profile.lastname.substring(0, 1);
        }
    }

    public getIsSearching(isSearching: boolean) {
        this.isSearching = isSearching;
        if (!this.isSearching) {
            this.applyFilter('');
        }
    }
}
