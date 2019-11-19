import {Component, OnDestroy, OnInit} from '@angular/core';
import {CustomersService} from '../customers.service';
import {ICustomer} from '../ICustomer';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {SortByNameService} from '../../sort-by-name.service';
import {CurrentClientDialogComponent} from './current-client-dialog/current-client-dialog.component';
import {MatDialog} from '@angular/material';

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
    private currentClient: ICustomer;

    animal: any;

    constructor(private customersService: CustomersService, private orderByNameService: SortByNameService, public dialog: MatDialog) {
    }

    ngOnInit() {
        this.getClients();
    }
    ngOnDestroy(): void {
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
        console.log([...new Set(this.alphabet)].sort());
        this.filteredFirstLetters = [...new Set(this.alphabet)].sort();
    }

    checkArray() {
        console.log(this.alphabet);
    }

    openDetailsDialog(client: ICustomer): void {
        const dialogRef = this.dialog.open(CurrentClientDialogComponent, {
            height: '70%',
            width: '90%',
            panelClass: 'client-dialog',
            data: {client}
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.animal = result;
        });
    }
}
