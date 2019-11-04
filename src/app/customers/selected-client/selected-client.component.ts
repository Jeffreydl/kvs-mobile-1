import {Component, OnDestroy, OnInit} from '@angular/core';
import {CustomersService} from '../customers.service';
import {Subscription} from 'rxjs';
import {IAddress, ICustomer, IPhoneNumber} from '../ICustomer';

@Component({
    selector: 'app-selected-client',
    templateUrl: './selected-client.component.html',
    styleUrls: ['./selected-client.component.scss']
})
export class SelectedClientComponent implements OnInit, OnDestroy {


    name;

    constructor(private customersService: CustomersService) {
    }

    ngOnInit() {
    }

    ngOnDestroy(): void {

    }


}
