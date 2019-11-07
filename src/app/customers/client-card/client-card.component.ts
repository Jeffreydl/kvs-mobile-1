import {Component, OnInit} from '@angular/core';
import {CustomersService} from '../customers.service';
import {ActivatedRoute, Router} from '@angular/router';
import {IAddress, ICustomer} from '../ICustomer';
import {Subscription} from 'rxjs';

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

    constructor(private router: Router, private activatedRoute: ActivatedRoute, private customersService: CustomersService) {
        // const navigation = this.router.getCurrentNavigation();
        // const state = navigation.extras.state as { data: string };
        // this.id = state.data;

        this.routeSubscription$ = this.activatedRoute.params.subscribe(params => {
            this.id = params.id;
        });
    }

    ngOnInit() {
        this.customersService.getClient(+this.id).subscribe(
            (data) => {
                this.currentClient = data;
                console.log(this.currentClient);
                this.getFullName(data);
                this.getAddress(data.address);
            }
        );
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

    public getAddress(addresses: IAddress[]) {

        for (const address of addresses) {
            let houseNumber = address.housenumber.toString();

            if (address.housenumberaddition) {
                houseNumber = address.housenumber + '-' + address.housenumberaddition;
            }
            this.fullAddresses.push(address.street + ' ' + houseNumber + ', ' + address.postalcode + ' ' + address.city + ' (' + address.type + ')');
        }
    }
}
