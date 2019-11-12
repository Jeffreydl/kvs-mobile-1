import {Component, OnInit} from '@angular/core';
import {CustomersService} from '../customers.service';
import {ICustomer} from '../ICustomer';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-client-list',
    templateUrl: './client-list.component.html',
    styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {
    private clients$: Observable<ICustomer[]>;

    constructor(private customersService: CustomersService) {
    }

    ngOnInit() {
        this.getClients();
    }

    private getClients() {
        this.clients$ = this.customersService.getAll();
    }
}
