import {Component, HostListener, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  breakpoint = 1;
  rowspanForm = 7;
  rowspanLogo = 3;
  innerWidth;
  innerHeight;


  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: this.formBuilder.control('', Validators.compose([Validators.required])),
      password: this.formBuilder.control('', Validators.compose([Validators.required]))
    });

    this.breakpoint = (window.innerWidth > window.innerHeight) ? 2 : 1;
  }

  onSubmit(value: any) {
    console.log('submitted');
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
      this.rowspanForm = 7;
      this.rowspanLogo = 3;
    }
  }
}
