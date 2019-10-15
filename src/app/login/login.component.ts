import {Component, HostListener, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  breakpoint;
  rowspanForm;
  rowspanLogo;
  innerWidth;
  innerHeight;
  hide = true;

  constructor(private formBuilder: FormBuilder, private auth: AuthService) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: this.formBuilder.control('', Validators.compose([Validators.required])),
      password: this.formBuilder.control('', Validators.compose([Validators.required]))
    });

    this.breakpoint = (window.innerWidth > window.innerHeight) ? 2 : 1;
    this.rowspanForm = (window.innerWidth > window.innerHeight) ? 1 : 1;
    this.rowspanLogo = (window.innerWidth > window.innerHeight) ? 1 : 1;
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

  onSubmit(formData: any) {
    this.auth.login(formData);
  }
}
