import {Component, OnInit} from '@angular/core';
import {CustomersService} from '../customers.service';
import {ActivatedRoute, Router} from '@angular/router';
import {IAddress, ICustomer} from '../ICustomer';
import {Observable, Subscription} from 'rxjs';
import {TaskFilter, TasksService} from '../../tasks/tasks.service';
import {MatTableDataSource} from '@angular/material';
import {FilterService} from '../../filter.service';
import {DossierFilter, DossierService} from '../../dossiers/dossier.service';

@Component({
    selector: 'app-client-card',
    templateUrl: './client-card.component.html',
    styleUrls: ['./client-card.component.scss']
})
export class ClientCardComponent implements OnInit {
    private id: number;
    private currentClient: ICustomer;
    private routeSubscription$: Subscription;

    private tasks: any;
    private displayedColumnsTasks: string[] = ['category', 'subject', 'sla'];
    private dataSourceTasks: MatTableDataSource<any>;
    private openDossiers: any;
    private displayedColumnsOpenDossiers: string[] = ['id', 'category', 'subject', 'sla'];
    private dataSourceOpenDossiers: MatTableDataSource<any>;
    private closedDossiers: any;
    private displayedColumnsClosedDossiers: string[] = ['id', 'category', 'subject', 'sla'];
    private dataSourceClosedDossiers: MatTableDataSource<any>;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private customersService: CustomersService,
        private tasksService: TasksService,
        private filterService: FilterService,
        private dossiersService: DossierService
    ) {
        // const navigation = this.router.getCurrentNavigation();
        // const state = navigation.extras.state as { data: string };
        // this.id = state.data;

        this.routeSubscription$ = this.activatedRoute.params.subscribe(params => {
            this.id = params.id;
        });
    }

    ngOnInit() {
        this.getClient();
        this.getTasks();
        this.getDossiers();
    }

    ngOndestroy() {

    }

    private getTasks() {
        this.tasksService.getAll(new TaskFilter()
            .openTasks()
            .inboundTasks()
            .forClient(this.id)
            .limitTo(10)
            .descending()
            .includeDrafts(false))
            .subscribe(tasks => {
                this.tasks = tasks;
                this.dataSourceTasks = new MatTableDataSource(this.tasks);
                this.filterService.filterNestedObjects(this.dataSourceTasks);
            });
    }

    private getDossiers() {
        this.dossiersService.getAll(new DossierFilter()
            .forRelation(this.id)
            .openDossiers()
            .orderByCreationDate()
            .descending())
            .subscribe(dossiers => {
                this.openDossiers = dossiers;
                this.dataSourceOpenDossiers = new MatTableDataSource(this.openDossiers);
                this.filterService.filterNestedObjects(this.dataSourceOpenDossiers);
            });
        this.dossiersService.getAll(new DossierFilter()
            .forRelation(this.id)
            .closedDossiers()
            .orderByCreationDate()
            .descending())
            .subscribe(dossiers => {
                this.closedDossiers = dossiers;
                console.log(this.closedDossiers);
                this.dataSourceClosedDossiers = new MatTableDataSource(this.closedDossiers);
                this.filterService.filterNestedObjects(this.dataSourceClosedDossiers);
            });
    }

    private getClient() {
        console.log('one');
        this.customersService.getById(+this.id).subscribe(
            (data) => {
                this.currentClient = data;
            }
        );
    }

    private applyFilterTasks(filterValue: string) {
        this.dataSourceTasks.filter = filterValue;
    }

    private applyFilterOpenDossiers(filterValue: string) {
        this.dataSourceOpenDossiers.filter = filterValue;
    }

    private applyFilterClosedDossiers(filterValue: string) {
        this.dataSourceClosedDossiers.filter = filterValue;
    }
}
