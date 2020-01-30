import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ICustomer} from '../ICustomer';
import {CustomersService} from '../customers.service';
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
    @Output() client = new EventEmitter<ICustomer>();
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
    }

    public selectClient(client: ICustomer) {
        this.formStepTwo.controls.relatieId.setValue(client.id);
        this.client.emit(client);
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
}
