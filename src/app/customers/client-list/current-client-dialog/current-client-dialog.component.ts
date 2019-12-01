import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {ICustomer, IEmailAddress} from '../../ICustomer';
import {EmployeesService} from '../../../employees/employees.service';
import {AuthService} from '../../../auth/auth.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-current-client-dialog',
  templateUrl: './current-client-dialog.component.html',
  styleUrls: ['./current-client-dialog.component.scss']
})
export class CurrentClientDialogComponent implements OnInit, OnDestroy {
  public emailSubject = 'Reparatieverzoek';
  public emailBody = 'Hallo%20Melanie,%0D%0A%0D%0AHoe%20gaat%20het?%0D%0A%0D%0AMet%20vriendelijke%20groet,%0D%0A%0D%0AJeffrey%20de%20Looper';
  public client: ICustomer;

  constructor(
      public dialogRef: MatDialogRef<CurrentClientDialogComponent>,
      private authService: AuthService,
      private employeesService: EmployeesService,
      @Inject(MAT_DIALOG_DATA) public data: any) {}

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

  sendMail(email: IEmailAddress, client: ICustomer) {
    // const employeeId = this.authService.getUserId();
    // let employeeName;
    // this.employeesService.getById(employeeId).subscribe(
    //     (employee) => {
    //       employeeName = employee.profile.username;
    //     }
    // );

    const clientName = client.firstname;
    const emailSubject = 'Reparatieverzoek';
    const emailBody = `Hallo%20${clientName},%0D%0A%0D%0AHoe%20gaat%20het?%0D%0A%0D%0AMet%20vriendelijke%20groet,%0D%0A%0D%0AJeffrey%20de%20Looper`;

    return `mailto:${email.address}?subject=${emailSubject}&body=${emailBody}`;
  }
}