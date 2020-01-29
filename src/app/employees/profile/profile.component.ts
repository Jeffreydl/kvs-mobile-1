import { Component, OnInit } from '@angular/core';
import {EmployeesService} from '../employees.service';
import {AuthService} from '../../auth/auth.service';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public profile: any;

  constructor(private authService: AuthService,
              private employeesService: EmployeesService,
              public dialogRef: MatDialogRef<ProfileComponent>) { }

  ngOnInit() {
    this.employeesService.getByToken(this.authService.getToken()).subscribe((profile) => {
      this.profile = profile;
    });
  }

    public logout() {
      this.dialogRef.close();
      this.authService.logOut();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
