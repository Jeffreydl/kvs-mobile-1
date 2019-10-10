import {Component, HostListener, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  columns = 1;
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
  }

  onSubmit(value: any) {
    console.log('submitted');
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

    if (this.innerWidth > this.innerHeight) {
      this.columns = 2;
      this.rowspanForm = 1;
      this.rowspanForm = 1;
    } else {
      this.columns = 1;
      this.rowspanForm = 7;
      this.rowspanLogo = 3;
    }
  }
}
