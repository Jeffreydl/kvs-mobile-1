import {Component, OnDestroy, OnInit} from '@angular/core';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {ICustomer} from '../ICustomer';
import {CustomersService} from '../customers.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
    selector: 'app-client-searchbar',
    templateUrl: './client-searchbar.component.html',
    styleUrls: ['./client-searchbar.component.scss']
})
export class ClientSearchbarComponent implements OnInit, OnDestroy {
    private autoCompleteFormControl = new FormControl();
    private clients: ICustomer[];
    private currentClient$: Subscription;

    constructor(private router: Router, private customersService: CustomersService) {
    }

    ngOnInit() {
        this.autoCompleteFormControl.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe((value) => {
            this.searchCustomers(value);
        });
    }

    ngOnDestroy(): void {
        if (this.currentClient$) {
            this.currentClient$.unsubscribe();
        }
    }

    private searchCustomers(value: string) {
        if (value.length > 0) {
            this.customersService.search(value).subscribe(
                (data) => {
                    this.clients = data;
                }
            );
        } else {
            this.clients = null;
        }
    }

    private selectClient(id: number) {
        this.router.navigate(['klantkaart', id]);
        // this.router.navigate(['client-card/', id], {state: { data: id}});
    }

}
