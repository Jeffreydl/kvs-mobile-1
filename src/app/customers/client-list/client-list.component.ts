import {Component, OnDestroy, OnInit} from '@angular/core';
import {CustomersService} from '../customers.service';
import {ICustomer} from '../ICustomer';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {SortByNameService} from '../../sort-by-name.service';
import {CurrentClientDialogComponent} from './current-client-dialog/current-client-dialog.component';
import {MatDialog} from '@angular/material';
import {FormControl} from '@angular/forms';
import {debounceTime, distinctUntilChanged, first, map, startWith} from 'rxjs/operators';
import {AddClientDialogComponent} from '../add-client-dialog/add-client-dialog.component';

@AutoUnsubscribe()
@Component({
    selector: 'app-client-list',
    templateUrl: './client-list.component.html',
    styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit, OnDestroy {
    public clients: ICustomer[];
    public alphabet = [];
    public filteredFirstLetters: any[];
    public autoCompleteFormControl = new FormControl();
    public isSearching = false;
    public filteredClients: ICustomer[];

    constructor(private customersService: CustomersService, private orderByNameService: SortByNameService, public dialog: MatDialog) {

    }

    ngOnInit() {
        this.getClients();
        this.autoCompleteFormControl.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe((value) => {
            this.filterClients(value);
        });
    }
    ngOnDestroy(): void {
    }

    public filterClients(value: string) {
        if (value.length > 1) {
            const regex = new RegExp(value, 'i');
            this.filteredClients = this.clients.filter(({fullname}) => regex.test(fullname));
            this.isSearching = true;
        } else {
            this.isSearching = false;
        }
    }

    private getClients() {
        this.customersService.getAll().subscribe((clients) => {
            clients.sort(this.orderByNameService.dynamicSortMultiple('lastname', 'firstname'));
            this.clients = clients;
            this.alphabeticalList(clients);

        });
    }

    public alphabeticalList(clients: ICustomer[]) {
        for (const client of clients) {
            const firstLetter = client.lastname.substr(0, 1);
            this.alphabet.push(firstLetter);
        }
        this.filteredFirstLetters = [...new Set(this.alphabet)].sort();
    }

    public openDetailsDialog(client: ICustomer): void {
        this.dialog.open(CurrentClientDialogComponent, {
            position: {top: '0'},
            height: 'calc(100% - 80px)',
            width: '100%',
            maxWidth: '100%',
            panelClass: 'client-dialog',
            data: {client}
        });
    }

    openNewClientDialog(): void {
        this.dialog.open(AddClientDialogComponent, {
            position: {top: '0'},
            height: 'calc(100% - 80px)',
            width: '100%',
            maxWidth: '100%',
            panelClass: 'client-dialog',
        });
    }
}
