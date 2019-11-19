import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import {AuthService} from './auth/auth.service';
import {Route, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title = 'KVS Mobile';
  public token: string;
  public currentRoute: string;

  constructor(private authService: AuthService, public router: Router) {
  }


  ngOnInit(): void {
    this.token = localStorage.getItem('loginToken');
    this.currentRoute = this.router.url;
    console.log(this.token);

    if (this.token != null) {
      this.authService.setToken(this.token);
      this.authService.setPermission(true);
      this.router.navigate(['dashboard']);
    } else {
      this.router.navigate(['login']);
    }
  }

  onSwipe(event) {

    const x = Math.abs(event.deltaX) > 40 ? (event.deltaX > 0 ? 'right' : 'left') : '';
    this.currentRoute = this.router.url;
    const direction = x;

    console.log(direction);

    if (direction === 'left') {
      if (this.currentRoute === '/dashboard') {
        this.router.navigate(['kennisbank']);
      } else if (this.currentRoute === '/kennisbank') {
        this.router.navigate(['klanten']);
      } else if (this.currentRoute === '/klanten') {
        this.router.navigate(['taak-aanmaken']);
      }
    } else {
      if (this.currentRoute === '/kennisbank') {
        this.router.navigate(['dashboard']);
      } else if (this.currentRoute === '/klanten') {
        this.router.navigate(['kennisbank']);
      } else if (this.currentRoute === '/taak-aanmaken') {
        this.router.navigate(['klanten']);
      }
    }
  }

}
