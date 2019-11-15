import {Component, OnDestroy, OnInit} from '@angular/core';
import {CustomersService} from '../customers.service';
import {ICustomer} from '../ICustomer';
import {Observable} from 'rxjs';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {DomSanitizer} from '@angular/platform-browser';

@AutoUnsubscribe()
@Component({
    selector: 'app-client-list',
    templateUrl: './client-list.component.html',
    styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit, OnDestroy {
    private clients$: Observable<ICustomer[]>;
    private emailSubject = 'Reparatieverzoek';
    private emailBody = 'Hallo%20Melanie,%0D%0A%0D%0AHoe%20gaat%20het?%0D%0A%0D%0AMet%20vriendelijke%20groet,%0D%0A%0D%0AJeffrey%20de%20Looper';
    private smsBody = 'Hallo%20Melanie,%0D%0A%0D%0AHoe%20gaat%20het?%0D%0A%0D%0AMet%20vriendelijke%20groet,%0D%0A%0D%0AJeffrey%20de%20Looper';
    private number = '063445815789';
    sms = 'sms:' + this.number + '?body=aa';
    phoneNumber;


    constructor(private customersService: CustomersService, private domSanitizer: DomSanitizer) {
    }

    ngOnInit() {
        this.getClients();
    }
    ngOnDestroy(): void {
    }

    private getClients() {
        this.clients$ = this.customersService.getAll();
    }


    private sendText() {
        console.log(this.phoneNumber);
    }

    makeSafe(phoneNumber: string) {
        this.phoneNumber = this.domSanitizer.bypassSecurityTrustUrl(`sms:${phoneNumber}`);
    }
}
