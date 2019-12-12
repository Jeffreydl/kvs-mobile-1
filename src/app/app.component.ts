import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import {AuthService} from './auth/auth.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title = 'KVS Mobile';
  public currentRoute: string;
  public isLoggedIn$: Observable<boolean>;

  constructor(private authService: AuthService, public router: Router) {
  }


  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    console.log(this.isLoggedIn$);

    this.authService.checkPermission();

    if (this.authService.hasPermission) {
        this.router.navigate(['dashboard']);
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
        console.log(this.router.url);
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
