import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import {APP_DATE_FORMATS, DateAdapterService} from '../../date-adapter.service';
import {CustomersService} from '../customers.service';


@AutoUnsubscribe()
@Component({
  selector: 'app-current-client-dialog',
  templateUrl: './add-client-dialog.component.html',
  styleUrls: ['./add-client-dialog.component.scss'],
    providers: [
        {
            provide: DateAdapter, useClass: DateAdapterService
        },
        {
            provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
        }
    ]
})
export class AddClientDialogComponent implements OnInit, OnDestroy {
    private client: object;

  constructor(
      public dialogRef: MatDialogRef<AddClientDialogComponent>,
      private formBuilder: FormBuilder,
      private customersService: CustomersService,
      @Inject(MAT_DIALOG_DATA) public data: any) {}

    get phonenumber(): FormArray {
        return this.form.get('phonenumber') as FormArray;
    }

    get emailaddress(): FormArray {
        return this.form.get('emailaddress') as FormArray;
    }

    get address(): FormArray {
        return this.form.get('address') as FormArray;
    }
    public form: FormGroup;

    private static onFormValueChange(data: any) {
    }

  ngOnInit() {

      this.form = this.formBuilder.group({
          gender: this.formBuilder.control('', Validators.compose([Validators.required])),
          dateofbirth: this.formBuilder.control('', Validators.compose([Validators.required])),
          initials: this.formBuilder.control('', Validators.compose([Validators.required])),
          firstname: this.formBuilder.control('', Validators.compose([Validators.required])),
          middlename: this.formBuilder.control('', Validators.compose([Validators.required])),
          lastname: this.formBuilder.control('', Validators.compose([Validators.required])),
          emailaddress: this.formBuilder.array([]),
          phonenumber: this.formBuilder.array([]),
          address: this.formBuilder.array([]),
      });
      this.form.valueChanges.subscribe(data => AddClientDialogComponent.onFormValueChange(data));
      this.addEmailAddress();
      this.addPhoneNumber();
  }

  ngOnDestroy(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

    public onSubmit(relation: any) {
        const array1 = {data: {relation}};
        this.newClient(array1);
    }

    addPhoneNumber() {
        this.phonenumber.push(this.formBuilder.group({
            number: this.formBuilder.control(''),
            type: this.formBuilder.control('correspondence'),
        }));
    }

    removePhoneNumber(i: number) {
        this.phonenumber.removeAt(i);
    }

    addEmailAddress() {
        this.emailaddress.push(this.formBuilder.group({
            address: this.formBuilder.control('', Validators.compose([Validators.required])),
        }));
    }

    removeEmailAddress(i: number) {
        this.emailaddress.removeAt(i);
    }

    addAddress() {
        this.address.push(this.formBuilder.group({
            city: this.formBuilder.control(''),
            country: this.formBuilder.control('Nederland'),
            houseletter: this.formBuilder.control(''),
            housenumber: this.formBuilder.control(''),
            housenumberaddition: this.formBuilder.control(''),
            postalcode: this.formBuilder.control(''),
            state: this.formBuilder.control(''),
            street: this.formBuilder.control(''),
        }));
    }

    private newClient(formData: any) {
        this.customersService.create(formData).subscribe(
            (client) => {
                this.client = client;
            }
        );
    }
}
