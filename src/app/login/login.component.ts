import {Component, HostListener, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { LoginAPIService } from '../loginAPI.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  breakpoint; rowspanForm; rowspanLogo; innerWidth; innerHeight;
  hide = true;

  apiKey;

  constructor(private formBuilder: FormBuilder, private loginAPIService: LoginAPIService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: this.formBuilder.control('', Validators.compose([Validators.required])),
      password: this.formBuilder.control('', Validators.compose([Validators.required]))
    });

    this.breakpoint = (window.innerWidth > window.innerHeight) ? 2 : 1;
    this.rowspanForm = (window.innerWidth > window.innerHeight) ? 1 : 1;
    this.rowspanLogo = (window.innerWidth > window.innerHeight) ? 1 : 1;
  }

  onSubmit(formData: any) {
    this.authenticate(formData);
  }

  authenticate(formData) {
    this.loginAPIService.login(formData).subscribe(
            (data: any) => {
      this.apiKey = data.accessToken.id;
      // this.ttl = data.accessToken.ttl;
      console.log(this.apiKey);
    },
    (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
        console.log('Client-side error occured.');
      } else {
        console.log('Server-side error occured.');
      }
    }
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

    if (this.innerWidth > this.innerHeight) {
      this.breakpoint = 2;
      this.rowspanForm = 1;
      this.rowspanLogo = 1;
    } else {
      this.breakpoint = 1;
      this.rowspanForm = 1;
      this.rowspanLogo = 1;
    }
  }
}
