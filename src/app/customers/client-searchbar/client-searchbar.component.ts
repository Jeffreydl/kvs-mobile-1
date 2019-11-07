import {Component, OnDestroy, OnInit} from '@angular/core';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {IAddress, ICustomer, IPhoneNumber} from '../ICustomer';
import {CustomersService} from '../customers.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';

@Component({
    selector: 'app-client-searchbar',
    templateUrl: './client-searchbar.component.html',
    styleUrls: ['./client-searchbar.component.scss']
})
export class ClientSearchbarComponent implements OnInit, OnDestroy {
    public autoCompleteFormControl = new FormControl();
    public clients: ICustomer[];
    public currentClient: ICustomer;
    public currentClient$: Subscription;
    public currentClientAddress: IAddress[];
    public currentClientPhoneNumber: IPhoneNumber[];

    public name: string;
    public age: number;

    constructor(private router: Router, private customersService: CustomersService) {
    }

    ngOnInit() {
        this.autoCompleteFormControl.valueChanges.pipe(
            debounceTime(500),
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

    searchCustomers(value: string) {
        if (value.length > 0) {
            this.customersService.search(value).subscribe(
                (data) => {
                    this.clients = data;
                    console.log(this.clients);
                    for (const i of data) {
                        this.getAge(i.dateofbirth);
                        this.createName(i.firstname, i.middlename, i.lastname);
                        // console.log(i);
                    }
                }
            );
        } else {
            this.clients = null;
        }
    }

    private createName(firstname: string, middlename: string, lastname: string) {
        if (middlename) {
            this.name = firstname + ' ' + middlename + ' ' + lastname;
            console.log(this.name);
        } else {
            this.name = firstname + ' ' + lastname;
            console.log(this.name);
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

    selectClient(id: number) {
        this.router.navigate(['klantkaart', id]);
        // this.router.navigate(['client-card/', id], {state: { data: id}});
    }

}
