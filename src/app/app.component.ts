import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import {AuthService} from './auth/auth.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {Meta} from '@angular/platform-browser';
import {fadeAnimation} from './animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation]
})
export class AppComponent implements OnInit {
  public title = 'KVS Mobile';
  public currentRoute: string;
  public isLoggedIn$: Observable<boolean>;

  private readonly mobHeight: number;
  private readonly mobWidth: number;

  constructor(private authService: AuthService, public router: Router, private metaService: Meta) {
      this.mobHeight = (window.innerHeight);
      this.mobWidth = (window.innerWidth);
      console.log(this.mobHeight);
      console.log(this.mobWidth);
  }


  ngOnInit(): void {
    const viewport = this.metaService.getTag('name=viewport');
    console.log(viewport.content); // width=device-width, initial-scale=1
    if (viewport) {
      this.metaService.updateTag({
              name: 'viewport',
              content: `height=${this.mobHeight}, width=${this.mobWidth}, initial-scale=1.0`
          },
          `name='viewport'`
      );
    }

    this.isLoggedIn$ = this.authService.isLoggedIn;
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
