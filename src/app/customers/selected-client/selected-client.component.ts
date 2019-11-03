import {Component, OnDestroy, OnInit} from '@angular/core';
import {CustomersService} from '../customers.service';
import {FormControl} from '@angular/forms';
import {debounceTime, distinctUntilChanged, isEmpty, map} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {IAddress, ICustomer, IPhoneNumber} from '../ICustomer';

@Component({
    selector: 'app-selected-client',
    templateUrl: './selected-client.component.html',
    styleUrls: ['./selected-client.component.scss']
})
export class SelectedClientComponent implements OnInit, OnDestroy {
    public currentClient: ICustomer;
    public currentClient$: Subscription;
    public autoCompleteFormControl = new FormControl();
    public clients: ICustomer[];
    public currentClientAddress: IAddress[];
    public currentClientPhoneNumber: IPhoneNumber[];
    public age: number;

    name;

    constructor(private customersService: CustomersService) {
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
        console.log(id);
        this.currentClient$ = this.customersService.getClient(id).subscribe(
            (data) => {
                this.currentClient = data;
                this.currentClientAddress = data.address;
                this.currentClientPhoneNumber = data.phoneNumber;
                console.log(this.currentClient);
                console.log(this.currentClientAddress);
                // map()
            }
        );
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
}
