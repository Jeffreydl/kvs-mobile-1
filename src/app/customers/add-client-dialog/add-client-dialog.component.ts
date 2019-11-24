import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

@AutoUnsubscribe()
@Component({
  selector: 'app-current-client-dialog',
  templateUrl: './add-client-dialog.component.html',
  styleUrls: ['./add-client-dialog.component.scss']
})
export class AddClientDialogComponent implements OnInit, OnDestroy {

  constructor(
      public dialogRef: MatDialogRef<AddClientDialogComponent>,
      private formBuilder: FormBuilder,
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
      console.log(data);
    }

  ngOnInit() {

      this.form = this.formBuilder.group({
          gender: this.formBuilder.control('', Validators.compose([Validators.required])),
          // dateOfBirth: this.formBuilder.control('', Validators.compose([Validators.required])),
          initials: this.formBuilder.control('', Validators.compose([Validators.required])),
          firstname: this.formBuilder.control('', Validators.compose([Validators.required])),
          middlename: this.formBuilder.control('', Validators.compose([Validators.required])),
          lastname: this.formBuilder.control('', Validators.compose([Validators.required])),
          emailaddress: this.formBuilder.array([]),
          phonenumber: this.formBuilder.array([]),
          address: this.formBuilder.array([]),
      });
      this.form.valueChanges.subscribe(data => AddClientDialogComponent.onFormValueChange(data));
      this.addPhoneNumber();
  }

  ngOnDestroy(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

    public onSubmit(formData: any) {
        console.log(formData);
    }

    addPhoneNumber() {
        this.phonenumber.push(this.formBuilder.group({
            relatieId: this.formBuilder.control(null),
            number: this.formBuilder.control(null),
            type: this.formBuilder.control(null),
            id: this.formBuilder.control(null),
        }));
    }

    addEmailAddress() {
        this.emailaddress.push(this.formBuilder.group({
            relatieId: this.formBuilder.control(null),
            address: this.formBuilder.control(null),
            type: this.formBuilder.control(null),
            id: this.formBuilder.control(null),
        }));
    }

    addAddress() {
        this.address.push(this.formBuilder.group({
            city: this.formBuilder.control(null),
            country: this.formBuilder.control(null),
            houseletter: this.formBuilder.control(null),
            housenumber: this.formBuilder.control(null),
            housenumberaddition: this.formBuilder.control(null),
            id: this.formBuilder.control(null),
            postalcode: this.formBuilder.control(null),
            relatieId: this.formBuilder.control(null),
            searchIndex: this.formBuilder.control(null),
            state: this.formBuilder.control(null),
            street: this.formBuilder.control(null),
            type: this.formBuilder.control(null),
        }));
    }
}
