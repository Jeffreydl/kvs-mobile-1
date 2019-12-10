import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {FormControl, FormGroup, Validators} from '@angular/forms';
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
    public autoCompleteFormControl = new FormControl();
    public clients: ICustomer[];
    private currentClient$: Subscription;
    @Output() clientId = new EventEmitter<number>();
    @Input() formStepTwo: FormGroup;

    constructor(private router: Router, private customersService: CustomersService) {
    }

    ngOnInit() {
        this.autoCompleteFormControl.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe((value) => {
            this.searchCustomers(value);
        });

        this.formStepTwo.addControl('relatieId', new FormControl(Validators.compose([Validators.required])));
    }

    ngOnDestroy(): void {
        if (this.currentClient$) {
            this.currentClient$.unsubscribe();
        }
    }


    private searchCustomers(value: string) {
        if (value.length > 1) {
            this.customersService.search(value).subscribe(
                (data) => {
                    this.clients = data;
                }
            );
        } else {
            this.clients = null;
        }
    }

    public selectClient(id: number) {
        // if (this.router.url === '/taak-aanmaken') {
            this.formStepTwo.controls.relatieId.setValue(id);
            this.clientId.emit(id);
        // } else {
        //     this.router.navigate(['klantkaart', id]);
        // }
        // this.router.navigate(['client-card/', id], {state: { data: id}});
    }

}
