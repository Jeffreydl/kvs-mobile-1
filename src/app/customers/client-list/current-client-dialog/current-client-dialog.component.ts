import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {ICustomer} from '../../ICustomer';
import {Router} from '@angular/router';

@AutoUnsubscribe()
@Component({
  selector: 'app-current-client-dialog',
  templateUrl: './current-client-dialog.component.html',
  styleUrls: ['./current-client-dialog.component.scss']
})
export class CurrentClientDialogComponent implements OnInit, OnDestroy {
    public client: ICustomer;

    constructor(
        public dialogRef: MatDialogRef<CurrentClientDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private router: Router) {
    }

    ngOnInit() {
        this.client = this.data.client;
    }

    ngOnDestroy(): void {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    public call(phoneNumber) {
        return `tel:${phoneNumber}`;
    }

    public sendSms(phoneNumber) {
        return `sms:${phoneNumber}`;
    }

    public selectTaskType(action: string) {
        this.dialogRef.close();
        this.router.navigate(['taak-aanmaken'], { state: {action, client: this.client}});
    }
}
