import {Component, OnDestroy, OnInit} from '@angular/core';
import {CustomersService} from '../customers.service';
import {ICustomer} from '../ICustomer';
import {Observable} from 'rxjs';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
    selector: 'app-client-list',
    templateUrl: './client-list.component.html',
    styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit, OnDestroy {
    private clients$: Observable<ICustomer[]>;

    constructor(private customersService: CustomersService) {
    }

    ngOnInit() {
        this.getClients();
    }
    ngOnDestroy(): void {
    }

    private getClients() {
        this.clients$ = this.customersService.getAll();
    }
}
