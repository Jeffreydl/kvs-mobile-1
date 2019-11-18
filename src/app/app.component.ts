import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import {AuthService} from './auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title = 'KVS Mobile';
  public token: string;

  constructor(private authService: AuthService, private router: Router) {
  }


  ngOnInit(): void {
    this.token = localStorage.getItem('loginToken');
    console.log(this.token);

    if (this.token != null) {
      this.authService.setToken(this.token);
      this.authService.setPermission(true);
      // this.router.navigate(['dashboard']);
    } else {
      this.router.navigate(['login']);
    }
  }
}
