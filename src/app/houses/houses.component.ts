import {Component, OnDestroy, OnInit} from '@angular/core';
import {HousesService} from './houses.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
    selector: 'app-houses',
    templateUrl: './houses.component.html',
    styleUrls: ['./houses.component.css']
})
export class HousesComponent implements OnInit, OnDestroy {
    private houses: any;
    private routeSubscription$: Subscription;
    private id: number;

    constructor(private router: Router, private activatedRoute: ActivatedRoute, private housesService: HousesService) {
        this.routeSubscription$ = this.activatedRoute.params.subscribe(params => {
            this.id = params.id;
        });
    }

    ngOnInit() {
        this.housesService.getHouses(this.id).subscribe(
            (data) => {
                this.houses = data;
            }
        );
    }

    ngOnDestroy(): void {
    }

}
