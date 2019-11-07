import {Component, OnInit} from '@angular/core';
import {CustomersService} from '../customers.service';
import {ActivatedRoute, Router} from '@angular/router';
import {IAddress, ICustomer} from '../ICustomer';
import {Subscription} from 'rxjs';
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
    public id: number;
    public currentClient: ICustomer;
    private routeSubscription$: Subscription;
    public fullName: string;
    public fullAddresses = [];
    public age: number;

    public tasks: any;
    public displayedColumnsTasks: string[] = ['category', 'subject', 'sla'];
    public dataSourceTasks: MatTableDataSource<any>;
    public openDossiers: any;
    public displayedColumnsOpenDossiers: string[] = ['id', 'category', 'subject', 'sla'];
    public dataSourceOpenDossiers: MatTableDataSource<any>;
    public closedDossiers: any;
    public displayedColumnsClosedDossiers: string[] = ['id', 'category', 'subject', 'sla'];
    public dataSourceClosedDossiers: MatTableDataSource<any>;

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

    getFullName(data: ICustomer) {
        let prefix = '';
        if (data.gender === 'Vrouw') {
            prefix = 'Mevr.';
        } else if (data.gender === 'Man') {
            prefix = 'M.';
        }
        this.fullName = prefix + ' ' + data.initials + ' (' + data.firstname + ') ' + data.lastname;
    }
    getAddress(addresses: IAddress[]) {

        for (const address of addresses) {
            let houseNumber = address.housenumber.toString();

            if (address.housenumberaddition) {
                houseNumber = address.housenumber + '-' + address.housenumberaddition;
            }
            this.fullAddresses.push(
                address.street + ' ' + houseNumber + ', ' + address.postalcode + ' ' + address.city + ' (' + address.type + ')'
            );
        }
    }
    getAge(value: string) {
        const today = new Date();
        const birthDate = new Date(value);
        let age = today.getFullYear() - birthDate.getFullYear();
        const months = today.getMonth() - birthDate.getMonth();
        if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        this.age = age;
    }

    getTasks() {
        this.tasksService.getAll(new TaskFilter()
            .openTasks()
            .inboundTasks()
            .forClient(this.id)
            .limitTo(10)
            .descending()
            .includeDrafts(false))
            .subscribe(tasks => {
                this.tasks = tasks;
                console.log(this.tasks);
                this.dataSourceTasks = new MatTableDataSource(this.tasks);
                this.filterService.filterNestedObjects(this.dataSourceTasks);
            });
    }

    getDossiers() {
        console.log('dosieers');
        this.dossiersService.getAll(new DossierFilter()
            .forRelation(this.id)
            .openDossiers()
            .orderByCreationDate()
            .descending())
            .subscribe(dossiers => {
                this.openDossiers = dossiers;
                console.log(this.openDossiers);
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

    getClient() {
        this.customersService.getById(+this.id).subscribe(
            (data) => {
                this.currentClient = data;
                this.getFullName(data);
                this.getAddress(data.address);
                this.getAge(data.dateofbirth);
            }
        );
    }

    applyFilterTasks(filterValue: string) {
        this.dataSourceTasks.filter = filterValue;
    }
    applyFilterOpenDossiers(filterValue: string) {
        this.dataSourceOpenDossiers.filter = filterValue;
    }
    applyFilterClosedDossiers(filterValue: string) {
        this.dataSourceClosedDossiers.filter = filterValue;
    }
}
